// Featured Collections for featured.html
// Loads featured collections from Strapi with real biography counts

// Helper function to safely access CONFIG
function getApiBaseUrl() {
    if (typeof CONFIG !== 'undefined' && CONFIG.API_BASE_URL) {
        return CONFIG.API_BASE_URL;
    }
    return 'https://womencypedia-cms.onrender.com';
}

// Proxy Cloudinary images to avoid tracking prevention blocks
function proxyImageUrl(url) {
    if (!url || !url.includes('res.cloudinary.com')) {
        return url;
    }
    // Encode the URL and proxy through CMS
    const encodedUrl = encodeURIComponent(url);
    return `${getApiBaseUrl()}/api/images/proxy?url=${encodedUrl}`;
}

// Helper function to get image URL from Strapi media
function getImageUrl(media) {
    if (!media) return null;
    const mediaData = media.data ? media.data.attributes || media.data : media;
    if (mediaData && mediaData.url) {
        if (mediaData.url.startsWith('http')) return proxyImageUrl(mediaData.url);
        return getApiBaseUrl() + mediaData.url;
    }
    return null;
}

// Browse fetch function (similar to browse.js)
async function browseFetch(endpoint, params = {}) {
    const baseUrl = getApiBaseUrl();
    const url = new URL(`${baseUrl}/api/${endpoint}`);

    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.append(key, params[key]);
        }
    });

    // Direct fetch for collections
    const headers = { 'Content-Type': 'application/json' };
    if (typeof CONFIG !== 'undefined' && CONFIG.API_TOKEN) {
        headers['Authorization'] = `Bearer ${CONFIG.API_TOKEN}`;
    }

    try {
        const response = await fetch(url.toString(), { headers });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`[Browse] Failed to fetch ${endpoint}:`, error);
        throw error;
    }
}

// Load featured collections
async function loadFeaturedCollections() {
    const container = document.getElementById('featured-collections-grid');
    if (!container) {
        console.warn('[Featured Collections] Container not found');
        return;
    }

    // Show loading state
    container.innerHTML = '<div class="col-span-full text-center py-8 text-text-secondary">Loading featured collections...</div>';

    try {
        // Fetch featured collections
        const collectionsRes = await browseFetch('collections', {
            "filters[featured][$eq]": true,
            "populate": "coverImage",
            "pagination[pageSize]": 6,
            "sort": "order:asc"
        });

        if (!collectionsRes.data || collectionsRes.data.length === 0) {
            container.innerHTML = '<div class="col-span-full text-center py-8 text-text-secondary">No featured collections available.</div>';
            return;
        }

        // Get collection slugs for count loading
        const collectionSlugs = collectionsRes.data.map(col => {
            const attrs = col.attributes || col;
            return attrs.slug;
        }).filter(slug => slug);

        // Load biography counts for each collection
        const countPromises = collectionSlugs.map(async (slug) => {
            try {
                // First get collection ID
                const collectionRes = await browseFetch('collections', {
                    "filters[slug][$eq]": slug,
                    "fields[0]": "id"
                });

                if (collectionRes.data && collectionRes.data.length > 0) {
                    const collectionId = collectionRes.data[0].id;

                    // Get biography count
                    const bioRes = await browseFetch('biographies', {
                        "filters[collections][id][$eq]": collectionId,
                        "pagination[pageSize]": 1
                    });

                    return {
                        slug,
                        count: bioRes.meta?.pagination?.total || 0
                    };
                }
                return { slug, count: 0 };
            } catch (error) {
                console.warn(`[Featured Collections] Failed to load count for ${slug}:`, error);
                return { slug, count: 0 };
            }
        });

        // Wait for all counts to load
        const counts = await Promise.allSettled(countPromises);
        const countMap = {};
        counts.forEach(result => {
            if (result.status === 'fulfilled') {
                countMap[result.value.slug] = result.value.count;
            }
        });

        // Render collections
        const collectionCards = collectionsRes.data.map(collection => {
            const attrs = collection.attributes || collection;
            const slug = attrs.slug || '';
            const title = attrs.title || attrs.name || 'Untitled Collection';
            const description = attrs.description || attrs.summary || 'A curated collection of remarkable women.';
            const coverImage = getImageUrl(attrs.coverImage);
            const biographyCount = countMap[slug] || 0;

            return `
                <a href="collections.html?slug=${slug}"
                    class="group bg-white rounded-2xl overflow-hidden border border-border-light hover:shadow-xl transition-all">
                    <div class="h-48 relative overflow-hidden">
                        ${coverImage ? `
                            <img src="${coverImage}" alt="${title}"
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy" />
                        ` : `
                            <div class="w-full h-full bg-gradient-to-br from-primary/20 to-accent-gold/20 flex items-center justify-center">
                                <span class="material-symbols-outlined text-primary/30 text-5xl">collections</span>
                            </div>
                        `}
                        <div class="absolute inset-0 bg-gradient-to-t from-text-main/80 to-transparent"></div>
                        <div class="absolute bottom-4 left-4 right-4">
                            <h3 class="font-serif text-xl font-bold text-white">${title}</h3>
                        </div>
                    </div>
                    <div class="p-5">
                        <p class="text-sm text-text-secondary mb-3">${description}</p>
                        <span class="text-xs font-bold text-accent-teal">${biographyCount} ${biographyCount === 1 ? 'biography' : 'biographies'} →</span>
                    </div>
                </a>
            `;
        });

        container.innerHTML = collectionCards.join('');

    } catch (error) {
        console.error('[Featured Collections] Failed to load collections:', error);
        container.innerHTML = '<div class="col-span-full text-center py-8 text-text-secondary">Unable to load featured collections at this time. Please try again later.</div>';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔍 [Featured Collections] Initializing...');
    loadFeaturedCollections();
});