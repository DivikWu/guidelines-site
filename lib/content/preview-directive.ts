/**
 * 解析 Markdown 中的 :::component-preview type="xxx"::: 指令，
 * 将文档拆分为「Markdown 段」与「预览段」的有序列表，支持多处预览。
 */

export type PreviewSegment =
  | { type: 'markdown'; content: string }
  | { type: 'preview'; previewType: string; tableData?: string };

const DIRECTIVE_REGEX = /:::component-preview\s+type="([\w-]+)"\s*:::/g;

/**
 * 将整篇 markdown 按指令拆成有序片段（markdown | preview 交替）。
 * 指令行本身不会出现在任何 content 中。
 * 如果 preview 指令后紧跟表格,会提取表格数据并隐藏表格。
 */
export function parseMarkdownWithPreviewDirective(markdown: string): PreviewSegment[] {
  const segments: PreviewSegment[] = [];
  let lastEnd = 0;
  let match: RegExpMatchArray | null;

  // reset lastIndex for global regex
  DIRECTIVE_REGEX.lastIndex = 0;
  while ((match = DIRECTIVE_REGEX.exec(markdown)) !== null) {
    const idx = match.index ?? 0;
    const before = markdown.slice(lastEnd, idx).trimEnd();
    if (before.length > 0) {
      segments.push({ type: 'markdown', content: before + '\n\n' });
    }

    // 检查指令后是否有表格数据
    const afterDirective = markdown.slice(idx + match[0].length);
    const tableMatch = afterDirective.match(/^\s*\n(<!--[\s\S]*?-->\s*)?\n(\|[\s\S]+?\|)\n(?=\s*\n[^|])/);

    let tableData: string | undefined;
    let skipLength = match[0].length;

    if (tableMatch) {
      tableData = tableMatch[2]; // 提取表格内容(不包括注释)
      skipLength += tableMatch[0].length - 1; // 跳过表格内容(-1 是因为要保留最后的换行)
    }

    segments.push({
      type: 'preview',
      previewType: match[1].toLowerCase(),
      tableData
    });
    lastEnd = idx + skipLength;
  }

  const after = markdown.slice(lastEnd).trimStart();
  if (after.length > 0) {
    segments.push({ type: 'markdown', content: after });
  } else if (segments.length === 0) {
    // 无指令时整篇为单段 markdown
    segments.push({ type: 'markdown', content: markdown });
  }

  return segments;
}
