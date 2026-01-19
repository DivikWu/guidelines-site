'use client';

import Header from './Header';
import SearchBar from './SearchBar';
import IconNav from './IconNav';
import TokenNav from './TokenNav';
import NavDrawer from './NavDrawer';
import DocContent from './DocContent';
import SearchModal, { SearchItem } from './SearchModal';
import { useSearch } from './SearchProvider';
import { useState, useEffect, useRef, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { DocPage } from '../data/docs';
import { getSectionConfig, findSectionByItemId } from '../config/navigation';

export default function AppShell({ docs }: { docs: DocPage[] }) {
  const [category, setCategory] = useState<string>('foundations');
  const [activeToken, setActiveToken] = useState<string>('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prevPathname, setPrevPathname] = useState<string>('');
  const pathname = usePathname();
  const sentinelRef = useRef<HTMLDivElement>(null);

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
    const sectionConfig = getSectionConfig(category);
    if (sectionConfig) {
      const itemIds = sectionConfig.items.map(item => item.id);
      // 如果当前 activeToken 不在新分类的 items 中，切换到默认或第一个 item
      if (itemIds.length > 0 && !itemIds.includes(activeToken)) {
        setActiveToken(sectionConfig.defaultItem || itemIds[0]);
      }
    }
  }, [category, activeToken]);

  useEffect(() => {
    const onScroll = () => {
      const sections = docs.map(d => document.getElementById(d.id)).filter(Boolean) as HTMLElement[];
      const current = sections.find(section => {
        const rect = section.getBoundingClientRect();
        return rect.top <= window.innerHeight * 0.3 && rect.bottom >= window.innerHeight * 0.3;
      });
      if (current && current.id !== activeToken) setActiveToken(current.id);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [activeToken, docs]);

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

  // ESC 键关闭 drawer
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [mobileOpen]);

  // 检测是否为移动端（使用断点 768px）
  // 使用 matchMedia 确保稳定判断，避免 resize 时频繁触发
  useEffect(() => {
    // 使用 matchMedia 进行稳定判断，匹配标准移动端断点
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    
    const checkMobile = () => {
      const mobile = mediaQuery.matches;
      const wasMobile = isMobile;
      setIsMobile(mobile);
      
      // 仅在跨越断点时关闭 drawer：
      // 1. 从小屏变为大屏：强制关闭 drawer
      // 2. 从大屏变为小屏：保持 drawer 状态（不自动关闭）
      if (wasMobile && !mobile && mobileOpen) {
        // 从小屏变为大屏，关闭 drawer
        setMobileOpen(false);
      }
    };

    // 初始检查
    checkMobile();
    
    // 使用 matchMedia 的 change 事件
    mediaQuery.addEventListener('change', checkMobile);
    return () => mediaQuery.removeEventListener('change', checkMobile);
  }, [isMobile, mobileOpen]);

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

  const handleSearchSelect = (pageId: string) => {
    // ... 原有逻辑 ...
    const sectionId = findSectionByItemId(pageId);
    if (sectionId) {
      setCategory(sectionId);
    }

    // 设置激活的 token 并滚动
    setActiveToken(pageId);
    setMobileOpen(false);
    closeSearch(); // 确保搜索框关闭
    setTimeout(() => {
      document.getElementById(pageId)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // 将 docs 转换为 SearchItem 格式并提取元数据
  const searchItems: SearchItem[] = useMemo(() => docs.map(doc => {
    // 提取第一行标题 (# Title)
    const titleMatch = doc.markdown.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : doc.id;
    
    // 提取描述（排除标题后的第一段文本）
    const descriptionMatch = doc.markdown.replace(/^#\s+.+$/m, '').trim().match(/^([^#\n].+)$/m);
    const description = descriptionMatch ? descriptionMatch[1].trim().slice(0, 60) + '...' : undefined;

    return {
      id: doc.id,
      type: (doc.id.includes('button') || doc.id.includes('tabs') || doc.id.includes('badge') || 
             doc.id.includes('heading') || doc.id.includes('filter') || doc.id.includes('navbar') ||
             doc.id.includes('product-card') || doc.id.includes('forms')) ? 'component' : 
            (doc.id.includes('changelog') || doc.id.includes('update-process')) ? 'resource' : 'page',
      title,
      description,
      href: `#${doc.id}`
    };
  }), [docs]);

  // 记录最近访问 (Recent)
  useEffect(() => {
    if (!activeToken || typeof window === 'undefined') return;

    const currentItem = searchItems.find(item => item.id === activeToken);
    if (!currentItem) return;

    // 获取现有记录
    const saved = localStorage.getItem('search-recent');
    let recent: SearchItem[] = [];
    if (saved) {
      try {
        recent = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse recent items', e);
      }
    }

    // 去重并限制数量 (5-8条，这里取8条)
    const newRecent = [currentItem, ...recent.filter(i => i.id !== currentItem.id)].slice(0, 8);
    localStorage.setItem('search-recent', JSON.stringify(newRecent));
  }, [activeToken, searchItems]);

  return (
    <div className="app-shell" suppressHydrationWarning>
      <Header 
        onToggleSidebar={() => setMobileOpen(v => !v)} 
        isOpen={mobileOpen}
        docs={docs}
        onSearchSelect={handleSearchSelect}
        isOverview={activeToken === 'overview'}
        showMenuButton={isMobile}
      />
      
      {/* SearchModal - 全局唯一实例 */}
      <SearchModal
        open={isSearchModalOpen}
        onOpenChange={(open) => open ? openSearch() : closeSearch()}
        items={searchItems}
        onSelect={(item) => handleSearchSelect(item.id)}
      />
      
      {/* SearchBar - 仅在 Overview 页面显示且位于三列布局上方 */}
      {activeToken === 'overview' && (
        <SearchBar 
          docs={docs}
          onSearchSelect={handleSearchSelect}
        />
      )}

      {/* 结构化锚点 (Sentinel)：用于稳定检测侧栏固定临界点 */}
      <div ref={sentinelRef} className="app-nav-sentinel" />
      
      {/* 小屏单列 Drawer - 始终渲染，通过 CSS 控制显示/隐藏 */}
      <NavDrawer
        isOpen={isMobile && mobileOpen}
        activeCategory={category}
        activeToken={activeToken}
        onClose={() => setMobileOpen(false)}
        onCategoryChange={(id) => {
          setCategory(id);
          // 切换 section 时不关闭 drawer，让用户看到新的二级列表
        }}
        onTokenChange={(id) => {
          setActiveToken(id);
          setMobileOpen(false);
          setTimeout(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      />

      <div className="app-body">
        {/* 桌面端稳定侧栏容器：无论导航是否固定，此容器始终占位，防止布局跳动 */}
        {!isMobile && (
          <aside className="app-nav-side">
            <div className="app-nav-side__inner">
              <IconNav 
                activeCategory={category}
                onCategoryChange={(id) => {
                  setCategory(id);
                }}
              />
              <TokenNav
                category={category}
                activeToken={activeToken}
                onTokenChange={(id) => {
                  setActiveToken(id);
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </div>
          </aside>
        )}
        
        {/* 内容区 */}
        <main className="content" id="main-content">
          {docs.map(page => (
            <DocContent
              key={page.id}
              page={page}
              hidden={page.id !== activeToken}
            />
          ))}
        </main>
      </div>
    </div>
  );
}
