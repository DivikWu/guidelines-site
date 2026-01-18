import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const targetRoots = ["docs", "tokens"].map((dir) => path.join(repoRoot, dir));
const markdownFiles = [];
const errors = [];

const linkPattern = /!?\[[^\]]*?\]\(([^)]+)\)/g;
const skipSchemes = ["http://", "https://", "mailto:", "tel:", "javascript:", "data:"];

const walkDir = (dir) => {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
      continue;
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      markdownFiles.push(fullPath);
    }
  }
};

const normalizeLink = (rawLink) => {
  const trimmed = rawLink.trim().replace(/^<|>$/g, "");
  if (!trimmed || trimmed.startsWith("#")) return null;
  if (trimmed.startsWith("//")) return null;
  if (skipSchemes.some((scheme) => trimmed.startsWith(scheme))) return null;
  const withoutHash = trimmed.split("#")[0].split("?")[0];
  if (!withoutHash) return null;
  let decoded = withoutHash;
  try {
    decoded = decodeURI(withoutHash);
  } catch (error) {
    decoded = withoutHash;
  }
  return decoded;
};

for (const root of targetRoots) {
  walkDir(root);
}

for (const filePath of markdownFiles) {
  const content = fs.readFileSync(filePath, "utf8");
  let match;
  while ((match = linkPattern.exec(content)) !== null) {
    const normalized = normalizeLink(match[1]);
    if (!normalized) continue;

    const resolvedPath = normalized.startsWith("/")
      ? path.resolve(repoRoot, normalized.slice(1))
      : path.resolve(path.dirname(filePath), normalized);

    if (!fs.existsSync(resolvedPath)) {
      const displayPath = path.relative(repoRoot, filePath);
      errors.push(`链接不存在：${displayPath} -> ${match[1]}`);
    }
  }
}

if (errors.length > 0) {
  console.error("文档链接检查失败：");
  errors.forEach((message) => console.error(message));
  process.exit(1);
}

console.log("文档链接检查通过：未发现失效链接。");
