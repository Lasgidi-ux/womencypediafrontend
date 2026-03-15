'use strict';

/**
 * biography controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::biography.biography', ({ strapi }) => ({
    /**
     * Custom: Search biographies by query string
     */
    async search(ctx) {
        const { query } = ctx.request.query;

        if (!query) {
            return ctx.badRequest('Search query is required');
        }

        const biographies = await strapi.entityService.findMany('api::biography.biography', {
            filters: {
                $or: [
                    { name: { $containsi: query } },
                    { title: { $containsi: query } },
                    { description: { $containsi: query } },
                ],
            },
            populate: ['image', 'tags'],
            limit: 20,
        });

        return biographies;
    },

    /**
     * Custom: Get featured biographies
     */
    async findFeatured(ctx) {
        const biographies = await strapi.entityService.findMany('api::biography.biography', {
            filters: {
                featured: true,
            },
            populate: ['image', 'tags'],
            sort: { createdAt: 'desc' },
            limit: 10,
        });

        return biographies;
    },

    /**
     * Custom: Get biographies by region
     */
    async findByRegion(ctx) {
        const { region } = ctx.params;

        const biographies = await strapi.entityService.findMany('api::biography.biography', {
            filters: {
                region: { $containsi: region },
            },
            populate: ['image', 'tags'],
            sort: { createdAt: 'desc' },
        });

        return biographies;
    },

    /**
     * Custom: Get biographies by category
     */
    async findByCategory(ctx) {
        const { category } = ctx.params;

        const biographies = await strapi.entityService.findMany('api::biography.biography', {
            filters: {
                category: { $containsi: category },
            },
            populate: ['image', 'tags'],
            sort: { createdAt: 'desc' },
        });

        return biographies;
    },

    /**
     * Custom: Get biographies by era
     */
    async findByEra(ctx) {
        const { era } = ctx.params;

        const biographies = await strapi.entityService.findMany('api::biography.biography', {
            filters: {
                era: { $containsi: era },
            },
            populate: ['image', 'tags'],
            sort: { createdAt: 'desc' },
        });

        return biographies;
    },

    /**
     * Override findOne to support both ID and slug
     */
    async findOne(ctx) {
        const { idOrSlug } = ctx.params;

        // Try to find by ID first
        let biography;
        try {
            biography = await strapi.entityService.findOne('api::biography.biography', parseInt(idOrSlug), {
                populate: ['image', 'tags'],
            });
        } catch (e) {
            // If not found by ID, try slug
            const [bio] = await strapi.entityService.findMany('api::biography.biography', {
                filters: { slug: idOrSlug },
                populate: ['image', 'tags'],
                limit: 1,
            });
            biography = bio;
        }

        if (!biography) {
            return ctx.notFound('Biography not found');
        }

        return biography;
    },
}));
