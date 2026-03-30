/**
 * Womencypedia Comments Module
 * Handles discussion and commenting functionality
 */

const Comments = {
    _comments: {},
    _isLoading: false,

    init() {
        this.setupEventListeners();
    },

    setupEventListeners() {
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('comment-form')) {
                e.preventDefault();
                this.handleSubmit(e.target);
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('reply-btn')) {
                this.showReplyForm(e.target.dataset.commentId);
            }
            if (e.target.classList.contains('like-btn')) {
                this.toggleLike(e.target.dataset.commentId);
            }
        });
    },

    async loadComments(entryId) {
        if (this._isLoading) return this._comments[entryId] || [];
        this._isLoading = true;

        try {
            if (!window.StrapiAPI) {
                throw new Error('API client not available');
            }

            const response = await window.StrapiAPI.comments.getByBiography(entryId);
            this._comments[entryId] = response.entries || response.data || [];
            this._isLoading = false;
            return this._comments[entryId];
        } catch (error) {
            console.error('Failed to load comments:', error.message);
            this._comments[entryId] = [];
            this._isLoading = false;
            return this._comments[entryId];
        }
    },

    getMockComments() {
        return [
            {
                id: '1',
                user: { name: 'Sarah Johnson', initials: 'SJ' },
                content: 'This biography is incredibly inspiring!',
                likes: 12,
                isLiked: false,
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                replies: []
            }
        ];
    },

    async postComment(entryId, content, parentId = null) {
        if (!Auth.isAuthenticated()) {
            window.location.href = 'index.html?auth=login';
            return null;
        }

        try {
            if (!window.StrapiAPI) {
                throw new Error('API client not available');
            }

            const commentData = {
                biography: entryId,
                content: content.trim(),
                ...(parentId && { parent: parentId })
            };

            const response = await window.StrapiAPI.comments.create(commentData);

            // Optimistically update local state
            const newComment = {
                id: response.id || Date.now().toString(),
                user: { name: Auth.getUser().name || Auth.getUser().email },
                content: content.trim(),
                likes: 0,
                isLiked: false,
                createdAt: new Date().toISOString(),
                replies: []
            };

            if (!this._comments[entryId]) this._comments[entryId] = [];
            if (parentId) {
                const parent = this._comments[entryId].find(c => c.id === parentId);
                if (parent) parent.replies.push(newComment);
            } else {
                this._comments[entryId].unshift(newComment);
            }

            if (typeof UI !== 'undefined' && UI.showToast) UI.showToast('Comment posted!', 'success');

            // Notify real-time system of new comment
            if (typeof Realtime !== 'undefined') {
                Realtime.forceUpdateCheck();
            }

            return newComment;
        } catch (error) {
            console.error('Failed to post comment:', error);
            if (typeof UI !== 'undefined' && UI.showToast) {
                UI.showToast('Failed to post comment. Please try again.', 'error');
            }
            return null;
        }
    },

    async toggleLike(commentId) {
        if (!Auth.isAuthenticated()) return;

        // Find the comment to determine current state
        let comment = null;
        let entryId = null;
        for (const id in this._comments) {
            comment = this._comments[id].find(c => c.id === commentId);
            if (comment) {
                entryId = id;
                break;
            }
        }

        if (!comment) return;

        // Optimistic UI update - toggle locally first
        const isLiked = !comment.isLiked;
        comment.isLiked = isLiked;
        comment.likes += isLiked ? 1 : -1;

        // Call the atomic API endpoint
        try {
            const result = await StrapiAPI.comments.like(commentId);

            // Handle error case
            if (result && result.error) {
                console.error('Failed to like comment:', result.error);
                // Revert optimistic update on error
                comment.isLiked = !isLiked;
                comment.likes += isLiked ? -1 : 1;
                if (typeof UI !== 'undefined' && UI.showToast) {
                    UI.showToast(result.error, 'error');
                }
                return;
            }

            // Update with server response if available
            if (result && result.data) {
                comment.likes = result.data.attributes?.likes ?? result.data.likes ?? comment.likes;
                comment.isLiked = result.data.attributes?.isLiked ?? result.data.isLiked ?? comment.isLiked;
            } else if (result && result.attributes) {
                comment.likes = result.attributes.likes ?? comment.likes;
                comment.isLiked = result.attributes.isLiked ?? comment.isLiked;
            }
        } catch (error) {
            console.error('Failed to like comment:', error);
            // Revert optimistic update on error
            comment.isLiked = !isLiked;
            comment.likes += isLiked ? -1 : 1;
        }
    },

    async handleSubmit(form) {
        const entryId = form.dataset.entryId;
        const parentId = form.dataset.parentId || null;
        const content = form.querySelector('textarea').value.trim();
        if (!content) return;
        await this.postComment(entryId, content, parentId);
        form.querySelector('textarea').value = '';
    },

    showReplyForm(commentId) {
        document.querySelectorAll('.reply-form-container').forEach(el => el.remove());
        const commentEl = document.querySelector(`[data-comment-container="${commentId}"]`);
        if (!commentEl) return;
        const entryId = commentEl.closest('.comments-container')?.dataset.entryId;
        const replyForm = document.createElement('div');
        replyForm.className = 'reply-form-container mt-4 pl-12';
        replyForm.innerHTML = `
            <form class="comment-form" data-entry-id="${entryId}" data-parent-id="${commentId}">
                <textarea placeholder="Write a reply..." class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white" rows="2" required></textarea>
                <div class="flex justify-end gap-2 mt-2">
                    <button type="button" onclick="this.closest('.reply-form-container').remove()" class="px-4 py-2 text-gray-400">Cancel</button>
                    <button type="submit" class="px-4 py-2 bg-pink-500 text-white rounded-lg">Reply</button>
                </div>
            </form>
        `;
        commentEl.appendChild(replyForm);
    },

    getTimeAgo(dateString) {
        const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    }
};

document.addEventListener('DOMContentLoaded', () => Comments.init());
