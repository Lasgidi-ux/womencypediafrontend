/**
 * WOMENCYPEDIA - Shared Navigation JavaScript
 * Provides consistent navigation functionality across all pages
 */

document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
});

/**
 * Initialize all navigation components
 */
function initNavigation() {
    createMobileNavigation();
    initNavActiveState();
    initNavScrollBehavior();
    initKeyboardNavigation();
}

/**
 * Create mobile navigation elements if they don't exist
 */
function createMobileNavigation() {
    // Check if mobile navigation already exists
    if (document.getElementById('mobileMenu')) {
        setupMobileMenuHandlers();
        return;
    }

    // Create search sheet
    const searchSheet = document.createElement('div');
    searchSheet.id = 'searchSheet';
    searchSheet.className = 'search-sheet hidden fixed top-0 left-0 right-0 z-[150] bg-background-cream/95 backdrop-blur-sm p-4 border-b border-divider shadow-lg';
    searchSheet.innerHTML = `
        <div class="flex items-center gap-3 max-w-[1440px] mx-auto">
            <div class="flex-1 flex items-center bg-white border border-border-light rounded-lg px-4 h-12 focus-within:border-accent-teal focus-within:ring-1 focus-within:ring-accent-teal">
                <span class="material-symbols-outlined text-accent-teal text-[20px]">search</span>
                <input type="search" placeholder="Search women, cultures, eras…"
                    class="flex-1 bg-transparent border-none focus:ring-0 text-sm text-text-main placeholder-text-secondary ml-2" />
            </div>
            <button onclick="toggleSearch()"
                class="size-12 flex items-center justify-center bg-white border border-border-light rounded-lg hover:bg-primary/10 transition-colors">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
    `;
    document.body.insertBefore(searchSheet, document.body.firstChild);

    // Create menu overlay
    const menuOverlay = document.createElement('div');
    menuOverlay.id = 'menuOverlay';
    menuOverlay.className = 'overlay hidden fixed inset-0 z-[140] bg-black/40';
    menuOverlay.onclick = toggleMenu;
    document.body.insertBefore(menuOverlay, document.body.firstChild);

    // Create mobile bottom sheet menu
    const mobileMenu = document.createElement('nav');
    mobileMenu.id = 'mobileMenu';
    mobileMenu.className = 'mobile-menu hidden fixed bottom-0 left-0 right-0 z-[150] bg-background-cream rounded-t-2xl border-t border-border-light max-h-[85vh] overflow-y-auto shadow-2xl';
    mobileMenu.innerHTML = `
        <div class="w-10 h-1 bg-border-light rounded-full mx-auto mt-3 mb-4"></div>

        <!-- Primary Navigation -->
        <div class="px-6 pb-4">
            <h3 class="text-xs font-bold uppercase tracking-widest text-text-secondary mb-3 pb-2 border-b border-border-light">
                Primary Navigation</h3>
            <a href="index.html"
                class="block py-3 text-base font-medium text-text-main border-b border-border-light/50 hover:text-primary transition-colors">Home</a>
            <a href="about.html"
                class="block py-3 text-base font-medium text-text-main border-b border-border-light/50 hover:text-primary transition-colors">About
                Womencypedia</a>
            <a href="collections.html"
                class="block py-3 text-base font-medium text-text-main border-b border-border-light/50 hover:text-primary transition-colors">Featured
                Collections</a>
            <a href="browse.html"
                class="block py-3 text-base font-medium text-text-main border-b border-border-light/50 hover:text-primary transition-colors">Browse
                Stories</a>
            <a href="featured.html"
                class="block py-3 text-base font-medium text-text-main border-b border-border-light/50 hover:text-primary transition-colors">Featured</a>
            <a href="resources.html"
                class="block py-3 text-base font-medium text-text-main border-b border-border-light/50 hover:text-primary transition-colors">Resources</a>
            <a href="research.html"
                class="block py-3 text-base font-medium text-text-main hover:text-primary transition-colors">Research
                & Method</a>
        </div>

        <!-- Participate -->
        <div class="px-6 pb-4">
            <h3 class="text-xs font-bold uppercase tracking-widest text-text-secondary mb-3 pb-2 border-b border-border-light">
                Participate</h3>
            <a href="nominate.html"
                class="block py-3 text-base font-medium text-text-main border-b border-border-light/50 hover:text-primary transition-colors">Nominate
                a Woman</a>
            <a href="share-story.html"
                class="block py-3 text-base font-medium text-text-main border-b border-border-light/50 hover:text-primary transition-colors">Share
                Your Story</a>
            <a href="contributors.html"
                class="block py-3 text-base font-medium text-text-main hover:text-primary transition-colors">Become a Contributor</a>
        </div>

        <!-- Organization -->
        <div class="px-6 pb-4">
            <h3 class="text-xs font-bold uppercase tracking-widest text-text-secondary mb-3 pb-2 border-b border-border-light">
                Organization</h3>
            <a href="founders.html"
                class="block py-3 text-base font-medium text-text-main border-b border-border-light/50 hover:text-primary transition-colors">Founders</a>
            <a href="editorial-standards.html"
                class="block py-3 text-base font-medium text-text-main border-b border-border-light/50 hover:text-primary transition-colors">Editorial Standards</a>
            <a href="contact.html"
                class="block py-3 text-base font-medium text-text-main hover:text-primary transition-colors">Contact Us</a>
        </div>

        <!-- CTA -->
        <div class="px-6 pb-8 pt-2 space-y-3">
            <a href="donate.html"
                class="block w-full h-12 bg-accent-gold text-white text-base font-bold rounded-lg flex items-center justify-center hover:bg-accent-gold/90 transition-colors">
                <span class="material-symbols-outlined mr-2">favorite</span>
                Donate
            </a>
            <a href="share-story.html"
                class="block w-full h-12 bg-primary text-white text-base font-bold rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors">
                Share Your Story
            </a>
        </div>
    `;
    document.body.appendChild(mobileMenu);

    // Add CSS animations if not present
    addMobileNavStyles();

    // Setup handlers
    setupMobileMenuHandlers();
}

/**
 * Add required CSS for mobile navigation
 */
function addMobileNavStyles() {
    if (document.getElementById('mobile-nav-styles')) return;

    const styleSheet = document.createElement('style');
    styleSheet.id = 'mobile-nav-styles';
    styleSheet.textContent = `
        /* Mobile menu animation */
        .mobile-menu {
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
        }

        .mobile-menu.hidden {
            transform: translateY(100%);
            opacity: 0;
            pointer-events: none;
        }

        .mobile-menu.active {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
        }

        /* Search sheet animation */
        .search-sheet {
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
        }

        .search-sheet.hidden {
            transform: translateY(-100%);
            opacity: 0;
            pointer-events: none;
        }

        .search-sheet.active {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
        }

        /* Overlay animation */
        .overlay {
            transition: opacity 0.3s ease;
        }

        .overlay.hidden {
            opacity: 0;
            pointer-events: none;
        }

        .overlay.active {
            opacity: 1;
            pointer-events: auto;
        }
    `;
    document.head.appendChild(styleSheet);
}

/**
 * Setup event handlers for mobile menu buttons
 */
function setupMobileMenuHandlers() {
    // Find and attach handlers to mobile menu button
    const menuButtons = document.querySelectorAll('[aria-label="Open menu"], [aria-label="Menu"]');
    menuButtons.forEach(btn => {
        // Remove existing onclick to avoid duplicates
        btn.removeAttribute('onclick');
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            toggleMenu();
        });
    });

    // Find and attach handlers to mobile search button
    const searchButtons = document.querySelectorAll('[aria-label="Open search"]');
    searchButtons.forEach(btn => {
        // Remove existing onclick to avoid duplicates
        btn.removeAttribute('onclick');
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            toggleSearch();
        });
    });

    // Handle swipe to close on mobile menu
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        let touchStartY = 0;
        let touchEndY = 0;

        mobileMenu.addEventListener('touchstart', function (e) {
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        mobileMenu.addEventListener('touchend', function (e) {
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeDistance = touchEndY - touchStartY;
            if (swipeDistance > 100) {
                toggleMenu();
            }
        }
    }
}

/**
 * Toggle mobile menu visibility
 */
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('menuOverlay');

    if (!menu || !overlay) return;

    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        menu.classList.add('active');
        overlay.classList.remove('hidden');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        menu.classList.remove('active');
        menu.classList.add('hidden');
        overlay.classList.remove('active');
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

/**
 * Toggle search sheet visibility
 */
function toggleSearch() {
    const search = document.getElementById('searchSheet');

    if (!search) return;

    if (search.classList.contains('hidden')) {
        search.classList.remove('hidden');
        search.classList.add('active');
        const input = search.querySelector('input');
        if (input) {
            setTimeout(() => input.focus(), 100);
        }
    } else {
        search.classList.remove('active');
        search.classList.add('hidden');
    }
}

/**
 * Initialize active state for navigation links based on current page
 */
function initNavActiveState() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';

    // Desktop navigation links
    const navLinks = document.querySelectorAll('header nav a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('text-primary', 'border-b-2', 'border-primary');
            link.classList.remove('text-text-main', 'hover:text-primary');
        } else {
            link.classList.remove('text-primary', 'border-b-2', 'border-primary');
            link.classList.add('text-text-main');
        }
    });
}

/**
 * Navbar hide/show on scroll
 */
function initNavScrollBehavior() {
    const navbar = document.querySelector('header');
    if (!navbar) return;

    // Add ID if missing
    if (!navbar.id) {
        navbar.id = 'navbar';
    }

    let lastScrollTop = 0;
    const scrollThreshold = 10;

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (Math.abs(currentScroll - lastScrollTop) < scrollThreshold) {
            return;
        }

        if (currentScroll > lastScrollTop && currentScroll > 100) {
            // Scrolling down & past navbar
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }, { passive: true });
}

/**
 * Keyboard navigation support
 */
function initKeyboardNavigation() {
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            const menu = document.getElementById('mobileMenu');
            const search = document.getElementById('searchSheet');

            if (menu && !menu.classList.contains('hidden')) {
                toggleMenu();
            }
            if (search && !search.classList.contains('hidden')) {
                toggleSearch();
            }
        }
    });
}

// Make functions globally available
window.toggleMenu = toggleMenu;
window.toggleSearch = toggleSearch;
