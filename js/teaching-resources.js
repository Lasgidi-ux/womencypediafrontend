/**
 * Teaching Resources Loader
 * Loads teaching resources from Strapi API
 */

async function loadTeachingResources(containerId) {
  const container = document.getElementById(containerId);
  const loadingElement = document.getElementById('teaching-resources-loading');

  if (!container || !loadingElement) {
    console.error('Teaching resources container or loading element not found');
    return;
  }

  try {
    // Show loading skeleton
    loadingElement.classList.remove('hidden');

    // Get API instance
    const api = window.StrapiAPI || window.API;
    if (!api) {
      throw new Error('API not available');
    }

    // Fetch teaching resources
    const response = await api.teachingResources.getAll({
      populate: 'file,thumbnail',
      sort: 'createdAt:desc',
      pagination: { pageSize: 12 }
    });

    const resources = response.entries || [];

    // Hide loading skeleton
    loadingElement.classList.add('hidden');

    if (resources.length === 0) {
      container.innerHTML = '<p class="text-center text-text-secondary col-span-full">No teaching resources available.</p>';
      return;
    }

    // Render resources
    const html = resources.map(resource => {
      const title = resource.title || resource.name || 'Untitled Resource';
      const description = resource.description || '';
      const type = resource.type || 'Resource';
      const downloadUrl = resource.file ? api.teachingResources.getDownloadUrl(resource) : null;
      const thumbnailUrl = resource.thumbnail ? api.getMediaURL(resource.thumbnail.url) : null;

      return `
        <div class="bg-white rounded-xl p-6 border border-border-light hover:shadow-lg transition-shadow">
          ${thumbnailUrl ? `
            <div class="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
              <img src="${thumbnailUrl}" alt="${title}" class="w-full h-full object-cover">
            </div>
          ` : ''}
          <div class="flex items-center gap-2 mb-3">
            <span class="px-2 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded">
              ${type}
            </span>
          </div>
          <h3 class="font-serif text-lg font-bold text-text-main mb-2">${title}</h3>
          ${description ? `<p class="text-text-secondary text-sm mb-4">${description}</p>` : ''}
          ${downloadUrl ? `
            <a href="${downloadUrl}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 text-primary font-bold hover:underline">
              <span class="material-symbols-outlined text-sm">download</span>
              Download
            </a>
          ` : ''}
        </div>
      `;
    }).join('');

    container.innerHTML = html;
    container.classList.remove('hidden');

  } catch (error) {
    console.error('Failed to load teaching resources:', error);

    // Hide loading skeleton
    loadingElement.classList.add('hidden');

    // Show error message
    container.innerHTML = '<p class="text-center text-red-600 col-span-full">Failed to load teaching resources. Please try again later.</p>';
    container.classList.remove('hidden');
  }
}

// Export for global access
if (typeof window !== 'undefined') {
  window.loadTeachingResources = loadTeachingResources;
}