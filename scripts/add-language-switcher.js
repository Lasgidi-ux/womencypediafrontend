#!/usr/bin/env node
/**
 * Womencypedia — Add Language Switcher to Collection Pages
 * 
 * Usage: node scripts/add-language-switcher.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const COLLECTIONS_DIR = path.join(ROOT, 'collections');

// Language switcher HTML to add
const languageSwitcher = `<a href="../collections.html"
                        class="hidden sm:block text-sm font-medium text-text-secondary hover:text-primary transition-colors">←
                        All Collections</a>
                    <div id="language-switcher"></div>
                    <!-- Mobile Search Button -->`;

const languageSwitcherReplacement = `<a href="../collections.html"
                        class="hidden sm:block text-sm font-medium text-text-secondary hover:text-primary transition-colors">←
                        All Collections</a>
                    <!-- Mobile Search Button -->`;

if (!fs.existsSync(COLLECTIONS_DIR)) {
    console.log('Collections directory not found');
    process.exit(0);
}

const files = fs.readdirSync(COLLECTIONS_DIR).filter(f => f.endsWith('.html'));

for (const file of files) {
    const filePath = path.join(COLLECTIONS_DIR, file);
    let html = fs.readFileSync(filePath, 'utf-8');

    // Check if it already has Language Switcher
    if (html.includes('id="language-switcher"')) {
        console.log(`  · ${file} — Already has Language Switcher`);
        continue;
    }

    // Add Language Switcher before Mobile Search Button
    if (html.includes('<!-- Mobile Search Button -->')) {
        html = html.replace('<!-- Mobile Search Button -->', languageSwitcher);
        fs.writeFileSync(filePath, html);
        console.log(`  ✓ ${file} — Added Language Switcher`);
    } else {
        console.log(`  · ${file} — No Mobile Search Button found`);
    }
}

console.log('\n✅ Done!');
