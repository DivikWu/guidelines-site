'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useTokenTheme } from './TokenProvider';
import Logo from './Logo';
import SearchResults, { SearchResult } from './SearchResults';
import { DocPage } from '../data/docs';

// 图标资源路径（本地 SVG 图片存储在 public/icons 目录）
const languageIconUrl = '/icons/language-icon.svg'; // icon / language-circle
const sunIconUrl = '/icons/sun-icon.svg'; // icon / sun-01

interface HeaderProps {
  onToggleSidebar: () => void;
  docs?: DocPage[];
  onSearchSelect?: (pageId: string) => void;
}

export default function Header({ onToggleSidebar, docs = [], onSearchSelect }: HeaderProps) {
  // #region agent log
  const isServer = typeof window === 'undefined';
  fetch('http://127.0.0.1:7243/ingest/bec5ef14-f4e7-4569-92de-812c24e45b28',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Header.tsx:19',message:'Header render start',data:{docsLength:docs.length,hasOnToggleSidebar:!!onToggleSidebar,hasOnSearchSelect:!!onSearchSelect,isServer},timestamp:Date.now(),sessionId:'debug-session',runId:'hydrate-debug',hypothesisId:'H1'})}).catch(()=>{});
  // #endregion
  const { theme, toggle } = useTokenTheme();
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/bec5ef14-f4e7-4569-92de-812c24e45b28',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Header.tsx:23',message:'useTokenTheme result',data:{theme,isServer},timestamp:Date.now(),sessionId:'debug-session',runId:'hydrate-debug',hypothesisId:'H2'})}).catch(()=>{});
  // #endregion
  const headerRef = useRef<HTMLElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/bec5ef14-f4e7-4569-92de-812c24e45b28',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Header.tsx:35',message:'State initialization',data:{searchQuery,showResults,selectedIndex,isScrolled,mounted,isServer},timestamp:Date.now(),sessionId:'debug-session',runId:'hydrate-debug',hypothesisId:'H4'})}).catch(()=>{});
  // #endregion

  // 标记组件已在客户端挂载
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/bec5ef14-f4e7-4569-92de-812c24e45b28',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Header.tsx:42',message:'Header mounted effect (client only)',data:{headerRefExists:!!headerRef.current,headerTagName:headerRef.current?.tagName,scrollY:typeof window !== 'undefined' ? window.scrollY : null},timestamp:Date.now(),sessionId:'debug-session',runId:'hydrate-debug',hypothesisId:'H1'})}).catch(()=>{});
    // #endregion
    setMounted(true);
  }, []);

  // 监听滚动，控制阴影显示
  // 只在客户端挂载后才检查滚动状态，避免水合不匹配
  useEffect(() => {
    if (!mounted) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/bec5ef14-f4e7-4569-92de-812c24e45b28',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Header.tsx:52',message:'Scroll effect skipped (not mounted)',data:{mounted},timestamp:Date.now(),sessionId:'debug-session',runId:'hydrate-debug',hypothesisId:'H1'})}).catch(()=>{});
      // #endregion
      return;
    }
    
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newIsScrolled = scrollTop > 0;
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/bec5ef14-f4e7-4569-92de-812c24e45b28',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Header.tsx:58',message:'Scroll handler',data:{scrollTop,newIsScrolled,currentIsScrolled:isScrolled},timestamp:Date.now(),sessionId:'debug-session',runId:'hydrate-debug',hypothesisId:'H1'})}).catch(()=>{});
      // #endregion
      setIsScrolled(newIsScrolled);
    };

    // 初始化检查
    const initialScrollTop = window.scrollY || document.documentElement.scrollTop;
    const initialIsScrolled = initialScrollTop > 0;
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/bec5ef14-f4e7-4569-92de-812c24e45b28',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Header.tsx:66',message:'Scroll effect init',data:{initialScrollTop,initialIsScrolled,mounted},timestamp:Date.now(),sessionId:'debug-session',runId:'hydrate-debug',hypothesisId:'H1'})}).catch(()=>{});
    // #endregion
    setIsScrolled(initialIsScrolled);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mounted, isScrolled]);

  // 搜索功能
  const performSearch = useCallback((query: string) => {
    if (!query.trim() || docs.length === 0) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const lowerQuery = query.toLowerCase().trim();
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

      // 计算匹配次数
      const matchCount = (page.markdown.match(new RegExp(lowerQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length;
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
    results.sort((a, b) => b.score - a.score);
    setSearchResults(results);
    setShowResults(results.length > 0);
  }, [docs]);

  // 防抖搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  // 处理搜索输入
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedIndex(-1);
  };

  // 键盘导航
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
      case 'Escape':
        setShowResults(false);
        setSearchQuery('');
        inputRef.current?.blur();
        break;
    }
  };

  // 处理搜索结果选择
  const handleSearchSelect = (pageId: string) => {
    setSearchQuery('');
    setShowResults(false);
    if (onSearchSelect) {
      onSearchSelect(pageId);
    }
  };

  // 点击外部关闭搜索结果
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    if (showResults) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showResults]);

  // #region agent log
  const finalClassName = `header ${mounted && isScrolled ? 'header--scrolled' : ''}`;
  fetch('http://127.0.0.1:7243/ingest/bec5ef14-f4e7-4569-92de-812c24e45b28',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Header.tsx:201',message:'Header return statement',data:{mounted,isScrolled,showResults,className:finalClassName,isServer,headerRefExists:!!headerRef.current},timestamp:Date.now(),sessionId:'debug-session',runId:'hydrate-debug',hypothesisId:'H1'})}).catch(()=>{});
  // #endregion
  return (
    <header 
      className={finalClassName}
      ref={headerRef}
    >
      <div className="header__brand">
        <button className="header__menu" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          ☰
        </button>
        <Logo />
      </div>
      <div className="header__search" ref={searchRef}>
        <input 
          ref={inputRef} 
          type="search" 
          placeholder="搜索设计规范..." 
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchQuery && setShowResults(true)}
        />
        {showResults && (
          <SearchResults 
            results={searchResults} 
            query={searchQuery}
            selectedIndex={selectedIndex}
            onSelect={handleSearchSelect}
          />
        )}
      </div>
      <div className="header__actions">
        <button onClick={toggle} aria-label="Toggle theme" title="主题">
          <img 
            src={sunIconUrl} 
            alt="Theme" 
            width={20}
            height={20}
            className="header__action-icon"
          />
        </button>
        <button aria-label="Language" title="语言">
          <img 
            src={languageIconUrl} 
            alt="Language" 
            width={20}
            height={20}
            className="header__action-icon"
          />
        </button>
      </div>
    </header>
  );
}
