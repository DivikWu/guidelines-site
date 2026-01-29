import fs from "node:fs";
import path from "node:path";
import { getContentRoot, DEFAULT_CONTENT_DIR } from "./constants";

const DOCS_SUBDIR = "docs";

/** 与 URL/doc id 一致：去掉 .md、emoji/符号、空格，供 tree 与 nav-index 共用 */
export function normalizeDocId(name: string): string {
  const raw = name.replace(/\.md$/i, "").trim();
  const slug = raw.replace(/[\p{So}\p{Sk}]/gu, "").replace(/\s+/g, "").trim();
  return slug || raw;
}

/** Section id → list of doc items (file id and relative path) */
export interface ContentSection {
  id: string;
  label: string;
  items: { id: string; path: string; label: string }[];
}

export interface ContentTree {
  sections: ContentSection[];
}

/**
 * List content directory tree from content/docs/: top-level dirs under docs/
 * and their .md files. Paths are relative to content root (e.g. docs/A_快速开始/xxx.md).
 * @param contentRoot 若传入则使用该目录，否则用 getContentRoot()（会受 YDS_CONTENT_DIR 影响）
 */
export function getContentTree(contentRoot?: string): ContentTree {
  const contentRootResolved = contentRoot ?? getContentRoot();
  const root = path.join(contentRootResolved, DOCS_SUBDIR);
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    return { sections: [] };
  }

  const dirs = fs
    .readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const sections: ContentSection[] = [];

  /** 目录名若含 "_" 则 label 只取下划线之后的部分，否则用原名 */
  const sectionLabel = (dirName: string) =>
    dirName.includes("_") ? dirName.slice(dirName.indexOf("_") + 1) : dirName;

  const slugFromFileName = (fileName: string): string => normalizeDocId(fileName);

  for (const dir of dirs) {
    const sectionPath = path.join(root, dir);
    const entries = fs.readdirSync(sectionPath, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile() && e.name.endsWith(".md"))
      .map((f) => f.name)
      .sort();

    const items = files.map((fileName) => {
      const rawName = fileName.replace(/\.md$/, "");
      const id = slugFromFileName(fileName);
      /** 展示用 label 取自原始文件名（含 emoji），仅显示 "_" 之后的部分 */
      const itemLabel = sectionLabel(rawName);
      return {
        id,
        path: `${DOCS_SUBDIR}/${dir}/${fileName}`,
        label: itemLabel,
      };
    });

    sections.push({
      id: dir,
      label: sectionLabel(dir),
      items,
    });
  }

  return { sections };
}
