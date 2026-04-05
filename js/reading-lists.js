/**
 * Reading Lists Loader
 * Loads reading lists from Strapi API
 */

class ReadingListsLoader {
  constructor() {
    this.api = window.StrapiAPI || window.API;
  }

  async loadReadingLists(containerId) {
    const container = document.getElementById(containerId);

    if (!container) {
      console.error('Reading lists container not found');
      return;
    }

    try {
      // Fetch reading lists
      const response = await this.api.readingLists.getAll({
        populate: 'books',
        sort: 'createdAt:desc',
        pagination: { pageSize: 10 }
      });

      const readingLists = response.entries || [];

      if (readingLists.length === 0) {
        container.innerHTML = '<p class="text-center text-text-secondary">No reading lists available.</p>';
        return;
      }

      // Render reading lists
      const html = readingLists.map(list => {
        const title = list.title || list.name || 'Untitled List';
        const description = list.description || '';
        const category = list.category || '';
        const books = list.books || [];

        return `
          <div class="bg-white rounded-xl p-6 border border-border-light">
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
            <a href="reading-lists.html?slug=${list.slug}" class="text-accent-gold font-bold text-sm hover:underline">View Full List →</a>
          </div>
        `;
      }).join('');

      container.innerHTML = html;

    } catch (error) {
      console.error('Failed to load reading lists:', error);
      container.innerHTML = '<p class="text-center text-red-600">Failed to load reading lists. Please try again later.</p>';
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const loader = new ReadingListsLoader();
  const container = document.getElementById('reading-lists-grid');
  if (container) {
    loader.loadReadingLists('reading-lists-grid');
  }
});

// Export for global access
if (typeof window !== 'undefined') {
  window.ReadingListsLoader = ReadingListsLoader;
}