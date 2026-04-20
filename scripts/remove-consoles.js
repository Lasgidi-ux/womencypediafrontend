const fs = require('fs');
const path = require('path');

// Directories to process
const dirs = ['js', 'scripts', 'womencypedia-cms/src'];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir, { recursive: true }).filter(f => f.endsWith('.js'));

  files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    // Remove lines containing console statements
    fs.writeFileSync(filePath, content);
  });
});
