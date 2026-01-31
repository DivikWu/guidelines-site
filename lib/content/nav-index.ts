import fs from "node:fs";
import path from "node:path";
import { getContentRoot, DEFAULT_CONTENT_DIR } from "./constants";
import { getContentTree, normalizeDocId } from "./tree";
import type { ContentTree } from "./tree";
import { getDocTitleAndDescriptionAsync } from "./loaders";
import type { RecentUpdate } from "@/data/home";

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

/** 解析表格行：按 | 分割，但保留 [[...]] 中的 |，去掉首尾空，得到单元格 */
function parseTableRow(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inWikiLink = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    // 检测 [[ 开始
    if (char === '[' && nextChar === '[') {
      inWikiLink = true;
      current += '[[';
      i++; // 跳过下一个 [
      continue;
    }
    
    // 检测 ]] 结束
    if (char === ']' && nextChar === ']' && inWikiLink) {
      current += ']]';
      i++; // 跳过下一个 ]
      inWikiLink = false;
      continue;
    }
    
    // 在 wikilink 中的 | 不作为分隔符
    if (char === '|' && !inWikiLink) {
      cells.push(current.trim());
      current = '';
      continue;
    }
    
    current += char;
  }
  
  // 添加最后一个单元格
  cells.push(current.trim());
  
  // 去掉首尾空单元格（表格两端的 |）
  return cells.filter((c, i) => i > 0 && i < cells.length - 1);
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

/** Recent Update 条目（解析自索引文档） */
interface RecentUpdateEntry {
  wikilink: string;    // 原始 wikilink 文本
  description: string; // 表格中的描述
  status: 'Released' | 'Not Started' | 'Review' | 'Draft';
  docPath: string;     // B_品牌/B01_🏷️ Logo使用规范
}

/** 解析「## 最近更新」后的表格 */
function parseRecentUpdatesTable(markdown: string): RecentUpdateEntry[] {
  const out: RecentUpdateEntry[] = [];
  const lines = markdown.split(/\r?\n/);
  let afterRecentUpdates = false;
  const tableRows: string[][] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("## 最近更新")) {
      afterRecentUpdates = true;
      tableRows.length = 0;
      continue;
    }
    if (!afterRecentUpdates) continue;
    if (line.startsWith("## ") || line.startsWith("> [!")) break;
    if (!line.trim().startsWith("|")) continue;
    
    const cells = parseTableRow(line);
    if (cells.length >= 4) tableRows.push(cells);
  }

  // 跳过表头(row 0)和分隔行(row 1)
  for (let i = 2; i < tableRows.length; i++) {
    const row = tableRows[i];
    // 表格列顺序: 0=标题, 1=描述, 2=状态, 3=文档路径
    out.push({
      wikilink: row[0]?.trim() || '',
      description: row[1]?.trim() || '',
      status: (row[2]?.trim() as any) || 'Draft',
      docPath: row[3]?.trim() || '',
    });
  }
  
  return out;
}

/** 从索引文档获取最近更新列表 */
export async function getRecentUpdatesFromIndex(
  contentRoot?: string
): Promise<RecentUpdate[]> {
  const root = contentRoot ?? getContentRoot();
  const tree = getContentTree(contentRoot ?? DEFAULT_CONTENT_DIR);
  const indexPath = findNavIndexPath(root);

  if (!indexPath || !fs.existsSync(indexPath)) {
    console.warn('[Recent Updates] 内容索引文件不存在，返回空列表');
    return [];
  }

  const raw = await fs.promises.readFile(indexPath, "utf-8");
  const body = stripFrontMatter(raw);
  const entries = parseRecentUpdatesTable(body);

  if (entries.length === 0) {
    console.warn('[Recent Updates] 索引文件中未找到"最近更新"区块');
    return [];
  }

  const results = await Promise.all(
    entries.map(async (entry) => {
      // 解析 docPath: "B_品牌/B01_🏷️ Logo使用规范"
      const pathMatch = entry.docPath.match(/^([^/]+)\/(.+)$/);
      if (!pathMatch) {
        console.warn(`[Recent Updates] Invalid docPath format: ${entry.docPath}`);
        return null;
      }
      
      const [, sectionId, fileNameWithEmoji] = pathMatch;
      const fileId = normalizeDocId(fileNameWithEmoji);
      
      // ✅ 第一重验证：检查文档在 content tree 中是否存在
      const section = tree.sections.find((s) => s.id === sectionId);
      const item = section?.items.find((i) => i.id === fileId);
      
      if (!item) {
        console.warn(
          `[Recent Updates] Document not found in tree: ${sectionId}/${fileId}`
        );
        return null;
      }
      
      // ✅ 第二重验证：读取 frontmatter，确保文件可读
      const contentPath = `docs/${sectionId}/${fileNameWithEmoji}${fileNameWithEmoji.endsWith('.md') ? '' : '.md'}`;
      const { title: fmTitle, description: fmDesc } = 
        await getDocTitleAndDescriptionAsync(contentPath, contentRoot);
      
      if (!fmTitle) {
        console.warn(`[Recent Updates] Failed to read document: ${contentPath}`);
        return null;
      }
      
      // 解析 wikilink 的 label 作为 fallback
      const wikilinkParsed = parseWikiLinkCell(entry.wikilink);
      const title = fmTitle || wikilinkParsed?.label || fileId;
      const description = fmDesc || entry.description || null;
      
      return {
        id: `recent-${fileId}`,
        title,
        description,
        status: entry.status,
        href: `/docs/${encodeURIComponent(sectionId)}/${encodeURIComponent(item.id)}`,
      };
    })
  );

  // ✅ 过滤掉不存在或无法读取的文档
  return results.filter((r): r is RecentUpdate => r !== null);
}
