/**
 * Reading Lists Loader
 * Loads reading lists from Strapi API with static fallback
 */

const READING_LISTS_FALLBACK = [
  {
    title: "Medieval European Queens",
    category: "Politics",
    description: "Curated reading list on monarchy, power, and gender in medieval Europe.",
    books: [
      { title: "Queens of the Conquest", author: "Alison Weir" },
      { title: "Eleanor of Aquitaine", author: "Marion Meade" },
      { title: "The She-Wolves", author: "Helen Castor" },
      { title: "Empress Matilda", author: "Marjorie Chibnall" }
    ]
  },
  {
    title: "African Women Leaders",
    category: "Leadership",
    description: "Essential reading on African women's political and cultural power.",
    books: [
      { title: "Warrior Women of Africa", author: "Mariama Bâ" },
      { title: "The Strength of Our Mothers", author: "Niara Sudarkasa" },
      { title: "African Women in Revolution", author: "Wunyabari O. Maloba" },
      { title: "Yaa Asantewaa", author: "A. Adu Boahen" }
    ]
  },
  {
    title: "Women in Science & Medicine",
    category: "STEM",
    description: "Stories of women who changed our understanding of the natural world.",
    books: [
      { title: "Lab Girl", author: "Hope Jahren" },
      { title: "Hidden Figures", author: "Margot Lee Shetterly" },
      { title: "The Immortal Life of Henrietta Lacks", author: "Rebecca Skloot" },
      { title: "Broad Band", author: "Claire L. Evans" }
    ]
  },
  {
    title: "Feminist Theory & Philosophy",
    category: "Theory",
    description: "Foundational texts in feminist thought from diverse perspectives.",
    books: [
      { title: "A Vindication of the Rights of Woman", author: "Mary Wollstonecraft" },
      { title: "The Second Sex", author: "Simone de Beauvoir" },
      { title: "Sister Outsider", author: "Audre Lorde" },
      { title: "Gender Trouble", author: "Judith Butler" }
    ]
  }
];

class ReadingListsLoader {
  constructor() {
    this.api = window.StrapiAPI || window.API;
  }

  async loadReadingLists(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
      if (!this.api) throw new Error('API not available');

      const response = await this.api.readingLists.getAll({
        sort: 'createdAt:desc',
        pagination: { pageSize: 10 }
      });

      const readingLists = response.entries || [];

      if (readingLists.length === 0) {
        this.renderFallback(container);
        return;
      }

      container.innerHTML = readingLists.map(list => {
        const title = list.title || list.name || 'Untitled List';
        const description = list.description || '';
        const category = list.category || '';
        const books = list.books || [];

        return `
          <div class="bg-white rounded-xl p-6 border border-border-light hover:shadow-md transition-shadow">
            <div class="flex items-center gap-2 mb-3">
              ${category ? `<span class="px-2 py-1 bg-accent-gold/10 text-accent-gold text-xs font-bold uppercase tracking-wider rounded">${category}</span>` : ''}
            </div>
            <h3 class="font-bold text-text-main mb-3">${title}</h3>
            ${description ? `<p class="text-text-secondary text-sm mb-4">${description}</p>` : ''}
            ${books.length > 0 ? `
              <ul class="text-text-secondary text-sm space-y-2 mb-4">
                ${books.slice(0, 3).map(book => `<li>• "${book.title}" ${book.author ? `by ${book.author}` : ''}</li>`).join('')}
                ${books.length > 3 ? `<li class="text-accent-gold">...and ${books.length - 3} more</li>` : ''}
              </ul>
            ` : ''}
            <a href="#" class="text-accent-gold font-bold text-sm hover:underline">View Full List →</a>
          </div>
        `;
      }).join('');

    } catch (error) {
      console.warn('[Resources] Reading lists API unavailable, using fallback:', error.message || error);
      this.renderFallback(container);
    }
  }

  renderFallback(container) {
    container.innerHTML = READING_LISTS_FALLBACK.map(list => `
      <div class="bg-white rounded-xl p-6 border border-border-light hover:shadow-md transition-shadow">
        <div class="flex items-center gap-2 mb-3">
          <span class="px-2 py-1 bg-accent-gold/10 text-accent-gold text-xs font-bold uppercase tracking-wider rounded">${list.category}</span>
        </div>
        <h3 class="font-bold text-text-main mb-3">${list.title}</h3>
        <p class="text-text-secondary text-sm mb-4">${list.description}</p>
        <ul class="text-text-secondary text-sm space-y-2 mb-4">
          ${list.books.slice(0, 3).map(book => `<li>• "${book.title}" by ${book.author}</li>`).join('')}
          ${list.books.length > 3 ? `<li class="text-accent-gold">...and ${list.books.length - 3} more</li>` : ''}
        </ul>
        <a href="#" class="text-accent-gold font-bold text-sm hover:underline">View Full List →</a>
      </div>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const loader = new ReadingListsLoader();
  const container = document.getElementById('reading-lists-grid');
  if (container) {
    loader.loadReadingLists('reading-lists-grid');
  }
});

if (typeof window !== 'undefined') {
  window.ReadingListsLoader = ReadingListsLoader;
}