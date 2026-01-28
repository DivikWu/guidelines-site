'use client';

import HomePage from '../components/HomePage';
import { SearchProvider } from '../components/SearchProvider';
import Header from '../components/Header';
import SearchModal, { SearchItem } from '../components/SearchModal';
import { docs } from '../data/docs';
import { useSearch } from '../components/SearchProvider';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

function HomePageWrapper() {
  const router = useRouter();
  const { isOpen: isSearchModalOpen, closeSearch, openSearch } = useSearch();

  // 将 docs 转换为 SearchItem 格式
  const searchItems: SearchItem[] = useMemo(() => docs.map(doc => {
    const titleMatch = doc.markdown.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : doc.id;
    const descriptionMatch = doc.markdown.replace(/^#\s+.+$/m, '').trim().match(/^([^#\n].+)$/m);
    const description = descriptionMatch ? descriptionMatch[1].trim().slice(0, 60) + '...' : undefined;

    // 根据 doc id 确定路由
    let href = '/overview';
    if (doc.id === 'overview' || doc.id === 'changelog' || doc.id === 'update-process') {
      href = '/overview';
    } else if (doc.id.startsWith('brand-') || doc.id === 'logo' || doc.id === 'typeface') {
      href = '/foundations/brand';
    } else if (['color', 'typography', 'spacing', 'layout', 'radius', 'elevation', 'iconography', 'motion'].includes(doc.id)) {
      href = `/foundations/${doc.id}`;
    } else if (['button', 'tabs', 'badge', 'heading', 'filter', 'navbar', 'product-card', 'forms'].includes(doc.id)) {
      href = `/components/${doc.id}`;
    } else if (doc.id === 'patterns-overview') {
      href = '/components';
    } else if (doc.id === 'resources-overview') {
      href = '/resources';
    }

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
      <HomePage />
    </>
  );
}

export default function Page() {
  return (
    <SearchProvider>
      <HomePageWrapper />
    </SearchProvider>
  );
}
