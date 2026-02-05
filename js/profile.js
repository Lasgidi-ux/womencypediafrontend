/**
 * Womencypedia User Profile
 * Profile page functionality and interactions
 */

// Profile data (mock)
const profileData = {
    id: 1,
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@email.com",
    role: "Editor-in-Chief",
    location: "New York, USA",
    joinDate: "January 2024",
    avatar: null,
    bio: "Historian specializing in women's history with 20+ years of experience. Contributing to Womencypedia since 2024.",
    stats: {
        contributions: 47,
        saved: 128,
        badges: 12,
        profileViews: 45200
    },
    badges: [
        { id: 1, name: "Top Contributor", icon: "workspace_premium", description: "50+ contributions" },
        { id: 2, name: "Expert Reviewer", icon: "star", description: "50+ reviews" },
        { id: 3, name: "Research Lead", icon: "military_tech", description: "10+ original" },
        { id: 4, name: "Verified Expert", icon: "verified", description: "PhD verified" }
    ],
    contributions: [
        {
            id: 1,
            name: "Queen Amina of Zazzau",
            action: "Updated biography with new historical context and sources",
            date: "Jan 28, 2026",
            views: 2456
        },
        {
            id: 2,
            name: "Hildegard of Bingen",
            action: "Added new section on musical contributions",
            date: "Jan 25, 2026",
            views: 1892
        },
        {
            id: 3,
            name: "Wangari Maathai",
            action: "New biography submission - published after review",
            date: "Jan 22, 2026",
            views: 3124
        }
    ],
    saved: [
        {
            id: 1,
            name: "Cleopatra",
            category: "Leadership",
            savedDate: "Jan 20, 2026"
        },
        {
            id: 2,
            name: "Mary Seacole",
            category: "Enterprise",
            savedDate: "Jan 18, 2026"
        },
        {
            id: 3,
            name: "Yaa Asantewaa",
            category: "Leadership",
            savedDate: "Jan 15, 2026"
        }
    ],
    nominations: [
        {
            id: 1,
            name: "Dr. Ngozi Okonjo-Iweala",
            category: "Leadership & Policy",
            status: "Under Review",
            date: "Jan 28, 2026"
        },
        {
            id: 2,
            name: "Funmilayo Ransome-Kuti",
            category: "Activism & Social Impact",
            status: "Pending",
            date: "Jan 26, 2026"
        }
    ]
};

// Initialize profile page
document.addEventListener('DOMContentLoaded', function () {
    initTabNavigation();
    initProfileDropdown();
    setupEditProfile();
    setupSaveActions();
});

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
    const editButton = document.querySelector('button:contains("Edit Profile")');

    if (editButton) {
        editButton.addEventListener('click', function () {
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

    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl" onclick="event.stopPropagation()">
            <div class="flex items-center justify-between mb-6">
                <h2 class="font-serif text-2xl font-bold text-text-main">Edit Profile</h2>
                <button onclick="this.closest('.fixed').remove()" class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            
            <form id="edit-profile-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-text-main mb-2">Display Name</label>
                    <input type="text" value="${profileData.name}" class="w-full h-12 px-4 border border-border-light rounded-lg focus:border-accent-teal focus:ring-1 focus:ring-accent-teal">
                </div>
                <div>
                    <label class="block text-sm font-medium text-text-main mb-2">Email</label>
                    <input type="email" value="${profileData.email}" class="w-full h-12 px-4 border border-border-light rounded-lg focus:border-accent-teal focus:ring-1 focus:ring-accent-teal">
                </div>
                <div>
                    <label class="block text-sm font-medium text-text-main mb-2">Location</label>
                    <input type="text" value="${profileData.location}" class="w-full h-12 px-4 border border-border-light rounded-lg focus:border-accent-teal focus:ring-1 focus:ring-accent-teal">
                </div>
                <div>
                    <label class="block text-sm font-medium text-text-main mb-2">Bio</label>
                    <textarea rows="3" class="w-full px-4 py-3 border border-border-light rounded-lg focus:border-accent-teal focus:ring-1 focus:ring-accent-teal resize-none">${profileData.bio}</textarea>
                </div>
            </form>
            
            <div class="flex gap-4 mt-6">
                <button onclick="this.closest('.fixed').remove()" class="flex-1 px-6 py-3 border border-border-light text-text-main font-medium rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                <button onclick="saveProfile()" class="flex-1 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors">Save Changes</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function saveProfile() {
    // In a real implementation, this would save to the backend
    alert('Profile saved successfully!');
    document.querySelector('.fixed')?.remove();
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
