#!/usr/bin/env node
/**
 * Womencypedia — Add Mobile Search Button to Collection Pages
 * 
 * Usage: node scripts/add-mobile-search-button.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const COLLECTIONS_DIR = path.join(ROOT, 'collections');

const mobileSearchButton = `<!-- Mobile Search Button -->
                    <button onclick="toggleSearch()"
                        class="md:hidden size-11 flex items-center justify-center rounded-lg hover:bg-accent-teal/10 transition-colors"
                        aria-label="Open search">
                        <span class="material-symbols-outlined text-accent-teal">search</span>
                    </button>

                    <!-- Mobile Menu Button -->`;

const mobileSearchButtonReplacement = `<!-- Mobile Menu Button -->`;

if (!fs.existsSync(COLLECTIONS_DIR)) {
    
    process.exit(0);
}

const files = fs.readdirSync(COLLECTIONS_DIR).filter(f => f.endsWith('.html'));

for (const file of files) {
    const filePath = path.join(COLLECTIONS_DIR, file);
    let html = fs.readFileSync(filePath, 'utf-8');

    // Check if it already has Mobile Search Button
    if (html.includes('aria-label="Open search"')) {
        
        continue;
    }

    // Check if it has Mobile Menu Button
    if (html.includes('<!-- Mobile Menu Button -->')) {
        html = html.replace(mobileSearchButtonReplacement, mobileSearchButton);
        fs.writeFileSync(filePath, html);
        
    } else {
        
    }
}


