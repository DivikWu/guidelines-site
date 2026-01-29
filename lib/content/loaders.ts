import fs from "node:fs";
import path from "node:path";
import { getContentRoot, LOCAL_CONTENT_DIR } from "./constants";

const MAPPING_PATH = path.join(process.cwd(), "scripts/content-mapping.json");

/** 去掉 front matter（--- 之间的文档标签），只返回正文供渲染 */
function stripFrontMatter(raw: string): string {
  const match = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
  return match ? raw.slice(match[0].length).trimStart() : raw;
}

/** 从 front matter 块解析出 category、status、last_updated、title、description */
function parseFrontmatterFields(block: string): {
  category?: string;
  status?: string;
  last_updated?: string;
  title?: string;
  description?: string;
} {
  const out: Record<string, string> = {};
  const keys = ["category", "status", "last_updated", "title", "description"];
  for (const line of block.split(/\r?\n/)) {
    const m = line.match(/^\s*([a-z_]+)\s*:\s*(.+)$/i);
    if (m && keys.includes(m[1].toLowerCase())) {
      out[m[1].toLowerCase()] = m[2].trim();
    }
  }
  return out as {
    category?: string;
    status?: string;
    last_updated?: string;
    title?: string;
    description?: string;
  };
}

/** 根据 canonical 路径从 content-mapping 反查 Obsidian 源路径 */
function getSourcePathForCanonical(canonicalPath: string): string | null {
  if (!fs.existsSync(MAPPING_PATH)) return null;
  const normalized = canonicalPath.replace(/\\/g, "/");
  const mapping: Record<string, string> = JSON.parse(
    fs.readFileSync(MAPPING_PATH, "utf-8")
  );
  for (const [source, canonical] of Object.entries(mapping)) {
    if (canonical.replace(/\\/g, "/") === normalized) return source;
  }
  return null;
}

/**
 * 从 content 根目录按相对路径读取一个 md 文件，返回正文；不存在或非文件则返回 null。
 * @param relativePath 相对路径，如 "01_快速开始/1. 介绍.md"
 * @param contentRoot 可选，指定内容根目录；不传则用 getContentRoot()（会受 YDS_CONTENT_DIR 影响）
 * 当根目录为 Obsidian 且 canonical 路径不存在时，会按 content-mapping 反查源路径再读（保证 dev 与 content/ 一致）。
 */
export function getMarkdownByRelativePath(
  relativePath: string,
  contentRoot?: string
): string | null {
  const root = contentRoot ?? getContentRoot();
  const fullPath = path.join(root, relativePath);
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    return stripFrontMatter(fs.readFileSync(fullPath, "utf-8"));
  }
  // 根目录为 Obsidian 时，canonical 文件可能不存在（只有 sync 后的项目 content 才有），按 mapping 读源路径
  if (LOCAL_CONTENT_DIR && root === LOCAL_CONTENT_DIR) {
    const sourcePath = getSourcePathForCanonical(relativePath);
    if (sourcePath) {
      const sourceFull = path.join(root, sourcePath);
      if (fs.existsSync(sourceFull) && fs.statSync(sourceFull).isFile()) {
        return stripFrontMatter(fs.readFileSync(sourceFull, "utf-8"));
      }
    }
  }
  return null;
}

/** 规范文档 front matter 字段，用于文档页与最近更新卡片展示 */
export type DocFrontmatter = {
  category?: string;
  status?: string;
  last_updated?: string;
  title?: string;
  description?: string;
};

/**
 * 从 content 根目录按相对路径读取 md 的 front matter，返回 category、status、last_updated。
 * 不存在或无法解析时返回空对象。
 */
/**
 * 从文档 frontmatter 取 title、description；仅用 frontmatter，缺失则为空。
 * @returns title（缺失时 ""）、description（缺失时 null）
 */
export function getDocTitleAndDescription(
  relativePath: string,
  contentRoot?: string
): { title: string; description: string | null } {
  const root = contentRoot ?? getContentRoot();
  let raw: string | undefined;
  const fullPath = path.join(root, relativePath);
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    raw = fs.readFileSync(fullPath, "utf-8");
  } else if (LOCAL_CONTENT_DIR && root === LOCAL_CONTENT_DIR) {
    const sourcePath = getSourcePathForCanonical(relativePath);
    if (sourcePath) {
      const sourceFull = path.join(root, sourcePath);
      if (fs.existsSync(sourceFull) && fs.statSync(sourceFull).isFile()) {
        raw = fs.readFileSync(sourceFull, "utf-8");
      }
    }
  }
  if (!raw) return { title: "", description: null };

  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const fm = fmMatch ? parseFrontmatterFields(fmMatch[1]) : {};
  const t = fm.title?.trim();
  const d = fm.description?.trim();
  return {
    title: t !== undefined && t !== "" ? t : "",
    description: d !== undefined && d !== "" ? d : null,
  };
}

export function getDocFrontmatter(
  relativePath: string,
  contentRoot?: string
): DocFrontmatter {
  const root = contentRoot ?? getContentRoot();
  let raw: string | undefined;
  const fullPath = path.join(root, relativePath);
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    raw = fs.readFileSync(fullPath, "utf-8");
  } else if (LOCAL_CONTENT_DIR && root === LOCAL_CONTENT_DIR) {
    const sourcePath = getSourcePathForCanonical(relativePath);
    if (sourcePath) {
      const sourceFull = path.join(root, sourcePath);
      if (fs.existsSync(sourceFull) && fs.statSync(sourceFull).isFile()) {
        raw = fs.readFileSync(sourceFull, "utf-8");
      }
    }
  }
  if (!raw) return {};
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  return parseFrontmatterFields(match[1]);
}
