'use client';

import { memo, useEffect, useLayoutEffect, useRef, useState, useCallback, startTransition } from 'react';
import { useEventListener } from '@/hooks/useEventListener';
import { usePathname } from 'next/navigation';
import { useTokenTheme } from './TokenProvider';
import BrandLogo from './BrandLogo';
import Icon from './Icon';
import SearchResults, { SearchResult } from './SearchResults';
import { SearchItem } from './SearchModal';
import { useSearch } from './SearchProvider';
import { DocPage } from '../data/docs';



interface HeaderProps {
  onToggleSidebar: () => void;
  isOpen?: boolean;
  docs?: DocPage[];
  onSearchSelect?: (pageId: string) => void;
  isOverview?: boolean;
  showMenuButton?: boolean;
  showExtraActions?: boolean;
  showSearchSlot?: boolean;
  onToggleDesktopSidebar?: () => void;
}

const Header = memo(function Header({
  onToggleSidebar,
  isOpen = false,
  docs = [],
  onSearchSelect,
  isOverview = false,
  showMenuButton = false,
  showExtraActions = false,
  showSearchSlot = false,
  onToggleDesktopSidebar,
}: HeaderProps) {
  const { theme, toggle } = useTokenTheme();
  
  // 检查 search-hidden 状态以控制搜索按钮显示
  const [isSearchHidden, setIsSearchHidden] = useState(false);
  
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const hidden = document.documentElement.dataset.searchHidden === 'true';
      setIsSearchHidden(hidden);
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-search-hidden']
    });
    
    // 初始状态
    setIsSearchHidden(document.documentElement.dataset.searchHidden === 'true');
    
    return () => observer.disconnect();
  }, []);
  const headerRef = useRef<HTMLElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const sidebarButtonWrapperRef = useRef<HTMLDivElement | null>(null);
  const brandRef = useRef<HTMLDivElement | null>(null);
  const [shouldRouteAnimate, setShouldRouteAnimate] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const pathname = usePathname();
  const { openSearch, preloadSearch } = useSearch();

  // 标记组件已在客户端挂载
  useEffect(() => {
    setMounted(true);
  }, []);

  // 检测路由切换：仅在首页↔规范页切换时触发动画
  // 使用 useLayoutEffect 确保动画类在首帧绘制前生效，避免跳动
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const isHome = pathname === '/';
    const prevPath = window.sessionStorage.getItem('yds-last-path');

    if (prevPath !== null) {
      const prevIsHome = prevPath === '/';
      if (prevIsHome !== isHome) {
        setShouldRouteAnimate(true);
      }
    }

    window.sessionStorage.setItem('yds-last-path', pathname);
  }, [pathname]);

  useEffect(() => {
    if (!shouldRouteAnimate) return;
    const timer = setTimeout(() => {
      setShouldRouteAnimate(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [shouldRouteAnimate]);

  // 计算按钮和品牌 logo 的类名，直接在 JSX 中使用，避免 SSR/水合时的布局跳动
  const sidebarButtonWrapperClassName = `header__sidebar-button-wrapper${onToggleDesktopSidebar ? ' header__sidebar-button-wrapper--visible' : ''}${shouldRouteAnimate ? ' header__sidebar-button-wrapper--route-animate' : ''}`;
  const brandClassName = `header__brand${onToggleDesktopSidebar ? ' header__brand--offset' : ''}`;

  // 检测屏幕宽度（断点：768px，与项目其他断点一致）
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      // 切换屏幕尺寸时，收起搜索框以保持一致性
      setIsSearchExpanded(false);
      setShowResults(false);
      setSearchQuery('');
    };

    // 初始化
    handleMediaChange(mediaQuery);
    
    // 监听变化
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
      return () => mediaQuery.removeEventListener('change', handleMediaChange);
    } else {
      // 兼容旧版浏览器
      mediaQuery.addListener(handleMediaChange);
      return () => mediaQuery.removeListener(handleMediaChange);
    }
  }, [mounted]);

  // 监听滚动，控制阴影显示：仅 mounted 后绑定一次，passive + rAF，仅阈值变化时 setState
  const scrollRafIdRef = useRef<number | null>(null);
  const lastIsScrolledRef = useRef(false);
  const handleScroll = useCallback(() => {
    if (scrollRafIdRef.current != null) return;
    scrollRafIdRef.current = requestAnimationFrame(() => {
      scrollRafIdRef.current = null;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newIsScrolled = scrollTop > 0;
      if (lastIsScrolledRef.current !== newIsScrolled) {
        lastIsScrolledRef.current = newIsScrolled;
        startTransition(() => setIsScrolled(newIsScrolled));
      }
    });
  }, []);
  // 约定：Header 单例，scroll 仅注册一次
  useEventListener(mounted ? window : null, 'scroll', handleScroll, { passive: true });
  useEffect(() => {
    if (!mounted) return;
    const initialScrollTop = window.scrollY || document.documentElement.scrollTop;
    const initialIsScrolled = initialScrollTop > 0;
    lastIsScrolledRef.current = initialIsScrolled;
    setIsScrolled(initialIsScrolled);
    return () => {
      if (scrollRafIdRef.current != null) cancelAnimationFrame(scrollRafIdRef.current);
    };
  }, [mounted]);

  // 搜索功能
  const performSearch = useCallback((query: string) => {
    if (!query.trim() || docs.length === 0) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const lowerQuery = query.toLowerCase().trim();
    const regex = new RegExp(
      lowerQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'gi'
    );
    const results: SearchResult[] = [];

    docs.forEach(page => {
      const matches: SearchResult['matches'] = [];
      let score = 0;

      // 提取标题（第一个 # 标题）
      const titleMatch = page.markdown.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : '';
      
      // 搜索标题
      if (title.toLowerCase().includes(lowerQuery)) {
        matches.push({
          type: 'title',
          text: title,
          index: title.toLowerCase().indexOf(lowerQuery)
        });
        score += 10; // 标题匹配权重更高
      }

      // 搜索内容
      const content = page.markdown.toLowerCase();
      const contentIndex = content.indexOf(lowerQuery);
      if (contentIndex !== -1) {
        matches.push({
          type: 'content',
          text: page.markdown.substring(Math.max(0, contentIndex - 20), contentIndex + lowerQuery.length + 20),
          index: contentIndex
        });
        score += 1;
      }

      // 计算匹配次数（RegExp 在循环外创建，避免重复实例化）
      const matchCount = (page.markdown.match(regex) || []).length;
      score += matchCount * 0.5;

      if (matches.length > 0) {
        results.push({
          page,
          matches,
          score
        });
      }
    });

    // 按分数排序
    const sortedResults = results.toSorted((a, b) => b.score - a.score);
    setSearchResults(sortedResults);
    setShowResults(results.length > 0);
  }, [docs]);

  const performSearchRef = useRef(performSearch);
  performSearchRef.current = performSearch;

  // 防抖搜索：仅依赖 searchQuery，避免 docs 引用变化重置 timer
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearchRef.current(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 处理搜索输入
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedIndex(-1);
  };

  // 键盘导航
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setShowResults(false);
      setSearchQuery('');
      inputRef.current?.blur();
      // 收起搜索框
      setIsSearchExpanded(false);
      return;
    }

    if (!showResults || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          handleSearchSelect(searchResults[selectedIndex].page.id);
        } else if (searchResults.length > 0) {
          handleSearchSelect(searchResults[0].page.id);
        }
        break;
    }
  };

  // 处理搜索结果选择
  const handleSearchSelect = (pageId: string) => {
    setSearchQuery('');
    setShowResults(false);
    // 选择后收起搜索框
    setIsSearchExpanded(false);
    if (onSearchSelect) {
      onSearchSelect(pageId);
    }
  };

  // 处理搜索图标点击（展开搜索框）
  const handleSearchIconClick = () => {
    setIsSearchExpanded(true);
    // 延迟聚焦，确保输入框已渲染
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // 点击外部关闭搜索结果和搜索框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        // 点击外部区域收起搜索框
        if (isSearchExpanded) {
          setIsSearchExpanded(false);
          setSearchQuery('');
        }
      }
    };

    if (showResults || isSearchExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showResults, isSearchExpanded]);

  // 将 docs 转换为 SearchItem
  const searchItems: SearchItem[] = docs.map(page => {
    const titleMatch = page.markdown.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : page.id;
    // 提取描述（markdown 第一段）
    const descMatch = page.markdown.match(/^#\s+.+$\n\n(.+)$/m);
    const description = descMatch ? descMatch[1].slice(0, 50) : undefined;
    
    return {
      id: page.id,
      type: page.id.includes('button') || page.id.includes('tabs') || page.id.includes('badge') || 
            page.id.includes('heading') || page.id.includes('filter') || page.id.includes('navbar') ||
            page.id.includes('product-card') || page.id.includes('forms') ? 'component' : 
            page.id.includes('changelog') || page.id.includes('update-process') ? 'resource' : 'page',
      title,
      description,
      href: `#${page.id}`,
    };
  });

  const finalClassName = `header ${mounted && isScrolled ? 'header--scrolled' : ''}`;
  const searchClassName = `header__search ${isSearchExpanded ? 'header__search--expanded' : showSearchSlot ? 'header__search--slot' : 'header__search--collapsed'}`;
  // 最终显示规则实现：
  // 1. 非 Overview：永远显示
  // 2. Overview：仅当页面内 Search 模块完全隐藏 (isSearchHidden) 时显示
  const shouldDeferSearchIcon = isOverview || showSearchSlot;
  const showSearchIcon = !isSearchExpanded && (!shouldDeferSearchIcon || isSearchHidden);

  return (
    <header 
      className={finalClassName}
      ref={headerRef}
    >
      <div 
        ref={sidebarButtonWrapperRef}
        className={sidebarButtonWrapperClassName}
      >
        {onToggleDesktopSidebar && (
          <button 
            aria-label="面板" 
            title="面板"
            onClick={onToggleDesktopSidebar}
          >
            <Icon 
              name="ds-icon-panel-left1" 
              size={20}
              className="header__action-icon leading-none"
            />
          </button>
        )}
      </div>
      <div 
        ref={brandRef}
        className={brandClassName}
      >
        <BrandLogo />
      </div>
      <div style={{ flex: 1 }} />
      <div className={searchClassName} ref={searchRef}>
        {isSearchExpanded ? (
          <>
            <input 
              ref={inputRef} 
              type="search" 
              placeholder="搜索设计规范..." 
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                preloadSearch();
                searchQuery && setShowResults(true);
              }}
              onMouseEnter={preloadSearch}
              onClick={() => openSearch()}
              readOnly
            />
            {showResults && (
              <SearchResults 
                results={searchResults} 
                query={searchQuery}
                selectedIndex={selectedIndex}
                onSelect={handleSearchSelect}
              />
            )}
          </>
        ) : showSearchSlot ? (
          <div className="header__search-slot" aria-hidden="true" />
        ) : (
          <input 
            type="search" 
            placeholder="搜索设计规范..." 
            onMouseEnter={preloadSearch}
            onFocus={preloadSearch}
            onClick={() => openSearch()}
            readOnly
          />
        )}
      </div>
      <div className="header__actions">
        <button onClick={toggle} aria-label="切换主题模式" title="主题">
          <Icon 
            name="ds-icon-sun-03" 
            size={20}
            className="header__action-icon leading-none"
          />
        </button>
        {showSearchIcon && (
          <button 
            ref={searchTriggerRef}
            className="header__search-icon-button"
            onMouseEnter={preloadSearch}
            onFocus={preloadSearch}
            onClick={() => openSearch()}
            aria-label="搜索"
            title="搜索"
          >
            <Icon 
              name="ds-icon-search-01" 
              size={20}
              className="header__action-icon leading-none"
            />
          </button>
        )}
        {/* 仅在移动端且当前页面没有 Tab 切换栏时显示菜单入口 */}
        {showMenuButton && (
          <button className="header__menu" onClick={onToggleSidebar} aria-label={isOpen ? "Close menu" : "Open menu"}>
            {isOpen ? (
              <Icon name="ds-icon-cancel-01" size={20} className="header__action-icon leading-none" />
            ) : (
              <Icon name="ds-icon-menu-01" size={20} className="header__action-icon leading-none" />
            )}
          </button>
        )}
      </div>
    </header>
  );
});

export default Header;
