/**
 * Womencypedia UI Utilities
 * 
 * Common UI components and helper functions for the frontend.
 */

const UI = {
    /**
     * Show a loading spinner
     * @param {HTMLElement|string} container - Container element or selector
     * @param {string} message - Loading message
     */
    showLoading(container, message = 'Loading...') {
        const el = typeof container === 'string'
            ? document.querySelector(container)
            : container;

        if (!el) return;

        el.innerHTML = `
            <div class="flex flex-col items-center justify-center py-16">
                <div class="relative">
                    <div class="w-12 h-12 rounded-full border-4 border-lavender-soft"></div>
                    <div class="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin absolute top-0 left-0"></div>
                </div>
                <p class="mt-4 text-text-secondary text-sm">${message}</p>
            </div>
        `;
    },

    /**
     * Show an error message
     * @param {HTMLElement|string} container - Container element or selector
     * @param {string} message - Error message
     * @param {Function} retryCallback - Optional retry callback
     */
    showError(container, message = 'An error occurred', retryCallback = null) {
        const el = typeof container === 'string'
            ? document.querySelector(container)
            : container;

        if (!el) return;

        el.innerHTML = `
            <div class="flex flex-col items-center justify-center py-16 text-center">
                <div class="size-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <span class="material-symbols-outlined text-red-500 text-3xl">error</span>
                </div>
                <h3 class="font-serif text-xl font-bold text-text-main mb-2">Something went wrong</h3>
                <p class="text-text-secondary text-sm mb-6 max-w-md">${message}</p>
                ${retryCallback ? `
                    <button id="retry-btn" class="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
                        <span class="material-symbols-outlined text-[18px]">refresh</span>
                        Try Again
                    </button>
                ` : ''}
            </div>
        `;

        if (retryCallback) {
            const retryBtn = el.querySelector('#retry-btn');
            if (retryBtn) {
                retryBtn.addEventListener('click', retryCallback);
            }
        }
    },

    /**
     * Show empty state
     * @param {HTMLElement|string} container - Container element or selector
     * @param {Object} options - Options (icon, title, message, actionText, actionUrl)
     */
    showEmpty(container, options = {}) {
        const el = typeof container === 'string'
            ? document.querySelector(container)
            : container;

        if (!el) return;

        const {
            icon = 'search_off',
            title = 'No results found',
            message = 'Try adjusting your search or filters.',
            actionText = null,
            actionUrl = null
        } = options;

        el.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-16 text-center">
                <div class="size-16 rounded-full bg-lavender-soft/50 flex items-center justify-center mb-4">
                    <span class="material-symbols-outlined text-text-secondary/50 text-3xl">${icon}</span>
                </div>
                <h3 class="font-serif text-xl font-bold text-text-main mb-2">${title}</h3>
                <p class="text-text-secondary text-sm mb-6 max-w-md">${message}</p>
                ${actionText && actionUrl ? `
                    <a href="${actionUrl}" class="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">
                        ${actionText}
                    </a>
                ` : ''}
            </div>
        `;
    },

    /**
     * Show a toast notification
     * @param {string} message - Toast message
     * @param {string} type - Type: 'success', 'error', 'warning', 'info'
     * @param {number} duration - Duration in ms
     */
    showToast(message, type = 'info', duration = 3000) {
        // Create toast container if it doesn't exist
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'fixed bottom-4 right-4 z-[100] flex flex-col gap-2';
            document.body.appendChild(container);
        }

        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-accent-teal'
        };

        const icons = {
            success: 'check_circle',
            error: 'error',
            warning: 'warning',
            info: 'info'
        };

        const toast = document.createElement('div');
        toast.className = `${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 transform translate-x-full transition-transform duration-300`;
        toast.innerHTML = `
            <span class="material-symbols-outlined">${icons[type]}</span>
            <span class="text-sm font-medium">${message}</span>
        `;

        container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.remove('translate-x-full');
        });

        // Remove after duration
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    /**
     * Show a confirmation dialog
     * @param {Object} options - Dialog options
     * @returns {Promise<boolean>} - User's choice
     */
    confirm(options = {}) {
        return new Promise((resolve) => {
            const {
                title = 'Confirm Action',
                message = 'Are you sure you want to proceed?',
                confirmText = 'Confirm',
                cancelText = 'Cancel',
                confirmClass = 'bg-primary',
                danger = false
            } = options;

            const overlay = document.createElement('div');
            overlay.className = 'fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4';
            overlay.innerHTML = `
                <div class="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
                    <h3 class="font-serif text-xl font-bold text-text-main mb-2">${title}</h3>
                    <p class="text-text-secondary mb-6">${message}</p>
                    <div class="flex justify-end gap-3">
                        <button id="confirm-cancel" class="px-5 py-2.5 border border-border-light rounded-lg font-bold text-sm hover:bg-background-cream transition-colors">
                            ${cancelText}
                        </button>
                        <button id="confirm-ok" class="${danger ? 'bg-red-500 hover:bg-red-600' : confirmClass + ' hover:opacity-90'} text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors">
                            ${confirmText}
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);

            overlay.querySelector('#confirm-cancel').addEventListener('click', () => {
                overlay.remove();
                resolve(false);
            });

            overlay.querySelector('#confirm-ok').addEventListener('click', () => {
                overlay.remove();
                resolve(true);
            });

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.remove();
                    resolve(false);
                }
            });
        });
    },

    /**
     * Create a biography card HTML
     * @param {Object} bio - Biography data
     * @param {boolean} showAdminActions - Show admin edit/delete buttons
     * @returns {string} - HTML string
     */
    createBiographyCard(bio, showAdminActions = false) {
        const eraColors = {
            'Ancient': 'accent-gold',
            'Pre-colonial': 'accent-gold',
            'Colonial': 'primary',
            'Post-colonial': 'accent-teal',
            'Contemporary': 'divider'
        };

        const color = eraColors[bio.era] || 'primary';

        return `
            <div class="group bg-white rounded-2xl overflow-hidden border border-border-light hover:shadow-xl transition-all relative" data-entry-id="${bio.id}">
                ${showAdminActions ? `
                    <div class="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onclick="AdminActions.editEntry(${bio.id})" class="size-8 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-accent-teal hover:text-white transition-colors" title="Edit">
                            <span class="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button onclick="AdminActions.deleteEntry(${bio.id})" class="size-8 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors" title="Delete">
                            <span class="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                    </div>
                ` : ''}
                <a href="biography.html?id=${bio.id}" class="block">
                    <div class="aspect-[4/3] bg-lavender-soft/50 relative overflow-hidden">
                        ${bio.image ? `
                            <img src="${bio.image}" alt="${bio.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ` : `
                            <div class="absolute inset-0 bg-gradient-to-br from-${color}/20 to-lavender-soft flex items-center justify-center">
                                <span class="material-symbols-outlined text-${color}/40 text-6xl">person</span>
                            </div>
                        `}
                        ${bio.isNew ? '<span class="absolute top-3 left-3 bg-accent-gold text-white text-xs font-bold px-2 py-1 rounded-full">NEW</span>' : ''}
                        ${bio.status === 'pending' ? '<span class="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">PENDING</span>' : ''}
                    </div>
                    <div class="p-5">
                        <span class="text-xs font-bold text-${color} uppercase tracking-wider">${bio.era} • ${bio.region}</span>
                        <h3 class="font-serif text-lg font-bold text-text-main mt-2 mb-2 group-hover:text-primary transition-colors">
                            ${bio.name}
                        </h3>
                        <p class="text-sm text-text-secondary line-clamp-2">${bio.introduction || bio.summary || ''}</p>
                        ${bio.tags && bio.tags.length > 0 ? `
                            <div class="flex flex-wrap gap-1 mt-3">
                                ${bio.tags.slice(0, 3).map(tag => `<span class="text-xs bg-lavender-soft px-2 py-1 rounded">${tag}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                </a>
            </div>
        `;
    },

    /**
     * Create pagination HTML
     * @param {Object} pagination - Pagination data (page, totalPages, total)
     * @param {Function} onPageChange - Page change callback
     * @returns {string} - HTML string
     */
    createPagination(pagination, onPageChangeFn = 'changePage') {
        const { page, totalPages, total } = pagination;

        if (totalPages <= 1) return '';

        let pages = [];
        const range = 2;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= page - range && i <= page + range)) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }

        return `
            <div class="flex items-center justify-center gap-2 mt-12">
                <button 
                    onclick="${onPageChangeFn}(${page - 1})" 
                    ${page === 1 ? 'disabled' : ''}
                    class="size-10 rounded-lg border border-border-light flex items-center justify-center hover:bg-lavender-soft disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <span class="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                
                ${pages.map(p => {
            if (p === '...') {
                return '<span class="px-2 text-text-secondary">...</span>';
            }
            return `
                        <button 
                            onclick="${onPageChangeFn}(${p})"
                            class="size-10 rounded-lg border ${p === page ? 'bg-primary text-white border-primary' : 'border-border-light hover:bg-lavender-soft'} flex items-center justify-center font-bold text-sm transition-colors"
                        >
                            ${p}
                        </button>
                    `;
        }).join('')}
                
                <button 
                    onclick="${onPageChangeFn}(${page + 1})" 
                    ${page === totalPages ? 'disabled' : ''}
                    class="size-10 rounded-lg border border-border-light flex items-center justify-center hover:bg-lavender-soft disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <span class="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
            </div>
            
            <p class="text-center text-sm text-text-secondary mt-4">
                Showing page ${page} of ${totalPages} (${total} total entries)
            </p>
        `;
    },

    /**
     * Format a date for display
     * @param {string|Date} date - Date to format
     * @returns {string} - Formatted date
     */
    formatDate(date) {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    /**
     * Truncate text to a specified length
     * @param {string} text - Text to truncate
     * @param {number} length - Max length
     * @returns {string} - Truncated text
     */
    truncate(text, length = 100) {
        if (!text || text.length <= length) return text;
        return text.substring(0, length).trim() + '...';
    },

    /**
     * Debounce a function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} - Debounced function
     */
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UI;
}
