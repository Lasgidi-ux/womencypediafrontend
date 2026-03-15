/**
 * Common toggle unit functionality for education modules
 * Used in education-module.html, education-module-1.html through education-module-7.html, 
 * and education-module-template.html
 * 
 * This was extracted from inline <script> blocks to support stricter CSP policies
 * without requiring 'unsafe-inline' in script-src
 */

(function () {
    'use strict';

    // Global toggleUnit function for backward compatibility
    window.toggleUnit = function (button) {
        const content = button.nextElementSibling;
        const icon = button.querySelector('.material-symbols-outlined');

        if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            icon.textContent = 'expand_less';
        } else {
            content.classList.add('hidden');
            icon.textContent = 'expand_more';
        }
    };
})();
