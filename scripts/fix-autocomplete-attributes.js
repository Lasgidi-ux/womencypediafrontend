#!/usr/bin/env node
/**
 * Womencypedia — Fix Missing Autocomplete Attributes
 *
 * This script adds missing autocomplete="current-password" attributes
 * to all password input fields across HTML files.
 *
 * Usage: node scripts/fix-autocomplete-attributes.js
 */

const fs = require('fs');
const path = require('path');

const htmlFiles = [
    'nominate.html', 'publications.html', 'research.html', 'browse.html',
    'biography.html', 'index.html', 'resources.html', 'enterprises.html',
    'education.html', 'featured.html', 'collections.html', 'timelines.html',
    'share-story.html', 'pricing.html', 'methodology.html',
    'editorial-standards.html', 'donate.html', 'contributors.html',
    'contributor-guidelines.html', 'contact.html',
    'biography-maria-sabina.html', 'biography-hypatia.html', 'about.html'
];

function fixAutocomplete(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Pattern to match password inputs missing autocomplete
        const passwordPattern = /(<input\s+type="password"\s+id="login-password"\s+name="password"\s+required\s+placeholder="••••••••"\s*class="[^"]*")/g;

        // Replace with autocomplete attribute added
        content = content.replace(passwordPattern, '$1 autocomplete="current-password"');

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed ${filePath}`);
    } catch (error) {
        console.error(`❌ Error fixing ${filePath}:`, error.message);
    }
}

console.log('🔧 Fixing autocomplete attributes in HTML files...\n');

htmlFiles.forEach(fileName => {
    const filePath = path.join(__dirname, '..', fileName);
    if (fs.existsSync(filePath)) {
        fixAutocomplete(filePath);
    } else {
        console.log(`⚠️  File not found: ${fileName}`);
    }
});

console.log('\n🎉 Autocomplete attribute fixes completed!');</content>
<parameter name="filePath">scripts/fix-autocomplete-attributes.js