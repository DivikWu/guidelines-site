import type { ContentTree } from '@/lib/content/tree';

/** 展示名：仅显示 "_" 之后的文本 */
export function displayLabel(raw: string): string {
  const i = raw.indexOf('_');
  return i >= 0 ? raw.slice(i + 1) : raw;
}

/** 根据 contentTree 或静态配置返回 item 路由 */
export function getItemRoute(
  itemId: string,
  sectionId: string,
  contentTree: ContentTree | null
): string | null {
  if (contentTree) {
    return `/docs/${encodeURIComponent(sectionId)}/${encodeURIComponent(itemId)}`;
  }
  if (sectionId === 'home' && itemId === 'home') return '/';
  if (sectionId === 'getting-started') return `/getting-started/${itemId}`;
  if (sectionId === 'brand') return `/foundations/brand${itemId !== 'logo' ? `#${itemId}` : ''}`;
  if (sectionId === 'foundations') return `/foundations/${itemId}`;
  if (sectionId === 'components') return `/components/${itemId}`;
  if (sectionId === 'content') return `/content${itemId !== 'content-overview' ? `#${itemId}` : ''}`;
  if (sectionId === 'resources')
    return `/resources${itemId !== 'resources-overview' ? `#${itemId}` : ''}`;
  return null;
}

/** 根据 contentTree 或静态配置返回 section 首项路由 */
export function getSectionRoute(
  sectionId: string,
  contentTree: ContentTree | null
): string | null {
  if (contentTree) {
    const section = contentTree.sections.find((s) => s.id === sectionId);
    const firstFile = section?.items[0];
    if (section && firstFile) {
      return `/docs/${encodeURIComponent(sectionId)}/${encodeURIComponent(firstFile.id)}`;
    }
    return null;
  }
  if (sectionId === 'home') return '/';
  if (sectionId === 'getting-started') return '/getting-started/introduction';
  if (sectionId === 'brand') return '/foundations/brand';
  if (sectionId === 'foundations') return '/foundations';
  if (sectionId === 'components') return '/components';
  if (sectionId === 'content') return '/content';
  if (sectionId === 'resources') return '/resources';
  return null;
}

/** 判断 section 是否来自 contentTree */
export function isContentTreeSection(
  s: { id: string },
  contentTree: ContentTree | null
): boolean {
  return Boolean(contentTree && contentTree.sections.some((sec) => sec.id === s.id));
}
