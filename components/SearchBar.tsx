'use client';

import { useRef, useEffect } from 'react';
import { useIntersectionVisible } from '../hooks/useIntersectionVisible';
import Icon from './Icon';
import { useSearch } from './SearchProvider';
import { DocPage } from '../data/docs';

interface SearchBarProps {
  docs?: DocPage[];
  onSearchSelect?: (pageId: string) => void;
}

export default function SearchBar({ docs = [] }: SearchBarProps) {
  const searchBarRef = useRef<HTMLElement>(null);
  const searchTriggerRef = useRef<HTMLInputElement>(null);
  const { openSearch, preloadSearch } = useSearch();
  
  // 使用 IntersectionObserver 监听搜索模块容器本身
  // rootMargin 为 0 确保只有完全离开视口时才触发
  const isVisible = useIntersectionVisible(searchBarRef, {
    root: null,
    rootMargin: '0px',
    threshold: 0,
  });

  // 状态更新：稳定性保护，当搜索栏离开视口时自动 blur
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const isHidden = !isVisible;
      
      // 稳定性保护：如果即将隐藏且内部有焦点，主动 blur 防止浏览器强制滚动
      if (isHidden && document.activeElement && searchBarRef.current?.contains(document.activeElement)) {
        (document.activeElement as HTMLElement).blur();
      }
    }
  }, [isVisible]);

  return (
    <>
      <section 
        ref={searchBarRef}
        className="search-bar" 
        role="search" 
        aria-label="搜索设计规范"
      >
        {/* Search container - aligns with page content container */}
        <div className="search-bar__container">
          <div className="search-bar__content">
            <div className="search-bar__header">
              <h1 className="search-bar__title">UI/UX Guidelines</h1>
              <p className="search-bar__description">
                探索 YAMI 设计系统，获取组件使用指南、交互规范与视觉资产。
              </p>
            </div>

            <div className="search-bar__input-wrapper">
              <Icon 
                name="ds-icon-search-01" 
                size={20} 
                className="search-bar__input-icon" 
              />
              <input
                ref={searchTriggerRef}
                type="search"
                className="search-bar__input"
                placeholder="搜索规范、组件或资源…"
                onMouseEnter={preloadSearch}
                onFocus={preloadSearch}
                onClick={() => openSearch()}
                readOnly
                aria-label="搜索"
              />
              <div className="search-bar__shortcut">
                <kbd>⌘</kbd><kbd>K</kbd>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
