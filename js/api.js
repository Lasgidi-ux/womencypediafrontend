/**
 * Womencypedia API Service
 * 
 * Centralized API client for all backend communications.
 * Handles HTTP requests, error handling, and response processing.
 */

const API = {
    /**
     * Make an HTTP request to the API
     * @param {string} endpoint - API endpoint (relative to base URL)
     * @param {Object} options - Request options
     * @returns {Promise<Object>} - Response data
     */
    async request(endpoint, options = {}) {
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
                    // Retry the request with new token
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
            // Network error or other issues
            throw new APIError('Network error. Please check your connection.', 0, error);
        }
    },

    /**
     * GET request
     */
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request(url, { method: 'GET' });
    },

    /**
     * POST request
     */
    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * PUT request
     */
    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    /**
     * PATCH request
     */
    async patch(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    /**
     * DELETE request
     */
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    },

    // ============================================
    // ENTRIES API (Biographies/Stories)
    // ============================================

    entries: {
        /**
         * Get all entries with optional filters
         * @param {Object} params - Query parameters (page, limit, region, era, domain, search)
         */
        async getAll(params = {}) {
            const queryParams = {
                page: params.page || 1,
                limit: params.limit || CONFIG.PAGINATION.DEFAULT_PAGE_SIZE,
                ...params
            };
            return API.get(CONFIG.ENDPOINTS.ENTRIES.LIST, queryParams);
        },

        /**
         * Search entries
         * @param {string} query - Search query
         * @param {Object} filters - Additional filters
         */
        async search(query, filters = {}) {
            return API.get(CONFIG.ENDPOINTS.ENTRIES.SEARCH, { q: query, ...filters });
        },

        /**
         * Get a single entry by ID
         * @param {string|number} id - Entry ID
         */
        async getById(id) {
            return API.get(CONFIG.ENDPOINTS.ENTRIES.GET(id));
        },

        /**
         * Create a new entry (Admin only)
         * @param {Object} entryData - Entry data
         */
        async create(entryData) {
            return API.post(CONFIG.ENDPOINTS.ENTRIES.CREATE, entryData);
        },

        /**
         * Update an entry (Admin only)
         * @param {string|number} id - Entry ID
         * @param {Object} entryData - Updated entry data
         */
        async update(id, entryData) {
            return API.put(CONFIG.ENDPOINTS.ENTRIES.UPDATE(id), entryData);
        },

        /**
         * Delete an entry (Admin only)
         * @param {string|number} id - Entry ID
         */
        async delete(id) {
            return API.delete(CONFIG.ENDPOINTS.ENTRIES.DELETE(id));
        }
    },

    // ============================================
    // CONTRIBUTIONS API
    // ============================================

    contributions: {
        /**
         * Submit a nomination
         * @param {Object} nominationData - Nomination form data
         */
        async submitNomination(nominationData) {
            return API.post(CONFIG.ENDPOINTS.CONTRIBUTIONS.NOMINATIONS, nominationData);
        },

        /**
         * Submit a story
         * @param {Object} storyData - Story form data
         */
        async submitStory(storyData) {
            return API.post(CONFIG.ENDPOINTS.CONTRIBUTIONS.STORIES, storyData);
        },

        /**
         * Get pending contributions (Admin only)
         * @param {Object} params - Query parameters
         */
        async getPending(params = {}) {
            return API.get(CONFIG.ENDPOINTS.CONTRIBUTIONS.PENDING, params);
        },

        /**
         * Approve a contribution (Admin only)
         * @param {string|number} id - Contribution ID
         */
        async approve(id) {
            return API.post(CONFIG.ENDPOINTS.CONTRIBUTIONS.APPROVE(id));
        },

        /**
         * Reject a contribution (Admin only)
         * @param {string|number} id - Contribution ID
         * @param {string} reason - Rejection reason
         */
        async reject(id, reason = '') {
            return API.post(CONFIG.ENDPOINTS.CONTRIBUTIONS.REJECT(id), { reason });
        }
    },

    // ============================================
    // COLLECTIONS API
    // ============================================

    collections: {
        /**
         * Get all collections
         */
        async getAll() {
            return API.get(CONFIG.ENDPOINTS.COLLECTIONS.LIST);
        },

        /**
         * Get a collection by ID
         * @param {string|number} id - Collection ID
         */
        async getById(id) {
            return API.get(CONFIG.ENDPOINTS.COLLECTIONS.GET(id));
        }
    },

    // ============================================
    // STATISTICS API
    // ============================================

    stats: {
        /**
         * Get dashboard statistics (Admin only)
         */
        async getDashboard() {
            return API.get(CONFIG.ENDPOINTS.STATS.DASHBOARD);
        },

        /**
         * Get public statistics
         */
        async getPublic() {
            return API.get(CONFIG.ENDPOINTS.STATS.PUBLIC);
        }
    }
};

/**
 * Custom API Error class
 */
class APIError extends Error {
    constructor(message, status, data = null) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.data = data;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API, APIError };
}
