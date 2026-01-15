const fs = require('fs');
const path = require('path');

const basePath = '/guidelines-site';
const outDir = path.join(__dirname, '../out');

// 递归查找所有文件（CSS 或 HTML）
function findFiles(dir, extensions, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findFiles(filePath, extensions, fileList);
    } else if (extensions.some(ext => file.endsWith(ext))) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

// 递归查找所有 CSS 文件
function findCssFiles(dir, fileList = []) {
  return findFiles(dir, ['.css'], fileList);
}

// 递归查找所有 HTML 文件
function findHtmlFiles(dir, fileList = []) {
  return findFiles(dir, ['.html'], fileList);
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
  
  // 2. 替换所有 url() 中的字体路径
  // 2a. 绝对路径：url("/fonts/ -> url("/guidelines-site/fonts/
  if (content.includes('/fonts/')) {
    // 匹配 url(/fonts/ 或 url("/fonts/ 或 url('/fonts/
    content = content.replace(
      /url\((["']?)\/fonts\//g,
      `url($1${basePath}/fonts/`
    );
  }
  
  // 2b. 相对路径：url("./icofont.woff2") -> url("/guidelines-site/fonts/icofont/icofont.woff2")
  // 这确保即使 CSS 文件被内联或路径解析有问题时也能工作
  if (content.includes('url("./icofont.') || content.includes("url('./icofont.")) {
    content = content.replace(
      /url\((["']?)\.\/icofont\.(woff2|woff|ttf)/g,
      `url($1${basePath}/fonts/icofont/icofont.$2`
    );
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(cssFilePath, content, 'utf8');
    const relativePath = path.relative(outDir, cssFilePath);
    console.log(`Fixed font paths in: ${relativePath}`);
    fixedCount++;
  }
});

console.log(`Font path fix completed! Fixed ${fixedCount} CSS files.`);

// 2. 修复 HTML 文件中的字体路径
const htmlFiles = findHtmlFiles(outDir);
console.log(`Found ${htmlFiles.length} HTML files`);

let fixedHtmlCount = 0;
htmlFiles.forEach(htmlFilePath => {
  let content = fs.readFileSync(htmlFilePath, 'utf8');
  const originalContent = content;
  
  // 替换 HTML 中的字体路径：
  // - href="/fonts/icofont/ -> href="/guidelines-site/fonts/icofont/
  // - 匹配各种引号情况
  if (content.includes('/fonts/icofont/')) {
    // 匹配 href="/fonts/ 或 href='/fonts/ 或 href=/fonts/
    content = content.replace(
      /href=(["']?)\/fonts\/icofont\//g,
      `href=$1${basePath}/fonts/icofont/`
    );
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(htmlFilePath, content, 'utf8');
    const relativePath = path.relative(outDir, htmlFilePath);
    console.log(`Fixed font paths in HTML: ${relativePath}`);
    fixedHtmlCount++;
  }
});

console.log(`HTML path fix completed! Fixed ${fixedHtmlCount} HTML files.`);

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
