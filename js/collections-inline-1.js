

        // Get media URL helper
        function getCollectionImageUrl(collection) {
            if (collection.coverImage && collection.coverImage.url) {
                return collection.coverImage.url;
            }
            return 'images/womencypedia-logo.png';
        }

        // Render collections from API data
        function renderCollections(collections) {
            const grid = document.getElementById('collections-grid');
            if (!grid) return;

            grid.innerHTML = collections.map((collection, index) => {
                const imageUrl = getCollectionImageUrl(collection);
                const slug = collection.slug || collection.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return `
                <article class="group bg-white rounded-lg overflow-hidden border border-border-light hover:border-accent-gold/50 hover:shadow-lg transition-all">
                    <div class="relative h-56 overflow-hidden">
                        <span class="absolute top-4 left-4 z-10 size-8 bg-accent-gold text-white rounded-full flex items-center justify-center text-sm font-bold">${index + 1}</span>
                        <img src="${imageUrl}" alt="${collection.title}"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                    <div class="p-6">
                        <h3 class="font-serif text-xl font-bold text-text-main mb-2" data-i18n="collections.collectiontitle">${collection.title}</h3>
                        <p class="text-sm text-text-secondary mb-4">${collection.description || ''}</p>
                        <a href="collection.html?slug=${slug}"
                            class="inline-flex items-center gap-1 text-sm font-semibold text-accent-teal hover:text-accent-teal/80">Explore
                            <span class="material-symbols-outlined text-[16px]">arrow_forward</span></a>
                    </div>
                </article>
            `;
            }).join('');

            // Hide loading, show grid
            document.getElementById('collections-loading').classList.add('hidden');
            grid.classList.remove('hidden');
        }

        // Show error message when collections can't be loaded
        function showCollectionsError() {
            const grid = document.getElementById('collections-grid');
            if (!grid) return;

            // Hide loading, show error in grid
            document.getElementById('collections-loading').classList.add('hidden');
            grid.innerHTML = `
                <div class="col-span-full text-center py-8 text-text-secondary">
                    <p>Unable to load collections at this time.</p>
                    <p class="text-sm mt-2">Please try again later.</p>
                </div>
            `;
            grid.classList.remove('hidden');
        }

        // Load collections from Strapi API
        async function loadCollections() {
            try {
                // Try Strapi API first
                if (typeof StrapiAPI !== 'undefined') {
                    const response = await StrapiAPI.collections.getAll();
                    if (response && response.entries && response.entries.length > 0) {
                        renderCollections(response.entries);
                        return;
                    }
                }
            } catch (error) {
                console.warn('Failed to load collections from Strapi:', error.message);
            }

            // If API fails or no data, show error
            showCollectionsError();
        }

        // Initialize on page load
        document.addEventListener('DOMContentLoaded', function () {
            loadCollections();
        });