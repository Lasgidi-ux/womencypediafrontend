/**
 * Maps Loader
 * Loads interactive maps from Strapi API with static fallback
 */

const MAPS_FALLBACK = [
  { title: "Queens & Empresses of Africa", description: "Explore the kingdoms and empires ruled or shaped by women across the African continent, from ancient Kush to colonial resistance.", region: "Africa", markers: 24 },
  { title: "Women of the Silk Road", description: "Trace the footsteps of women traders, diplomats, and scholars along the ancient Silk Road trade routes connecting East and West.", region: "Asia", markers: 18 },
  { title: "European Women's Suffrage", description: "Map the progression of women's suffrage across Europe from the late 19th century through the 20th century.", region: "Europe", markers: 32 },
  { title: "Indigenous Women Leaders of the Americas", description: "Discover the territories and stories of indigenous women leaders from the Haudenosaunee Confederacy to the Mapuche resistance.", region: "Americas", markers: 15 }
];

class MapsLoader {
  constructor() {
    this.api = window.StrapiAPI || window.API;
  }

  async loadMaps(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
      if (!this.api) throw new Error('API not available');

      const response = await this.api.maps.getAll({
        sort: 'createdAt:desc',
        pagination: { pageSize: 6 }
      });

      const maps = response.entries || [];

      if (maps.length === 0) {
        this.renderFallback(container);
        return;
      }

      container.innerHTML = maps.map(map => {
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
          </div>
        `;
      }).join('');

    } catch (error) {
      console.warn('[Resources] Maps API unavailable, using fallback:', error.message || error);
      this.renderFallback(container);
    }
  }

  renderFallback(container) {
    container.innerHTML = MAPS_FALLBACK.map(m => `
      <div class="bg-white rounded-xl p-6 border border-border-light hover:shadow-lg transition-shadow">
        <div class="aspect-video bg-gradient-to-br from-primary/20 to-accent-teal/20 rounded-lg mb-4 flex items-center justify-center">
          <span class="material-symbols-outlined text-primary text-4xl opacity-60">map</span>
        </div>
        <div class="flex items-center gap-2 mb-3">
          <span class="px-2 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded">${m.region}</span>
          <span class="px-2 py-1 bg-accent-teal/10 text-accent-teal text-xs font-medium rounded">${m.markers} locations</span>
        </div>
        <h3 class="font-serif text-lg font-bold text-text-main mb-2">${m.title}</h3>
        <p class="text-text-secondary text-sm mb-4">${m.description}</p>
        <span class="inline-flex items-center gap-1 text-primary font-bold text-sm opacity-60">
          <span class="material-symbols-outlined text-[16px]">lock</span> Coming Soon
        </span>
      </div>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const loader = new MapsLoader();
  const container = document.getElementById('maps-grid');
  if (container) {
    loader.loadMaps('maps-grid');
  }
});

if (typeof window !== 'undefined') {
  window.MapsLoader = MapsLoader;
}