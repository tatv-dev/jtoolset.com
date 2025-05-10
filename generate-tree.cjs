const fs = require('fs');
const path = require('path');

const EXCLUDED_DIRS = ['node_modules', '.git', 'dist', 'build', 'coverage'];
const output = [];

function generateTree(dir, prefix = '', isLast = true, level = 0) {
    const dirName = path.basename(dir);
    
    if (level === 0) {
        output.push(dirName + '/');
    }
    
    let files;
    try {
        files = fs.readdirSync(dir);
    } catch (err) {
        return;
    }
    
    // Filter out excluded directories
    files = files.filter(file => {
        const fullPath = path.join(dir, file);
        const isDirectory = fs.statSync(fullPath).isDirectory();
        return !(isDirectory && EXCLUDED_DIRS.includes(file));
    });
    
    files.forEach((file, index) => {
        const filePath = path.join(dir, file);
        const isDirectory = fs.statSync(filePath).isDirectory();
        const isLastItem = index === files.length - 1;
        
        // Generate tree characters
        const connector = isLastItem ? '└── ' : '├── ';
        const extension = isDirectory ? '/' : '';
        
        output.push(prefix + connector + file + extension);
        
        if (isDirectory && level < 3) { // Limit depth to 3
            const newPrefix = prefix + (isLastItem ? '    ' : '│   ');
            generateTree(filePath, newPrefix, isLastItem, level + 1);
        }
    });
}

// Generate tree structure
generateTree('./src');

// Write to file
fs.writeFileSync('project-structure.txt', output.join('\n'), 'utf8');
console.log('Project structure has been saved to project-structure.txt');