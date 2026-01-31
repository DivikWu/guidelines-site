'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import TreeNav from './TreeNav';
import NavDrawer from './NavDrawer';
import ContentSkeleton, { type ContentSkeletonVariant } from './ContentSkeleton';
import { useSearch } from './SearchProvider';
import { getSectionConfig } from '../config/navigation';

const SearchModal = dynamic(
  () => import('./SearchModal').then((m) => ({ default: m.default })),
  { ssr: false }
);

function getRouteState(path: string): { category: string; token: string } {
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) return { category: 'home', token: 'home' };
  if (segments[0] === 'docs' && segments.length >= 3) {
    return {
      category: decodeURIComponent(segments[1]),
      token: decodeURIComponent(segments[2]),
    };
  }
  if (segments[0] === 'getting-started') {
    return { category: 'getting-started', token: segments[1] || 'introduction' };
  }
  if (segments[0] === 'foundations') {
    if (segments[1] === 'brand') return { category: 'brand', token: 'logo' };
    if (segments[1]) return { category: 'foundations', token: segments[1] };
    return { category: 'foundations', token: 'color' };
  }
  if (segments[0] === 'components') {
    return { category: 'components', token: segments[1] || 'button' };
  }
  if (segments[0] === 'content') {
    return { category: 'content', token: segments[1] || 'content-overview' };
  }
  if (segments[0] === 'resources') {
    return { category: 'resources', token: segments[1] || 'resources-overview' };
  }
  if (segments[0] === 'overview') {
    return { category: 'getting-started', token: 'introduction' };
  }
  return { category: 'getting-started', token: 'introduction' };
}

export default function ShellWithSkeleton({
  variant = 'doc',
}: { variant?: ContentSkeletonVariant } = {}) {
  const pathname = usePathname();
  const { isOpen: isSearchModalOpen, closeSearch, openSearch } = useSearch();

  const routeState = useMemo(() => getRouteState(pathname), [pathname]);
  const [category, setCategory] = useState(routeState.category);
  const [activeToken, setActiveToken] = useState(routeState.token);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const next = getRouteState(pathname);
    setCategory(next.category);
    setActiveToken(next.token);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 767px)');
    const check = () => setIsMobile(mq.matches);
    check();
    mq.addEventListener('change', check);
    return () => mq.removeEventListener('change', check);
  }, []);

  const handleToggleMobileSidebar = useCallback(() => {
    setMobileOpen((v) => !v);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const onToggleDesktopSidebar = useMemo(
    () => (!isMobile ? toggleSidebar : undefined),
    [isMobile, toggleSidebar]
  );

  const handleCategoryChange = useCallback((id: string) => {
    setCategory(id);
  }, []);

  const handleTokenChange = useCallback((id: string) => {
    setActiveToken(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSearchSelect = useCallback(
    (pageId: string) => {
      const sectionId = getSectionConfig(category) ? category : 'getting-started';
      const sectionConfig = getSectionConfig(sectionId);
      const itemIds = sectionConfig?.items.map((i) => i.id) ?? [];
      const targetToken = itemIds.includes(pageId) ? pageId : itemIds[0];
      if (targetToken) setActiveToken(targetToken);
      closeSearch();
    },
    [category, closeSearch]
  );

  const searchItems = useMemo(() => [], []);

  return (
    <div className="app-shell" suppressHydrationWarning>
      <div className="header-wrapper" suppressHydrationWarning>
        <Header
          onToggleSidebar={handleToggleMobileSidebar}
          isOpen={mobileOpen}
          docs={[]}
          onSearchSelect={handleSearchSelect}
          isOverview={false}
          showMenuButton={isMobile}
          onToggleDesktopSidebar={onToggleDesktopSidebar}
        />
      </div>

      <SearchModal
        open={isSearchModalOpen}
        onOpenChange={(open) => (open ? openSearch() : closeSearch())}
        items={searchItems}
        onSelect={() => {}}
      />

      <div className="app-nav-sentinel" />

      <NavDrawer
        isOpen={isMobile && mobileOpen}
        activeCategory={category}
        activeToken={activeToken}
        onClose={() => setMobileOpen(false)}
        onCategoryChange={(id) => setCategory(id)}
        onTokenChange={(id) => {
          setActiveToken(id);
          setMobileOpen(false);
          setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100);
        }}
        contentTree={null}
      />

      <div className="app-body">
        {!isMobile && (
          <aside className={`app-nav-side ${sidebarCollapsed ? 'collapsed' : ''}`}>
            <div className="app-nav-side__inner">
              <TreeNav
                activeCategory={category}
                activeToken={activeToken}
                onCategoryChange={handleCategoryChange}
                onTokenChange={handleTokenChange}
                contentTree={null}
              />
            </div>
          </aside>
        )}

        <main className="content" id="main-content">
          <div className="page-skeleton-wrapper doc">
            <ContentSkeleton variant={variant} />
          </div>
        </main>
      </div>
    </div>
  );
}
