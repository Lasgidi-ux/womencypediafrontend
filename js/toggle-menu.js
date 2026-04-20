/**
 * Common mobile menu toggle functionality
 * Used across multiple pages: sitemap-page.html, press.html, community.html, careers.html
 * 
 * This was extracted from inline <script> blocks to support stricter CSP policies
 * without requiring 'unsafe-inline' in script-src
 */

(function () {
    'use strict';

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function () {
        const menuButton = document.querySelector('[aria-controls="mobileMenu"]');
        const menu = document.getElementById('mobileMenu');

        if (menuButton && menu) {
            menuButton.addEventListener('click', function () {
                toggleMenu();
            });
        }
    });

    // Global toggleMenu function for backward compatibility
    window.toggleMenu = function () {
        const menu = document.getElementById('mobileMenu');
        const overlay = document.getElementById('menuOverlay');

        if (menu) {
            menu.classList.toggle('hidden');
        }
        if (overlay) {
            overlay.classList.toggle('hidden');
        }
    };
})();
