'use client';

import dynamic from 'next/dynamic';
import HomePage from './HomePage';
import Header from './Header';
import type { SearchItem } from './SearchModal';
import { docs } from '../data/docs';
import { useSearch } from './SearchProvider';
import { useMemo, useLayoutEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const SearchModal = dynamic(
  () => import('@/components/SearchModal').then((m) => ({ default: m.default })),
  { ssr: false }
);
import type { QuickStartCard } from '@/lib/content/nav-index';
import type { RecentUpdate } from '@/data/home';

/** 搜索用 doc id -> docs 路径。section 入口类用 section 级路径；具体文档用完整路径，与 content/docs/ 结构一致。 */
const docIdToDocsPath: Record<string, string> = {
  overview: '/docs/A_快速开始',
  changelog: '/docs/A_快速开始/A06_更新日志',
  'update-process': '/docs/A_快速开始/A04_更新流程',
  logo: '/docs/B_品牌',
  'brand-colors': '/docs/B_品牌',
  typeface: '/docs/B_品牌',
  color: '/docs/C_基础规范/C01_颜色',
  typography: '/docs/C_基础规范/C02_字体排版',
  spacing: '/docs/C_基础规范/C03_间距',
  layout: '/docs/C_基础规范/C04_布局',
  radius: '/docs/C_基础规范/C05_圆角',
  elevation: '/docs/C_基础规范/C06_层级与阴影',
  iconography: '/docs/C_基础规范/C07_图标',
  motion: '/docs/C_基础规范/C08_动效',
  button: '/docs/D_组件/D01_按钮',
  tabs: '/docs/D_组件/D04_标签页',
  filter: '/docs/D_组件/D03_筛选器',
  badge: '/docs/D_组件/D02_徽标',
  heading: '/docs/D_组件',
  navbar: '/docs/D_组件',
  'product-card': '/docs/D_组件/D16_商品卡片',
  forms: '/docs/D_组件',
  'patterns-overview': '/docs/D_组件',
  'resources-overview': '/docs/F_资源',
};

export default function HomePageClient({
  initialQuickStartCards,
  initialRecentUpdates,
}: {
  initialQuickStartCards?: QuickStartCard[] | null;
  initialRecentUpdates?: RecentUpdate[] | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen: isSearchModalOpen, closeSearch, openSearch } = useSearch();

  useLayoutEffect(() => {
    if (pathname === '/' && typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  const searchItems: SearchItem[] = useMemo(() => docs.map(doc => {
    const titleMatch = doc.markdown.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : doc.id;
    const descriptionMatch = doc.markdown.replace(/^#\s+.+$/m, '').trim().match(/^([^#\n].+)$/m);
    const description = descriptionMatch ? descriptionMatch[1].trim().slice(0, 60) + '...' : undefined;
    const href = docIdToDocsPath[doc.id] ?? '/docs/A_快速开始';
    return {
      id: doc.id,
      type: (doc.id.includes('button') || doc.id.includes('tabs') || doc.id.includes('badge') ||
             doc.id.includes('heading') || doc.id.includes('filter') || doc.id.includes('navbar') ||
             doc.id.includes('product-card') || doc.id.includes('forms')) ? 'component' :
            (doc.id.includes('changelog') || doc.id.includes('update-process')) ? 'resource' : 'page',
      title,
      description,
      href
    };
  }), []);

  const handleSearchSelect = useCallback(
    (pageId: string) => {
      const item = searchItems.find((i) => i.id === pageId);
      if (item) {
        router.push(item.href, { scroll: false });
        closeSearch();
      }
    },
    [router, closeSearch, searchItems]
  );

  return (
    <>
      <div className="header-wrapper" suppressHydrationWarning>
        <Header
          onToggleSidebar={() => {}}
          isOpen={false}
          docs={docs}
          onSearchSelect={handleSearchSelect}
          isOverview={false}
          showMenuButton={false}
          showExtraActions
          showSearchSlot
        />
      </div>
      <SearchModal
        open={isSearchModalOpen}
        onOpenChange={(open) => open ? openSearch() : closeSearch()}
        items={searchItems}
        onSelect={(item) => handleSearchSelect(item.id)}
      />
      <HomePage
        initialQuickStartCards={initialQuickStartCards}
        initialRecentUpdates={initialRecentUpdates}
      />
    </>
  );
}
