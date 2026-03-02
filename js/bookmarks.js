/**
 * Womencypedia Bookmarks Module
 * Handles user bookmarks/saved biographies functionality
 */

const Bookmarks = {
    // Bookmark state
    _bookmarks: [],
    _isLoaded: false,

    /**
     * Initialize bookmarks module
     */
    init() {
        this.loadBookmarks();
        this.initializeBookmarkButtons();
    },

    /**
     * Load bookmarks from API or localStorage
     */
    async loadBookmarks() {
        try {
            // Try to load from API first
            if (Auth.isAuthenticated()) {
                const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.COLLECTIONS.SAVED}`, {
                    headers: {
                        'Authorization': `Bearer ${Auth.getAccessToken()}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    this._bookmarks = data.items || data.bookmarks || [];
                    this._isLoaded = true;
                    this.saveToLocalStorage();
                    this.updateAllBookmarkButtons();
                    return;
                }
            }
        } catch (error) {
            console.log('Loading bookmarks from localStorage');
        }

        // Fallback to localStorage
        this.loadFromLocalStorage();
    },

    /**
     * Load from localStorage
     */
    loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem('womencypedia_bookmarks');
            if (stored) {
                this._bookmarks = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Failed to load bookmarks from localStorage:', error);
            this._bookmarks = [];
        }
        this._isLoaded = true;
    },

    /**
     * Save to localStorage
     */
    saveToLocalStorage() {
        try {
            localStorage.setItem('womencypedia_bookmarks', JSON.stringify(this._bookmarks));
        } catch (error) {
            console.error('Failed to save bookmarks:', error);
        }
    },

    /**
     * Get all bookmarks
     * @returns {Array} List of bookmarked entries
     */
    getAll() {
        return this._bookmarks;
    },

    /**
     * Get bookmark count
     * @returns {number} Number of bookmarks
     */
    getCount() {
        return this._bookmarks.length;
    },

    /**
     * Check if an entry is bookmarked
     * @param {string} entryId - Entry ID to check
     * @returns {boolean} True if bookmarked
     */
    isBookmarked(entryId) {
        return this._bookmarks.some(b => b.id === entryId || b.entry_id === entryId);
    },

    /**
     * Add a bookmark
     * @param {Object} entry - Entry data to bookmark
     */
    async add(entry) {
        if (this.isBookmarked(entry.id)) {
            return { success: false, message: 'Already bookmarked' };
        }

        // Check authentication
        if (!Auth.isAuthenticated()) {
            if (typeof UI !== 'undefined' && UI.showAuthModal) {
                UI.showAuthModal('login');
            } else {
                window.location.href = 'index.html?auth=login';
            }
            return { success: false, message: 'Please log in to bookmark' };
        }

        const bookmark = {
            id: entry.id,
            entry_id: entry.id,
            name: entry.name || entry.title,
            slug: entry.slug,
            image: entry.image || entry.featured_image,
            category: entry.category,
            preview: entry.preview || entry.summary,
            bookmarkedAt: new Date().toISOString()
        };

        try {
            // Sync with API
            const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.COLLECTIONS.SAVED}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Auth.getAccessToken()}`
                },
                body: JSON.stringify({ entry_id: entry.id })
            });

            if (!response.ok) {
                throw new Error('Failed to save bookmark');
            }
        } catch (error) {
            console.log('Saving bookmark locally');
        }

        this._bookmarks.push(bookmark);
        this.saveToLocalStorage();
        this.updateAllBookmarkButtons();

        // Show success feedback
        if (typeof UI !== 'undefined' && UI.showToast) {
            UI.showToast('Biography saved to bookmarks!', 'success');
        }

        return { success: true, bookmark };
    },

    /**
     * Remove a bookmark
     * @param {string} entryId - Entry ID to remove
     */
    async remove(entryId) {
        const index = this._bookmarks.findIndex(b => b.id === entryId || b.entry_id === entryId);

        if (index === -1) {
            return { success: false, message: 'Bookmark not found' };
        }

        try {
            // Sync with API
            if (Auth.isAuthenticated()) {
                await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.COLLECTIONS.SAVED}/${entryId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${Auth.getAccessToken()}`
                    }
                });
            }
        } catch (error) {
            console.log('Removing bookmark locally');
        }

        this._bookmarks.splice(index, 1);
        this.saveToLocalStorage();
        this.updateAllBookmarkButtons();

        // Show success feedback
        if (typeof UI !== 'undefined' && UI.showToast) {
            UI.showToast('Biography removed from bookmarks', 'info');
        }

        return { success: true };
    },

    /**
     * Toggle bookmark status
     * @param {Object|string} entry - Entry data or ID
     */
    async toggle(entry) {
        const entryId = typeof entry === 'string' ? entry : entry.id;

        if (this.isBookmarked(entryId)) {
            return await this.remove(entryId);
        } else {
            // If only ID was passed, create minimal entry object
            const entryData = typeof entry === 'string' ? { id: entry } : entry;
            return await this.add(entryData);
        }
    },

    /**
     * Clear all bookmarks
     */
    async clearAll() {
        try {
            if (Auth.isAuthenticated()) {
                await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.COLLECTIONS.SAVED}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${Auth.getAccessToken()}`
                    }
                });
            }
        } catch (error) {
            console.log('Clearing bookmarks locally');
        }

        this._bookmarks = [];
        this.saveToLocalStorage();
        this.updateAllBookmarkButtons();

        if (typeof UI !== 'undefined' && UI.showToast) {
            UI.showToast('All bookmarks cleared', 'info');
        }

        return { success: true };
    },

    /**
     * Initialize bookmark buttons on page
     */
    initializeBookmarkButtons() {
        document.addEventListener('click', (e) => {
            const button = e.target.closest('[data-bookmark-id]');
            if (button) {
                e.preventDefault();
                const entryId = button.dataset.bookmarkId;
                const entryData = {
                    id: entryId,
                    name: button.dataset.bookmarkName || '',
                    slug: button.dataset.bookmarkSlug || '',
                    image: button.dataset.bookmarkImage || '',
                    category: button.dataset.bookmarkCategory || ''
                };
                this.toggle(entryData);
            }
        });
    },

    /**
     * Update all bookmark buttons on page
     */
    updateAllBookmarkButtons() {
        document.querySelectorAll('[data-bookmark-id]').forEach(button => {
            const entryId = button.dataset.bookmarkId;
            this.updateButtonState(button, this.isBookmarked(entryId));
        });
    },

    /**
     * Update button state
     * @param {Element} button - Button element
     * @param {boolean} isBookmarked - Whether item is bookmarked
     */
    updateButtonState(button, isBookmarked) {
        if (isBookmarked) {
            button.classList.add('bookmarked');
            button.setAttribute('aria-label', 'Remove from bookmarks');
            // Update icon if present
            const icon = button.querySelector('svg');
            if (icon) {
                icon.setAttribute('fill', 'currentColor');
                button.classList.add('text-pink-500');
                button.classList.remove('text-gray-400');
            }
        } else {
            button.classList.remove('bookmarked');
            button.setAttribute('aria-label', 'Add to bookmarks');
            const icon = button.querySelector('svg');
            if (icon) {
                icon.setAttribute('fill', 'none');
                button.classList.remove('text-pink-500');
                button.classList.add('text-gray-400');
            }
        }
    },

    /**
     * Create bookmark button HTML
     * @param {Object} entry - Entry data
     * @param {string} size - Button size (sm, md, lg)
     * @returns {string} HTML string
     */
    createBookmarkButton(entry, size = 'md') {
        const isBookmarked = this.isBookmarked(entry.id);
        const sizeClasses = {
            sm: 'w-4 h-4',
            md: 'w-5 h-5',
            lg: 'w-6 h-6'
        };
        const iconSize = sizeClasses[size] || sizeClasses.md;

        return `
            <button 
                data-bookmark-id="${entry.id}"
                data-bookmark-name="${entry.name || ''}"
                data-bookmark-slug="${entry.slug || ''}"
                data-bookmark-image="${entry.image || ''}"
                data-bookmark-category="${entry.category || ''}"
                class="bookmark-btn p-2 rounded-full transition-all duration-200 hover:bg-white/10 ${isBookmarked ? 'text-pink-500 bookmarked' : 'text-gray-400'}"
                aria-label="${isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}"
            >
                <svg class="${iconSize}" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                </svg>
            </button>
        `;
    },

    /**
     * Render bookmarks list
     * @param {Element} container - Container element
     */
    renderBookmarksList(container) {
        if (!container) return;

        if (this._bookmarks.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <svg class="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                    </svg>
                    <h3 class="text-xl font-semibold text-white mb-2">No Saved Biographies</h3>
                    <p class="text-gray-400 mb-6">Start exploring and save biographies you want to read later.</p>
                    <a href="browse.html" class="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity">
                        Browse Biographies
                    </a>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-semibold text-white">${this._bookmarks.length} Saved ${this._bookmarks.length === 1 ? 'Biography' : 'Biographies'}</h3>
                <button onclick="Bookmarks.clearAll()" class="text-sm text-gray-400 hover:text-red-400 transition-colors">Clear All</button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                ${this._bookmarks.map(b => this.renderBookmarkCard(b)).join('')}
            </div>
        `;
    },

    /**
     * Render single bookmark card
     * @param {Object} bookmark - Bookmark data
     * @returns {string} HTML string
     */
    renderBookmarkCard(bookmark) {
        return `
            <div class="group relative bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-pink-500/50 transition-all duration-300">
                <a href="biography.html?slug=${bookmark.slug || bookmark.id}" class="block">
                    <div class="aspect-[4/3] relative overflow-hidden">
                        <img src="${bookmark.image || 'images/placeholder-portrait.jpg'}" alt="${bookmark.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        ${bookmark.category ? `<span class="absolute top-3 left-3 px-3 py-1 bg-pink-500/90 text-white text-xs font-medium rounded-full">${bookmark.category}</span>` : ''}
                    </div>
                    <div class="p-4">
                        <h4 class="text-white font-semibold mb-2 group-hover:text-pink-400 transition-colors">${bookmark.name}</h4>
                        ${bookmark.preview ? `<p class="text-gray-400 text-sm line-clamp-2">${bookmark.preview}</p>` : ''}
                    </div>
                </a>
                <button 
                    onclick="Bookmarks.remove('${bookmark.id}')"
                    class="absolute top-3 right-3 p-2 bg-black/50 hover:bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                    aria-label="Remove bookmark"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;
    },

    /**
     * Export bookmarks as JSON
     * @returns {string} JSON string of bookmarks
     */
    exportBookmarks() {
        return JSON.stringify(this._bookmarks, null, 2);
    },

    /**
     * Import bookmarks from JSON
     * @param {string} jsonString - JSON string of bookmarks
     */
    importBookmarks(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            if (Array.isArray(imported)) {
                imported.forEach(b => {
                    if (!this.isBookmarked(b.id)) {
                        this._bookmarks.push(b);
                    }
                });
                this.saveToLocalStorage();
                this.updateAllBookmarkButtons();

                if (typeof UI !== 'undefined' && UI.showToast) {
                    UI.showToast(`Imported ${imported.length} bookmarks`, 'success');
                }
                return { success: true, count: imported.length };
            }
        } catch (error) {
            console.error('Failed to import bookmarks:', error);
            if (typeof UI !== 'undefined' && UI.showToast) {
                UI.showToast('Failed to import bookmarks', 'error');
            }
        }
        return { success: false };
    }
};

// Initialize bookmarks when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Bookmarks.init();
});
