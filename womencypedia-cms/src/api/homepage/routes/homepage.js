'use strict';

/**
 * Homepage API Routes
 * 
 * Custom endpoints for the Womencypedia homepage single type
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = {
    routes: [
        // Public: Get the homepage content
        {
            method: 'GET',
            path: '/homepage',
            handler: 'homepage.find',
            config: {
                policies: [],
                auth: false,
            },
        },
        // Admin: Update homepage content
        {
            method: 'PUT',
            path: '/homepage',
            handler: 'homepage.update',
            config: {
                policies: [],
                auth: 'api-token',
            },
        },
    ],
};
