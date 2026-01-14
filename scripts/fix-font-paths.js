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
  if (content.includes('@import') && content.includes('/fonts/')) {
    content = content.replace(
      /@import\s+["']\/fonts\//g,
      `@import "${basePath}/fonts/`
    );
  }
  
  // 2. 替换所有 url() 中的字体路径：url("/fonts/ -> url("/guidelines-site/fonts/
  // 这包括 icofont.css 文件本身中的路径
  if (content.includes('/fonts/')) {
    // 匹配 url(/fonts/ 或 url("/fonts/ 或 url('/fonts/
    content = content.replace(
      /url\((["']?)\/fonts\//g,
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

// 3. 兜底旧路径：复制字体到 out/fonts/iconfont/*，防止历史 CSS 请求 /fonts/iconfont/iconfont.woff2
try {
  const srcDir = path.join(outDir, 'fonts', 'icofont');
  const legacyDir = path.join(outDir, 'fonts', 'iconfont');
  if (fs.existsSync(srcDir)) {
    fs.mkdirSync(legacyDir, { recursive: true });
    ['woff2', 'woff', 'ttf', 'css'].forEach(ext => {
      const srcFile = path.join(srcDir, `icofont.${ext}`);
      const dstFile = path.join(legacyDir, `iconfont.${ext}`);
      if (fs.existsSync(srcFile)) {
        fs.copyFileSync(srcFile, dstFile);
        console.log(`Copied legacy font file: ${path.relative(outDir, dstFile)}`);
      }
    });
  }
} catch (e) {
  console.warn('Legacy font copy failed:', e);
}
