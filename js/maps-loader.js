/**
 * Maps Loader
 * Loads interactive maps from Strapi API
 */

class MapsLoader {
  constructor() {
    this.api = window.StrapiAPI || window.API;
  }

  async loadMaps(containerId) {
    const container = document.getElementById(containerId);

    if (!container) {
      console.error('Maps container not found');
      return;
    }

    try {
      // Fetch maps
      const response = await this.api.maps.getAll({
        populate: 'markers',
        sort: 'createdAt:desc',
        pagination: { pageSize: 6 }
      });

      const maps = response.entries || [];

      if (maps.length === 0) {
        container.innerHTML = '<p class="text-center text-text-secondary">No maps available.</p>';
        return;
      }

      // Render maps
      const html = maps.map(map => {
        const title = map.title || 'Untitled Map';
        const description = map.description || '';
        const region = map.region || '';
        const markers = map.markers || [];

        return `
          <div class="bg-white rounded-xl p-6 border border-border-light hover:shadow-lg transition-shadow">
            <div class="aspect-video bg-gradient-to-br from-primary/20 to-accent-teal/20 rounded-lg mb-4 flex items-center justify-center">
              <span class="material-symbols-outlined text-primary text-4xl opacity-60">map</span>
            </div>
            <div class="flex items-center gap-2 mb-3">
              ${region ? `<span class="px-2 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded">${region}</span>` : ''}
              <span class="px-2 py-1 bg-accent-teal/10 text-accent-teal text-xs font-medium rounded">${markers.length} locations</span>
            </div>
            <h3 class="font-serif text-lg font-bold text-text-main mb-2">${title}</h3>
            ${description ? `<p class="text-text-secondary text-sm mb-4">${description}</p>` : ''}
            <a href="maps.html?slug=${map.slug}" class="inline-flex items-center gap-2 text-primary font-bold hover:underline">
              <span class="material-symbols-outlined text-sm">visibility</span>
              View Map
            </a>
          </div>
        `;
      }).join('');

      container.innerHTML = html;

    } catch (error) {
      console.error('Failed to load maps:', error);
      container.innerHTML = '<p class="text-center text-red-600">Failed to load maps. Please try again later.</p>';
    }
  }

  async loadMapBySlug(slug) {
    try {
      const map = await this.api.maps.getBySlug(slug);
      return map;
    } catch (error) {
      console.error('Failed to load map:', error);
      return null;
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const loader = new MapsLoader();
  const container = document.getElementById('maps-grid');
  if (container) {
    loader.loadMaps('maps-grid');
  }
});

// Export for global access
if (typeof window !== 'undefined') {
  window.MapsLoader = MapsLoader;
}