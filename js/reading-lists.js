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

      // Store API data for modal access
      this.apiReadingLists = readingLists;

      container.innerHTML = readingLists.map((list, index) => {
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
            <button onclick="viewFullReadingList(${index}, false)" class="text-accent-gold font-bold text-sm hover:underline bg-transparent border-none cursor-pointer">View Full List →</button>
          </div>
        `;
      }).join('');

    } catch (error) {
      console.warn('[Resources] Reading lists API unavailable, using fallback:', error.message || error);
      this.renderFallback(container);
    }
  }

  renderFallback(container) {
    container.innerHTML = READING_LISTS_FALLBACK.map((list, index) => `
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
        <button onclick="viewFullReadingList(${index}, true)" class="text-accent-gold font-bold text-sm hover:underline bg-transparent border-none cursor-pointer">View Full List →</button>
      </div>
    `).join('');
  }

  // View full reading list in modal
  viewFullReadingList(index, isFallback = false) {
    const lists = isFallback ? READING_LISTS_FALLBACK : (this.apiReadingLists || READING_LISTS_FALLBACK);
    const list = lists[index];

    if (!list) return;

    const title = list.title || list.name || 'Untitled List';
    const description = list.description || '';
    const category = list.category || '';
    const books = list.books || [];

    const modalHTML = `
      <div id="reading-list-modal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onclick="closeReadingListModal()">
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
          <div class="p-8">
            <button onclick="closeReadingListModal()" class="absolute top-4 right-4 size-8 flex items-center justify-center rounded-full hover:bg-border-light transition-colors">
              <span class="material-symbols-outlined text-text-secondary">close</span>
            </button>

            <div class="mb-6">
              ${category ? `<span class="inline-block px-3 py-1 bg-accent-gold/10 text-accent-gold text-sm font-bold uppercase tracking-wider rounded mb-3">${category}</span>` : ''}
              <h2 class="font-serif text-2xl font-bold text-text-main mb-2">${title}</h2>
              ${description ? `<p class="text-text-secondary">${description}</p>` : ''}
            </div>

            <div class="space-y-4 mb-6">
              <h3 class="font-bold text-text-main text-lg">Complete Reading List (${books.length} books)</h3>
              <div class="space-y-3">
                ${books.map((book, i) => `
                  <div class="flex items-start gap-4 p-4 bg-lavender-soft/30 rounded-lg">
                    <span class="flex-shrink-0 size-8 rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center text-sm font-bold">${i + 1}</span>
                    <div class="flex-1">
                      <h4 class="font-bold text-text-main text-base">${book.title}</h4>
                      ${book.author ? `<p class="text-text-secondary text-sm">by ${book.author}</p>` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="flex justify-between items-center pt-6 border-t border-border-light">
              <div class="text-sm text-text-secondary">
                ${books.length} book${books.length !== 1 ? 's' : ''} in this reading list
              </div>
              <div class="flex gap-3">
                <button onclick="closeReadingListModal()" class="px-6 py-2 border border-border-light text-text-main font-bold rounded-lg hover:bg-border-light transition-colors">
                  Close
                </button>
                <a href="research.html" class="px-6 py-2 bg-accent-gold text-white font-bold rounded-lg hover:bg-accent-gold/90 transition-colors">
                  Start Research
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }
}

// Global functions for modal interaction
function viewFullReadingList(index, isFallback = false) {
  const loader = new ReadingListsLoader();
  loader.viewFullReadingList(index, isFallback);
}

function closeReadingListModal() {
  const modal = document.getElementById('reading-list-modal');
  if (modal) {
    modal.remove();
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
  window.viewFullReadingList = viewFullReadingList;
  window.closeReadingListModal = closeReadingListModal;
}