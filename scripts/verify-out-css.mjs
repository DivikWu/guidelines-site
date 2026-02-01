/**
 * 构建后检查：确认 out/_next/static 下存在 CSS 文件，避免部署后无样式。
 * 在 npm run build 中于 fix-font-paths.js 之后执行。
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'out');
const staticDir = path.join(outDir, '_next', 'static');

function findCssFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'ENOENT' || err.code === 'EPERM') {
      console.warn(`Skipping directory: ${dir}`);
      return fileList;
    }
    throw err;
  }
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      findCssFiles(full, fileList);
    } else if (ent.isFile() && ent.name.endsWith('.css')) {
      fileList.push(path.relative(outDir, full));
    }
  }
  return fileList;
}

if (!fs.existsSync(outDir)) {
  console.log('verify-out-css: out/ not present (e.g. non-export build), skipping');
  process.exit(0);
}
if (!fs.existsSync(staticDir)) {
  console.error('verify-out-css: out/_next/static missing. Deployment may have no styles.');
  process.exit(1);
}

const cssFiles = findCssFiles(staticDir);
if (cssFiles.length === 0) {
  console.error(
    'verify-out-css: No CSS files found under out/_next/static. Deployment may have no styles.'
  );
  process.exit(1);
}
console.log(`verify-out-css: Found ${cssFiles.length} CSS file(s) under out/_next/static`);
