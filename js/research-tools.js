/**
 * Research Tools Loader
 * Loads research tools from Strapi API
 */

class ResearchToolsLoader {
  constructor() {
    this.api = window.StrapiAPI || window.API;
  }

  async loadResearchTools(containerId) {
    const container = document.getElementById(containerId);

    if (!container) {
      console.error('Research tools container not found');
      return;
    }

    try {
      // Fetch research tools
      const response = await this.api.researchTools.getAll({
        sort: 'createdAt:desc',
        pagination: { pageSize: 8 }
      });

      const tools = response.entries || [];

      if (tools.length === 0) {
        container.innerHTML = '<p class="text-center text-text-secondary">No research tools available.</p>';
        return;
      }

      // Render research tools
      const html = tools.map(tool => {
        const title = tool.title || 'Untitled Tool';
        const description = tool.description || '';
        const type = tool.type || 'Tool';
        const url = tool.url || tool.link || '#';

        return `
          <div class="bg-white rounded-xl p-6 border border-border-light hover:shadow-lg transition-shadow">
            <div class="size-12 rounded-lg bg-accent-gold/10 flex items-center justify-center mb-4">
              <span class="material-symbols-outlined text-accent-gold text-2xl">${this.getToolIcon(type)}</span>
            </div>
            <div class="flex items-center gap-2 mb-3">
              <span class="px-2 py-1 bg-accent-gold/10 text-accent-gold text-xs font-bold uppercase tracking-wider rounded">${type}</span>
            </div>
            <h3 class="font-serif text-lg font-bold text-text-main mb-2">${title}</h3>
            ${description ? `<p class="text-text-secondary text-sm mb-4">${description}</p>` : ''}
            <a href="${url}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 text-accent-gold font-bold hover:underline">
              <span class="material-symbols-outlined text-sm">open_in_new</span>
              ${tool.actionText || 'Access Tool'}
            </a>
          </div>
        `;
      }).join('');

      container.innerHTML = html;

    } catch (error) {
      console.error('Failed to load research tools:', error);
      container.innerHTML = '<p class="text-center text-red-600">Failed to load research tools. Please try again later.</p>';
    }
  }

  getToolIcon(type) {
    const icons = {
      'search': 'search',
      'export': 'download',
      'citation': 'format_quote',
      'database': 'database',
      'analysis': 'analytics',
      'filter': 'filter_list'
    };

    return icons[type.toLowerCase()] || 'build';
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const loader = new ResearchToolsLoader();
  const container = document.getElementById('research-tools-grid');
  if (container) {
    loader.loadResearchTools('research-tools-grid');
  }
});

// Export for global access
if (typeof window !== 'undefined') {
  window.ResearchToolsLoader = ResearchToolsLoader;
}