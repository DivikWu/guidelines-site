import dynamic from 'next/dynamic';
import { redirect, notFound } from 'next/navigation';
import { getContentTree } from '@/lib/content/tree';
import { DEFAULT_CONTENT_DIR } from '@/lib/content/constants';
import { getMarkdownAndFrontmatter } from '@/lib/content/loaders';
import DocsPageView from './DocsPageView';
import type { DocPage } from '@/data/docs';

const DocContent = dynamic(() => import('@/components/DocContent'), { ssr: true });

export function generateStaticParams() {
  // 固定使用项目 content/，与站内链接一致，避免 YDS_CONTENT_DIR 导致 param 不匹配
  const tree = getContentTree(DEFAULT_CONTENT_DIR);
  const params: { slug: string[] }[] = [];
  const seen = new Set<string>();
  for (const section of tree.sections) {
    for (const item of section.items) {
      // 开发与静态导出时 Next 均按编码后的 URL 匹配，需返回编码后的 slug
      const decoded = [section.id, item.id];
      const encoded = [encodeURIComponent(section.id), encodeURIComponent(item.id)];
      for (const slug of [decoded, encoded]) {
        const key = slug.join("/");
        if (seen.has(key)) continue;
        seen.add(key);
        params.push({ slug });
      }
    }
  }
  return params;
}

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

function buildDocIdToSectionMap(tree: ReturnType<typeof getContentTree>) {
  const map = new Map<string, string>();
  for (const section of tree.sections) {
    for (const item of section.items) {
      if (!map.has(item.id)) {
        map.set(item.id, section.id);
      }
    }
  }
  return map;
}

function rewriteWikiLinks(markdown: string, tree: ReturnType<typeof getContentTree>) {
  const docIdToSection = buildDocIdToSectionMap(tree);
  return markdown.replace(/\[\[([^\]]+)\]\]/g, (_match, raw) => {
    const [targetRaw, labelRaw] = String(raw).split('|');
    const target = (targetRaw || '').trim().replace(/\.md$/i, '');
    const label = (labelRaw || '').trim();
    if (!target) return _match;

    // 支持 [[section/file|label]] 形式
    if (target.includes('/')) {
      const [sectionId, fileId] = target.split('/');
      if (sectionId && fileId) {
        const text = label || fileId;
        return `[${text}](/docs/${encodeURIComponent(sectionId)}/${encodeURIComponent(fileId)})`;
      }
    }

    const sectionId = docIdToSection.get(target);
    if (!sectionId) {
      // 未找到目标，保留纯文本以避免生成无效链接
      return label || target;
    }
    const text = label || target;
    return `[${text}](/docs/${encodeURIComponent(sectionId)}/${encodeURIComponent(target)})`;
  });
}

export default async function DocsSlugPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug || slug.length < 2) {
    const treeForRedirect = getContentTree(DEFAULT_CONTENT_DIR);
    const firstSection = treeForRedirect.sections[0];
    const firstFile = firstSection?.items[0];
    if (firstSection && firstFile) {
      redirect(`/docs/${encodeURIComponent(firstSection.id)}/${encodeURIComponent(firstFile.id)}`);
    }
    redirect('/');
  }

  const [section, file] = slug;
  const sectionDecoded = decodeURIComponent(section);
  const fileDecoded = decodeURIComponent(file);
  const tree = getContentTree(DEFAULT_CONTENT_DIR);
  const sectionNode = tree.sections.find((s) => s.id === sectionDecoded);
  const item = sectionNode?.items.find((i) => i.id === fileDecoded);
  const relativePath = item?.path ?? `docs/${sectionDecoded}/${fileDecoded}${fileDecoded.endsWith('.md') ? '' : '.md'}`;
  const { markdown, frontmatter: docMeta } = getMarkdownAndFrontmatter(relativePath, DEFAULT_CONTENT_DIR);

  if (markdown === null) {
    notFound();
  }

  const normalizedMarkdown = rewriteWikiLinks(markdown, tree);
  const doc: DocPage = { id: fileDecoded, markdown: normalizedMarkdown };
  const docMetaForClient = docMeta
    ? { status: docMeta.status, last_updated: docMeta.last_updated }
    : undefined;
  return (
    <DocsPageView
      doc={doc}
      section={sectionDecoded}
      file={fileDecoded}
      docMeta={docMetaForClient}
    >
      <DocContent page={doc} hidden={false} docMeta={docMetaForClient} />
    </DocsPageView>
  );
}
