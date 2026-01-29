'use client';

import HomePage from './HomePage';
import { SearchProvider } from './SearchProvider';
import Header from './Header';
import SearchModal, { SearchItem } from './SearchModal';
import { docs } from '../data/docs';
import { useSearch } from './SearchProvider';
import { useMemo, useLayoutEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { QuickStartCard } from '@/lib/content/nav-index';
import type { RecentUpdate } from '@/data/home';

const docIdToDocsPath: Record<string, string> = {
  overview: '/docs/A_快速开始/A01_介绍',
  changelog: '/docs/A_快速开始/A05_更新日志',
  'update-process': '/docs/A_快速开始/A04_常见问题',
  logo: '/docs/B_品牌/Logo使用规范',
  'brand-colors': '/docs/B_品牌/品牌色彩策略',
  typeface: '/docs/B_品牌/品牌原则',
  color: '/docs/C_基础规范/颜色系统',
  typography: '/docs/C_基础规范/字体排版',
  spacing: '/docs/C_基础规范/间距',
  layout: '/docs/C_基础规范/布局',
  radius: '/docs/C_基础规范/圆角',
  elevation: '/docs/C_基础规范/层级与阴影',
  iconography: '/docs/C_基础规范/图标',
  motion: '/docs/C_基础规范/动效',
  button: '/docs/D_组件/按钮',
  tabs: '/docs/D_组件/标签页',
  filter: '/docs/D_组件/筛选器',
  badge: '/docs/D_组件/徽标',
  heading: '/docs/D_组件/标题',
  navbar: '/docs/D_组件/组件原则',
  'product-card': '/docs/D_组件/业务组件',
  forms: '/docs/D_组件/组件模板',
  'patterns-overview': '/docs/D_组件/组件原则',
  'resources-overview': '/docs/F_资源/Token概述',
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
    const href = docIdToDocsPath[doc.id] ?? '/docs/A_快速开始/A01_介绍';
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

  const handleSearchSelect = (pageId: string) => {
    const item = searchItems.find(item => item.id === pageId);
    if (item) {
      router.push(item.href);
      closeSearch();
    }
  };

  return (
    <>
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
