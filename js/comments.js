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
            const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.COMMENTS.LIST(entryId)}`);
            if (response.ok) {
                const data = await response.json();
                this._comments[entryId] = data.comments || [];
                return this._comments[entryId];
            }
        } catch (error) {
            console.log('Using mock comments');
        }

        this._comments[entryId] = this.getMockComments();
        this._isLoading = false;
        return this._comments[entryId];
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

        const user = Auth.getUser();
        const newComment = {
            id: Date.now().toString(),
            user: { name: user.name || user.email, initials: (user.name || user.email).substring(0, 2).toUpperCase() },
            content: content,
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
        return newComment;
    },

    async toggleLike(commentId) {
        if (!Auth.isAuthenticated()) return;
        for (const entryId in this._comments) {
            const comment = this._comments[entryId].find(c => c.id === commentId);
            if (comment) {
                comment.isLiked = !comment.isLiked;
                comment.likes += comment.isLiked ? 1 : -1;
                break;
            }
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
