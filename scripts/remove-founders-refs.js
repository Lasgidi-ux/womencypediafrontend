/**
 * Remove Founders Page References — Womencypedia Site Cleanup
 * 
 * This script removes ALL references to founders.html from:
 * - HTML files (nav links, mobile menu links, footer links, sitemap links)
 * - JS files (navigation.js mobile menu template)
 * 
 * Run: node scripts/remove-founders-refs.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const RESULTS = { filesModified: 0, referencesRemoved: 0 };

/**
 * Get all HTML and JS files in root directory
 */
function getTargetFiles() {
    const files = [];
    const entries = fs.readdirSync(ROOT);

    for (const entry of entries) {
        const fullPath = path.join(ROOT, entry);
        const stat = fs.statSync(fullPath);

        if (stat.isFile() && (entry.endsWith('.html') || entry === 'sitemap.xml')) {
            files.push(fullPath);
        }
    }

    // Also include js/navigation.js
    const navJs = path.join(ROOT, 'js', 'navigation.js');
    if (fs.existsSync(navJs)) {
        files.push(navJs);
    }

    return files;
}

/**
 * Remove founders.html link lines from file content
 * Handles multiple patterns:
 * 1. <a href="founders.html" ...>Founders</a> (single or multi-line)
 * 2. <li><a href="founders.html" ...>Founders</a></li>
 * 3. Navigation mobile menu template literals with founders.html
 */
function removeFoundersReferences(content, filePath) {
    const original = content;
    let modified = content;

    // Pattern 1: Multi-line <a> blocks linking to founders.html (with surrounding whitespace)
    // Matches: <a href="founders.html" class="...">Founders</a> (possibly multi-line)
    modified = modified.replace(
        /\s*<a\s+[^>]*href=["'](?:\.\.\/)?founders\.html["'][^>]*>[\s\S]*?<\/a>\s*/gi,
        '\n'
    );

    // Pattern 2: <li> wrapping a founders link
    modified = modified.replace(
        /\s*<li>\s*<a\s+[^>]*href=["'](?:\.\.\/)?founders\.html["'][^>]*>[\s\S]*?<\/a>\s*<\/li>\s*/gi,
        '\n'
    );

    // Pattern 3: Template literal lines in JS files (navigation.js)
    // e.g., `<a href="${pathPrefix}founders.html" ...>Founders</a>`
    modified = modified.replace(
        /\s*<a\s+href=["']\$\{pathPrefix\}founders\.html["'][^>]*>[\s\S]*?<\/a>\s*/gi,
        '\n'
    );

    // Pattern 4: Standalone text references to founders.html in href attributes
    // (catch any remaining patterns)
    modified = modified.replace(
        /\s*<a\s+[^>]*href\s*=\s*["'][^"']*founders\.html[^"']*["'][^>]*>[\s\S]*?<\/a>\s*/gi,
        '\n'
    );

    // Clean up any resulting double blank lines
    modified = modified.replace(/\n{3,}/g, '\n\n');

    const count = (original.match(/founders\.html/gi) || []).length - (modified.match(/founders\.html/gi) || []).length;

    return { modified, count };
}

// Main execution


const files = getTargetFiles();


for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf-8');

    if (!content.includes('founders.html')) {
        continue;
    }

    const { modified, count } = removeFoundersReferences(content, filePath);

    if (count > 0) {
        fs.writeFileSync(filePath, modified, 'utf-8');
        const relativePath = path.relative(ROOT, filePath);
        `);
        RESULTS.filesModified++;
        RESULTS.referencesRemoved += count;
    } else {
        // Check if there are still references we couldn't remove
        const remaining = (modified.match(/founders\.html/gi) || []).length;
        if (remaining > 0) {
            const relativePath = path.relative(ROOT, filePath);
             remain (complex pattern)`);
        }
    }
}





