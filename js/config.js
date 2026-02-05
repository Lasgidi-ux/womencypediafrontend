/**
 * Womencypedia Frontend Configuration
 * 
 * This file contains all API configuration settings.
 * Update API_BASE_URL when the backend is ready.
 */

const CONFIG = {
    // API Base URL - Update this when backend is ready
    // For development: 'http://localhost:8001'
    // For production: 'https://womencypedia-api.onrender.com'
    API_BASE_URL: 'https://womencypedia-api.onrender.com',

    // API Endpoints
    ENDPOINTS: {
        // Authentication
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            LOGOUT: '/auth/logout',
            REFRESH: '/auth/refresh',
            ME: '/auth/me',
            FORGOT_PASSWORD: '/auth/forgot-password',
            RESET_PASSWORD: '/auth/reset-password',
            SEND_VERIFICATION: '/auth/send-verification',
            VERIFY_EMAIL: (token) => `/auth/verify/${token}`,
            // Social Login
            GOOGLE: '/auth/google',
            GOOGLE_CALLBACK: '/auth/google/callback',
            GITHUB: '/auth/github',
            GITHUB_CALLBACK: '/auth/github/callback'
        },

        // Entries (Biographies/Stories)
        ENTRIES: {
            LIST: '/entries',
            GET: (id) => `/entries/${id}`,
            CREATE: '/entries',
            UPDATE: (id) => `/entries/${id}`,
            DELETE: (id) => `/entries/${id}`,
            SEARCH: '/entries/search'
        },

        // Contributions (User submissions)
        CONTRIBUTIONS: {
            NOMINATIONS: '/contributions/nominations',
            STORIES: '/contributions/stories',
            PENDING: '/contributions/pending',
            APPROVE: (id) => `/contributions/${id}/approve`,
            REJECT: (id) => `/contributions/${id}/reject`
        },

        // Collections
        COLLECTIONS: {
            LIST: '/collections',
            GET: (id) => `/collections/${id}`
        },

        // Statistics
        STATS: {
            DASHBOARD: '/stats/dashboard',
            PUBLIC: '/stats/public'
        }
    },

    // Token storage keys
    STORAGE_KEYS: {
        ACCESS_TOKEN: 'womencypedia_access_token',
        REFRESH_TOKEN: 'womencypedia_refresh_token',
        USER: 'womencypedia_user'
    },

    // User roles
    ROLES: {
        ADMIN: 'admin',
        CONTRIBUTOR: 'contributor',
        PUBLIC: 'public'
    },

    // Pagination defaults
    PAGINATION: {
        DEFAULT_PAGE_SIZE: 12,
        MAX_PAGE_SIZE: 50
    },

    // Request settings
    REQUEST: {
        TIMEOUT: 30000, // 30 seconds
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000 // 1 second
    }
};

// Freeze configuration to prevent accidental modifications
Object.freeze(CONFIG);
Object.freeze(CONFIG.ENDPOINTS);
Object.freeze(CONFIG.ENDPOINTS.AUTH);
Object.freeze(CONFIG.ENDPOINTS.ENTRIES);
Object.freeze(CONFIG.ENDPOINTS.CONTRIBUTIONS);
Object.freeze(CONFIG.ENDPOINTS.COLLECTIONS);
Object.freeze(CONFIG.ENDPOINTS.STATS);
Object.freeze(CONFIG.STORAGE_KEYS);
Object.freeze(CONFIG.ROLES);
Object.freeze(CONFIG.PAGINATION);
Object.freeze(CONFIG.REQUEST);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
