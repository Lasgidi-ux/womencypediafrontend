/**
 * Contributors Page - Dynamic Loading
 * Loads contributor data from Strapi CMS and renders it dynamically
 */

(function () {
    'use strict';

    // Wait for DOM and dependencies to be ready
    document.addEventListener('DOMContentLoaded', async () => {
        // Check if fetchStrapi is available
        if (typeof window.fetchStrapi !== 'function') {
            console.warn('fetchStrapi function not available.');
            return;
        }

        // Initialize contributors loading
        await loadContributors();
    });

    /**
     * Load contributors from Strapi API
     */
    async function loadContributors() {
        const loadingElement = document.getElementById('contributors-loading');
        const gridElement = document.getElementById('contributors-grid');

        if (!gridElement) {
            console.warn('Contributors grid container not found.');
            return;
        }

        try {
            // Fetch contributors from Strapi (leaders content type with verified=true)
            const response = await window.fetchStrapi('/api/leaders?filters[verified][$eq]=true&populate=*&sort=createdAt:desc');

            if (!response || !response.data || response.data.length === 0) {
                // Hide loading and show fallback
                if (loadingElement) loadingElement.classList.add('hidden');
                gridElement.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <span class="material-symbols-outlined text-4xl text-text-secondary mb-4 block">group</span>
                        <p class="text-text-secondary">Contributors will be displayed here once verified.</p>
                    </div>
                `;
                gridElement.classList.remove('hidden');
                return;
            }

            // Render contributors
            renderContributors(response.data, gridElement);

            // Hide loading and show grid
            if (loadingElement) loadingElement.classList.add('hidden');
            gridElement.classList.remove('hidden');

        } catch (error) {
            console.error('Error loading contributors:', error);
            if (loadingElement) loadingElement.classList.add('hidden');
            gridElement.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <span class="material-symbols-outlined text-4xl text-red-500 mb-4 block">error</span>
                    <p class="text-text-secondary">Unable to load contributors. Please try again later.</p>
                </div>
            `;
            gridElement.classList.remove('hidden');
        }
    }

    /**
     * Render contributors to the grid container
     * @param {Array} contributors - Array of contributor data from Strapi
     * @param {HTMLElement} container - Container element to render into
     */
    function renderContributors(contributors, container) {
        let html = '';

        contributors.forEach(contributor => {
            const attrs = contributor.attributes || contributor;
            const name = attrs.name || 'Anonymous Contributor';
            const specialty = attrs.sector || attrs.field || attrs.expertise || 'Researcher';
            const bio = attrs.bio || attrs.description || attrs.specialization || '';
            const joinDate = attrs.createdAt ? new Date(attrs.createdAt).getFullYear() : '2024';
            const entryCount = attrs.contributions || attrs.entries || 0;

            // Get domain color based on sector
            const domainColor = getDomainColor(specialty);

            html += `
                <div class="bg-white rounded-xl p-5 border border-border-light hover:shadow-md transition-shadow">
                    <div class="flex items-center gap-4 mb-4">
                        <div class="size-14 rounded-full ${domainColor} flex items-center justify-center flex-shrink-0">
                            <span class="material-symbols-outlined text-white text-2xl">person</span>
                        </div>
                        <div class="min-w-0">
                            <h3 class="font-serif text-base font-bold text-text-main truncate">${escapeHtml(name)}</h3>
                            <p class="text-accent-teal text-xs truncate">${escapeHtml(specialty)}</p>
                        </div>
                    </div>
                    <p class="text-text-secondary text-xs leading-relaxed mb-3 line-clamp-3">${escapeHtml(bio)}</p>
                    <div class="flex items-center justify-between text-xs text-text-secondary">
                        <span class="flex items-center gap-1">
                            <span class="material-symbols-outlined text-[14px]">auto_stories</span> ${entryCount} ${entryCount === 1 ? 'Entry' : 'Entries'}
                        </span>
                        <span class="flex items-center gap-1">
                            <span class="material-symbols-outlined text-[14px]">calendar_today</span> Joined ${joinDate}
                        </span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    /**
     * Get color class for contributor domain
     * @param {string} specialty - Specialty or sector name
     * @returns {string} - Tailwind color class
     */
    function getDomainColor(specialty) {
        const colors = {
            'leadership': 'bg-primary',
            'politics': 'bg-primary',
            'science': 'bg-accent-teal',
            'innovation': 'bg-accent-teal',
            'arts': 'bg-accent-gold',
            'culture': 'bg-accent-gold',
            'faith': 'bg-primary/40',
            'spirituality': 'bg-primary/40',
            'enterprise': 'bg-accent-gold/40',
            'economy': 'bg-accent-gold/40',
            'history': 'bg-divider',
            'research': 'bg-accent-teal/60'
        };

        const key = specialty.toLowerCase().split(' ')[0]; // Take first word
        return colors[key] || 'bg-gray-400';
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} - Escaped text
     */
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

})();