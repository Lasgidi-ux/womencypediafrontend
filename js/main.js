/**
 * WOMENCYPEDIA - Main JavaScript
 * Enterprise-grade Editorial Knowledge Platform
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initSearch();
    initScrollBehavior();
    initMobileMenu();
    initAccessibility();
});

/**
 * Navigation Scroll Behavior
 * Navbar hides on scroll down, reappears on scroll up
 */
function initScrollBehavior() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScrollTop = 0;
    const scrollThreshold = 10;

    window.addEventListener('scroll', function() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (Math.abs(currentScrollTop - lastScrollTop) < scrollThreshold) {
            return;
        }

        if (currentScrollTop > lastScrollTop && currentScrollTop > 100) {
            // Scrolling down & past navbar
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    }, { passive: true });
}

/**
 * Navigation Active State
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.navbar__nav-link');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.includes(href.replace('.html', ''))) {
            link.classList.add('active');
        }
    });
}

/**
 * Search Functionality
 */
function initSearch() {
    const searchBtn = document.querySelector('.navbar__search-btn');
    const searchSheet = document.querySelector('.search-sheet');
    const searchClose = document.querySelector('.search-sheet__close');
    const searchInput = document.querySelector('.search-sheet__input');

    if (!searchBtn || !searchSheet) return;

    // Open search sheet
    searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        searchSheet.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus search input after animation
        setTimeout(() => {
            if (searchInput) searchInput.focus();
        }, 300);
    });

    // Close search sheet
    if (searchClose) {
        searchClose.addEventListener('click', function() {
            closeSearchSheet();
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchSheet.classList.contains('active')) {
            closeSearchSheet();
        }
    });

    function closeSearchSheet() {
        searchSheet.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Search form submission
    const searchForm = document.querySelector('.search-sheet__form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput?.value.trim();
            if (query) {
                // Handle search - in real app would send to API
                console.log('Searching for:', query);
                // window.location.href = `/search?q=${encodeURIComponent(query)}`;
            }
        });
    }
}

/**
 * Mobile Bottom Sheet Menu
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.navbar__menu-btn');
    const bottomSheet = document.querySelector('.bottom-sheet');
    const menuOverlay = document.querySelector('.menu-overlay');

    if (!menuBtn || !bottomSheet) return;

    // Open menu
    menuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openMenu();
    });

    // Close on overlay click
    if (menuOverlay) {
        menuOverlay.addEventListener('click', function() {
            closeMenu();
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && bottomSheet.classList.contains('active')) {
            closeMenu();
        }
    });

    // Handle swipe to close
    let touchStartY = 0;
    let touchEndY = 0;

    bottomSheet.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    bottomSheet.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeDistance = touchEndY - touchStartY;
        if (swipeDistance > 100) {
            closeMenu();
        }
    }

    function openMenu() {
        bottomSheet.classList.add('active');
        if (menuOverlay) menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus first menu item
        const firstLink = bottomSheet.querySelector('.bottom-sheet__link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 300);
        }
    }

    function closeMenu() {
        bottomSheet.classList.remove('active');
        if (menuOverlay) menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Accessibility Enhancements
 */
function initAccessibility() {
    // Skip to main content
    const skipLink = document.querySelector('.skip-link');
    const mainContent = document.querySelector('main');

    if (skipLink && mainContent) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            mainContent.focus();
            mainContent.scrollIntoView();
        });
    }

    // Add keyboard navigation for interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input, textarea, select');
    
    interactiveElements.forEach(element => {
        // Ensure visible focus states
        element.addEventListener('focus', function() {
            this.classList.add('focus-visible');
        });

        element.addEventListener('blur', function() {
            this.classList.remove('focus-visible');
        });
    });

    // Handle reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--transition-duration', '0s');
    }
}

/**
 * Form Validation Helper
 */
function validateForm(formElement) {
    const requiredFields = formElement.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            
            // Show error message
            let errorMsg = field.parentElement.querySelector('.error-message');
            if (!errorMsg) {
                errorMsg = document.createElement('span');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                field.parentElement.appendChild(errorMsg);
            }
        } else {
            field.classList.remove('error');
            const errorMsg = field.parentElement.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
        }
    });

    // Email validation
    const emailFields = formElement.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        if (field.value && !isValidEmail(field.value)) {
            isValid = false;
            field.classList.add('error');
        }
    });

    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/**
 * Lazy loading for images
 */
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

/**
 * Animation on scroll
 */
if ('IntersectionObserver' in window) {
    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        animateObserver.observe(el);
    });
}

// Export functions for external use if needed
window.WomencypediaApp = {
    validateForm,
    isValidEmail
};
