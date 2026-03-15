/**
 * Womencypedia - Skeleton Loading System
 * Provides production-ready skeleton loading states for Strapi-powered content
 * 
 * Usage:
 * 1. Include this script in your pages
 * 2. Add data-skeleton="biography-grid" to containers
 * 3. SkeletonLoader auto-initializes on DOMContentLoaded
 */

const SKELETON_TEMPLATES = {
    // Biography card skeleton
    'biography-card': '<div class="bg-white rounded-xl overflow-hidden border border-border-light animate-pulse"><div class="h-48 bg-gray-200 w-full"></div><div class="p-5"><div class="h-3 bg-gray-200 rounded w-1/3 mb-3"></div><div class="h-5 bg-gray-200 rounded w-3/4 mb-2"></div><div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div><div class="flex gap-2"><div class="h-6 bg-gray-200 rounded-full w-16"></div><div class="h-6 bg-gray-200 rounded-full w-20"></div></div></div></div>',

    // Biography grid skeleton
    'biography-grid': '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><div class="bg-white rounded-xl overflow-hidden border border-border-light animate-pulse"><div class="h-48 bg-gray-200 w-full"></div><div class="p-5"><div class="h-3 bg-gray-200 rounded w-1/3 mb-3"></div><div class="h-5 bg-gray-200 rounded w-3/4 mb-2"></div><div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div><div class="flex gap-2"><div class="h-6 bg-gray-200 rounded-full w-16"></div><div class="h-6 bg-gray-200 rounded-full w-20"></div></div></div></div><div class="bg-white rounded-xl overflow-hidden border border-border-light animate-pulse"><div class="h-48 bg-gray-200 w-full"></div><div class="p-5"><div class="h-3 bg-gray-200 rounded w-1/3 mb-3"></div><div class="h-5 bg-gray-200 rounded w-3/4 mb-2"></div><div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div><div class="flex gap-2"><div class="h-6 bg-gray-200 rounded-full w-16"></div><div class="h-6 bg-gray-200 rounded-full w-20"></div></div></div></div><div class="bg-white rounded-xl overflow-hidden border border-border-light animate-pulse"><div class="h-48 bg-gray-200 w-full"></div><div class="p-5"><div class="h-3 bg-gray-200 rounded w-1/3 mb-3"></div><div class="h-5 bg-gray-200 rounded w-3/4 mb-2"></div><div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div><div class="flex gap-2"><div class="h-6 bg-gray-200 rounded-full w-16"></div><div class="h-6 bg-gray-200 rounded-full w-20"></div></div></div></div><div class="bg-white rounded-xl overflow-hidden border border-border-light animate-pulse"><div class="h-48 bg-gray-200 w-full"></div><div class="p-5"><div class="h-3 bg-gray-200 rounded w-1/3 mb-3"></div><div class="h-5 bg-gray-200 rounded w-3/4 mb-2"></div><div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div><div class="flex gap-2"><div class="h-6 bg-gray-200 rounded-full w-16"></div><div class="h-6 bg-gray-200 rounded-full w-20"></div></div></div></div><div class="bg-white rounded-xl overflow-hidden border border-border-light animate-pulse"><div class="h-48 bg-gray-200 w-full"></div><div class="p-5"><div class="h-3 bg-gray-200 rounded w-1/3 mb-3"></div><div class="h-5 bg-gray-200 rounded w-3/4 mb-2"></div><div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div><div class="flex gap-2"><div class="h-6 bg-gray-200 rounded-full w-16"></div><div class="h-6 bg-gray-200 rounded-full w-20"></div></div></div></div><div class="bg-white rounded-xl overflow-hidden border border-border-light animate-pulse"><div class="h-48 bg-gray-200 w-full"></div><div class="p-5"><div class="h-3 bg-gray-200 rounded w-1/3 mb-3"></div><div class="h-5 bg-gray-200 rounded w-3/4 mb-2"></div><div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div><div class="flex gap-2"><div class="h-6 bg-gray-200 rounded-full w-16"></div><div class="h-6 bg-gray-200 rounded-full w-20"></div></div></div></div></div>',

    // Collection card skeleton
    'collection-card': '<div class="bg-white rounded-xl overflow-hidden border border-border-light animate-pulse"><div class="h-40 bg-gray-200 w-full"></div><div class="p-5"><div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div><div class="h-3 bg-gray-200 rounded w-1/2 mb-4"></div><div class="h-3 bg-gray-200 rounded w-full"></div></div></div>',

    // Featured biography skeleton
    'featured-biography': '<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse"><div class="h-96 bg-gray-200 rounded-xl w-full"></div><div class="flex flex-col justify-center"><div class="h-4 bg-gray-200 rounded w-24 mb-4"></div><div class="h-10 bg-gray-200 rounded w-3/4 mb-4"></div><div class="h-4 bg-gray-200 rounded w-full mb-2"></div><div class="h-4 bg-gray-200 rounded w-full mb-2"></div><div class="h-4 bg-gray-200 rounded w-2/3 mb-6"></div><div class="flex gap-2"><div class="h-10 bg-gray-200 rounded-lg w-32"></div><div class="h-10 bg-gray-200 rounded-lg w-32"></div></div></div></div>',

    // Timeline item skeleton
    'timeline-item': '<div class="flex gap-4 animate-pulse"><div class="w-20 h-20 bg-gray-200 rounded-full flex-shrink-0"></div><div class="flex-1"><div class="h-4 bg-gray-200 rounded w-24 mb-2"></div><div class="h-6 bg-gray-200 rounded w-3/4 mb-2"></div><div class="h-3 bg-gray-200 rounded w-full"></div></div></div>',

    // Leader card skeleton
    'leader-card': '<div class="flex items-center gap-4 p-4 bg-white rounded-xl border border-border-light animate-pulse"><div class="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0"></div><div class="flex-1"><div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div><div class="h-3 bg-gray-200 rounded w-3/4"></div></div></div>',

    // Education module skeleton
    'education-card': '<div class="bg-white rounded-xl p-6 border border-border-light animate-pulse"><div class="flex items-center gap-4 mb-4"><div class="w-12 h-12 bg-gray-200 rounded-lg"></div><div class="flex-1"><div class="h-4 bg-gray-200 rounded w-1/3 mb-2"></div><div class="h-3 bg-gray-200 rounded w-1/2"></div></div></div><div class="h-3 bg-gray-200 rounded w-full mb-2"></div><div class="h-3 bg-gray-200 rounded w-2/3"></div></div>',

    // Text content skeleton
    'text-content': '<div class="animate-pulse space-y-4"><div class="h-4 bg-gray-200 rounded w-1/4"></div><div class="h-6 bg-gray-200 rounded w-3/4"></div><div class="h-4 bg-gray-200 rounded w-full"></div><div class="h-4 bg-gray-200 rounded w-full"></div><div class="h-4 bg-gray-200 rounded w-2/3"></div></div>',

    // List skeleton
    'list': '<div class="space-y-3 animate-pulse"><div class="flex items-center gap-3"><div class="w-8 h-8 bg-gray-200 rounded-full"></div><div class="flex-1"><div class="h-3 bg-gray-200 rounded w-1/2"></div></div></div><div class="flex items-center gap-3"><div class="w-8 h-8 bg-gray-200 rounded-full"></div><div class="flex-1"><div class="h-3 bg-gray-200 rounded w-1/2"></div></div></div><div class="flex items-center gap-3"><div class="w-8 h-8 bg-gray-200 rounded-full"></div><div class="flex-1"><div class="h-3 bg-gray-200 rounded w-1/2"></div></div></div><div class="flex items-center gap-3"><div class="w-8 h-8 bg-gray-200 rounded-full"></div><div class="flex-1"><div class="h-3 bg-gray-200 rounded w-1/2"></div></div></div><div class="flex items-center gap-3"><div class="w-8 h-8 bg-gray-200 rounded-full"></div><div class="flex-1"><div class="h-3 bg-gray-200 rounded w-1/2"></div></div></div></div>'
};

const SkeletonLoader = {
    // Initialize skeleton loaders on page
    init: function () {
        const skeletonElements = document.querySelectorAll('[data-skeleton]');

        skeletonElements.forEach(element => {
            const skeletonType = element.dataset.skeleton;
            const count = parseInt(element.dataset.skeletonCount) || 1;

            // Only add skeletons if no content is present
            if (element.children.length === 0 || element.innerHTML.trim() === '') {
                element.innerHTML = this.generateSkeleton(skeletonType, count);
                element.classList.add('skeleton-loading');
            }
        });

        // Set up intersection observer
        this.setupIntersectionObserver();

        console.log('[SkeletonLoader] Initialized');
    },

    // Generate skeleton HTML based on type and count
    generateSkeleton: function (type, count) {
        const template = SKELETON_TEMPLATES[type];

        if (!template) {
            console.warn('[SkeletonLoader] Unknown skeleton type: ' + type);
            return SKELETON_TEMPLATES['text-content'];
        }

        if (count === 1) {
            return template;
        }

        // For grids, wrap multiple items
        if (type === 'biography-grid') {
            let gridItems = '';
            for (let i = 0; i < count; i++) {
                gridItems += SKELETON_TEMPLATES['biography-card'];
            }
            return '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">' + gridItems + '</div>';
        }

        // For lists, stack items
        let items = '';
        for (let i = 0; i < count; i++) {
            items += template;
        }
        return items;
    },

    // Show skeletons in a container
    showSkeletons: function (containerSelector, skeletonType, count) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        container.innerHTML = this.generateSkeleton(skeletonType, count);
        container.classList.add('skeleton-loading');
    },

    // Hide skeletons and show content
    hideSkeletons: function (containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        container.classList.remove('skeleton-loading');
        container.classList.add('skeleton-loaded');
    },

    // Replace skeletons with actual content
    replaceWithContent: function (containerSelector, contentHTML) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        // Add fade-out animation
        container.style.opacity = '0';
        container.style.transition = 'opacity 0.3s ease';

        setTimeout(function () {
            container.innerHTML = contentHTML;
            container.classList.remove('skeleton-loading');
            container.classList.add('skeleton-loaded');

            // Fade in new content
            requestAnimationFrame(function () {
                container.style.opacity = '1';
            });
        }, 300);
    },

    // Show error state
    showError: function (containerSelector, message) {
        message = message || 'Failed to load content';
        const container = document.querySelector(containerSelector);
        if (!container) return;

        container.innerHTML = '<div class="bg-red-50 border border-red-100 rounded-xl p-8 text-center"><span class="material-symbols-outlined text-red-400 text-4xl mb-4">error</span><p class="text-red-600 font-medium mb-4">' + message + '</p><button onclick="location.reload()" class="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">Try Again</button></div>';
        container.classList.remove('skeleton-loading');
    },

    // Show empty state
    showEmpty: function (containerSelector, message) {
        message = message || 'No content found';
        const container = document.querySelector(containerSelector);
        if (!container) return;

        container.innerHTML = '<div class="bg-lavender-soft/20 border border-lavender/30 rounded-xl p-8 text-center"><span class="material-symbols-outlined text-lavender text-4xl mb-4">search_off</span><p class="text-text-secondary">' + message + '</p></div>';
        container.classList.remove('skeleton-loading');
    },

    // Setup intersection observer
    setupIntersectionObserver: function () {
        if (!('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('skeleton-visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('[data-skeleton]').forEach(function (el) {
            observer.observe(el);
        });
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    SkeletonLoader.init();
});
