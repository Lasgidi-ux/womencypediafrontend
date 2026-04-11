/**
 * Womencypedia User Profile — PRO Enhanced Version
 * Cleaner architecture, safer, scalable, production-ready
 */

//////////////////////////////
// CONFIG + HELPERS
//////////////////////////////

const ProfileAPI = {
    base: (typeof CONFIG !== 'undefined' && CONFIG.API_BASE_URL) ? CONFIG.API_BASE_URL : 'https://womencypedia-cms.onrender.com',

    async request(url, options = {}) {
        try {
            const res = await fetch(url, {
                cache: 'no-store',
                ...options
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err?.error?.message || `HTTP ${res.status}`);
            }

            return await res.json();
        } catch (err) {
            console.warn('[Profile] API request failed:', err.message);
            throw err;
        }
    },

    getAuthHeaders() {
        if (typeof Auth === 'undefined') return {};
        const token = Auth.getAccessToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
};

function safeText(str = '') {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function qs(id) {
    return document.getElementById(id);
}

/**
 * Show a non-blocking toast notification
 */
function profileToast(message, type = 'info') {
    if (typeof UI !== 'undefined' && UI.showToast) {
        UI.showToast(message, type);
        return;
    }
    // Fallback inline toast
    const toast = document.createElement('div');
    const bg = { success: '#16a34a', error: '#dc2626', warning: '#d97706', info: '#6366f1' }[type] || '#6366f1';
    toast.style.cssText = `position:fixed;top:20px;right:20px;z-index:9999;padding:12px 24px;border-radius:12px;background:${bg};color:#fff;font-size:14px;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,.15);opacity:0;transition:opacity .3s`;
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity = '1'; });
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3500);
}

//////////////////////////////
// STATE
//////////////////////////////

let profileData = {
    id: null,
    name: "Guest User",
    email: "",
    role: "Contributor",
    location: "",
    joinDate: "",
    avatar: null,
    bio: "",
    website: "",
    stats: { contributions: 0, saved: 0, badges: 0, views: 0 },
    contributions: [],
    nominations: [],
    saved: [],
    badges: []
};

let profileInitialized = false;

//////////////////////////////
// INIT
//////////////////////////////

document.addEventListener('DOMContentLoaded', async () => {
    if (profileInitialized) return;
    profileInitialized = true;

    initUI();
    await loadProfile();
});

function initUI() {
    initTabs();
    setupSettingsForm();
}

//////////////////////////////
// PROFILE LOAD
//////////////////////////////

async function loadProfile() {
    showSkeleton();

    try {
        if (!Auth?.isAuthenticated?.()) {
            loadDemo();
            renderUI();
            hideSkeleton();
            return;
        }

        const user = await ProfileAPI.request(
            `${ProfileAPI.base}/api/users/me?populate=*`,
            { headers: ProfileAPI.getAuthHeaders() }
        );

        hydrateUser(user);

        await Promise.allSettled([
            loadStats(),
            loadContributions(),
            loadNominations(),
            loadSaved(),
            loadBadges()
        ]);

    } catch (err) {
        console.warn('[Profile] Could not load profile, falling back to demo:', err.message);
        loadDemo();
    }

    renderUI();
    prefillSettingsForms();
    hideSkeleton();
}

function hydrateUser(user) {
    const avatarUrl =
        user.avatar?.url ||
        user.avatar?.data?.attributes?.url;

    profileData = {
        ...profileData,
        id: user.id,
        name: user.username || user.email || 'User',
        email: user.email || '',
        role: user.role?.name || user.role?.type || (typeof user.role === 'string' ? user.role : 'User'),
        location: user.location || '',
        bio: user.bio || '',
        website: user.website || '',
        joinDate: user.createdAt ? formatDate(user.createdAt) : '',
        avatar: avatarUrl
            ? avatarUrl.startsWith('http')
                ? avatarUrl
                : `${ProfileAPI.base}${avatarUrl}`
            : null
    };
}

//////////////////////////////
// LOAD DATA
//////////////////////////////

async function loadStats() {
    try {
        const res = await ProfileAPI.request(
            `${ProfileAPI.base}/api/contributions?filters[author][id][$eq]=${profileData.id}&pagination[pageSize]=1`,
            { headers: ProfileAPI.getAuthHeaders() }
        );

        profileData.stats.contributions = res.meta?.pagination?.total || 0;
    } catch { }
}

async function loadContributions() {
    try {
        const res = await ProfileAPI.request(
            `${ProfileAPI.base}/api/contributions?filters[author][id][$eq]=${profileData.id}&sort=createdAt:desc&pagination[pageSize]=5`,
            { headers: ProfileAPI.getAuthHeaders() }
        );

        profileData.contributions = (res.data || []).map(item => {
            const attrs = item.attributes || item;
            return { id: item.id, ...attrs };
        });
    } catch { }
}

async function loadNominations() {
    try {
        const res = await ProfileAPI.request(
            `${ProfileAPI.base}/api/nominations?filters[author][id][$eq]=${profileData.id}&sort=createdAt:desc&pagination[pageSize]=5`,
            { headers: ProfileAPI.getAuthHeaders() }
        );

        profileData.nominations = (res.data || []).map(item => {
            const attrs = item.attributes || item;
            return { id: item.id, ...attrs };
        });
    } catch { }
}

async function loadSaved() {
    try {
        const res = await ProfileAPI.request(
            `${ProfileAPI.base}/api/users/me?populate=savedBiographies`,
            { headers: ProfileAPI.getAuthHeaders() }
        );

        profileData.saved = res.savedBiographies || [];
        profileData.stats.saved = profileData.saved.length;
    } catch { }
}

async function loadBadges() {
    try {
        const res = await ProfileAPI.request(
            `${ProfileAPI.base}/api/users/me?populate=badges`,
            { headers: ProfileAPI.getAuthHeaders() }
        );

        profileData.badges = res.badges || [];
        profileData.stats.badges = profileData.badges.length;
    } catch { }
}

//////////////////////////////
// DEMO MODE
//////////////////////////////

function loadDemo() {
    const data = JSON.parse(localStorage.getItem('demo_profile') || '{}');
    profileData = { ...profileData, ...data };
    // renderUI is called by loadProfile after this returns
}

//////////////////////////////
// RENDER
//////////////////////////////

function renderUI() {
    // Header card
    if (qs('profile-name')) qs('profile-name').textContent = profileData.name;
    if (qs('profile-email')) qs('profile-email').textContent = profileData.email || 'No email set';
    if (qs('profile-bio')) qs('profile-bio').textContent = profileData.bio || 'Member of the Womencypedia community.';
    if (qs('profile-joined')) qs('profile-joined').textContent = profileData.joinDate ? `Joined ${profileData.joinDate}` : 'Member since 2024';

    // Role badge
    const roleEl = qs('profile-role');
    if (roleEl && profileData.role) {
        roleEl.textContent = profileData.role;
        roleEl.classList.remove('hidden');
    }

    // Location
    const locEl = qs('profile-location');
    if (locEl) locEl.textContent = profileData.location || '';

    renderAvatar();
    renderStats();
    renderContributions();
    renderSaved();
    renderNominations();
    renderBadges();
}

function renderAvatar() {
    const el = qs('profile-avatar-container');
    if (!el) return;

    if (profileData.avatar) {
        el.innerHTML = `<img src="${safeText(profileData.avatar)}" alt="${safeText(profileData.name)}" class="w-full h-full object-cover">`;
    } else {
        el.innerHTML = `<span class="text-3xl font-serif font-bold text-white">${getInitials(profileData.name)}</span>`;
    }
}

function renderStats() {
    if (qs('stat-contributions'))
        qs('stat-contributions').textContent = profileData.stats.contributions;

    if (qs('stat-saved'))
        qs('stat-saved').textContent = profileData.stats.saved;

    if (qs('stat-badges'))
        qs('stat-badges').textContent = profileData.stats.badges;

    if (qs('stat-views'))
        qs('stat-views').textContent = profileData.stats.views;
}

function renderContributions() {
    const el = qs('contributions-list');
    if (!el) return;

    if (!profileData.contributions.length) {
        el.innerHTML = `
            <div class="text-center py-12">
                <span class="material-symbols-outlined text-5xl text-text-secondary/40 mb-4 block">edit_note</span>
                <h3 class="font-serif text-lg font-semibold text-text-main mb-2">No contributions yet</h3>
                <p class="text-text-secondary text-sm mb-4">Start sharing your knowledge with the community.</p>
                <a href="share-story.html" class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">
                    <span class="material-symbols-outlined text-[18px]">add</span>
                    Share Your Story
                </a>
            </div>
        `;
        return;
    }

    el.innerHTML = profileData.contributions.map(c => {
        const statusColor = {
            published: 'bg-green-100 text-green-700',
            draft: 'bg-yellow-100 text-yellow-700',
            pending: 'bg-blue-100 text-blue-700',
            rejected: 'bg-red-100 text-red-700'
        }[c.status] || 'bg-gray-100 text-gray-700';

        const displayTitle = safeText(c.title || c.name || 'Untitled');

        return `
            <div class="flex items-start gap-4 p-4 bg-white rounded-xl border border-border-light hover:shadow-md transition-shadow">
                <div class="size-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span class="material-symbols-outlined text-primary text-[20px]">${c.type === 'nomination' ? 'person_add' : 'article'}</span>
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="font-serif font-semibold text-text-main truncate">${displayTitle}</h4>
                    <p class="text-sm text-text-secondary mt-1">${formatDate(c.createdAt)}</p>
                </div>
                <span class="px-2 py-1 rounded-full text-xs font-medium ${statusColor}">${safeText(c.status || 'draft')}</span>
            </div>
        `;
    }).join('');
}

function renderNominations() {
    const el = qs('nominations-list');
    if (!el) return;

    if (!profileData.nominations.length) {
        el.innerHTML = `
            <div class="text-center py-12">
                <span class="material-symbols-outlined text-5xl text-text-secondary/40 mb-4 block">person_add</span>
                <h3 class="font-serif text-lg font-semibold text-text-main mb-2" data-i18n="profile.noNominationsYet">No nominations yet</h3>
                <p class="text-text-secondary text-sm mb-4">Nominate a remarkable woman to be featured on Womencypedia.</p>
                <a href="nominate.html" class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">
                    <span class="material-symbols-outlined text-[18px]">add</span> Nominate
                </a>
            </div>
        `;
        return;
    }

    el.innerHTML = profileData.nominations.map(n => {
        const safeName = safeText(n.name || n.title || 'Unnamed');
        const statusColor = {
            approved: 'bg-green-100 text-green-700',
            pending: 'bg-blue-100 text-blue-700',
            rejected: 'bg-red-100 text-red-700'
        }[n.status] || 'bg-gray-100 text-gray-700';

        return `
            <div class="flex items-start gap-4 p-4 bg-white rounded-xl border border-border-light hover:shadow-md transition-shadow">
                <div class="size-10 rounded-lg bg-accent-teal/10 flex items-center justify-center flex-shrink-0">
                    <span class="material-symbols-outlined text-accent-teal text-[20px]">person_add</span>
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="font-serif font-semibold text-text-main truncate">${safeName}</h4>
                    <p class="text-sm text-text-secondary mt-1">${formatDate(n.createdAt)}</p>
                </div>
                <span class="px-2 py-1 rounded-full text-xs font-medium ${statusColor}">${safeText(n.status || 'pending')}</span>
            </div>
        `;
    }).join('');
}

function renderSaved() {
    const el = qs('saved-list');
    if (!el) return;

    if (!profileData.saved.length) {
        el.innerHTML = `
            <div class="text-center py-12">
                <span class="material-symbols-outlined text-5xl text-text-secondary/40 mb-4 block">bookmark_border</span>
                <h3 class="font-serif text-lg font-semibold text-text-main mb-2">No saved items</h3>
                <p class="text-text-secondary text-sm mb-4">Bookmark biographies to save them here.</p>
                <a href="browse.html" class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">
                    <span class="material-symbols-outlined text-[18px]">explore</span>
                    Browse Biographies
                </a>
            </div>
        `;
        return;
    }

    el.innerHTML = profileData.saved.map(s => {
        const attrs = s.attributes || s;
        const safeName = safeText(attrs.name || 'Unnamed');
        const safeRegion = safeText(attrs.region || '');
        const safeEra = safeText(attrs.era || '');
        const safeSlug = encodeURIComponent(String(attrs.slug || s.id));

        let imageUrl = null;
        if (attrs.image?.url) {
            imageUrl = attrs.image.url.startsWith('http')
                ? attrs.image.url
                : `${ProfileAPI.base}${attrs.image.url}`;
        }

        return `
            <a href="biography.html?slug=${safeSlug}" class="flex items-center gap-4 p-4 bg-white rounded-xl border border-border-light hover:shadow-md transition-shadow group">
                <div class="size-14 rounded-lg overflow-hidden flex-shrink-0 bg-primary/10">
                    ${imageUrl
                ? `<img src="${safeText(imageUrl)}" alt="${safeName}" class="w-full h-full object-cover">`
                : `<div class="w-full h-full flex items-center justify-center"><span class="material-symbols-outlined text-primary/40">person</span></div>`
            }
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="font-serif font-semibold text-text-main truncate group-hover:text-primary transition-colors">${safeName}</h4>
                    <p class="text-sm text-text-secondary">${safeRegion}${safeRegion && safeEra ? ' • ' : ''}${safeEra}</p>
                </div>
                <span class="material-symbols-outlined text-text-secondary/40 group-hover:text-primary transition-colors">chevron_right</span>
            </a>
        `;
    }).join('');
}

/**
 * Check and award badges based on user activity
 * This function should be called after user actions (contributions, reviews, etc.)
 */
async function checkAndAwardBadges() {
    try {
        const token = localStorage.getItem('womencypedia_access_token');
        if (!token) return;

        const response = await fetch(`${ProfileAPI.base}/api/badges/check`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const result = await response.json();
            if (result.newBadges && result.newBadges.length > 0) {
                // Show notification for new badges
                result.newBadges.forEach(badge => {
                    showBadgeNotification(badge);
                });
                // Reload badges display
                await loadBadges();
                renderBadges();
                renderStats();
            }
        }
    } catch (error) {
        console.warn('[Profile] Badge check failed:', error.message);
    }
}

/**
 * Show a notification when a new badge is earned
 */
function showBadgeNotification(badge) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-white border border-border-light rounded-xl shadow-lg p-4 z-50';
    notification.style.cssText = 'animation: slideIn .3s ease-out; transform: translateX(0)';
    notification.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="size-12 rounded-full bg-accent-gold/10 flex items-center justify-center">
                <span class="material-symbols-outlined text-accent-gold text-2xl">${badge.icon || 'workspace_premium'}</span>
            </div>
            <div>
                <h4 class="font-bold text-text-main">New Badge Earned!</h4>
                <p class="text-sm text-text-secondary">${safeText(badge.name)}</p>
            </div>
        </div>
    `;

    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity .3s';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function renderBadges() {
    const el = qs('badges-grid');
    if (!el) return;

    if (!profileData.badges.length) {
        el.innerHTML = `
            <div class="col-span-full text-center py-12">
                <span class="material-symbols-outlined text-5xl text-text-secondary/40 mb-4 block">workspace_premium</span>
                <h3 class="font-serif text-lg font-semibold text-text-main mb-2">No badges yet</h3>
                <p class="text-text-secondary text-sm mb-4">Start contributing to earn recognition badges.</p>
                <a href="share-story.html" class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">
                    <span class="material-symbols-outlined text-[18px]">add</span>
                    Share Your Story
                </a>
            </div>
        `;
        return;
    }

    el.innerHTML = profileData.badges.map(badge => {
        const attrs = badge.attributes || badge;
        const safeName = safeText(attrs.name || 'Unnamed Badge');
        const safeDescription = safeText(attrs.description || '');
        const icon = attrs.icon || 'workspace_premium';
        const color = attrs.color || 'primary';

        const colorClasses = {
            primary: 'bg-primary/10 text-primary',
            teal: 'bg-accent-teal/10 text-accent-teal',
            gold: 'bg-accent-gold/10 text-accent-gold',
            bronze: 'bg-amber-100 text-amber-700',
            silver: 'bg-gray-100 text-gray-600'
        }[color] || 'bg-primary/10 text-primary';

        return `
            <div class="bg-white rounded-xl p-6 border border-border-light flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left hover:shadow-md hover:border-primary/20 transition-all">
                <div class="size-14 rounded-full ${colorClasses} flex items-center justify-center">
                    <span class="material-symbols-outlined text-2xl">${icon}</span>
                </div>
                <div>
                    <h4 class="font-bold text-text-main">${safeName}</h4>
                    <p class="text-xs text-text-secondary">${safeDescription}</p>
                </div>
            </div>
        `;
    }).join('');
}

//////////////////////////////
// AVATAR UPLOAD
//////////////////////////////

// Called from profile.html's onchange="handleAvatarUpload(event)"
function handleAvatarUpload(event) {
    const file = event?.target?.files?.[0];
    if (file) uploadAvatar(file);
}

async function uploadAvatar(file) {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        profileToast('Please upload a JPG, PNG, GIF, or WebP image.', 'warning');
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        profileToast('Image must be under 2MB.', 'warning');
        return;
    }

    const token = Auth?.getAccessToken?.();

    // Demo mode — save as base64 in localStorage
    if (!token) {
        const reader = new FileReader();
        reader.onload = e => {
            profileData.avatar = e.target.result;
            localStorage.setItem('demo_profile', JSON.stringify(profileData));
            renderAvatar();
            profileToast('Avatar updated (demo mode)', 'success');
        };
        return reader.readAsDataURL(file);
    }

    try {
        const fd = new FormData();
        fd.append('files', file);

        // Do NOT set Content-Type header for FormData — browser sets it with boundary
        const upload = await ProfileAPI.request(
            `${ProfileAPI.base}/api/upload`,
            {
                method: 'POST',
                headers: { ...ProfileAPI.getAuthHeaders() },
                body: fd
            }
        );

        const fileId = upload[0]?.id;
        if (!fileId) throw new Error('Upload returned no file');

        await ProfileAPI.request(
            `${ProfileAPI.base}/api/users/${profileData.id}`,
            {
                method: 'PUT',
                headers: {
                    ...ProfileAPI.getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ avatar: fileId })
            }
        );

        const uploadedUrl = upload[0].url;
        profileData.avatar = uploadedUrl?.startsWith('http') ? uploadedUrl : `${ProfileAPI.base}${uploadedUrl}`;
        renderAvatar();
        profileToast('Avatar updated successfully!', 'success');

    } catch (err) {
        console.error('[Profile] Avatar upload failed:', err.message);
        profileToast('Upload failed. Please try again.', 'error');
    }
}

//////////////////////////////
// EDIT PROFILE (Modal)
//////////////////////////////

function showEditModal() {
    // Scroll to settings form and focus the name field
    const settingsSection = qs('settings-section');
    if (settingsSection) {
        settingsSection.classList.remove('hidden');
        settingsSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => { qs('settings-name')?.focus(); }, 400);
    }
}

async function saveProfile() {
    try {
        if (Auth?.isAuthenticated?.()) {
            await ProfileAPI.request(
                `${ProfileAPI.base}/api/users/${profileData.id}`,
                {
                    method: 'PUT',
                    headers: {
                        ...ProfileAPI.getAuthHeaders(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: profileData.name,
                        bio: profileData.bio,
                        location: profileData.location,
                        website: profileData.website
                    })
                }
            );
        } else {
            localStorage.setItem('demo_profile', JSON.stringify(profileData));
        }

        renderUI();

    } catch (err) {
        console.error('[Profile] Save failed:', err.message);
        throw err; // Re-throw so callers can handle
    }
}

//////////////////////////////
// UTIL
//////////////////////////////

function getInitials(name) {
    if (!name) return '?';
    return name
        .split(' ')
        .filter(n => n.length > 0)
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

function formatDate(date) {
    if (!date) return '';
    try {
        return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
        return '';
    }
}

function showSkeleton() {
    qs('profile-card')?.classList.add('animate-pulse');
}

function hideSkeleton() {
    qs('profile-card')?.classList.remove('animate-pulse');
}

function initTabs() {
    document.querySelectorAll('[data-tab]').forEach(btn => {
        btn.addEventListener('click', () => showTab(btn.dataset.tab));
    });
}

/**
 * Show a specific tab by id — callable from HTML onclick
 */
function showTab(tabId) {
    // Hide all tab content
    document.querySelectorAll('[data-tab-content]')
        .forEach(c => c.style.display = 'none');

    // Show requested tab content
    const target = qs(tabId);
    if (target) target.style.display = 'block';

    // Update tab button styling
    document.querySelectorAll('[data-tab]').forEach(btn => {
        const isActive = btn.dataset.tab === tabId;
        // Reset all to inactive first
        btn.classList.remove('text-primary', 'border-b-2', 'border-primary', 'bg-lavender-soft/30');
        btn.classList.remove('text-text-secondary');

        if (isActive) {
            btn.classList.add('text-primary', 'border-b-2', 'border-primary', 'bg-lavender-soft/30');
        } else {
            btn.classList.add('text-text-secondary');
        }
    });
}

//////////////////////////////
// AUTH ACTIONS
//////////////////////////////

function handleLogout() {
    if (!confirm('Are you sure you want to sign out?')) return;
    try {
        if (typeof Auth !== 'undefined' && Auth.logout) {
            Auth.logout();
        } else {
            localStorage.removeItem('womencypedia_access_token');
            localStorage.removeItem('womencypedia_refresh_token');
            localStorage.removeItem('womencypedia_user');
        }
    } catch { }
    window.location.href = 'index.html';
}

function confirmDeleteAccount() {
    if (!confirm('This will PERMANENTLY delete your account and all data. This cannot be undone. Are you absolutely sure?')) return;
    const typed = prompt('Type DELETE to confirm account deletion:');
    if (typed !== 'DELETE') {
        profileToast('Account deletion cancelled.', 'info');
        return;
    }

    ProfileAPI.request(`${ProfileAPI.base}/api/users/me`, {
        method: 'DELETE',
        headers: ProfileAPI.getAuthHeaders()
    }).then(() => {
        profileToast('Account deleted.', 'success');
        setTimeout(handleLogout, 1500);
    }).catch(() => {
        profileToast('Could not delete account. Please contact support.', 'error');
    });
}

function openPasswordModal() {
    const currentPw = prompt('Enter your current password:');
    if (!currentPw) return;

    const newPw = prompt('Enter new password (min 8 characters):');
    if (!newPw || newPw.length < 8) {
        if (newPw) profileToast('Password must be at least 8 characters.', 'warning');
        return;
    }
    const confirmPw = prompt('Confirm new password:');
    if (newPw !== confirmPw) {
        profileToast('Passwords do not match.', 'warning');
        return;
    }

    ProfileAPI.request(`${ProfileAPI.base}/api/auth/change-password`, {
        method: 'POST',
        headers: {
            ...ProfileAPI.getAuthHeaders(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            currentPassword: currentPw,
            password: newPw,
            passwordConfirmation: confirmPw
        })
    }).then(() => {
        profileToast('Password updated successfully!', 'success');
    }).catch((err) => {
        profileToast(err.message || 'Could not update password.', 'error');
    });
}

//////////////////////////////
// SETTINGS FORM
//////////////////////////////

function prefillSettingsForms() {
    const nameField = qs('settings-name');
    const emailField = qs('settings-email');
    const bioField = qs('settings-bio');
    const locField = qs('settings-location');
    const webField = qs('settings-website');

    if (nameField) nameField.value = profileData.name || '';
    if (emailField) emailField.value = profileData.email || '';
    if (bioField) bioField.value = profileData.bio || '';
    if (locField) locField.value = profileData.location || '';
    if (webField) webField.value = profileData.website || '';
}

function setupSettingsForm() {
    const form = qs('edit-profile-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('[type="submit"]');
        const origText = submitBtn?.innerHTML;

        try {
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="material-symbols-outlined text-[20px] animate-spin">refresh</span> Saving...';
            }

            profileData.name = qs('settings-name')?.value || profileData.name;
            profileData.bio = qs('settings-bio')?.value || profileData.bio;
            profileData.location = qs('settings-location')?.value || profileData.location;
            profileData.website = qs('settings-website')?.value || profileData.website;

            await saveProfile();
            profileToast('Profile updated!', 'success');
        } catch {
            profileToast('Save failed. Please try again.', 'error');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = origText;
            }
        }
    });
}