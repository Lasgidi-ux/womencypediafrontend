/**
 * Biography API Routes
 * 
 * Custom endpoints for the Womencypedia frontend
 */

module.exports = {
    routes: [
        // Public: List all biographies with filtering
        {
            method: 'GET',
            path: '/biographies',
            handler: 'biography.find',
            config: {
                policies: [],
                auth: false,
            },
        },
        // Public: Get single biography by ID or slug
        {
            method: 'GET',
            path: '/biographies/:idOrSlug',
            handler: 'biography.findOne',
            config: {
                policies: [],
                auth: false,
            },
        },
        // Public: Search biographies
        {
            method: 'GET',
            path: '/biographies/search',
            handler: 'biography.search',
            config: {
                policies: [],
                auth: false,
            },
        },
        // Public: Get featured biographies
        {
            method: 'GET',
            path: '/biographies/featured',
            handler: 'biography.findFeatured',
            config: {
                policies: [],
                auth: false,
            },
        },
        // Public: Get biographies by region
        {
            method: 'GET',
            path: '/biographies/region/:region',
            handler: 'biography.findByRegion',
            config: {
                policies: [],
                auth: false,
            },
        },
        // Public: Get biographies by category
        {
            method: 'GET',
            path: '/biographies/category/:category',
            handler: 'biography.findByCategory',
            config: {
                policies: [],
                auth: false,
            },
        },
        // Public: Get biographies by era
        {
            method: 'GET',
            path: '/biographies/era/:era',
            handler: 'biography.findByEra',
            config: {
                policies: [],
                auth: false,
            },
        },
        // Admin: Create biography
        {
            method: 'POST',
            path: '/biographies',
            handler: 'biography.create',
            config: {
                policies: [],
                auth: 'api-token',
            },
        },
        // Admin: Update biography
        {
            method: 'PUT',
            path: '/biographies/:id',
            handler: 'biography.update',
            config: {
                policies: [],
                auth: 'api-token',
            },
        },
        // Admin: Delete biography
        {
            method: 'DELETE',
            path: '/biographies/:id',
            handler: 'biography.delete',
            config: {
                policies: [],
                auth: 'api-token',
            },
        },
    ],
};
