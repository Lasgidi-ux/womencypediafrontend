/**
 * Timelines Loader
 * Loads timelines and timeline events from Strapi API
 */

class TimelinesLoader {
  constructor() {
    this.api = window.StrapiAPI || window.API;
  }

  async loadTimelineEvents(containerId, limit = 10) {
    const container = document.getElementById(containerId);

    if (!container) {
      console.error('Timeline container not found');
      return;
    }

    try {
      // Fetch timeline events
      const response = await this.api.timelines.getEvents({
        sort: 'date:desc',
        pagination: { pageSize: limit }
      });

      const events = response.entries || [];

      if (events.length === 0) {
        container.innerHTML = '<p class="text-center text-text-secondary">No timeline events available.</p>';
        return;
      }

      // Render timeline events
      const html = events.map(event => {
        const title = event.title || 'Untitled Event';
        const description = event.description || '';
        const date = event.date ? this.formatDate(event.date) : '';
        const category = event.category || '';

        return `
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-20 text-accent-teal font-bold">${date}</div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <p class="text-text-main font-medium">${title}</p>
                ${category ? `<span class="px-2 py-0.5 bg-accent-teal/10 text-accent-teal text-xs rounded">${category}</span>` : ''}
              </div>
              <p class="text-text-secondary text-sm">${description}</p>
            </div>
          </div>
        `;
      }).join('');

      container.innerHTML = html;

    } catch (error) {
      console.error('Failed to load timeline events:', error);
      container.innerHTML = '<p class="text-center text-red-600">Failed to load timeline events. Please try again later.</p>';
    }
  }

  async loadTimelines(containerId) {
    const container = document.getElementById(containerId);

    if (!container) {
      console.error('Timelines container not found');
      return;
    }

    try {
      // Fetch timelines
      const response = await this.api.timelines.getAll({
        populate: 'events',
        sort: 'createdAt:desc',
        pagination: { pageSize: 6 }
      });

      const timelines = response.entries || [];

      if (timelines.length === 0) {
        container.innerHTML = '<p class="text-center text-text-secondary">No timelines available.</p>';
        return;
      }

      // Render timelines
      const html = timelines.map(timeline => {
        const title = timeline.title || 'Untitled Timeline';
        const description = timeline.description || '';
        const events = timeline.events || [];

        return `
          <div class="bg-white rounded-xl p-8 border border-border-light">
            <h3 class="font-bold text-text-main mb-6 text-center">${title}</h3>
            ${description ? `<p class="text-text-secondary text-sm mb-6 text-center">${description}</p>` : ''}
            <div class="space-y-4">
              ${events.slice(0, 5).map(event => `
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0 w-20 text-accent-teal font-bold text-sm">${event.date ? this.formatDate(event.date) : ''}</div>
                  <div class="flex-1">
                    <p class="text-text-main font-medium text-sm">${event.title}</p>
                    <p class="text-text-secondary text-xs">${event.description}</p>
                  </div>
                </div>
              `).join('')}
              ${events.length > 5 ? `<p class="text-center text-accent-teal text-sm mt-4">...and ${events.length - 5} more events</p>` : ''}
            </div>
            <div class="text-center mt-6">
              <a href="timelines.html?slug=${timeline.slug}" class="text-accent-teal font-bold hover:underline">View Full Timeline →</a>
            </div>
          </div>
        `;
      }).join('');

      container.innerHTML = html;

    } catch (error) {
      console.error('Failed to load timelines:', error);
      container.innerHTML = '<p class="text-center text-red-600">Failed to load timelines. Please try again later.</p>';
    }
  }

  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();

      // For ancient dates, just show the year
      if (year < 0) {
        return `${Math.abs(year)} BCE`;
      } else if (year < 100) {
        return `${year} CE`;
      } else {
        return year.toString();
      }
    } catch (error) {
      return dateString;
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const loader = new TimelinesLoader();
  const eventsContainer = document.getElementById('timeline-events');
  const timelinesContainer = document.getElementById('timelines-grid');

  if (eventsContainer) {
    loader.loadTimelineEvents('timeline-events');
  }

  if (timelinesContainer) {
    loader.loadTimelines('timelines-grid');
  }
});

// Export for global access
if (typeof window !== 'undefined') {
  window.TimelinesLoader = TimelinesLoader;
}