'use strict';

/**
 * comment controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::comment.comment', ({ strapi }) => ({
    /**
     * Toggle like on a comment (atomic increment/decrement)
     * POST /api/comments/:id/like
     */
    async toggleLike(ctx) {
        const { id } = ctx.params;

        // Get the authenticated user
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized('You must be logged in to like a comment');
        }

        try {
            // Find the comment
            const comment = await strapi.db.query('api::comment.comment').findOne({
                where: { id: id },
                populate: ['likedBy', 'author']
            });

            if (!comment) {
                return ctx.notFound('Comment not found');
            }

            // Check if user has already liked this comment
            const likedByIds = comment.likedBy?.map(u => u.id) || [];
            const hasLiked = likedByIds.includes(user.id);

            let updatedComment;

            if (hasLiked) {
                // Unlike: remove user from likedBy and decrement likes atomically
                // Use a single update with atomic operations
                await strapi.db.query('api::comment.comment').update({
                    where: { id: id },
                    data: {
                        likedBy: {
                            disconnect: [{ id: user.id }]
                        },
                        likes: comment.likes - 1
                    }
                });

                updatedComment = await strapi.db.query('api::comment.comment').findOne({
                    where: { id: id },
                    populate: ['likedBy', 'author']
                });
            } else {
                // Like: add user to likedBy and increment likes atomically
                // Use a single update with atomic operations
                await strapi.db.query('api::comment.comment').update({
                    where: { id: id },
                    data: {
                        likedBy: {
                            connect: [{ id: user.id }]
                        },
                        likes: comment.likes + 1
                    }
                });

                updatedComment = await strapi.db.query('api::comment.comment').findOne({
                    where: { id: id },
                    populate: ['likedBy', 'author']
                });
            }

            // Format the response
            const isLiked = updatedComment.likedBy?.some(u => u.id === user.id) || false;

            const responseData = {
                id: updatedComment.id,
                attributes: {
                    content: updatedComment.content,
                    likes: updatedComment.likes,
                    isLiked: isLiked,
                    createdAt: updatedComment.createdAt,
                    updatedAt: updatedComment.updatedAt,
                    author: updatedComment.author ? {
                        id: updatedComment.author.id,
                        name: updatedComment.author.username || updatedComment.author.email,
                        initials: (updatedComment.author.username || updatedComment.author.email || 'U').substring(0, 2).toUpperCase()
                    } : null,
                    biography: updatedComment.biography,
                    parent: updatedComment.parent
                }
            };

            return ctx.send({ data: responseData });

        } catch (error) {
            console.error('Error toggling like:', error);
            return ctx.internalServerError('Failed to toggle like');
        }
    }
}));
