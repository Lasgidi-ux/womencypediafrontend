/**
 * Womencypedia JS Bundle Script
 * 
 * Concatenates the core JS modules into a single bundle (dist/core.min.js).
 * Pages can load this ONE file instead of 6 separate <script> tags.
 * 
 * Core bundle includes (in dependency order):
 *   1. config.js    — Configuration & API endpoints
 *   2. security.js  — XSS protection & sanitization
 *   3. i18n.js      — Internationalization
 *   4. ui.js        — UI utilities (toasts, loading, cards)
 *   5. auth.js      — Authentication (Strapi JWT)
 *   6. navigation.js— Mobile/desktop navigation
 * 
 * Usage: Replace multiple <script> tags with:
 *   <script src="dist/core.min.js"></script>
 */

const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

// Core modules in dependency order
const CORE_MODULES = [
    'js/config.js',
    'js/security.js',
    'js/i18n.js',
    'js/ui.js',
    'js/auth.js',
    'js/navigation.js'
];

// API modules (loaded by pages that need data fetching)
const API_MODULES = [
    'js/strapi-api.js',
    'js/api.js'
];

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

async function bundle(modules, outputName) {
    // Ensure dist directory exists
    if (!fs.existsSync(DIST)) {
        fs.mkdirSync(DIST, { recursive: true });
    }

    // Read and concatenate all modules
    let combined = '';
    for (const mod of modules) {
        const filePath = path.join(ROOT, mod);
        if (!fs.existsSync(filePath)) {
            
            continue;
        }
        const content = fs.readFileSync(filePath, 'utf-8');
        combined += `\n/* === ${mod} === */\n${content}\n`;
    }

    // Minify
    const result = await minify(combined, {
        compress: {
            passes: 2
        },
        mangle: {
            reserved: [
                // Preserve global names that pages reference
                'CONFIG', 'Security', 'I18N', 'UI', 'Auth', 'Navigation',
                'StrapiAPI', 'API', 'Homepage', 'Search', 'Donate',
                'Browse', 'Profile', 'Comments', 'Bookmarks',
                'toggleMenu', 'toggleSearch'
            ]
        },
        output: {
            comments: false
        }
    });

    if (result.error) {
        
        return;
    }

    const minPath = path.join(DIST, outputName);
    fs.writeFileSync(minPath, result.code);

    const originalSize = Buffer.byteLength(combined, 'utf-8');
    const minifiedSize = Buffer.byteLength(result.code, 'utf-8');
    const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);

}

async function main() {
    

    await bundle(CORE_MODULES, 'core.min.js');
    await bundle(API_MODULES, 'api.min.js');
    await bundle([...CORE_MODULES, ...API_MODULES], 'app.min.js');

    
    
    
    
    
    
}

