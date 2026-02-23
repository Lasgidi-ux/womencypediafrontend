/**
 * Womencypedia User Profile
 * Profile page functionality and interactions
 */

// Profile data (will be loaded from Auth/Strapi)
let profileData = {
    id: null,
    name: "Guest User",
    email: "",
    role: "Contributor",
    location: "",
    joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    avatar: null,
    bio: "Member of the Womencypedia community.",
    stats: {
        contributions: 0,
        saved: 0,
        badges: 0,
        profileViews: 0
    },
    badges: [],
    contributions: [],
    saved: [],
    nominations: []
};

// Initialize profile page
document.addEventListener('DOMContentLoaded', async function () {
    initTabNavigation();
    initProfileDropdown();
    setupEditProfile();
    setupSaveActions();
    await loadUserProfile();
});

// Load user profile data from Auth/Strapi
async function loadUserProfile() {
    try {
        // Check if user is authenticated
        if (Auth && Auth.isAuthenticated()) {
            // Try to get current user from Strapi
            const user = await Auth.getCurrentUser();
            if (user) {
                profileData = {
                    ...profileData,
                    id: user.id,
                    name: user.username || user.name || user.email || "User",
                    email: user.email || "",
                    role: user.role?.name || user.role || "Contributor",
                    location: user.location || "",
                    joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                    avatar: user.avatar || null,
                    bio: user.bio || "Member of the Womencypedia community."
                };
            }
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
    }

    // Update UI with profile data
    updateProfileUI();
}

// Update the profile UI with data
function updateProfileUI() {
    // Update name
    const nameEl = document.getElementById('profile-name');
    if (nameEl) {
        nameEl.textContent = profileData.name;
    }

    // Update email
    const emailEl = document.getElementById('profile-email');
    if (emailEl) {
        emailEl.textContent = profileData.email || 'No email provided';
    }

    // Update bio
    const bioEl = document.getElementById('profile-bio');
    if (bioEl) {
        bioEl.textContent = profileData.bio;
    }

    // Update joined date
    const joinedEl = document.getElementById('profile-joined');
    if (joinedEl) {
        joinedEl.textContent = `Member since ${profileData.joinDate}`;
    }

    // Update role
    const roleEl = document.getElementById('profile-role');
    if (roleEl && profileData.role) {
        roleEl.textContent = profileData.role;
        roleEl.classList.remove('hidden');
    }

    // Update avatar
    const avatarContainer = document.getElementById('profile-avatar-container');
    if (avatarContainer) {
        if (profileData.avatar) {
            avatarContainer.innerHTML = `<img src="${profileData.avatar}" alt="${profileData.name}" class="size-32 rounded-full object-cover">`;
        } else {
            // Show initials or default avatar
            const initials = getInitials(profileData.name);
            avatarContainer.innerHTML = initials ?
                `<span class="text-3xl font-serif font-bold">${initials}</span>` :
                `<span class="material-symbols-outlined">person</span>`;
        }
    }

    // Update stats (if available)
    updateStatsUI();
}

// Update stats in the UI
function updateStatsUI() {
    const contribEl = document.querySelector('.grid .bg-white:first-child h3');
    if (contribEl) {
        contribEl.textContent = profileData.stats.contributions;
    }

    const savedEl = document.querySelector('.grid .bg-white:nth-child(2) h3');
    if (savedEl) {
        savedEl.textContent = profileData.stats.saved;
    }

    const badgesEl = document.querySelector('.grid .bg-white:nth-child(3) h3');
    if (badgesEl) {
        badgesEl.textContent = profileData.stats.badges;
    }

    const viewsEl = document.querySelector('.grid .bg-white:nth-child(4) h3');
    if (viewsEl) {
        viewsEl.textContent = formatNumber(profileData.stats.profileViews);
    }
}

// Get initials from name
function getInitials(name) {
    if (!name || name === 'Guest User') return null;
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

// Tab navigation
function initTabNavigation() {
    const tabButtons = document.querySelectorAll('.bg-white.rounded-xl.border.border-border-light button');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active state from all tabs
            tabButtons.forEach(btn => {
                btn.classList.remove('text-primary', 'border-b-2', 'border-primary', 'bg-lavender-soft/30');
                btn.classList.add('text-text-secondary');
            });

            // Add active state to clicked tab
            this.classList.add('text-primary', 'border-b-2', 'border-primary', 'bg-lavender-soft/30');
            this.classList.remove('text-text-secondary');

            // Show corresponding content
            const tabName = this.textContent.trim().toLowerCase();
            showTabContent(tabName);
        });
    });
}

function showTabContent(tabName) {
    // Hide all tab content
    const allContent = document.querySelectorAll('[id*="-tab"]');
    allContent.forEach(content => {
        content.style.display = 'none';
    });

    // Show selected tab content
    const selectedContent = document.getElementById(`${tabName}-tab`);
    if (selectedContent) {
        selectedContent.style.display = 'block';
    }
}

// Profile dropdown
function initProfileDropdown() {
    const dropdownButton = document.querySelector('#profile-dropdown button');

    if (dropdownButton) {
        dropdownButton.addEventListener('click', function () {
            // Toggle dropdown menu
            let dropdown = document.querySelector('.profile-menu');

            if (dropdown) {
                dropdown.remove();
            } else {
                dropdown = createProfileMenu();
                this.parentElement.appendChild(dropdown);

                // Position dropdown
                const rect = this.getBoundingClientRect();
                dropdown.style.top = `${rect.bottom + 8}px`;
                dropdown.style.right = `0`;
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!dropdownButton.contains(e.target)) {
                const dropdown = document.querySelector('.profile-menu');
                if (dropdown) {
                    dropdown.remove();
                }
            }
        });
    }
}

function createProfileMenu() {
    const menu = document.createElement('div');
    menu.className = 'profile-menu absolute bg-white rounded-xl shadow-lg border border-border-light py-2 min-w-[200px] z-50';

    menu.innerHTML = `
        <a href="profile.html" class="flex items-center gap-3 px-4 py-2 hover:bg-lavender-soft/30 transition-colors">
            <span class="material-symbols-outlined text-text-secondary text-[20px]">person</span>
            <span class="text-sm font-medium text-text-main">My Profile</span>
        </a>
        <a href="admin.html" class="flex items-center gap-3 px-4 py-2 hover:bg-lavender-soft/30 transition-colors">
            <span class="material-symbols-outlined text-text-secondary text-[20px]">dashboard</span>
            <span class="text-sm font-medium text-text-main">Dashboard</span>
        </a>
        <a href="nominate.html" class="flex items-center gap-3 px-4 py-2 hover:bg-lavender-soft/30 transition-colors">
            <span class="material-symbols-outlined text-text-secondary text-[20px]">send</span>
            <span class="text-sm font-medium text-text-main">My Nominations</span>
        </a>
        <a href="#" class="flex items-center gap-3 px-4 py-2 hover:bg-lavender-soft/30 transition-colors">
            <span class="material-symbols-outlined text-text-secondary text-[20px]">bookmark</span>
            <span class="text-sm font-medium text-text-main">Saved Items</span>
        </a>
        <hr class="my-2 border-border-light">
        <a href="#" class="flex items-center gap-3 px-4 py-2 hover:bg-lavender-soft/30 transition-colors">
            <span class="material-symbols-outlined text-text-secondary text-[20px]">settings</span>
            <span class="text-sm font-medium text-text-main">Settings</span>
        </a>
        <a href="#" class="flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 transition-colors">
            <span class="material-symbols-outlined text-red-600 text-[20px]">logout</span>
            <span class="text-sm font-medium">Sign Out</span>
        </a>
    `;

    return menu;
}

// Edit profile functionality
function setupEditProfile() {
    const editButton = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes("Edit Profile"));

    if (editButton) {
        // Remove any existing inline onclick to prevent conflicts
        editButton.removeAttribute('onclick');

        editButton.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            showEditProfileModal();
        });
    }
}

function showEditProfileModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4';
    modal.onclick = function (e) {
        if (e.target === modal) modal.remove();
    };

    // Check authentication status
    const isAuthenticated = Auth && Auth.isAuthenticated();
    const buttonText = isAuthenticated ? 'Save Changes' : 'Save (Demo)';

    // Show notice if not authenticated
    const authNotice = !isAuthenticated ?
        `<div class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            <span class="material-symbols-outlined text-[16px] align-middle mr-1">info</span>
            You are not signed in. Changes will only be saved locally for demonstration.
        </div>` : '';

    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl" onclick="event.stopPropagation()">
            <div class="flex items-center justify-between mb-6">
                <h2 class="font-serif text-2xl font-bold text-text-main">Edit Profile</h2>
                <button onclick="this.closest('.fixed').remove()" class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            
            ${authNotice}
            
            <form id="edit-profile-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-text-main mb-2">Display Name</label>
                    <input type="text" id="edit-name" value="${profileData.name}" ${!isAuthenticated ? 'disabled' : ''}
                        class="w-full h-12 px-4 border border-border-light rounded-lg focus:border-accent-teal focus:ring-1 focus:ring-accent-teal disabled:bg-gray-100 disabled:cursor-not-allowed">
                </div>
                <div>
                    <label class="block text-sm font-medium text-text-main mb-2">Email</label>
                    <input type="email" id="edit-email" value="${profileData.email}" ${!isAuthenticated ? 'disabled' : ''}
                        class="w-full h-12 px-4 border border-border-light rounded-lg focus:border-accent-teal focus:ring-1 focus:ring-accent-teal disabled:bg-gray-100 disabled:cursor-not-allowed">
                </div>
                <div>
                    <label class="block text-sm font-medium text-text-main mb-2">Location</label>
                    <input type="text" id="edit-location" value="${profileData.location || ''}" ${!isAuthenticated ? 'disabled' : ''}
                        class="w-full h-12 px-4 border border-border-light rounded-lg focus:border-accent-teal focus:ring-1 focus:ring-accent-teal disabled:bg-gray-100 disabled:cursor-not-allowed">
                </div>
                <div>
                    <label class="block text-sm font-medium text-text-main mb-2">Bio</label>
                    <textarea id="edit-bio" rows="3" ${!isAuthenticated ? 'disabled' : ''}
                        class="w-full px-4 py-3 border border-border-light rounded-lg focus:border-accent-teal focus:ring-1 focus:ring-accent-teal resize-none disabled:bg-gray-100 disabled:cursor-not-allowed">${profileData.bio}</textarea>
                </div>
            </form>
            
            <div class="flex gap-4 mt-6">
                <button onclick="this.closest('.fixed').remove()" class="flex-1 px-6 py-3 border border-border-light text-text-main font-medium rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                <button onclick="saveProfile()" class="flex-1 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors">${buttonText}</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

async function saveProfile() {
    // Get form values
    const name = document.getElementById('edit-name').value;
    const email = document.getElementById('edit-email').value;
    const location = document.getElementById('edit-location').value;
    const bio = document.getElementById('edit-bio').value;

    // Show loading state
    const saveButton = document.querySelector('#edit-profile-form + div button:last-child');
    const originalText = saveButton.textContent;
    saveButton.textContent = 'Saving...';
    saveButton.disabled = true;

    try {
        // Check if user is authenticated
        if (Auth && Auth.isAuthenticated()) {
            // Save to Strapi
            await Auth.updateProfile({
                username: name,
                email: email,
                location: location,
                bio: bio
            });

            // Show success message
            if (typeof UI !== 'undefined' && UI.showToast) {
                UI.showToast('Profile updated successfully!', 'success');
            } else {
                alert('Profile updated successfully!');
            }
        } else {
            // Demo mode - save to localStorage only
            profileData.name = name;
            profileData.email = email;
            profileData.location = location;
            profileData.bio = bio;

            // Save to localStorage for demo purposes
            localStorage.setItem('womencypedia_demo_profile', JSON.stringify({
                name: name,
                email: email,
                location: location,
                bio: bio
            }));

            if (typeof UI !== 'undefined' && UI.showToast) {
                UI.showToast('Profile saved locally (demo mode)', 'info');
            } else {
                alert('Profile saved locally (demo mode - not signed in)');
            }
        }

        // Update local profile data
        profileData.name = name;
        profileData.email = email;
        profileData.location = location;
        profileData.bio = bio;

        // Update UI
        updateProfileUI();

        // Close modal
        document.querySelector('.fixed')?.remove();

    } catch (error) {
        console.error('Error saving profile:', error);

        // Show error message
        if (typeof UI !== 'undefined' && UI.showToast) {
            UI.showToast('Failed to update profile: ' + error.message, 'error');
        } else {
            alert('Failed to update profile: ' + error.message);
        }
    } finally {
        // Restore button state
        saveButton.textContent = originalText;
        saveButton.disabled = false;
    }
}

// Save actions
function setupSaveActions() {
    // Setup any interactive elements on the profile page
    console.log('Profile page initialized');
}

// Format numbers
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Get relative time
function getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Make functions available globally
window.showTab = function (tabName) {
    showTabContent(tabName);
};
