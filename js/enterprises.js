/**
 * Enterprises Page Dynamic Content Loader
 * Loads enterprise categories and counts from Strapi API
 */

class EnterprisesLoader {
  constructor() {
    this.api = window.StrapiAPI || window.API;
    this.categories = [
      {
        name: 'Trade & Commerce',
        slug: 'Trade & Commerce',
        icon: 'local_shipping',
        color: 'primary',
        description: 'Market traders, merchants, and long-distance traders who built economic networks.'
      },
      {
        name: 'Agriculture & Food',
        slug: 'Agriculture & Food',
        icon: 'agriculture',
        color: 'accent-teal',
        description: 'Farmers, food producers, and agricultural innovators who fed communities.'
      },
      {
        name: 'Manufacturing',
        slug: 'Manufacturing',
        icon: 'factory',
        color: 'accent-gold',
        description: 'Artisans, weavers, pottery makers, and manufacturing pioneers.'
      },
      {
        name: 'Healthcare & Medicine',
        slug: 'Healthcare & Medicine',
        icon: 'medical_services',
        color: 'primary',
        description: 'Healers, midwives, physicians, and medical innovators.'
      },
      {
        name: 'Finance & Banking',
        slug: 'Finance & Banking',
        icon: 'account_balance',
        color: 'accent-teal',
        description: 'Early bankers, money lenders, and financial innovators.'
      },
      {
        name: 'Education',
        slug: 'Education',
        icon: 'school',
        color: 'accent-gold',
        description: 'Educators, school founders, and learning institution leaders.'
      },
      {
        name: 'Arts & Crafts',
        slug: 'Arts & Crafts',
        icon: 'palette',
        color: 'primary',
        description: 'Artists, craftswomen, and creative entrepreneurs.'
      },
      {
        name: 'Technology',
        slug: 'Technology',
        icon: 'memory',
        color: 'accent-teal',
        description: 'Inventors, engineers, and tech pioneers throughout history.'
      }
    ];
  }

  async loadCategoryCounts() {
    const counts = {};

    try {
      // Load counts for each category in parallel
      const countPromises = this.categories.map(async (category) => {
        try {
          const count = await this.api.enterprises.getCategoryCount(category.slug);
          counts[category.slug] = count;
        } catch (error) {
          console.warn(`Failed to load count for ${category.name}:`, error);
          counts[category.slug] = 0;
        }
      });

      await Promise.all(countPromises);
    } catch (error) {
      console.error('Failed to load enterprise category counts:', error);
    }

    return counts;
  }

  async loadFeaturedEnterprises() {
    try {
      // Get featured biographies from enterprise categories
      const enterpriseCategories = this.categories.map(cat => cat.slug);
      const filters = enterpriseCategories.map(cat => `filters[category][$eq]=${encodeURIComponent(cat)}`).join('&');
      const featuredQuery = `${filters}&filters[featured][$eq]=true&populate=image,tags&sort=createdAt:desc&pagination[pageSize]=3`;

      const res = await this.api.request(`/api/biographies?${featuredQuery}`);
      return res.entries || [];
    } catch (error) {
      console.error('Failed to load featured enterprises:', error);
      return [];
    }
  }

  renderCategoryGrid(counts) {
    const gridContainer = document.querySelector('.enterprise-categories-grid');
    if (!gridContainer) return;

    const html = this.categories.map(category => {
      const count = counts[category.slug] || 0;
      const colorClasses = this.getColorClasses(category.color);

      return `
        <a href="browse.html?category=${encodeURIComponent(category.slug)}"
           class="group bg-white rounded-2xl p-6 border border-border-light hover:shadow-lg transition-all">
          <div class="size-16 rounded-2xl bg-${category.color}/10 flex items-center justify-center mb-4 group-hover:bg-${category.color}/20 transition-colors">
            <span class="material-symbols-outlined text-${category.color} text-3xl">${category.icon}</span>
          </div>
          <h3 class="font-serif text-xl font-bold text-text-main mb-2">${category.name}</h3>
          <p class="text-text-secondary text-sm leading-relaxed mb-4">${category.description}</p>
          <span class="text-${category.color} text-sm font-bold group-hover:underline">View ${count} Entries →</span>
        </a>
      `;
    }).join('');

    gridContainer.innerHTML = html;
  }

  renderFeaturedEnterprises(enterprises) {
    const container = document.querySelector('.featured-enterprises-grid');
    if (!container) return;

    if (enterprises.length === 0) {
      container.innerHTML = '<p class="text-center text-text-secondary">No featured enterprises available.</p>';
      return;
    }

    const html = enterprises.map(enterprise => {
      const category = enterprise.category || 'Enterprise';
      const era = enterprise.era || '';
      const imageUrl = enterprise.image?.url ?
        (enterprise.image.url.startsWith('http') ? enterprise.image.url : `${this.api.baseURL}${enterprise.image.url}`) :
        '/images/placeholder-enterprise.jpg';

      return `
        <div class="bg-white rounded-2xl overflow-hidden border border-border-light hover:shadow-lg transition-shadow">
          <div class="h-48 bg-gradient-to-br from-primary/20 to-accent-gold/20 flex items-center justify-center">
            <img src="${imageUrl}" alt="${enterprise.name}" class="w-full h-full object-cover" onerror="this.style.display='none'">
            <span class="material-symbols-outlined text-primary text-6xl opacity-30">storefront</span>
          </div>
          <div class="p-6">
            <div class="flex items-center gap-2 mb-3">
              <span class="px-2 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded">${category}</span>
              ${era ? `<span class="px-2 py-1 bg-lavender-soft text-text-secondary text-xs font-medium rounded">${era}</span>` : ''}
            </div>
            <h3 class="font-serif text-xl font-bold text-text-main mb-2">${enterprise.name}</h3>
            <p class="text-text-secondary text-sm leading-relaxed mb-4">${enterprise.introduction || enterprise.description || ''}</p>
            <a href="biography.html?slug=${enterprise.slug}" class="text-primary font-bold hover:underline">Read Full Biography →</a>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = html;
  }

  getColorClasses(color) {
    const classes = {
      'primary': 'text-primary',
      'accent-teal': 'text-accent-teal',
      'accent-gold': 'text-accent-gold'
    };
    return classes[color] || classes.primary;
  }

  async init() {
    try {
      // Load category counts and featured enterprises in parallel
      const [counts, featuredEnterprises] = await Promise.all([
        this.loadCategoryCounts(),
        this.loadFeaturedEnterprises()
      ]);

      // Render the dynamic content
      this.renderCategoryGrid(counts);
      this.renderFeaturedEnterprises(featuredEnterprises);

      // Update total counts in stats section
      this.updateStats(counts);

    } catch (error) {
      console.error('Failed to initialize enterprises loader:', error);
    }
  }

  updateStats(counts) {
    const totalEnterprises = Object.values(counts).reduce((sum, count) => sum + count, 0);
    const totalCountries = 90; // This would need to be calculated from the API
    const totalYears = 5000; // This would need to be calculated from the API

    // Update the stats display
    const statsElements = document.querySelectorAll('.enterprise-stats');
    statsElements.forEach(el => {
      const type = el.dataset.stat;
      let value = totalEnterprises;

      if (type === 'countries') value = totalCountries;
      if (type === 'years') value = totalYears;

      el.textContent = this.formatNumber(value);
    });
  }

  formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const loader = new EnterprisesLoader();
  loader.init();
});

// Export for global access
if (typeof window !== 'undefined') {
  window.EnterprisesLoader = EnterprisesLoader;
}