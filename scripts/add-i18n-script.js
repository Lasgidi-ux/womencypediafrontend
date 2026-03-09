#!/usr/bin/env node
/**
 * Womencypedia — Add i18n.js to Collection Pages
 * 
 * Usage: node scripts/add-i18n-script.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const COLLECTIONS_DIR = path.join(ROOT, 'collections');

// Scripts to add
const scriptsToAdd = `    <script src="../js/i18n.js"><\/script>
    <script src="../js/navigation.js"><\/script>`;

const scriptsReplacement = `    <script src="../js/navigation.js"><\/script>`;

if (!fs.existsSync(COLLECTIONS_DIR)) {
    console.log('Collections directory not found');
    process.exit(0);
}

const files = fs.readdirSync(COLLECTIONS_DIR).filter(f => f.endsWith('.html'));

for (const file of files) {
    const filePath = path.join(COLLECTIONS_DIR, file);
    let html = fs.readFileSync(filePath, 'utf-8');

    // Check if it already has i18n.js
    if (html.includes('js/i18n.js')) {
        console.log(`  · ${file} — Already has i18n.js`);
        continue;
    }

    // Add i18n.js before navigation.js
    if (html.includes(scriptsReplacement)) {
        html = html.replace(scriptsReplacement, scriptsToAdd);
        fs.writeFileSync(filePath, html);
        console.log(`  ✓ ${file} — Added i18n.js`);
    } else {
        console.log(`  · ${file} — navigation.js not found at expected location`);
    }
}

console.log('\n✅ Done!');
