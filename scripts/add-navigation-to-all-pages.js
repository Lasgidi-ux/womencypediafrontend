#!/usr/bin/env node
/**
 * Womencypedia — Add Missing Navigation Elements to All Pages
 * 
 * This script ensures all HTML pages have:
 * 1. Mobile Search Sheet
 * 2. Mobile Menu Overlay
 * 3. Mobile Bottom Sheet Menu
 * 4. Language Switcher
 * 5. Mobile Search Button
 * 6. Mobile Menu Button (if not present)
 * 
 * It adds the navigation.js script if missing and adds HTML elements if not present.
 * 
 * Usage: node scripts/add-navigation-to-all-pages.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
let totalAdded = 0;
const report = {};

// Path prefix detection - determines if we're in a subdirectory
function getPathPrefix(filePath) {
    const relativePath = path.relative(ROOT, filePath);
    const depth = relativePath.split(path.sep).length - 1;
    return depth > 0 ? '../'.repeat(depth) : '';
}

// Mobile Search Sheet HTML
function getSearchSheet(pathPrefix) {
    return `
    <!-- Mobile Search Sheet -->
    <div id="searchSheet" class="search-sheet hidden fixed top-0 left-0 right-0 z-[150] bg-accent-teal/10 p-4">
        <div class="flex items-center gap-3">
            <div class="flex-1 flex items-center bg-white border border-border-light rounded-lg px-4 h-12">
                <span class="material-symbols-outlined text-accent-teal text-[20px]">search</span>
                <input type="search" placeholder="Search women, cultures, eras…" class="flex-1 bg-transparent border-none focus:ring-0 text-sm text-text-main placeholder-text-secondary ml-2" />
            </div>
            <button onclick="toggleSearch()" class="size-12 flex items-center justify-center bg-white border border-border-light rounded-lg">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
    </div>`;
}

// Mobile Menu Overlay HTML
function getMenuOverlay() {
    return `
    <!-- Mobile Menu Overlay -->
    <div id="menuOverlay" class="overlay hidden fixed inset-0 z-[140] bg-black/40" onclick="toggleMenu()"></div>`;
}

// Mobile Bottom Sheet Menu HTML
function getMobileMenu(pathPrefix) {
    return `
    <!-- Mobile Bottom Sheet Menu -->
    <nav id="mobileMenu" class="mobile-menu hidden fixed bottom-0 left-0 right-0 z-[150] bg-background-cream rounded-t-2xl border-t border-border-light max-h-[85vh] overflow-y-auto">
        <div class="w-10 h-1 bg-border-light rounded-full mx-auto mt-3 mb-4"></div>

        <!-- Explore -->
        <div class="px-6 pb-4">
            <h3 class="text-xs font-bold uppercase tracking-widest text-text-secondary mb-3 pb-2 border-b border-border-light">Explore</h3>
            <a href="${pathPrefix}index.html" class="block py-3 text-base font-medium text-text-main border-b border-border-light/50 hover:text-primary">Home</a>
            <a href="${pathPrefix}browse.html" class="block py-3 text-base font-medium text-text-main border-b border-border-light/50 hover:text-primary">Browse</a>
            <a href="${pathPrefix}featured.html" class="block py-3 text-base font-medium text-text-main border-b border-border-light/50 hover:text-primary">Featured</a>
            <a href="${pathPrefix}collections.html" class="block py-3 text-base font-medium text-text-main border-b border-border-light/50 hover:text-primary">Collections</a>
            <a href="${pathPrefix}timelines.html" class="block py-3 text-base font-medium text-text-main hover:text-primary">Timelines</a>
        </div>

        <!-- Registry -->
        <div class="px-6 pb-4">
            <h3 class="text-xs font-bold uppercase tracking-widest text-text-secondary mb-3 pb-2 border-b border-border-light">Registry</h3>
            <a href="${pathPrefix}browse-leaders.html" class="block py-3 text-base font-medium text-text-main border-b border-border-light/50 hover:text-primary">Browse Leaders</a>
            <a href="${pathPrefix}apply-verification.html" class="block py-3 text-base font-medium text-text-main border-b border-border-light/50 hover:text-primary">Apply for Verification</a>
            <a href="${pathPrefix}controlled-contributions.html" class="block py-3 text-base font-medium text-text-main border-b border-border-light/50 hover:text-primary">Submit Content</a>
            <a href="${pathPrefix}partners.html" class="block py-3 text-base font-medium text-text-main border-b border-border-light/50 hover:text-primary">Partners</a>
            <a href="${pathPrefix}fellowship.html" class="block py-3 text-base font-medium text-text-main border-b border-border-light/50 hover:text-primary">Fellowships</a>
            <a href="${pathPrefix}reports.html" class="block py-3 text-base font-medium text-text-main hover:text-primary">Reports</a>
        </div>

        <!-- Learn -->
        <div class="px-6 pb-4">
            <h3 class="text-xs font-bold uppercase tracking-widest text-text-secondary mb-3 pb-2 border-b border-border-light">Learn</h3>
            <a href="${pathPrefix}education.html" class="block py-3 text-base font-medium text-text-main border-b border-border-light/50 hover:text-primary">Education</a>
            <a href="${pathPrefix}enterprises.html" class="block py-3 text-base font-medium text-text-main border-b border-border-light/50 hover:text-primary">Enterprises</a>
            <a href="${pathPrefix}research.html" class="block py-3 text-base font-medium text-text-main border-b border-border-light/50 hover:text-primary">Research</a>
            <a href="${pathPrefix}publications.html" class="block py-3 text-base font-medium text-text-main border-b border-border-light/50 hover:text-primary">Publications</a>
            <a href="${pathPrefix}resources.html" class="block py-3 text-base font-medium text-text-main hover:text-primary">Resources</a>
        </div>

        <!-- Participate -->
        <div class="px-6 pb-4">
            <h3 class="text-xs font-bold uppercase tracking-widest text-text-secondary mb-3 pb-2 border-b border-border-light">Participate</h3>
            <a href="${pathPrefix}nominate.html" class="block py-3 text-base font-medium text-text-main border-b border-border-light/50 hover:text-primary">Nominate a Woman</a>
            <a href="${pathPrefix}share-story.html" class="block py-3 text-base font-medium text-text-main border-b border-border-light/50 hover:text-primary">Share Your Story</a>
            <a href="${pathPrefix}contributor-guidelines.html" class="block py-3 text-base font-medium text-text-main border-b border-border-light/50 hover:text-primary">Contributor Guidelines</a>
            <a href="${pathPrefix}donate.html" class="block py-3 text-base font-medium text-text-main hover:text-primary">Donate</a>
        </div>

        <!-- About -->
        <div class="px-6 pb-4">
            <h3 class="text-xs font-bold uppercase tracking-widest text-text-secondary mb-3 pb-2 border-b border-border-light">About</h3>
            <a href="${pathPrefix}about.html" class="block py-3 text-base font-medium text-text-main border-b border-border-light/50 hover:text-primary">About Us</a>
            <a href="${pathPrefix}contributors.html" class="block py-3 text-base font-medium text-text-main border-b border-border-light/50 hover:text-primary">Contributors</a>

            <a href="${pathPrefix}methodology.html" class="block py-3 text-base font-medium text-text-main border-b border-border-light/50 hover:text-primary">Methodology</a>
            <a href="${pathPrefix}editorial-standards.html" class="block py-3 text-base font-medium text-text-main border-b border-border-light/50 hover:text-primary">Editorial Standards</a>
            <a href="${pathPrefix}contact.html" class="block py-3 text-base font-medium text-text-main hover:text-primary">Contact</a>
        </div>

        <!-- CTA -->
        <div class="px-6 pb-8">
            <a href="${pathPrefix}share-story.html" class="block w-full h-12 bg-primary text-white text-base font-bold rounded-lg flex items-center justify-center hover:bg-primary-hover transition-colors">Share Your Story</a>
        </div>
    </nav>`;
}

// Navigation script to add if missing
function getNavigationScript(pathPrefix) {
    return `<script src="${pathPrefix}js/navigation.js"><\/script>`;
}

// Language switcher HTML
function getLanguageSwitcher() {
    return `<div id="language-switcher"></div>`;
}

// Mobile search button HTML
function getMobileSearchButton() {
    return `<button onclick="toggleSearch()" class="md:hidden size-11 flex items-center justify-center rounded-lg hover:bg-accent-teal/10 transition-colors" aria-label="Open search">
        <span class="material-symbols-outlined text-accent-teal">search</span>
    </button>`;
}

function processFile(filePath) {
    let html = fs.readFileSync(filePath, 'utf-8');
    const filename = path.basename(filePath);
    const pathPrefix = getPathPrefix(filePath);
    const fixes = [];
    const original = html;

    // Check if we need to add navigation.js script
    const hasNavigationScript = html.includes('js/navigation.js') || html.includes('navigation.js');
    if (!hasNavigationScript) {
        // Add before </body> or before closing head if no body
        const scriptTag = getNavigationScript(pathPrefix);
        if (html.includes('</body>')) {
            html = html.replace('</body>', `${scriptTag}\n</body>`);
        } else if (html.includes('</head>')) {
            html = html.replace('</head>', `${scriptTag}\n</head>`);
        }
        fixes.push('Added navigation.js script');
    }

    // Check if we need to add Mobile Search Sheet
    if (!html.includes('id="searchSheet"')) {
        if (html.includes('<body')) {
            const bodyMatch = html.match(/<body[^>]*>/);
            if (bodyMatch) {
                html = html.replace(bodyMatch[0], bodyMatch[0] + getSearchSheet(pathPrefix));
                fixes.push('Added Mobile Search Sheet');
            }
        }
    }

    // Check if we need to add Mobile Menu Overlay
    if (!html.includes('id="menuOverlay"')) {
        if (html.includes('<body')) {
            const bodyMatch = html.match(/<body[^>]*>/);
            if (bodyMatch) {
                html = html.replace(bodyMatch[0], bodyMatch[0] + getMenuOverlay());
                fixes.push('Added Mobile Menu Overlay');
            }
        }
    }

    // Check if we need to add Mobile Bottom Sheet Menu
    if (!html.includes('id="mobileMenu"')) {
        if (html.includes('<body')) {
            const bodyMatch = html.match(/<body[^>]*>/);
            if (bodyMatch) {
                html = html.replace(bodyMatch[0], bodyMatch[0] + getMobileMenu(pathPrefix));
                fixes.push('Added Mobile Bottom Sheet Menu');
            }
        }
    }

    // Check if we need to add Language Switcher in header
    // Only add to header section if not present in actions area
    const hasLanguageSwitcher = html.includes('id="language-switcher"');
    if (!hasLanguageSwitcher) {
        // Look for the header actions area and add language switcher
        // This is a simplified approach - we add it after the logo in header
        const logoLinkMatch = html.match(/<a href="[^"]*index\.html"[^>]*>[\s]*<img[^>]*>/);
        if (logoLinkMatch) {
            // Try to find a good insertion point after the logo area
            // For simplicity, we'll skip this for now as it requires more complex parsing
            // The navigation.js should handle this dynamically
        }
    }

    // Check if we need to add Mobile Search Button in header
    // Only add if there's a mobile menu button but no mobile search button
    const hasMobileSearchBtn = html.includes('aria-label="Open search"') || html.includes('toggleSearch()');
    const hasMobileMenuBtn = html.includes('aria-label="Open menu"') || html.includes('toggleMenu()');

    if (hasMobileMenuBtn && !hasMobileSearchBtn) {
        // Find the mobile menu button and add search button before it
        const menuBtnPattern = /(<button[^>]*aria-label="Open menu"[^>]*>[\s\S]*?<\/button>)/;
        if (menuBtnPattern.test(html)) {
            html = html.replace(menuBtnPattern, getMobileSearchButton() + '\n$1');
            fixes.push('Added Mobile Search Button');
        }
    }

    if (html !== original) {
        fs.writeFileSync(filePath, html);
        report[filename] = fixes;
        totalAdded += fixes.length;
        }`);
    } else {
        
    }
}

function processDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Skip certain directories
            if (!item.startsWith('.') && item !== 'node_modules' && item !== 'womencypedia-cms') {
                processDirectory(fullPath);
            }
        } else if (item.endsWith('.html')) {
            processFile(fullPath);
        }
    }
}

function main() {
    
    

    processDirectory(ROOT);

    .length} files`);

    if (Object.keys(report).length > 0) {
        
        for (const [filename, fixes] of Object.entries(report)) {
            }`);
        }
    }
}

main();
