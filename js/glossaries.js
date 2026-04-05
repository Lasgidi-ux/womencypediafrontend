/**
 * Glossaries Loader
 * Loads glossary terms from Strapi API
 */

class GlossariesLoader {
  constructor() {
    this.api = window.StrapiAPI || window.API;
  }

  async loadGlossaryTerms(containerId, limit = 12) {
    const container = document.getElementById(containerId);

    if (!container) {
      console.error('Glossary container not found');
      return;
    }

    try {
      // Fetch glossary terms
      const response = await this.api.glossaries.getTerms({
        sort: 'term:asc',
        pagination: { pageSize: limit }
      });

      const terms = response.entries || [];

      if (terms.length === 0) {
        container.innerHTML = '<p class="text-center text-text-secondary col-span-full">No glossary terms available.</p>';
        return;
      }

      // Render glossary terms
      const html = terms.map(term => {
        const termName = term.term || term.title || 'Unknown Term';
        const definition = term.definition || term.description || '';
        const category = term.category || '';

        return `
          <div class="bg-background-cream rounded-lg p-4 hover:bg-white transition-colors border border-transparent hover:border-border-light">
            <div class="flex items-start justify-between mb-2">
              <h4 class="font-bold text-text-main">${termName}</h4>
              ${category ? `<span class="text-xs text-accent-teal font-medium">${category}</span>` : ''}
            </div>
            <p class="text-text-secondary text-sm">${definition}</p>
          </div>
        `;
      }).join('');

      container.innerHTML = html;

    } catch (error) {
      console.error('Failed to load glossary terms:', error);
      container.innerHTML = '<p class="text-center text-red-600 col-span-full">Failed to load glossary terms. Please try again later.</p>';
    }
  }

  async loadGlossaryBySlug(containerId, slug) {
    const container = document.getElementById(containerId);

    if (!container) {
      console.error('Glossary container not found');
      return;
    }

    try {
      // Fetch specific glossary
      const glossary = await this.api.glossaries.getBySlug(slug);

      if (!glossary) {
        container.innerHTML = '<p class="text-center text-text-secondary">Glossary not found.</p>';
        return;
      }

      // Render glossary
      const title = glossary.title || 'Glossary';
      const description = glossary.description || '';
      const terms = glossary.terms || [];

      let html = `
        <div class="text-center mb-8">
          <h2 class="font-serif text-3xl font-bold text-text-main mb-4">${title}</h2>
          ${description ? `<p class="text-text-secondary max-w-2xl mx-auto">${description}</p>` : ''}
        </div>
      `;

      if (terms.length > 0) {
        html += `
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${terms.map(term => `
              <div class="bg-background-cream rounded-lg p-4">
                <h4 class="font-bold text-text-main mb-2">${term.term}</h4>
                <p class="text-text-secondary text-sm">${term.definition}</p>
              </div>
            `).join('')}
          </div>
        `;
      } else {
        html += '<p class="text-center text-text-secondary">No terms in this glossary.</p>';
      }

      container.innerHTML = html;

    } catch (error) {
      console.error('Failed to load glossary:', error);
      container.innerHTML = '<p class="text-center text-red-600">Failed to load glossary. Please try again later.</p>';
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const loader = new GlossariesLoader();
  const container = document.getElementById('glossary-terms-grid');
  if (container) {
    loader.loadGlossaryTerms('glossary-terms-grid');
  }
});

// Export for global access
if (typeof window !== 'undefined') {
  window.GlossariesLoader = GlossariesLoader;
}