/**
 * Womencypedia API Service
 * 
 * Centralized API client for all backend communications.
 * Handles HTTP requests, error handling, and response processing.
 * Supports both custom backend and Strapi CMS.
 * Falls back to MockAPI when backend is unavailable.
 */

const API = {
    // Track if using mock API
    _useMockAPI: false,

    // Track if using Strapi CMS
    _useStrapi: false,

    /**
     * Initialize API and check backend availability
     */
    async init() {
        // Initialize mock API (only if not using Strapi)
        if (typeof MockAPI !== 'undefined' && !CONFIG.USE_STRAPI) {
            MockAPI.init();
        }

        // Check if we should use mock API
        this._useMockAPI = CONFIG.USE_MOCK_API === true;

        // Check if using Strapi
        this._useStrapi = CONFIG.USE_STRAPI === true;

        // If mock API is available, check if real API is reachable
        if (typeof MockAPI !== 'undefined' && !this._useMockAPI && !this._useStrapi) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            this._useMockAPI = !MockAPI.isAPIAvailable();
        }

        if (this._useMockAPI) {
            console.info('Using Mock API - backend unavailable');
        }

        if (this._useStrapi) {
            console.info('Using Strapi CMS mode');
        }
    },

    /**
     * Check if using mock API
     */
    isUsingMockAPI() {
        return this._useMockAPI;
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
        // Use Strapi API if enabled
        if (this._useStrapi && typeof StrapiAPI !== 'undefined') {
            return this._strapiRequest(endpoint, options);
        }

        // Use mock API if enabled
        if (this._useMockAPI && typeof MockAPI !== 'undefined') {
            return this._mockRequest(endpoint, options);
        }

        // Use generic request for real API
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

        // Use generic request for other endpoints
        return this._genericRequest(endpoint, options);
    },

    /**
     * Route request to mock API
     */
    async _mockRequest(endpoint, options = {}) {
        const method = options.method || 'GET';
        const endpointParts = endpoint.split('/').filter(p => p);

        // Auth endpoints
        if (endpoint.startsWith('/auth/')) {
            const authEndpoint = endpointParts[1];
            if (authEndpoint === 'login' && method === 'POST') {
                const body = options.body ? JSON.parse(options.body) : {};
                return MockAPI.auth.login(body.email, body.password);
            }
            if (authEndpoint === 'register' && method === 'POST') {
                const body = options.body ? JSON.parse(options.body) : {};
                return MockAPI.auth.register(body);
            }
            if (authEndpoint === 'logout' && method === 'POST') {
                return MockAPI.auth.logout();
            }
            if (authEndpoint === 'refresh' && method === 'POST') {
                const body = options.body ? JSON.parse(options.body) : {};
                return MockAPI.auth.refresh(body.refresh_token);
            }
            if (authEndpoint === 'me' && method === 'GET') {
                return MockAPI.auth.getMe();
            }
            if (authEndpoint === 'forgot-password' && method === 'POST') {
                const body = options.body ? JSON.parse(options.body) : {};
                return MockAPI.auth.forgotPassword(body.email);
            }
            if (authEndpoint === 'reset-password' && method === 'POST') {
                const body = options.body ? JSON.parse(options.body) : {};
                return MockAPI.auth.resetPassword(body.token, body.new_password);
            }
        }

        // Entries endpoints
        if (endpoint.startsWith('/entries') || endpoint.startsWith('/api/biographies')) {
            if ((endpoint === '/entries' || endpoint === '/api/biographies') && method === 'GET') {
                const params = this._parseQueryParams(endpoint);
                return MockAPI.entries.getAll(params);
            }
            if (endpoint.includes('/entries/search') && method === 'GET') {
                const params = this._parseQueryParams(endpoint);
                return MockAPI.entries.search(params.q || '', params);
            }

            // Check for slug-based lookup
            const slugMatch = endpoint.match(/\/entries\/slug\/([^/?\s]+)/i) ||
                endpoint.match(/\/api\/biographies\/slug\/([^/?\s]+)/i);
            if (slugMatch && method === 'GET') {
                return MockAPI.entries.getBySlug(slugMatch[1]);
            }

            // Check for filter-based lookup (e.g., ?filters[slug][$eq]=value)
            if (endpoint.includes('filters[slug]') && method === 'GET') {
                const slugParam = endpoint.match(/filters\[slug\]\[\$eq\]=([^&]+)/);
                if (slugParam) {
                    return MockAPI.entries.getBySlug(decodeURIComponent(slugParam[1]));
                }
            }

            const entryId = endpointParts[1] || endpointParts[2];
            if (entryId && !endpoint.includes('?')) {
                return MockAPI.entries.getById(entryId);
            }
        }

        // Collections endpoints
        if (endpoint.startsWith('/collections') || endpoint.startsWith('/api/collections')) {
            if ((endpoint === '/collections' || endpoint === '/api/collections') && method === 'GET') {
                return MockAPI.collections.getAll();
            }
        }

        // Use generic request for other endpoints
        return this._genericRequest(endpoint, options);
    },

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
