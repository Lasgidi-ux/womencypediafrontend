/**
 * Womencypedia API Service
 * 
 * Centralized API client for all backend communications.
 * Handles HTTP requests, error handling, and response processing.
 * Supports both custom backend and Strapi CMS.
 * Uses Strapi CMS as the primary data source.
 */

const API = {
    // Track if using Strapi CMS
    _useStrapi: true,

    /**
     * Initialize API — Strapi CMS is the sole data source
     */
    async init() {
        this._useStrapi = CONFIG.USE_STRAPI === true;

        if (this._useStrapi) {
            console.info('Using Strapi CMS mode');
        }
    },

    /**
     * Check if using mock API (always false — mock API removed)
     */
    isUsingMockAPI() {
        return false;
    },

    /**
     * Check if using Strapi
     */
    isUsingStrapi() {
        return this._useStrapi;
    },

    /**
     * Get current locale for API requests
     */
    getLocale() {
        return typeof I18N !== 'undefined' ? I18N.currentLocale : 'en';
    },

    /**
     * Make an HTTP request to the API
     * @param {string} endpoint - API endpoint (relative to base URL)
     * @param {Object} options - Request options
     * @returns {Promise<Object>} - Response data
     */
    async request(endpoint, options = {}) {
        // Use Strapi API if enabled (primary path)
        if (this._useStrapi && typeof StrapiAPI !== 'undefined') {
            return this._strapiRequest(endpoint, options);
        }

        // Fallback to generic request
        return this._genericRequest(endpoint, options);
    },

    /**
     * Route request to Strapi API
     */
    async _strapiRequest(endpoint, options = {}) {
        if (typeof StrapiAPI === 'undefined') {
            console.warn('StrapiAPI not loaded, falling back to generic request');
            return this._genericRequest(endpoint, options);
        }

        const endpointParts = endpoint.split('/').filter(p => p);
        const method = options.method || 'GET';

        // Biographies endpoints
        if (endpoint.startsWith('/api/biographies')) {
            if (endpoint === '/api/biographies' && method === 'GET') {
                const params = this._parseQueryParams(endpoint);
                return StrapiAPI.biographies.getAll(params);
            }
            if (endpoint.includes('filters[slug]')) {
                const slugMatch = endpoint.match(/filters\[slug\]\[\$eq\]=([^&]+)/);
                if (slugMatch) {
                    return StrapiAPI.biographies.get(slugMatch[1]);
                }
            }
            const idOrSlug = endpointParts[2];
            if (idOrSlug && !endpoint.includes('?')) {
                return StrapiAPI.biographies.get(idOrSlug);
            }
            if (endpoint.includes('filters[featured]')) {
                return StrapiAPI.biographies.getFeatured();
            }
            if (endpoint.includes('filters[region]')) {
                const regionMatch = endpoint.match(/filters\[region\]\[\$eq\]=([^&]+)/);
                if (regionMatch) {
                    return StrapiAPI.biographies.getByRegion(regionMatch[1]);
                }
            }
            if (endpoint.includes('filters[category]')) {
                const categoryMatch = endpoint.match(/filters\[category\]\[\$eq\]=([^&]+)/);
                if (categoryMatch) {
                    return StrapiAPI.biographies.getByCategory(categoryMatch[1]);
                }
            }
        }

        // Collections endpoints
        if (endpoint.startsWith('/api/collections')) {
            if (endpoint === '/api/collections' && method === 'GET') {
                return StrapiAPI.collections.getAll();
            }
            if (endpoint.includes('filters[slug]')) {
                const slugMatch = endpoint.match(/filters\[slug\]\[\$eq\]=([^&]+)/);
                if (slugMatch) {
                    return StrapiAPI.collections.get(slugMatch[1]);
                }
            }
            const id = endpointParts[2];
            if (id && !endpoint.includes('?')) {
                return StrapiAPI.collections.get(id);
            }
        }

        // Education modules endpoints
        if (endpoint.startsWith('/api/education-modules')) {
            if (endpoint === '/api/education-modules' && method === 'GET') {
                return StrapiAPI.educationModules.getAll();
            }
            if (endpoint.includes('filters[slug]')) {
                const slugMatch = endpoint.match(/filters\[slug\]\[\$eq\]=([^&]+)/);
                if (slugMatch) {
                    return StrapiAPI.educationModules.getBySlug(slugMatch[1]);
                }
            }
        }

        // Tags endpoints
        if (endpoint.startsWith('/api/tags')) {
            if (endpoint === '/api/tags' && method === 'GET') {
                return StrapiAPI.tags.getAll();
            }
        }

        // Leaders endpoints
        if (endpoint.startsWith('/api/leaders')) {
            if (endpoint === '/api/leaders' && method === 'GET') {
                const params = this._parseQueryParams(endpoint);
                return StrapiAPI.leaders.getAll(params);
            }
            if (endpoint.includes('filters[slug]')) {
                const slugMatch = endpoint.match(/filters\[slug\]\[\$eq\]=([^&]+)/);
                if (slugMatch) return StrapiAPI.leaders.get(slugMatch[1]);
            }
            if (endpoint.includes('filters[featured]')) {
                return StrapiAPI.leaders.getFeatured();
            }
            if (endpoint.includes('filters[verified]')) {
                return StrapiAPI.leaders.getVerified();
            }
            if (endpoint.includes('filters[country]')) {
                const match = endpoint.match(/filters\[country\]\[\$eq\]=([^&]+)/);
                if (match) return StrapiAPI.leaders.getByCountry(match[1]);
            }
            if (endpoint.includes('filters[continent]')) {
                const match = endpoint.match(/filters\[continent\]\[\$eq\]=([^&]+)/);
                if (match) return StrapiAPI.leaders.getByContinent(match[1]);
            }
            if (endpoint.includes('filters[sector]')) {
                const match = endpoint.match(/filters\[sector\]\[\$eq\]=([^&]+)/);
                if (match) return StrapiAPI.leaders.getBySector(match[1]);
            }
            const leaderId = endpointParts[2];
            if (leaderId && !endpoint.includes('?')) {
                return StrapiAPI.leaders.get(leaderId);
            }
        }

        // Partners endpoints
        if (endpoint.startsWith('/api/partners')) {
            if (endpoint === '/api/partners' && method === 'GET') {
                return StrapiAPI.partners.getAll();
            }
            if (endpoint.includes('filters[slug]')) {
                const slugMatch = endpoint.match(/filters\[slug\]\[\$eq\]=([^&]+)/);
                if (slugMatch) return StrapiAPI.partners.get(slugMatch[1]);
            }
            if (endpoint.includes('filters[featured]')) {
                return StrapiAPI.partners.getFeatured();
            }
            if (endpoint.includes('filters[tier]')) {
                const match = endpoint.match(/filters\[tier\]\[\$eq\]=([^&]+)/);
                if (match) return StrapiAPI.partners.getByTier(match[1]);
            }
            const partnerId = endpointParts[2];
            if (partnerId && !endpoint.includes('?')) {
                return StrapiAPI.partners.get(partnerId);
            }
        }

        // Fellowships endpoints
        if (endpoint.startsWith('/api/fellowships')) {
            if (endpoint === '/api/fellowships' && method === 'GET') {
                return StrapiAPI.fellowships.getAll();
            }
            if (endpoint.includes('filters[slug]')) {
                const slugMatch = endpoint.match(/filters\[slug\]\[\$eq\]=([^&]+)/);
                if (slugMatch) return StrapiAPI.fellowships.get(slugMatch[1]);
            }
            if (endpoint.includes('filters[featured]')) {
                return StrapiAPI.fellowships.getFeatured();
            }
            if (endpoint.includes('filters[status][$eq]=open')) {
                return StrapiAPI.fellowships.getOpen();
            }
            if (endpoint.includes('filters[fellowshipType]')) {
                const match = endpoint.match(/filters\[fellowshipType\]\[\$eq\]=([^&]+)/);
                if (match) return StrapiAPI.fellowships.getByType(match[1]);
            }
            const fellowshipId = endpointParts[2];
            if (fellowshipId && !endpoint.includes('?')) {
                return StrapiAPI.fellowships.get(fellowshipId);
            }
        }

        // Contributions endpoints
        if (endpoint.startsWith('/api/contributions')) {
            if (endpoint === '/api/contributions' && method === 'GET') {
                return StrapiAPI.contributions.getAll();
            }
            if (endpoint === '/api/contributions' && method === 'POST') {
                const body = options.body ? JSON.parse(options.body) : {};
                return StrapiAPI.contributions.submit(body.data || body);
            }
            if (endpoint.includes('filters[slug]')) {
                const slugMatch = endpoint.match(/filters\[slug\]\[\$eq\]=([^&]+)/);
                if (slugMatch) return StrapiAPI.contributions.get(slugMatch[1]);
            }
            if (endpoint.includes('filters[featured]')) {
                return StrapiAPI.contributions.getFeatured();
            }
            if (endpoint.includes('filters[status][$eq]=published')) {
                return StrapiAPI.contributions.getPublished();
            }
            if (endpoint.includes('filters[type]')) {
                const match = endpoint.match(/filters\[type\]\[\$eq\]=([^&]+)/);
                if (match) return StrapiAPI.contributions.getByType(match[1]);
            }
            const contribId = endpointParts[2];
            if (contribId && !endpoint.includes('?')) {
                return StrapiAPI.contributions.get(contribId);
            }
        }

        // Verification Applications endpoints
        if (endpoint.startsWith('/api/verification-applications')) {
            if (endpoint === '/api/verification-applications' && method === 'GET') {
                return StrapiAPI.verificationApplications.getAll();
            }
            if (endpoint === '/api/verification-applications' && method === 'POST') {
                const body = options.body ? JSON.parse(options.body) : {};
                return StrapiAPI.verificationApplications.submit(body.data || body);
            }
            if (endpoint.includes('filters[status][$eq]=pending')) {
                return StrapiAPI.verificationApplications.getPending();
            }
            const appId = endpointParts[2];
            if (appId && !endpoint.includes('?')) {
                return StrapiAPI.verificationApplications.get(appId);
            }
        }

        // Use generic request for other endpoints
        return this._genericRequest(endpoint, options);
    },

    // Mock API routing removed — all data fetched from Strapi CMS

    /**
     * Generic request handler for unmapped endpoints
     */
    async _genericRequest(endpoint, options = {}) {
        const url = `${CONFIG.API_BASE_URL}${endpoint}`;

        const defaultHeaders = {
            'Content-Type': 'application/json',
        };

        // Add authorization header if user is authenticated
        const token = Auth.getAccessToken();
        if (token) {
            defaultHeaders['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        };

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST.TIMEOUT);

            const response = await fetch(url, {
                ...config,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            // Handle token expiration
            if (response.status === 401) {
                const refreshed = await Auth.refreshToken();
                if (refreshed) {
                    return this.request(endpoint, options);
                } else {
                    Auth.logout();
                    throw new APIError('Session expired. Please login again.', 401);
                }
            }

            const data = await response.json();

            if (!response.ok) {
                throw new APIError(
                    data.detail || data.message || 'An error occurred',
                    response.status,
                    data
                );
            }

            return data;
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new APIError('Request timeout. Please try again.', 408);
            }
            if (error instanceof APIError) {
                throw error;
            }
            throw new APIError('Network error. Please check your connection.', 0, error);
        }
    },

    /**
     * Parse query parameters from URL
     */
    _parseQueryParams(url) {
        const params = {};
        const queryString = url.split('?')[1];
        if (queryString) {
            queryString.split('&').forEach(param => {
                const [key, value] = param.split('=');
                params[key] = decodeURIComponent(value);
            });
        }
        return params;
    },

    // ============================================
    // CONVENIENCE METHODS
    // ============================================

    /**
     * Get all entries (biographies)
     */
    async getEntries(params = {}) {
        return this.request(CONFIG.ENDPOINTS.ENTRIES.LIST, {
            method: 'GET',
            queryParams: params
        });
    },

    /**
     * Get single entry by ID
     */
    async getEntry(id) {
        return this.request(CONFIG.ENDPOINTS.ENTRIES.GET(id), {
            method: 'GET'
        });
    },

    /**
     * Search entries
     */
    async searchEntries(query, params = {}) {
        const endpoint = `${CONFIG.ENDPOINTS.ENTRIES.SEARCH}?q=${encodeURIComponent(query)}`;
        return this.request(endpoint, {
            method: 'GET',
            queryParams: params
        });
    },

    /**
     * Get all collections
     */
    async getCollections(params = {}) {
        return this.request(CONFIG.ENDPOINTS.COLLECTIONS.LIST, {
            method: 'GET',
            queryParams: params
        });
    },

    /**
     * Get single collection
     */
    async getCollection(id) {
        return this.request(CONFIG.ENDPOINTS.COLLECTIONS.GET(id), {
            method: 'GET'
        });
    },

    /**
     * Get featured entries
     */
    async getFeaturedEntries() {
        return this.request(CONFIG.ENDPOINTS.ENTRIES.FEATURED, {
            method: 'GET'
        });
    }
};

/**
 * API Error class
 */
class APIError extends Error {
    constructor(message, status, data = null) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.data = data;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
    module.exports.APIError = APIError;
}
