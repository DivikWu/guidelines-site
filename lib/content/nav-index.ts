import fs from "node:fs";
import path from "node:path";
import { getContentRoot, DEFAULT_CONTENT_DIR } from "./constants";
import { getContentTree } from "./tree";
import type { ContentTree } from "./tree";

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

/** 与 QUICK_START_IDS 顺序一致的 section id，用于从 tree 计算首文档 href */
const QUICK_START_SECTIONS = [
  "A_快速开始",
  "B_品牌",
  "C_基础规范",
  "D_组件",
  "E_内容策略",
  "F_资源",
] as const;

const DEFAULT_QUICK_START_TITLES = [
  "快速开始",
  "品牌",
  "基础规范",
  "组件",
  "内容策略",
  "资源",
] as const;

const DEFAULT_QUICK_START_DESCRIPTIONS = [
  "快速了解设计系统的整体结构、使用原则与协作方式",
  "统一视觉语言，确保品牌在所有触点中的一致性与识别度",
  "系统化定义颜色、字体、间距、布局等基础规则",
  "可复用的 UI 组件库，覆盖常见业务场景与状态定义",
  "指导文案、信息层级与内容结构",
  "设计与开发所需的工具、模板与外部资源",
] as const;

/** 从 content tree 获取 section 首文档的 href，section 为空时返回 section 级路径作为 fallback */
function getFirstDocHref(tree: ContentTree, sectionId: string): string {
  const section = tree.sections.find((s) => s.id === sectionId);
  const first = section?.items[0];
  return first
    ? `/docs/${encodeURIComponent(sectionId)}/${encodeURIComponent(first.id)}`
    : `/docs/${encodeURIComponent(sectionId)}`;
}

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

/** 从导航索引文件解析「导航索引」区块（支持表格或 **标题**+描述 格式），得到 QuickStartCard[]；失败或缺失时返回空数组。href 由 content tree 计算首文档，同步后内容变化自动适配。 */
export async function getQuickStartCardsFromIndex(
  contentRoot?: string
): Promise<QuickStartCard[]> {
  const root = contentRoot ?? getContentRoot();
  const tree = getContentTree(contentRoot ?? DEFAULT_CONTENT_DIR);
  const indexPath = findNavIndexPath(root);

  if (!indexPath || !fs.existsSync(indexPath)) {
    return QUICK_START_IDS.map((id, i) => ({
      id,
      title: DEFAULT_QUICK_START_TITLES[i],
      description: DEFAULT_QUICK_START_DESCRIPTIONS[i],
      href: getFirstDocHref(tree, QUICK_START_SECTIONS[i]),
      iconName: QUICK_START_ICONS[i],
    }));
  }

  const raw = await fs.promises.readFile(indexPath, "utf-8");
  const body = stripFrontMatter(raw);

  // 优先解析表格格式（含 wikilink）
  const tableEntries = parseNavIndexTable(body);
  if (tableEntries.length === 6) {
    return tableEntries.map((entry, i) => ({
      id: QUICK_START_IDS[i],
      title: entry.title,
      description: entry.description,
      href: getFirstDocHref(tree, QUICK_START_SECTIONS[i]),
      iconName: QUICK_START_ICONS[i],
    }));
  }

  // 回退：解析 **标题** + 描述 段落格式
  const boldEntries = parseNavIndexBoldFormat(body);
  if (boldEntries.length >= 6) {
    return boldEntries.slice(0, 6).map((entry, i) => ({
      id: QUICK_START_IDS[i] ?? `nav-${i}`,
      title: entry.title,
      description: entry.description,
      href: getFirstDocHref(tree, QUICK_START_SECTIONS[i]),
      iconName: QUICK_START_ICONS[i] ?? QUICK_START_ICONS[0],
    }));
  }

  // 索引解析失败：仍返回 6 张卡片，使用默认 title/description，href 从 tree 计算
  return QUICK_START_IDS.map((id, i) => ({
    id,
    title: DEFAULT_QUICK_START_TITLES[i],
    description: DEFAULT_QUICK_START_DESCRIPTIONS[i],
    href: getFirstDocHref(tree, QUICK_START_SECTIONS[i]),
    iconName: QUICK_START_ICONS[i],
  }));
}
