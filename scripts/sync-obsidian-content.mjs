/**
 * 将 Obsidian 库内容同步到项目 content/docs/ 目录（仅 .md/.mdx 与图片）。
 * content/_rules 等非 docs 内容不会被清理。用于 build / CI；本地 dev 可通过 YDS_CONTENT_DIR 直接读 Obsidian。
 *
 * 使用：npm run sync:content（会读取 .env.local 中的 YDS_CONTENT_DIR）
 * 或：YDS_CONTENT_DIR=/path/to/vault npm run sync:content
 */

import fs from "node:fs";
import path from "node:path";

function loadEnvLocal(cwd) {
  const file = path.join(cwd, ".env.local");
  if (!fs.existsSync(file)) return;
  const raw = fs.readFileSync(file, "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*YDS_CONTENT_DIR\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+))/);
    if (m) process.env.YDS_CONTENT_DIR = (m[1] ?? m[2] ?? m[3] ?? "").trim();
  }
}

loadEnvLocal(process.cwd());

/** 清空 content/ 时保留的文件（相对于 content/，不删） */
const PROTECTED_RELATIVE_PATHS = [];

const ALLOWED_EXT = new Set([
  ".md",
  ".mdx",
  ".png",
  ".jpg",
  ".jpeg",
  ".svg",
  ".webp",
]);

const IGNORE_DIRS = new Set([".obsidian", ".trash"]);
const IGNORE_FILES = new Set([".DS_Store"]);

function shouldIgnoreFile(name) {
  if (IGNORE_FILES.has(name)) return true;
  if (name.endsWith(".tmp")) return true;
  return false;
}

function clearDestExceptRules(destRoot, relDir = "") {
  const currentDir = path.join(destRoot, relDir);
  if (!fs.existsSync(currentDir)) return;
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });
  for (const entry of entries) {
    const relPath = relDir ? path.join(relDir, entry.name) : entry.name;
    const normalizedRel = relPath.replace(/\\/g, "/");
    if (PROTECTED_RELATIVE_PATHS.includes(normalizedRel)) continue;
    const full = path.join(destRoot, relPath);
    if (entry.isDirectory()) {
      clearDestExceptRules(destRoot, relPath);
      if (fs.readdirSync(full).length === 0) {
        fs.rmdirSync(full);
      }
    } else {
      fs.unlinkSync(full);
    }
  }
}

function logProtectedStatus(destRoot) {
  for (const p of PROTECTED_RELATIVE_PATHS) {
    const full = path.join(destRoot, p);
    if (fs.existsSync(full) && fs.statSync(full).isFile()) {
      console.log("preserve: content/" + p);
    } else {
      console.warn(
        `protected file missing: content/${p}（需手工准备或由后续映射生成）`
      );
    }
  }
}

function applyMapping(destRoot) {
  const mappingPath = path.join(process.cwd(), "scripts/content-mapping.json");
  const mapping = JSON.parse(fs.readFileSync(mappingPath, "utf-8"));
  for (const [fromRel, toRel] of Object.entries(mapping)) {
    const fromPath = path.join(destRoot, fromRel);
    const toPath = path.join(destRoot, toRel);
    if (fs.existsSync(fromPath)) {
      fs.mkdirSync(path.dirname(toPath), { recursive: true });
      fs.copyFileSync(fromPath, toPath);
      console.log(`map: ${fromRel} -> ${toRel}`);
    } else {
      console.warn(`map-missing: ${fromRel} (skip)`);
    }
  }
}

function copyRecursive(srcRoot, destRoot, relDir = "") {
  const srcDir = path.join(srcRoot, relDir);
  if (!fs.existsSync(srcDir)) return;
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const relPath = relDir ? path.join(relDir, entry.name) : entry.name;

    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      const destSub = path.join(destRoot, relPath);
      if (!fs.existsSync(destSub)) {
        fs.mkdirSync(destSub, { recursive: true });
      }
      copyRecursive(srcRoot, destRoot, relPath);
    } else {
      if (shouldIgnoreFile(entry.name)) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (!ALLOWED_EXT.has(ext)) continue;
      const srcFile = path.join(srcRoot, relPath);
      const destFile = path.join(destRoot, relPath);
      const destDir = path.dirname(destFile);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      fs.copyFileSync(srcFile, destFile);
    }
  }
}

const repoRoot = process.cwd();
const srcDir = process.env.YDS_CONTENT_DIR;
const destRoot = path.join(repoRoot, "content");

if (!srcDir || !srcDir.trim()) {
  console.log("YDS_CONTENT_DIR 未配置，跳过同步。content/ 保留现有骨架。");
  process.exit(0);
}

if (!fs.existsSync(srcDir)) {
  console.error(`YDS_CONTENT_DIR 路径不存在: ${srcDir}`);
  process.exit(1);
}

const docsSubdir = "docs";
const destDocsRoot = path.join(destRoot, docsSubdir);
console.log(`同步: ${srcDir} → ${destDocsRoot}`);
clearDestExceptRules(destRoot, docsSubdir);
// 从原库根目录复制到 content/docs/（原库根下的 A_快速开始 等 → content/docs/A_快速开始 等）
copyRecursive(srcDir, destDocsRoot, "");
applyMapping(destRoot);
logProtectedStatus(destRoot);
console.log("sync:content 完成。");
console.log("本地 dev 会按 content/ 动态渲染文档，一般无需重启；若未看到新文档可重启 dev server。");