import fs from "node:fs";
import path from "node:path";
import { getContentRoot, DEFAULT_CONTENT_DIR } from "./constants";
import { getContentTree, normalizeDocId } from "./tree";

const DOCS_SUBDIR = "docs";

/** 导航索引文件名（content/docs 下），含 emoji */
const NAV_INDEX_FILENAME = "00_📚内容索引.md";

const QUICK_START_ICONS = [
  "ds-icon-asterisk",
  "ds-icon-brandfetch",
  "ds-icon-paint-board",
  "ds-icon-web-design-01",
  "ds-icon-book-02",
  "ds-icon-test-tube-01",
] as const;

const QUICK_START_IDS = [
  "getting-started",
  "brand",
  "foundations",
  "components",
  "content",
  "resources",
] as const;

export interface QuickStartCard {
  id: string;
  title: string;
  description: string;
  href: string;
  iconName: string;
}

function stripFrontMatter(raw: string): string {
  const match = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
  return match ? raw.slice(match[0].length).trimStart() : raw;
}

/** 从 content/docs 下找到 00_*内容索引.md */
function findNavIndexPath(contentRoot: string): string | null {
  const docsDir = path.join(contentRoot, DOCS_SUBDIR);
  if (!fs.existsSync(docsDir) || !fs.statSync(docsDir).isDirectory()) return null;
  const files = fs.readdirSync(docsDir);
  const found = files.find((f) => /^00_.*内容索引\.md$/i.test(f));
  if (found) return path.join(docsDir, found);
  const fallback = path.join(docsDir, NAV_INDEX_FILENAME);
  return fs.existsSync(fallback) ? fallback : null;
}

/** 解析表格行：按 | 分割，去掉首尾空，得到单元格 */
function parseTableRow(line: string): string[] {
  return line
    .split("|")
    .map((c) => c.trim())
    .filter((_, i, arr) => i > 0 && i < arr.length - 1);
}

/** 从链接单元格提取 [[target|label]] 或 [[target]] */
function parseWikiLinkCell(cell: string): { target: string; label: string } | null {
  const m = cell.match(/\*\*\[\[([^\]]+)\]\]\*\*/) || cell.match(/\[\[([^\]]+)\]\]/);
  if (!m) return null;
  const inner = m[1].replace(/\\\|/g, "|");
  const pipe = inner.indexOf("|");
  const target = (pipe >= 0 ? inner.slice(0, pipe) : inner).trim().replace(/\.md$/i, "");
  const label = (pipe >= 0 ? inner.slice(pipe + 1) : inner).trim();
  return target ? { target, label } : null;
}

/** 解析「## 导航索引」后的 **标题** + 描述 段落格式，得到若干条 { title, description } */
function parseNavIndexBoldFormat(markdown: string): { title: string; description: string }[] {
  const out: { title: string; description: string }[] = [];
  const lines = markdown.split(/\r?\n/);
  let afterNavIndex = false;
  let pendingTitle: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("## 导航索引")) {
      afterNavIndex = true;
      pendingTitle = null;
      continue;
    }
    if (!afterNavIndex) continue;
    if (line.startsWith("## ") || line.startsWith("---")) break;

    const boldMatch = line.match(/^\*\*([^*]+)\*\*\s*$/);
    if (boldMatch) {
      if (pendingTitle !== null) out.push({ title: pendingTitle, description: "" });
      pendingTitle = boldMatch[1].trim();
      continue;
    }
    const desc = line.trim();
    if (pendingTitle !== null && desc) {
      out.push({ title: pendingTitle, description: desc });
      pendingTitle = null;
    }
  }
  if (pendingTitle !== null) out.push({ title: pendingTitle, description: "" });
  return out;
}

/** 解析「## 导航索引」后的第一个表格，得到 6 条 { title, description, wikilinkTarget } */
function parseNavIndexTable(markdown: string): { title: string; description: string; wikilinkTarget: string }[] {
  const out: { title: string; description: string; wikilinkTarget: string }[] = [];
  const lines = markdown.split(/\r?\n/);
  let afterNavIndex = false;
  const tableRows: string[][] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("## 导航索引")) {
      afterNavIndex = true;
      tableRows.length = 0;
      continue;
    }
    if (!afterNavIndex) continue;
    if (!line.trim().startsWith("|")) {
      if (tableRows.length >= 6) break;
      continue;
    }
    const cells = parseTableRow(line);
    if (cells.length >= 3) tableRows.push(cells);
  }

  // 期望：row0 表头，row1 分隔，row2 链接，row3 描述，row4 链接，row5 描述
  if (tableRows.length >= 6) {
    for (let col = 0; col < 3; col++) {
      const link1 = parseWikiLinkCell(tableRows[2][col] ?? "");
      const desc1 = (tableRows[3][col] ?? "").trim();
      if (link1) out.push({ title: link1.label, description: desc1, wikilinkTarget: link1.target });
      const link2 = parseWikiLinkCell(tableRows[4][col] ?? "");
      const desc2 = (tableRows[5][col] ?? "").trim();
      if (link2) out.push({ title: link2.label, description: desc2, wikilinkTarget: link2.target });
    }
  }
  return out;
}

/** 从 content tree 构建 doc id -> { sectionId, fileId } */
function buildDocIdToHref(tree: ReturnType<typeof getContentTree>): (docId: string) => string | null {
  const map = new Map<string, { sectionId: string; fileId: string }>();
  for (const section of tree.sections) {
    for (const item of section.items) {
      if (!map.has(item.id)) map.set(item.id, { sectionId: section.id, fileId: item.id });
    }
  }
  return (docId: string) => {
    const v = map.get(docId);
    return v ? `/docs/${encodeURIComponent(v.sectionId)}/${encodeURIComponent(v.fileId)}` : null;
  };
}

/** 与导航索引 6 条顺序一致；使用编码后的 URL 保证链接可正常打开 */
const FALLBACK_HREFS = [
  `/docs/${encodeURIComponent("A_快速开始")}/${encodeURIComponent("A01_介绍")}`,
  `/docs/${encodeURIComponent("B_品牌")}/${encodeURIComponent("品牌原则")}`,
  `/docs/${encodeURIComponent("C_基础规范")}/${encodeURIComponent("颜色系统")}`,
  `/docs/${encodeURIComponent("D_组件")}/${encodeURIComponent("按钮")}`,
  `/docs/${encodeURIComponent("E_内容策略")}/${encodeURIComponent("内容原则")}`,
  `/docs/${encodeURIComponent("F_资源")}/${encodeURIComponent("Token概述")}`,
];

/** 从导航索引文件解析「导航索引」区块（支持表格或 **标题**+描述 格式），得到 QuickStartCard[]；失败或缺失时返回空数组 */
export function getQuickStartCardsFromIndex(contentRoot?: string): QuickStartCard[] {
  const root = contentRoot ?? getContentRoot();
  const indexPath = findNavIndexPath(root);
  if (!indexPath || !fs.existsSync(indexPath)) return [];

  const raw = fs.readFileSync(indexPath, "utf-8");
  const body = stripFrontMatter(raw);
  const tree = getContentTree(contentRoot ?? DEFAULT_CONTENT_DIR);
  const resolveHref = buildDocIdToHref(tree);

  // 优先解析表格格式（含 wikilink）
  const tableEntries = parseNavIndexTable(body);
  if (tableEntries.length === 6) {
    return tableEntries.map((entry, i) => ({
      id: QUICK_START_IDS[i],
      title: entry.title,
      description: entry.description,
      href: resolveHref(normalizeDocId(entry.wikilinkTarget)) ?? FALLBACK_HREFS[i],
      iconName: QUICK_START_ICONS[i],
    }));
  }

  // 回退：解析 **标题** + 描述 段落格式（与 00_📚内容索引.md 当前结构一致）
  const boldEntries = parseNavIndexBoldFormat(body);
  if (boldEntries.length === 0) return [];

  return boldEntries.slice(0, 6).map((entry, i) => ({
    id: QUICK_START_IDS[i] ?? `nav-${i}`,
    title: entry.title,
    description: entry.description,
    href: FALLBACK_HREFS[i] ?? FALLBACK_HREFS[0],
    iconName: QUICK_START_ICONS[i] ?? QUICK_START_ICONS[0],
  }));
}
