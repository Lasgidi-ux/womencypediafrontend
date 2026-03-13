'use strict';

/**
 * Custom router for contributions API
 * Explicitly defines all routes to ensure they're registered
 */

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/contributions',
            handler: 'contribution.find',
            config: {
                policies: [],
                auth: false,
            },
        },
        {
            method: 'GET',
            path: '/contributions/:id',
            handler: 'contribution.findOne',
            config: {
                policies: [],
                auth: false,
            },
        },
        {
            method: 'POST',
            path: '/contributions',
            handler: 'contribution.create',
            config: {
                policies: [],
                // Keep public for story submissions, but consider adding CAPTCHA/reCAPTCHA in production
                auth: false,
            },
        },
        {
            method: 'PUT',
            path: '/contributions/:id',
            handler: 'contribution.update',
            config: {
                policies: [],
                // Require authentication for updates
                auth: { strategy: 'jwt', mode: 'required' },
            },
        },
        {
            method: 'DELETE',
            path: '/contributions/:id',
            handler: 'contribution.delete',
            config: {
                policies: [],
                // Require authentication for deletions
                auth: { strategy: 'jwt', mode: 'required' },
            },
        },
    ],
};
