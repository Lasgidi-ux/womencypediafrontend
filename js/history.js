/**
 * Womencypedia Reading History Module
 * Tracks user reading history and provides recommendations
 */

const History = {
    // History state
    _history: [],
    _maxItems: 50, // Maximum history items to store

    /**
     * Initialize history module
     */
    init() {
        this.loadHistory();
    },

    /**
     * Load history from localStorage
     */
    loadHistory() {
        try {
            const stored = localStorage.getItem('womencypedia_history');
            if (stored) {
                this._history = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Failed to load history:', error);
            this._history = [];
        }
    },

    /**
     * Save history to localStorage
     */
    saveHistory() {
        try {
            localStorage.setItem('womencypedia_history', JSON.stringify(this._history));
        } catch (error) {
            console.error('Failed to save history:', error);
        }
    },

    /**
     * Get all history items
     * @returns {Array} History items
     */
    getAll() {
        return this._history;
    },

    /**
     * Get recent history items
     * @param {number} limit - Number of items to return
     * @returns {Array} Recent history items
     */
    getRecent(limit = 10) {
        return this._history.slice(0, limit);
    },

    /**
     * Get history count
     * @returns {number} Number of history items
     */
    getCount() {
        return this._history.length;
    },

    /**
     * Add entry to history
     * @param {Object} entry - Entry data
     */
    add(entry) {
        if (!entry || !entry.id) return;

        const historyItem = {
            id: entry.id,
            name: entry.name || entry.title,
            slug: entry.slug,
            image: entry.image || entry.featured_image,
            category: entry.category,
            preview: entry.preview || entry.summary,
            readProgress: entry.readProgress || 0,
            readAt: new Date().toISOString(),
            readDuration: 0
        };

        // Remove if already exists (will be added to top)
        const existingIndex = this._history.findIndex(h => h.id === entry.id);
        if (existingIndex !== -1) {
            // Preserve read progress if higher
            historyItem.readProgress = Math.max(historyItem.readProgress, this._history[existingIndex].readProgress);
            historyItem.readDuration = this._history[existingIndex].readDuration;
            this._history.splice(existingIndex, 1);
        }

        // Add to beginning
        this._history.unshift(historyItem);

        // Limit to max items
        if (this._history.length > this._maxItems) {
            this._history = this._history.slice(0, this._maxItems);
        }

        this.saveHistory();
    },

    /**
     * Update read progress for an entry
     * @param {string} entryId - Entry ID
     * @param {number} progress - Progress percentage (0-100)
     */
    updateProgress(entryId, progress) {
        const item = this._history.find(h => h.id === entryId);
        if (item) {
            item.readProgress = Math.min(100, Math.max(0, progress));
            item.lastReadAt = new Date().toISOString();
            this.saveHistory();
        }
    },

    /**
     * Update read duration for an entry
     * @param {string} entryId - Entry ID
     * @param {number} seconds - Duration in seconds
     */
    updateDuration(entryId, seconds) {
        const item = this._history.find(h => h.id === entryId);
        if (item) {
            item.readDuration += seconds;
            this.saveHistory();
        }
    },

    /**
     * Get read progress for an entry
     * @param {string} entryId - Entry ID
     * @returns {number} Progress percentage (0-100)
     */
    getProgress(entryId) {
        const item = this._history.find(h => h.id === entryId);
        return item ? item.readProgress : 0;
    },

    /**
     * Check if entry was recently read
     * @param {string} entryId - Entry ID
     * @returns {boolean} True if read within last 7 days
     */
    wasRecentlyRead(entryId) {
        const item = this._history.find(h => h.id === entryId);
        if (!item) return false;

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return new Date(item.readAt) > sevenDaysAgo;
    },

    /**
     * Remove from history
     * @param {string} entryId - Entry ID to remove
     */
    remove(entryId) {
        const index = this._history.findIndex(h => h.id === entryId);
        if (index !== -1) {
            this._history.splice(index, 1);
            this.saveHistory();
        }
    },

    /**
     * Clear all history
     */
    clearAll() {
        this._history = [];
        this.saveHistory();

        if (typeof UI !== 'undefined' && UI.showToast) {
            UI.showToast('Reading history cleared', 'info');
        }
    },

    /**
     * Get statistics
     * @returns {Object} Reading statistics
     */
    getStats() {
        const totalRead = this._history.length;
        const completedRead = this._history.filter(h => h.readProgress === 100).length;
        const totalDuration = this._history.reduce((sum, h) => sum + (h.readDuration || 0), 0);

        // Category breakdown
        const categories = {};
        this._history.forEach(h => {
            if (h.category) {
                categories[h.category] = (categories[h.category] || 0) + 1;
            }
        });

        // Reading by day of week
        const readingByDay = [0, 0, 0, 0, 0, 0, 0];
        this._history.forEach(h => {
            const day = new Date(h.readAt).getDay();
            readingByDay[day]++;
        });

        return {
            totalRead,
            completedRead,
            totalDurationMinutes: Math.round(totalDuration / 60),
            categories,
            readingByDay,
            averageProgress: totalRead > 0 ? Math.round(this._history.reduce((sum, h) => sum + h.readProgress, 0) / totalRead) : 0
        };
    },

    /**
     * Get category recommendations based on history
     * @returns {Array} Recommended categories
     */
    getRecommendedCategories() {
        const categories = {};
        this._history.slice(0, 20).forEach(h => {
            if (h.category) {
                categories[h.category] = (categories[h.category] || 0) + 1;
            }
        });

        return Object.entries(categories)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([category]) => category);
    },

    /**
     * Create reading progress tracker for a page
     * @param {string} entryId - Entry ID
     */
    createProgressTracker(entryId) {
        let startTime = Date.now();
        let lastScrollPosition = 0;

        // Track scroll progress
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

            this.updateProgress(entryId, progress);
            lastScrollPosition = scrollTop;
        };

        // Track time spent
        const updateDuration = () => {
            const elapsed = Math.round((Date.now() - startTime) / 1000);
            this.updateDuration(entryId, elapsed);
            startTime = Date.now();
        };

        // Debounced scroll handler
        let scrollTimeout;
        const debouncedScroll = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(handleScroll, 100);
        };

        // Update duration every 30 seconds
        const durationInterval = setInterval(updateDuration, 30000);

        // Add event listeners
        window.addEventListener('scroll', debouncedScroll);
        window.addEventListener('beforeunload', updateDuration);

        // Return cleanup function
        return () => {
            window.removeEventListener('scroll', debouncedScroll);
            window.removeEventListener('beforeunload', updateDuration);
            clearInterval(durationInterval);
            updateDuration();
        };
    },

    /**
     * Render history list
     * @param {Element} container - Container element
     */
    renderHistoryList(container) {
        if (!container) return;

        if (this._history.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <svg class="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 class="text-xl font-semibold text-white mb-2">No Reading History</h3>
                    <p class="text-gray-400 mb-6">Start reading biographies to build your history.</p>
                    <a href="browse.html" class="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity">
                        Start Reading
                    </a>
                </div>
            `;
            return;
        }

        const stats = this.getStats();
        container.innerHTML = `
            <!-- Stats Overview -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div class="bg-white/5 rounded-xl p-4 text-center">
                    <p class="text-3xl font-bold text-white">${stats.totalRead}</p>
                    <p class="text-gray-400 text-sm">Biographies Read</p>
                </div>
                <div class="bg-white/5 rounded-xl p-4 text-center">
                    <p class="text-3xl font-bold text-green-400">${stats.completedRead}</p>
                    <p class="text-gray-400 text-sm">Completed</p>
                </div>
                <div class="bg-white/5 rounded-xl p-4 text-center">
                    <p class="text-3xl font-bold text-pink-400">${stats.averageProgress}%</p>
                    <p class="text-gray-400 text-sm">Avg. Progress</p>
                </div>
                <div class="bg-white/5 rounded-xl p-4 text-center">
                    <p class="text-3xl font-bold text-purple-400">${stats.totalDurationMinutes}</p>
                    <p class="text-gray-400 text-sm">Minutes Read</p>
                </div>
            </div>

            <!-- History List -->
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-semibold text-white">Reading History</h3>
                <button onclick="History.clearAll()" class="text-sm text-gray-400 hover:text-red-400 transition-colors">Clear History</button>
            </div>
            <div class="space-y-4">
                ${this._history.map(h => this.renderHistoryItem(h)).join('')}
            </div>
        `;
    },

    /**
     * Render single history item
     * @param {Object} item - History item
     * @returns {string} HTML string
     */
    renderHistoryItem(item) {
        const readAt = new Date(item.readAt);
        const timeAgo = this.getTimeAgo(readAt);
        const progressColor = item.readProgress === 100 ? 'bg-green-500' : 'bg-pink-500';

        return `
            <div class="group flex gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                <a href="biography.html?slug=${item.slug || item.id}" class="flex-shrink-0">
                    <img src="${item.image || 'images/placeholder-portrait.jpg'}" alt="${item.name}" class="w-20 h-20 rounded-lg object-cover">
                </a>
                <div class="flex-grow min-w-0">
                    <a href="biography.html?slug=${item.slug || item.id}" class="block">
                        <h4 class="text-white font-semibold truncate group-hover:text-pink-400 transition-colors">${item.name}</h4>
                    </a>
                    ${item.category ? `<span class="inline-block mt-1 px-2 py-0.5 bg-pink-500/20 text-pink-400 text-xs rounded-full">${item.category}</span>` : ''}
                    <div class="mt-2 flex items-center gap-4">
                        <div class="flex-grow">
                            <div class="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div class="${progressColor} h-full rounded-full transition-all" style="width: ${item.readProgress}%"></div>
                            </div>
                        </div>
                        <span class="text-gray-400 text-sm">${item.readProgress}%</span>
                    </div>
                    <p class="text-gray-500 text-xs mt-2">${timeAgo}</p>
                </div>
                <button onclick="History.remove('${item.id}')" class="flex-shrink-0 p-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;
    },

    /**
     * Get time ago string
     */
    getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
        return date.toLocaleDateString();
    },

    /**
     * Render continue reading section
     * @param {Element} container - Container element
     * @param {number} limit - Max items to show
     */
    renderContinueReading(container, limit = 3) {
        if (!container) return;

        const inProgress = this._history.filter(h => h.readProgress > 0 && h.readProgress < 100).slice(0, limit);

        if (inProgress.length === 0) {
            container.style.display = 'none';
            return;
        }

        container.innerHTML = `
            <h3 class="text-xl font-semibold text-white mb-4">Continue Reading</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                ${inProgress.map(item => `
                    <a href="biography.html?slug=${item.slug || item.id}" class="group block p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                        <div class="flex gap-4">
                            <img src="${item.image || 'images/placeholder-portrait.jpg'}" alt="${item.name}" class="w-16 h-16 rounded-lg object-cover flex-shrink-0">
                            <div class="min-w-0">
                                <h4 class="text-white font-medium truncate group-hover:text-pink-400 transition-colors">${item.name}</h4>
                                <div class="mt-2">
                                    <div class="h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div class="bg-pink-500 h-full rounded-full" style="width: ${item.readProgress}%"></div>
                                    </div>
                                    <p class="text-gray-400 text-xs mt-1">${item.readProgress}% complete</p>
                                </div>
                            </div>
                        </div>
                    </a>
                `).join('')}
            </div>
        `;
    }
};

// Initialize history when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    History.init();
});
