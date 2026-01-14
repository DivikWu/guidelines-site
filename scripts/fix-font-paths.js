const fs = require('fs');
const path = require('path');

const basePath = '/guidelines-site';
const outDir = path.join(__dirname, '../out');

// 递归查找所有 CSS 文件
function findCssFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findCssFiles(filePath, fileList);
    } else if (file.endsWith('.css')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const cssFiles = findCssFiles(outDir);
console.log(`Found ${cssFiles.length} CSS files`);

let fixedCount = 0;
cssFiles.forEach(cssFilePath => {
  let content = fs.readFileSync(cssFilePath, 'utf8');
  
  // 检查是否包含字体路径
  if (content.includes('/fonts/icofont/')) {
    // 替换字体路径：/fonts/ -> /guidelines-site/fonts/
    const originalContent = content;
    // 匹配 url(/fonts/ 或 url("/fonts/ 或 url('/fonts/
    content = content.replace(
      /url\((["']?)\/fonts\//g,
      `url($1${basePath}/fonts/`
    );
    
    if (content !== originalContent) {
      fs.writeFileSync(cssFilePath, content, 'utf8');
      const relativePath = path.relative(outDir, cssFilePath);
      console.log(`Fixed font paths in: ${relativePath}`);
      fixedCount++;
    }
  }
});

console.log(`Font path fix completed! Fixed ${fixedCount} files.`);
