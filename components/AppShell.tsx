'use client';

import dynamic from 'next/dynamic';
import Header from './Header';
import IconNav from './IconNav';
import TokenNav from './TokenNav';
import NavDrawer from './NavDrawer';
import ContentSkeleton from './ContentSkeleton';
import type { SearchItem } from './SearchModal';
import { useSearch } from './SearchProvider';

const SearchModal = dynamic(
  () => import('./SearchModal').then((m) => ({ default: m.default })),
  { ssr: false }
);
import { useState, useEffect, useRef, useMemo, useCallback, startTransition } from 'react';
import { useEventListener } from '@/hooks/useEventListener';
import { usePathname, useRouter } from 'next/navigation';
import { DocPage } from '../data/docs';
import { getSectionConfig, findSectionByItemId } from '../config/navigation';
import type { ContentTree } from '@/lib/content/tree';
import type { DocMetaForClient } from '@/lib/content/loaders';
import { getSearchRecent, setSearchRecent } from '@/lib/search-recent-cache';
import { useGlobalShortcuts } from '@/contexts/GlobalShortcutsContext';

/** 模块级纯函数：根据 path 与 contentTree 解析出 category/token，避免每轮渲染新建 */
function getRouteState(path: string, contentTree: ContentTree | null): { category: string; token: string } {
  const segments = path.split('/').filter(Boolean);
  if (contentTree && segments[0] === 'docs' && segments.length >= 3) {
    const section = decodeURIComponent(segments[1]);
    const file = decodeURIComponent(segments[2]);
    return { category: section, token: file };
  }
  if (segments.length === 0) return { category: 'home', token: 'home' };
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

export default function AppShell({
  docs,
  contentTree = null,
  docsRouteSection = null,
  docsRouteFile = null,
  docMeta = null,
  children,
}: {
  docs: DocPage[];
  contentTree?: ContentTree | null;
  docsRouteSection?: string | null;
  docsRouteFile?: string | null;
  docMeta?: DocMetaForClient | null;
  children?: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const initialRouteState =
    contentTree && docsRouteSection && docsRouteFile
      ? { category: docsRouteSection, token: docsRouteFile }
      : getRouteState(pathname, contentTree);
  const [category, setCategory] = useState<string>(initialRouteState.category);
  const [activeToken, setActiveToken] = useState<string>(initialRouteState.token);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prevPathname, setPrevPathname] = useState<string>('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const docIds = useMemo(() => new Set(docs.map((doc) => doc.id)), [docs]);
  const docRouteMap = useMemo(() => {
    if (!contentTree) return null;
    const map = new Map<string, string>();
    for (const section of contentTree.sections) {
      for (const item of section.items) {
        map.set(item.id, `/docs/${encodeURIComponent(section.id)}/${encodeURIComponent(item.id)}`);
      }
    }
    return map;
  }, [contentTree]);
  const scrollRafIdRef = useRef<number | null>(null);
  const lastMobileRef = useRef(false);
  const docsRef = useRef(docs);
  docsRef.current = docs;

  // 1. 稳定 Header 搜索按钮状态：通过监测 sentinel 决定是否显示 Header 搜索
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // 当 sentinel 离开视口（顶部到达 header 位置）时，认为搜索栏已隐藏
        const isHidden = !entry.isIntersecting;
        document.documentElement.dataset.searchHidden = isHidden ? 'true' : 'false';
      },
      {
        // 关键：rootMargin 顶部偏移 header 高度（56px），确保在临界点才切换
        rootMargin: '-56px 0px 0px 0px',
        threshold: 0
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      observer.disconnect();
      document.documentElement.dataset.searchHidden = 'false';
    };
  }, [activeToken]); // activeToken 变化可能导致 SearchBar 挂载/卸载，需要重新监听

  // 当 category 变化时，自动选择第一个 token
  useEffect(() => {
    if (contentTree) {
      const section = contentTree.sections.find((s) => s.id === category);
      if (section && section.items.length > 0 && !section.items.some((i) => i.id === activeToken)) {
        setActiveToken(section.items[0].id);
      }
      return;
    }
    const sectionConfig = getSectionConfig(category);
    if (sectionConfig) {
      const itemIds = sectionConfig.items.map(item => item.id);
      // 如果当前 activeToken 不在新分类的 items 中，切换到默认或第一个 item
      if (itemIds.length > 0 && !itemIds.includes(activeToken)) {
        if (docIds.has(activeToken)) {
          return;
        }
        setActiveToken(sectionConfig.defaultItem || itemIds[0]);
      }
    }
  }, [category, activeToken, docIds, contentTree]);

  useEffect(() => {
    setPendingRoute(null);
    const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
    const nextState = getRouteState(pathname, contentTree);
    setCategory(nextState.category);
    setActiveToken(hash || nextState.token);
  }, [pathname, contentTree]);

  // 约定：AppShell 单例，hashchange 仅注册一次；多实例时改为模块级单监听 + 回调 Set
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveToken(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 滚动高亮：每帧最多计算一次，仅当 activeToken 实际变化时 setState；passive 提升滚动性能
  const onScrollHighlight = useCallback(() => {
    if (scrollRafIdRef.current != null) return;
    scrollRafIdRef.current = requestAnimationFrame(() => {
      scrollRafIdRef.current = null;
      const list = docsRef.current;
      const sections = list.map(d => document.getElementById(d.id)).filter(Boolean) as HTMLElement[];
      const current = sections.find(section => {
        const rect = section.getBoundingClientRect();
        return rect.top <= window.innerHeight * 0.3 && rect.bottom >= window.innerHeight * 0.3;
      });
      if (current) {
        startTransition(() => {
          setActiveToken((prev) => (current.id !== prev ? current.id : prev));
        });
      }
    });
  }, []);
  // 约定：AppShell 单例，scroll 仅注册一次
  useEventListener(typeof window !== 'undefined' ? window : null, 'scroll', onScrollHighlight, { passive: true });
  useEffect(() => {
    return () => {
      if (scrollRafIdRef.current != null) cancelAnimationFrame(scrollRafIdRef.current);
    };
  }, []);

  // 小屏 drawer 打开时锁定背景滚动
  useEffect(() => {
    if (mobileOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [mobileOpen]);

  // 注册到全局快捷键（单一 keydown 监听，由 GlobalShortcutsProvider 分发）
  const shortcuts = useGlobalShortcuts();
  if (shortcuts) {
    shortcuts.drawer.closeRef.current = () => setMobileOpen(false);
    shortcuts.drawer.isOpenRef.current = mobileOpen;
  }

  // 检测是否为移动端（使用断点 768px）
  // 使用 matchMedia 确保稳定判断，避免 resize 时频繁触发；lastMobileRef 避免 isMobile 依赖导致 effect 重跑
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    const checkMobile = () => {
      const mobile = mediaQuery.matches;
      const wasMobile = lastMobileRef.current;
      lastMobileRef.current = mobile;
      setIsMobile(mobile);

      if (wasMobile && !mobile && mobileOpen) {
        setMobileOpen(false);
      }
    };

    checkMobile();
    mediaQuery.addEventListener('change', checkMobile);
    return () => mediaQuery.removeEventListener('change', checkMobile);
  }, [mobileOpen]);

  // 路由切换后自动关闭 drawer（小屏）
  // 仅在 pathname 真正变化时关闭，避免初始渲染时误关闭
  useEffect(() => {
    // 初始化 prevPathname
    if (!prevPathname) {
      setPrevPathname(pathname);
      return;
    }
    
    // 仅在 pathname 真正变化且 drawer 打开时关闭
    if (isMobile && mobileOpen && pathname !== prevPathname) {
      setMobileOpen(false);
    }
    
    // 更新 prevPathname
    setPrevPathname(pathname);
  }, [pathname, isMobile, mobileOpen, prevPathname]);


  const { isOpen: isSearchModalOpen, closeSearch, openSearch } = useSearch();

  // 切换移动端侧边栏
  // 使用 useCallback 稳定函数引用，防止 Header 不必要的重新渲染
  const handleToggleMobileSidebar = useCallback(() => {
    setMobileOpen(v => !v);
  }, []);

  // 切换桌面端侧边栏收起/展开
  // 使用 useCallback 稳定函数引用，避免 Header 组件不必要的重新渲染和动画触发
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  // 稳定 onToggleDesktopSidebar 的引用，只在 isMobile 变化时更新
  // 确保切换 IconNav 时按钮显示状态不会改变
  const onToggleDesktopSidebar = useMemo(() => {
    return !isMobile ? toggleSidebar : undefined;
  }, [isMobile, toggleSidebar]);

  // 稳定 onCategoryChange 函数引用，防止 IconNav 切换时触发 Header 重新渲染
  const handleCategoryChange = useCallback((id: string) => {
    setCategory(id);
  }, []);

  // 稳定 onTokenChange 函数引用，保持与 onCategoryChange 的一致性
  const handleTokenChange = useCallback((id: string) => {
    setActiveToken(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // NavDrawer 稳定回调，减少子组件无效重渲染
  const handleNavDrawerClose = useCallback(() => setMobileOpen(false), []);
  const handleNavDrawerCategoryChange = useCallback((id: string) => setCategory(id), []);
  const handleNavDrawerTokenChange = useCallback((id: string) => {
    setActiveToken(id);
    setMobileOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  // 待导航路由：点击 tab 即将 router.push 时设置，pathname 更新后清除；仅 path 变化时设，避免同页 hash 闪骨架屏
  const handleNavigationStart = useCallback(
    (route: string) => {
      const routePath = route.split('#')[0];
      if (routePath !== pathname) setPendingRoute(route);
    },
    [pathname]
  );

  // 根据 doc id 确定路由（contentTree 时用 Map 查找，否则走静态 fallback）
  const getDocRouteFallback = useCallback((docId: string): string => {
    if (docId === 'overview' || docId === 'changelog' || docId === 'update-process') {
      return '/overview';
    }
    if (docId.startsWith('brand-') || docId === 'logo' || docId === 'typeface') {
      return '/foundations/brand';
    }
    if (['color', 'typography', 'spacing', 'layout', 'radius', 'elevation', 'iconography', 'motion'].includes(docId)) {
      return `/foundations/${docId}`;
    }
    if (['button', 'tabs', 'badge', 'heading', 'filter', 'navbar', 'product-card', 'forms'].includes(docId)) {
      return `/components/${docId}`;
    }
    if (docId === 'patterns-overview') return '/components';
    if (docId === 'resources-overview') return '/resources';
    if (docId === 'content') return '/content';
    if (docId === 'introduction') return '/getting-started/introduction';
    return pathname;
  }, [pathname]);

  const getDocRoute = useCallback((docId: string): string => {
    const fromMap = docRouteMap?.get(docId);
    if (fromMap) return fromMap;
    return getDocRouteFallback(docId);
  }, [docRouteMap, getDocRouteFallback]);

  // 使用 useCallback 稳定 handleSearchSelect 引用，防止 Header 不必要的重新渲染
  const handleSearchSelect = useCallback((pageId: string) => {
    if (contentTree) {
      for (const section of contentTree.sections) {
        if (section.items.some((i) => i.id === pageId)) {
          setCategory(section.id);
          break;
        }
      }
    } else {
      const sectionId = findSectionByItemId(pageId);
      if (sectionId) {
        setCategory(sectionId);
      }
    }

    // 获取路由
    const route = getDocRoute(pageId);
    const currentRoute = route.split('#')[0];
    
    // 如果路由不同，进行跳转（scroll: false 避免 Next.js 与自定义 scrollIntoView 冲突，减少 auto-scroll 警告）
    if (currentRoute !== pathname) {
      router.push(route.includes('#') ? route : `${route}#${pageId}`, { scroll: false });
      setMobileOpen(false);
      closeSearch();
      return;
    }

    // 如果在同一页面，设置激活的 token 并滚动
    setActiveToken(pageId);
    setMobileOpen(false);
    closeSearch();
    setTimeout(() => {
      document.getElementById(pageId)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [pathname, router, closeSearch, contentTree, getDocRoute]);

  // 将 docs 转换为 SearchItem 格式并提取元数据
  const searchItems: SearchItem[] = useMemo(() => {
    if (contentTree) {
      const items: SearchItem[] = [];
      for (const section of contentTree.sections) {
        for (const item of section.items) {
          const href = `/docs/${encodeURIComponent(section.id)}/${encodeURIComponent(item.id)}`;
          items.push({
            id: item.id,
            type: 'page',
            title: item.label,
            description: undefined,
            href,
          });
        }
      }
      return items;
    }

    return docs.map(doc => {
      // 提取第一行标题 (# Title)
      const titleMatch = doc.markdown.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1].trim() : doc.id;
      
      // 提取描述（排除标题后的第一段文本）
      const descriptionMatch = doc.markdown.replace(/^#\s+.+$/m, '').trim().match(/^([^#\n].+)$/m);
      const description = descriptionMatch ? descriptionMatch[1].trim().slice(0, 60) + '...' : undefined;

      // 根据 doc id 确定路由（无 contentTree 时用 fallback）
      const route = getDocRouteFallback(doc.id);
      const href = route.includes('#') ? route : `${route}#${doc.id}`;

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
    });
  }, [docs, pathname, contentTree, getDocRouteFallback]);

  // 记录最近访问 (Recent)
  useEffect(() => {
    if (!activeToken || typeof window === 'undefined') return;

    const currentItem = searchItems.find(item => item.id === activeToken);
    if (!currentItem) return;

    const recent = getSearchRecent();
    const newRecent = [currentItem, ...recent.filter(i => i.id !== currentItem.id)].slice(0, 8);
    setSearchRecent(newRecent);
  }, [activeToken, searchItems]);

  return (
    <div className="app-shell" suppressHydrationWarning>
      <div className="header-wrapper">
        <Header 
          onToggleSidebar={handleToggleMobileSidebar} 
          isOpen={mobileOpen}
          docs={docs}
          onSearchSelect={handleSearchSelect}
          isOverview={false}
          showMenuButton={isMobile}
          onToggleDesktopSidebar={onToggleDesktopSidebar}
        />
      </div>
      
      {/* SearchModal - 全局唯一实例 */}
      <SearchModal
        open={isSearchModalOpen}
        onOpenChange={(open) => open ? openSearch() : closeSearch()}
        items={searchItems}
        onSelect={(item) => handleSearchSelect(item.id)}
      />
      
      {/* 结构化锚点 (Sentinel)：用于稳定检测侧栏固定临界点 */}
      <div ref={sentinelRef} className="app-nav-sentinel" />
      
      {/* 小屏单列 Drawer - 始终渲染，通过 CSS 控制显示/隐藏 */}
      <NavDrawer
        isOpen={isMobile && mobileOpen}
        activeCategory={category}
        activeToken={activeToken}
        onClose={handleNavDrawerClose}
        onCategoryChange={handleNavDrawerCategoryChange}
        onTokenChange={handleNavDrawerTokenChange}
        contentTree={contentTree}
      />

      <div className="app-body">
        {/* 桌面端稳定侧栏容器：无论导航是否固定，此容器始终占位，防止布局跳动 */}
        {!isMobile && (
          <aside className={`app-nav-side ${sidebarCollapsed ? 'collapsed' : ''}`}>
            <div className="app-nav-side__inner">
              <IconNav 
                activeCategory={category}
                onCategoryChange={handleCategoryChange}
                contentTree={contentTree}
              />
              <TokenNav
                category={category}
                activeToken={activeToken}
                onTokenChange={handleTokenChange}
                onNavigationStart={handleNavigationStart}
                contentTree={contentTree}
              />
            </div>
          </aside>
        )}
        
        {/* 内容区：待导航时显示骨架屏，否则由 RSC 传入的文档内容 */}
        <main className="content" id="main-content">
          {pendingRoute != null ? (
            <div className="page-skeleton-wrapper doc">
              <ContentSkeleton />
            </div>
          ) : (
            children ?? null
          )}
        </main>
      </div>
    </div>
  );
}
