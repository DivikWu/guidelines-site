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
  const originalContent = content;
  
  // 1. 替换 @import 路径：@import "/fonts/icofont/icofont.css" -> @import "/guidelines-site/fonts/icofont/icofont.css"
  if (content.includes('@import') && content.includes('/fonts/icofont/')) {
    content = content.replace(
      /@import\s+["']\/fonts\/icofont\//g,
      `@import "${basePath}/fonts/icofont/`
    );
  }
  
  // 2. 替换 url() 中的字体路径：url("/fonts/ -> url("/guidelines-site/fonts/
  if (content.includes('/fonts/icofont/')) {
    // 匹配 url(/fonts/ 或 url("/fonts/ 或 url('./fonts/ 或 url("./fonts/
    content = content.replace(
      /url\((["']?)\/fonts\//g,
      `url($1${basePath}/fonts/`
    );
    // 也处理相对路径的情况（虽然现在使用相对路径，但为了兼容性保留）
    content = content.replace(
      /url\((["']?)\.\/fonts\//g,
      `url($1${basePath}/fonts/`
    );
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(cssFilePath, content, 'utf8');
    const relativePath = path.relative(outDir, cssFilePath);
    console.log(`Fixed font paths in: ${relativePath}`);
    fixedCount++;
  }
});

console.log(`Font path fix completed! Fixed ${fixedCount} files.`);
