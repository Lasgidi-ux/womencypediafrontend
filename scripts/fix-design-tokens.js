/**
 * Fix Design Token Inconsistencies in Womencypedia Frontend
 * 
 * Fixes:
 * 1. theme-color meta tags: #E8A6A6 -> #D67D7D (60 files)
 * 2. pricing.html: #4DB6AC -> #2F8F86, #D4AF37 -> #B8962F
 * 3. founders.html: JavaScript color definitions
 * 4. search.html: additional #E8A6A6 occurrences
 * 5. index.html: #e8a6a6 -> #D67D7D, #888 -> #5A5454
 */

const fs = require('fs');
const path = require('path');

const rootDir = '.';

// List of all HTML files that need theme-color fix
const filesWithThemeColor = [
    '403.html', '404.html', '500.html',
    'about.html', 'accessibility.html', 'apply-verification.html',
    'biography-hypatia.html', 'biography-maria-sabina.html', 'biography.html',
    'browse-leaders.html', 'browse.html', 'careers.html',
    'collection.html', 'collections.html',
    'collections/african-queens.html', 'collections/conflict-peace.html',
    'collections/diaspora.html', 'collections/missionary-women.html',
    'community.html', 'contact.html', 'contributor-guidelines.html',
    'contributors.html', 'controlled-contributions.html', 'cookies.html',
    'donate.html', 'editorial-standards.html',
    'education-module-1.html', 'education-module-2.html', 'education-module-3.html',
    'education-module-4.html', 'education-module-5.html', 'education-module-6.html',
    'education-module-7.html', 'education-module-template.html', 'education-module.html',
    'education.html', 'enterprises.html', 'faq.html', 'featured.html',
    'fellowship.html', 'forgot-password.html', 'help.html',
    'leader-profile.html', 'login.html', 'methodology.html',
    'nominate.html', 'partners.html', 'press.html', 'pricing.html',
    'privacy-policy.html', 'profile.html', 'publications.html',
    'reports.html', 'research.html', 'resources.html', 'reset-password.html',
    'search.html', 'settings.html', 'share-story.html', 'signup.html',
    'sitemap-page.html', 'terms-of-use.html', 'timelines.html',
    'verify-email.html', 'index.html'
];

console.log('Starting design token fixes...\n');

// 1. Fix theme-color meta tags in all HTML files
console.log('1. Fixing theme-color meta tags...');
let themeColorFixed = 0;
filesWithThemeColor.forEach(file => {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        content = content.replace(/<meta name="theme-color" content="#E8A6A6">/g,
            '<meta name="theme-color" content="#D67D7D">');
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            themeColorFixed++;
            console.log(`  Fixed: ${file}`);
        }
    } else {
        console.log(`  Warning: File not found: ${file}`);
    }
});
console.log(`  Total theme-color fixes: ${themeColorFixed}\n`);

// 2. Fix pricing.html additional colors
console.log('2. Fixing pricing.html colors...');
const pricingPath = path.join(rootDir, 'pricing.html');
if (fs.existsSync(pricingPath)) {
    let content = fs.readFileSync(pricingPath, 'utf8');
    const originalContent = content;
    // Replace #4DB6AC with #2F8F86 (accent-teal)
    content = content.replace(/#4DB6AC/g, '#2F8F86');
    // Replace #D4AF37 with #B8962F (accent-gold)
    content = content.replace(/#D4AF37/g, '#B8962F');
    if (content !== originalContent) {
        fs.writeFileSync(pricingPath, content, 'utf8');
        console.log('  Fixed: pricing.html (#4DB6AC -> #2F8F86, #D4AF37 -> #B8962F)');
    }
}
console.log('');

// 3. Fix founders.html JavaScript color definitions
console.log('3. Fixing founders.html JavaScript colors...');
const foundersPath = path.join(rootDir, 'founders.html');
if (fs.existsSync(foundersPath)) {
    let content = fs.readFileSync(foundersPath, 'utf8');
    const originalContent = content;
    // Fix primary color #E8A6A6 -> #D67D7D
    content = content.replace(/#E8A6A6/g, '#D67D7D');
    // Fix accent-gold #D4AF37 -> #B8962F
    content = content.replace(/#D4AF37/g, '#B8962F');
    // Fix accent-teal #4DB6AC -> #2F8F86
    content = content.replace(/#4DB6AC/g, '#2F8F86');
    // Fix background-cream #F5F5F0 -> #FAF8F3
    content = content.replace(/#F5F5F0/g, '#FAF8F3');
    // Fix text-main #191010 -> #1A1414
    content = content.replace(/#191010/g, '#1A1414');
    // Fix text-secondary #6B6B6B -> #5A5454
    content = content.replace(/#6B6B6B/g, '#5A5454');
    if (content !== originalContent) {
        fs.writeFileSync(foundersPath, content, 'utf8');
        console.log('  Fixed: founders.html color definitions');
    }
}
console.log('');

// 4. Fix search.html additional occurrences
console.log('4. Fixing search.html colors...');
const searchPath = path.join(rootDir, 'search.html');
if (fs.existsSync(searchPath)) {
    let content = fs.readFileSync(searchPath, 'utf8');
    const originalContent = content;
    // Fix any remaining #E8A6A6
    content = content.replace(/#E8A6A6/g, '#D67D7D');
    if (content !== originalContent) {
        fs.writeFileSync(searchPath, content, 'utf8');
        console.log('  Fixed: search.html (#E8A6A6 -> #D67D7D)');
    }
}
console.log('');

// 5. Fix index.html colors
console.log('5. Fixing index.html colors...');
const indexPath = path.join(rootDir, 'index.html');
if (fs.existsSync(indexPath)) {
    let content = fs.readFileSync(indexPath, 'utf8');
    const originalContent = content;
    // Fix #e8a6a6 (lowercase) -> #D67D7D
    content = content.replace(/#e8a6a6/g, '#D67D7D');
    // Fix #888 -> #5A5454 (text-secondary)
    content = content.replace(/#888(?![0-9A-Fa-f])/g, '#5A5454');
    if (content !== originalContent) {
        fs.writeFileSync(indexPath, content, 'utf8');
        console.log('  Fixed: index.html (#e8a6a6 -> #D67D7D, #888 -> #5A5454)');
    }
}
console.log('');

// Also check for any other HTML files that might have the old colors
console.log('6. Scanning for any remaining incorrect colors...');
const allFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));
let remainingIssues = 0;
allFiles.forEach(file => {
    const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
    if (content.includes('#E8A6A6') || content.includes('#e8a6a6')) {
        console.log(`  Warning: ${file} still has #E8A6A6`);
        remainingIssues++;
    }
    if (content.includes('#4DB6AC')) {
        console.log(`  Warning: ${file} still has #4DB6AC`);
        remainingIssues++;
    }
    if (content.includes('#D4AF37')) {
        console.log(`  Warning: ${file} still has #D4AF37`);
        remainingIssues++;
    }
});
if (remainingIssues === 0) {
    console.log('  No remaining issues found!');
}
console.log('');

console.log('Design token fixes complete!');
