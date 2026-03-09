'use strict';

/**
 * comment router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::comment.comment');

// Custom routes for comment like functionality
const customRoutes = {
    method: 'POST',
    path: '/comments/:id/like',
    handler: 'comment.toggleLike',
    config: {
        auth: {
            strategies: ['jwt'],
        },
        policies: [],
        middlewares: [],
    }
};

module.exports = {
    ...defaultRouter,
    routes: [
        ...defaultRouter.routes,
        customRoutes
    ]
};
