/**
 * Script to add update-emails.js to all HTML pages
 * 
 * This script adds the update-emails.js script to all HTML files
 * to ensure email addresses are dynamically updated.
 * 
 * Usage:
 * node scripts/add-email-update-to-all-pages.js
 */

const fs = require('fs');
const path = require('path');

// Get all HTML files in the project
function getHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Skip node_modules, .git, and other non-content directories
            if (!['node_modules', '.git', 'tmp', 'scripts'].includes(file)) {
                getHtmlFiles(filePath, fileList);
            }
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

// Add update-emails.js to HTML file
function addEmailUpdateScript(htmlFilePath) {
    try {
        let content = fs.readFileSync(htmlFilePath, 'utf8');

        // Check if update-emails.js is already included
        if (content.includes('js/update-emails.js')) {
            
            return false;
        }

        // Find the closing </body> tag
        const bodyCloseIndex = content.lastIndexOf('</body>');
        if (bodyCloseIndex === -1) {
            
            return false;
        }

        // Check if env-config.js is included
        const hasEnvConfig = content.includes('js/env-config.js');
        const hasConfig = content.includes('js/config.js');

        // Build script tags to add
        let scriptsToAdd = '';

        if (!hasEnvConfig) {
            scriptsToAdd += '    <script src="js/env-config.js"></script>\n';
        }

        if (!hasConfig) {
            scriptsToAdd += '    <script src="js/config.js"></script>\n';
        }

        scriptsToAdd += '    <script src="js/update-emails.js"></script>\n';

        // Insert scripts before </body>
        const newContent = content.slice(0, bodyCloseIndex) +
            scriptsToAdd +
            content.slice(bodyCloseIndex);

        // Write updated content
        fs.writeFileSync(htmlFilePath, newContent, 'utf8');
        
        return true;
    } catch (error) {
        
        return false;
    }
}

// Main execution


const htmlFiles = getHtmlFiles('.');


let updatedCount = 0;
let skippedCount = 0;

htmlFiles.forEach(file => {
    const updated = addEmailUpdateScript(file);
    if (updated) {
        updatedCount++;
    } else {
        skippedCount++;
    }
});






