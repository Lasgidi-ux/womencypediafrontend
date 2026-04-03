/**
 * Womencypedia — Minify Page-Specific JS Modules
 * 
 * Minifies each page-specific JS file individually so pages can
 * load only the JS they need alongside the core bundle.
 * 
 * Input:  js/browse.js, js/donate.js, etc.
 * Output: dist/browse.min.js, dist/donate.min.js, etc.
 */

const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

// Page-specific modules (not in core bundle)
const PAGE_MODULES = [
    'js/homepage.js',
    'js/browse.js',
    'js/search.js',
    'js/donate.js',
    'js/profile.js',
    'js/comments.js',
    'js/bookmarks.js',
    'js/share.js',
    'js/timeline.js',
    'js/analytics.js',
    'js/notifications.js',
    'js/forms.js',
    'js/history.js',
    'js/data.js',
    'js/main.js'
];

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

async function minifyFile(modulePath) {
    const filePath = path.join(ROOT, modulePath);

    if (!fs.existsSync(filePath)) {
        
        return;
    }

    const code = fs.readFileSync(filePath, 'utf-8');
    const baseName = path.basename(modulePath, '.js');

    const result = await minify(code, {
        compress: { passes: 2 },
        mangle: {
            reserved: [
                'CONFIG', 'Security', 'I18N', 'UI', 'Auth', 'Navigation',
                'StrapiAPI', 'API', 'Homepage', 'Search', 'Donate',
                'Browse', 'Profile', 'Comments', 'Bookmarks',
                'toggleMenu', 'toggleSearch'
            ]
        },
        output: { comments: false }
    });

    if (result.error) {
        
        return;
    }

    const outPath = path.join(DIST, `${baseName}.min.js`);
    fs.writeFileSync(outPath, result.code);

    const originalSize = Buffer.byteLength(code, 'utf-8');
    const minifiedSize = Buffer.byteLength(result.code, 'utf-8');
    const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);

}

async function main() {
    

    // Ensure dist directory exists
    if (!fs.existsSync(DIST)) {
        fs.mkdirSync(DIST, { recursive: true });
    }

    for (const mod of PAGE_MODULES) {
        await minifyFile(mod);
    }

    
}

