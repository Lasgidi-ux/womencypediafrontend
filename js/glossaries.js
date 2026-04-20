/**
 * Glossaries Loader
 * Loads glossary terms from Strapi API with static fallback
 */

const GLOSSARY_FALLBACK = [
  { term: "Matrilineal", definition: "A kinship system in which ancestry is traced through the mother's line. Common in many African, Southeast Asian, and indigenous American societies.", category: "Kinship" },
  { term: "Suffrage", definition: "The right to vote in political elections, historically denied to women until various reforms in the 19th and 20th centuries.", category: "Politics" },
  { term: "Patriarchy", definition: "A social system in which men hold primary power and predominate in roles of political leadership, moral authority, social privilege, and property control.", category: "Social Systems" },
  { term: "Purdah", definition: "The practice of screening women from men or strangers, especially by means of a curtain or veil. Observed in some Muslim and Hindu communities.", category: "Cultural Practice" },
  { term: "Dowry", definition: "Property or money brought by a bride to her husband on their marriage, a practice with deep historical roots across many cultures.", category: "Marriage Custom" },
  { term: "Amazons", definition: "In Greek mythology, a nation of all-female warriors. Archaeological evidence suggests real warrior women existed in Scythian and Sarmatian cultures.", category: "Mythology" },
  { term: "Feminism", definition: "A range of socio-political movements sharing a common goal: to define and advance political, economic, personal, and social equality of the sexes.", category: "Ideology" },
  { term: "Intersectionality", definition: "A theoretical framework for understanding how aspects of identity (gender, race, class, sexuality) combine to create unique modes of discrimination and privilege.", category: "Theory" },
  { term: "Sati", definition: "The historical Hindu practice of a widow immolating herself on her husband's funeral pyre. Banned in British India in 1829.", category: "Historical Practice" },
  { term: "Bride Price", definition: "Payment from the groom's family to the bride's family at marriage. Distinct from dowry, found across African, Asian, and Oceanian cultures.", category: "Marriage Custom" },
  { term: "Harem", definition: "The separate quarters reserved for wives and concubines in Muslim households, often misunderstood by Western scholars.", category: "Architecture" },
  { term: "Womanist", definition: "A term coined by Alice Walker describing a Black feminist or feminist of color, centering the experiences of women of African descent.", category: "Theory" }
];

class GlossariesLoader {
  constructor() {
    this.api = window.StrapiAPI || window.API;
  }

  async loadGlossaryTerms(containerId, limit = 12) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
      if (!this.api) throw new Error('API not available');

      const response = await this.api.glossaries.getTerms({
        sort: 'term:asc',
        pagination: { pageSize: limit }
      });

      const terms = response.entries || [];

      if (terms.length === 0) {
        this.renderFallback(container);
        return;
      }

      container.innerHTML = terms.map(term => {
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

    } catch (error) {
      console.warn('[Resources] Glossary API unavailable, using fallback:', error.message || error);
      this.renderFallback(container);
    }
  }

  renderFallback(container) {
    container.innerHTML = GLOSSARY_FALLBACK.map(t => `
      <div class="bg-background-cream rounded-lg p-4 hover:bg-white transition-colors border border-transparent hover:border-border-light">
        <div class="flex items-start justify-between mb-2">
          <h4 class="font-bold text-text-main">${t.term}</h4>
          <span class="text-xs text-accent-teal font-medium">${t.category}</span>
        </div>
        <p class="text-text-secondary text-sm">${t.definition}</p>
      </div>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const loader = new GlossariesLoader();
  const container = document.getElementById('glossary-terms-grid');
  if (container) {
    loader.loadGlossaryTerms('glossary-terms-grid');
  }
});

if (typeof window !== 'undefined') {
  window.GlossariesLoader = GlossariesLoader;
}