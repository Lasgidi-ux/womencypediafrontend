// Browse functionality for Womencypedia
// Implements search, filtering, and dynamic biography display

let currentFilters = {
    search: '',
    regions: [],
    eras: [],
    domains: [],
    tags: []
};

let currentBiographies = [];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeBrowse();
});

function initializeBrowse() {
    // Load data
    loadBiographies();

    // Set up event listeners
    setupSearch();
    setupFilters();
    setupFilterTabs();

    // Initial display
    displayBiographies();
}

function loadBiographies() {
    // In a real headless setup, this would fetch from API
    // For now, using the static data
    currentBiographies = biographies;
}

function setupSearch() {
    const searchInput = document.querySelector('#main-content input[type="search"]');
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            currentFilters.search = e.target.value.toLowerCase();
            displayBiographies();
        });
    }
}

function setupFilters() {
    // Modal toggle
    const filtersBtn = document.querySelector('button:has(.material-symbols-outlined:contains("tune"))');
    const modal = document.getElementById('filters-modal');
    const closeBtn = document.getElementById('close-filters');
    const applyBtn = document.getElementById('apply-filters');
    const clearBtn = document.getElementById('clear-filters');

    if (filtersBtn) {
        filtersBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }

    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            collectFilters();
            displayBiographies();
            modal.classList.add('hidden');
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            clearAllFilters();
            displayBiographies();
        });
    }
}

function setupFilterTabs() {
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');

            // For now, just visual feedback - could implement tab-specific filtering
            const filterType = this.textContent.trim().toLowerCase().replace(' ', '-');
            console.log('Switched to filter:', filterType);
        });
    });
}

function collectFilters() {
    currentFilters.regions = [];
    currentFilters.eras = [];
    currentFilters.domains = [];
    currentFilters.tags = [];

    const checkboxes = document.querySelectorAll('.filter-checkbox:checked');
    checkboxes.forEach(checkbox => {
        const filterType = checkbox.dataset.filter;
        const value = checkbox.value;

        switch (filterType) {
            case 'region':
                currentFilters.regions.push(value);
                break;
            case 'era':
                currentFilters.eras.push(value);
                break;
            case 'domain':
                currentFilters.domains.push(value);
                break;
            case 'tag':
                currentFilters.tags.push(value);
                break;
        }
    });
}

function clearAllFilters() {
    currentFilters = {
        search: '',
        regions: [],
        eras: [],
        domains: [],
        tags: []
    };

    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll('.filter-checkbox:checked');
    checkboxes.forEach(checkbox => checkbox.checked = false);

    // Clear search
    const searchInput = document.querySelector('#main-content input[type="search"]');
    if (searchInput) {
        searchInput.value = '';
    }
}

function filterBiographies() {
    return currentBiographies.filter(bio => {
        // Search filter
        if (currentFilters.search) {
            const searchTerm = currentFilters.search;
            const searchableText = `${bio.name} ${bio.introduction} ${bio.contributions} ${bio.tags.join(' ')}`.toLowerCase();
            if (!searchableText.includes(searchTerm)) {
                return false;
            }
        }

        // Region filter
        if (currentFilters.regions.length > 0) {
            if (!currentFilters.regions.includes(bio.region.toLowerCase().replace(' ', '-'))) {
                return false;
            }
        }

        // Era filter
        if (currentFilters.eras.length > 0) {
            if (!currentFilters.eras.includes(bio.era.toLowerCase().replace(' ', '-'))) {
                return false;
            }
        }

        // Domain filter
        if (currentFilters.domains.length > 0) {
            const bioDomain = bio.category.toLowerCase().replace(' & ', '-').replace(' ', '-');
            if (!currentFilters.domains.includes(bioDomain)) {
                return false;
            }
        }

        // Tags filter
        if (currentFilters.tags.length > 0) {
            const hasMatchingTag = currentFilters.tags.some(tag =>
                bio.tags.some(bioTag => bioTag.toLowerCase().includes(tag))
            );
            if (!hasMatchingTag) {
                return false;
            }
        }

        return true;
    });
}

function displayBiographies() {
    const filteredBios = filterBiographies();
    const container = document.querySelector('#main-content section:has(h2:contains("Recent Entries")) .grid');

    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    if (filteredBios.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <span class="material-symbols-outlined text-6xl text-text-secondary/50 mb-4">search_off</span>
                <h3 class="font-serif text-xl font-bold text-text-main mb-2">No biographies found</h3>
                <p class="text-text-secondary">Try adjusting your search terms or filters.</p>
            </div>
        `;
        return;
    }

    // Display filtered biographies
    filteredBios.forEach(bio => {
        const card = createBiographyCard(bio);
        container.appendChild(card);
    });
}

function createBiographyCard(bio) {
    const card = document.createElement('a');
    card.href = `biography.html?id=${bio.id}`;
    card.className = 'group bg-white rounded-2xl overflow-hidden border border-border-light hover:shadow-xl transition-all';

    const eraColor = getEraColor(bio.era);
    const categoryColor = getCategoryColor(bio.category);

    card.innerHTML = `
        <div class="aspect-[4/3] bg-lavender-soft/50 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-${categoryColor}/20 to-${eraColor}/20 flex items-center justify-center">
                <span class="material-symbols-outlined text-${categoryColor}/40 text-6xl">person</span>
            </div>
            ${bio.id <= 2 ? '<span class="absolute top-3 left-3 bg-accent-gold text-white text-xs font-bold px-2 py-1 rounded-full">NEW</span>' : ''}
        </div>
        <div class="p-5">
            <span class="text-xs font-bold text-${eraColor} uppercase tracking-wider">${bio.era} • ${bio.region}</span>
            <h3 class="font-serif text-lg font-bold text-text-main mt-2 mb-2 group-hover:text-primary transition-colors">
                ${bio.name}
            </h3>
            <p class="text-sm text-text-secondary line-clamp-2">${bio.introduction}</p>
            <div class="flex flex-wrap gap-1 mt-3">
                ${bio.tags.slice(0, 3).map(tag => `<span class="text-xs bg-lavender-soft px-2 py-1 rounded">${tag}</span>`).join('')}
            </div>
        </div>
    `;

    return card;
}

function getEraColor(era) {
    const colors = {
        'Ancient': 'accent-gold',
        'Pre-colonial': 'primary',
        'Colonial': 'accent-teal',
        'Post-colonial': 'divider',
        'Contemporary': 'lavender'
    };
    return colors[era] || 'text-secondary';
}

function getCategoryColor(category) {
    const colors = {
        'Leadership': 'primary',
        'Culture & Arts': 'accent-gold',
        'Spirituality & Faith': 'accent-teal',
        'Politics & Governance': 'divider',
        'Science & Innovation': 'lavender',
        'Community Builders': 'primary',
        'Activism & Justice': 'accent-gold',
        'Education': 'accent-teal',
        'Diaspora Stories': 'divider'
    };
    return colors[category] || 'text-secondary';
}

// Make functions globally available for inline event handlers
window.toggleFilters = function () {
    const modal = document.getElementById('filters-modal');
    if (modal) {
        modal.classList.toggle('hidden');
    }
};