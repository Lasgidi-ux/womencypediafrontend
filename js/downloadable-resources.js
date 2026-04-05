/**
 * Downloadable Resources Loader
 * Loads and handles downloads for PDF resources
 */

class DownloadableResourcesLoader {
  constructor() {
    this.api = window.StrapiAPI || window.API;
    this.resources = [];
  }

  async loadDownloadableResources() {
    try {
      const response = await this.api.downloadableResources.getAll({
        populate: 'file',
        sort: 'createdAt:desc'
      });

      this.resources = response.entries || [];
      this.attachDownloadHandlers();

    } catch (error) {
      console.error('Failed to load downloadable resources:', error);
    }
  }

  attachDownloadHandlers() {
    // Define the resource mapping based on button text/content
    const resourceMapping = {
      "Educator's Guide": 'educators-guide',
      'Timeline Poster': 'timeline-poster',
      'Research Guide': 'research-guide',
      'Glossary Quick Ref': 'glossary-quick-ref'
    };

    // Find all download buttons and attach handlers
    document.querySelectorAll('.downloadable-pdf-button').forEach(button => {
      const resourceTitle = button.closest('.bg-white').querySelector('h4').textContent.trim();
      const resourceSlug = resourceMapping[resourceTitle];

      if (resourceSlug) {
        const resource = this.resources.find(r => r.slug === resourceSlug);
        if (resource) {
          button.addEventListener('click', () => this.downloadResource(resource));
          button.disabled = false;
        } else {
          button.disabled = true;
          button.textContent = 'Not Available';
          button.style.opacity = '0.5';
        }
      }
    });
  }

  async downloadResource(resource) {
    try {
      const downloadUrl = this.api.downloadableResources.getDownloadUrl(resource);

      if (!downloadUrl) {
        throw new Error('Download URL not available');
      }

      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = resource.file?.name || `${resource.title || resource.slug}.pdf`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Track download event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'download', {
          event_category: 'resource',
          event_label: resource.title || resource.slug,
          value: 1
        });
      }

    } catch (error) {
      console.error('Failed to download resource:', error);
      // Show error message to user
      this.showDownloadError(resource.title || 'Resource');
    }
  }

  showDownloadError(resourceName) {
    // Create a simple error notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = `Failed to download ${resourceName}. Please try again.`;

    document.body.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }

  // Alternative method to load specific resource by type
  async loadResourceByType(type) {
    try {
      const response = await this.api.downloadableResources.getByType(type);
      return response.entries || [];
    } catch (error) {
      console.error(`Failed to load ${type} resources:`, error);
      return [];
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const loader = new DownloadableResourcesLoader();
  loader.loadDownloadableResources();
});

// Export for global access
if (typeof window !== 'undefined') {
  window.DownloadableResourcesLoader = DownloadableResourcesLoader;
}