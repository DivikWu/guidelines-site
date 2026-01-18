'use client';

import { useEffect, useRef, useState, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon';

export interface SearchItem {
  id: string;
  type: 'component' | 'resource' | 'page';
  title: string;
  description?: string;
  href: string;
  icon?: ReactNode;
}

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items?: SearchItem[];
  onSelect?: (item: SearchItem) => void;
  triggerRef?: React.RefObject<HTMLElement>;
}

// Mock 数据：推荐/常用项
const DEFAULT_MOCK_ITEMS: SearchItem[] = [
  { id: 'overview', type: 'page', title: '概述 Overview', description: '设计系统整体介绍', href: '#overview' },
  { id: 'color', type: 'page', title: '色彩 Color', description: '色彩规范与使用指南', href: '#color' },
  { id: 'typography', type: 'page', title: '文本 Typography', description: '字体层级与排版规则', href: '#typography' },
  { id: 'spacing', type: 'page', title: '间距 Spacing', description: '8点网格间距系统', href: '#spacing' },
  { id: 'button', type: 'component', title: '按钮 Button', description: '核心交互组件', href: '#button' },
  { id: 'tabs', type: 'component', title: '选项卡 Tabs', description: '内容切换组件', href: '#tabs' },
  { id: 'badge', type: 'component', title: '徽章 Badge', description: '状态指示与标签', href: '#badge' },
  { id: 'radius', type: 'page', title: '圆角 Radius', description: '圆角规范', href: '#radius' },
  { id: 'elevation', type: 'page', title: '阴影与层级 Elevation', description: '阴影与 Z-Index 规范', href: '#elevation' },
  { id: 'iconography', type: 'page', title: '图标 Iconography', description: '图标使用规范', href: '#iconography' },
  { id: 'layout', type: 'page', title: '布局 Layout', description: '栅格系统与响应式', href: '#layout' },
  { id: 'heading', type: 'component', title: '标题 Heading', description: '标题组件', href: '#heading' },
  { id: 'filter', type: 'component', title: '筛选器 Filter', description: '筛选条件组件', href: '#filter' },
  { id: 'navbar', type: 'component', title: '导航栏 Navbar', description: '全局导航组件', href: '#navbar' },
  { id: 'product-card', type: 'component', title: '商品卡片 Product Card', description: '商品展示组件', href: '#product-card' },
  { id: 'forms', type: 'component', title: '表单输入 Forms', description: '表单组件集合', href: '#forms' },
  { id: 'changelog', type: 'resource', title: '更新日志 Changelog', description: '设计系统版本变更记录', href: '#changelog' },
  { id: 'update-process', type: 'resource', title: '更新流程 Update Process', description: '设计系统更新流程规范', href: '#update-process' },
];

export default function SearchModal({
  open,
  onOpenChange,
  items = DEFAULT_MOCK_ITEMS,
  onSelect,
  triggerRef,
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [recentItems, setRecentItems] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const resultsListRef = useRef<HTMLUListElement>(null);
  const [mounted, setMounted] = useState(false);
  const previousBodyOverflowRef = useRef<string>('');
  const previousBodyPaddingRightRef = useRef<string>('');

  // 加载最近访问
  useEffect(() => {
    if (open) {
      const saved = localStorage.getItem('search-recent');
      if (saved) {
        try {
          setRecentItems(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse recent items', e);
        }
      }
    }
  }, [open]);

  // 1. 锁滚动稳定性修复：防止滚动条消失导致的页面跳动
  const lockScroll = useCallback(() => {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    previousBodyOverflowRef.current = document.body.style.overflow;
    previousBodyPaddingRightRef.current = document.body.style.paddingRight;
    
    document.body.style.overflow = 'hidden';
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }
  }, []);

  const unlockScroll = useCallback(() => {
    document.body.style.overflow = previousBodyOverflowRef.current;
    document.body.style.paddingRight = previousBodyPaddingRightRef.current;
  }, []);

  // 仅在客户端挂载
  useEffect(() => {
    setMounted(true);
  }, []);

  // 打开时逻辑
  useEffect(() => {
    if (!mounted) return;
    
    if (open) {
      lockScroll();
      document.documentElement.dataset.searchOpen = 'true';
      
      // 自动聚焦且不触发滚动跳动
      const timer = setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
      }, 50);
      
      setQuery('');
      setSelectedIndex(-1);
      
      return () => {
        clearTimeout(timer);
        // 清理逻辑：确保卸载或关闭时恢复状态
        unlockScroll();
        delete document.documentElement.dataset.searchOpen;
      };
    } else {
      // 正常关闭逻辑
      unlockScroll();
      delete document.documentElement.dataset.searchOpen;
      
      // 焦点回退
      if (triggerRef?.current) {
        triggerRef.current.focus();
      }
    }
  }, [open, mounted, triggerRef, lockScroll, unlockScroll]);

  // 过滤搜索结果并模拟加载状态
  const [displayedItems, setDisplayedItems] = useState<SearchItem[]>([]);
  
  // 核心逻辑：响应 items 或 query 的变化
  useEffect(() => {
    if (!query.trim()) {
      // 1. 最近更新 (Latest Updates) - 静态兜底 4 条
      const latestIds = ['button', 'tabs', 'filter', 'badge'];
      const latestItems = items.filter(item => latestIds.includes(item.id))
        .sort((a, b) => latestIds.indexOf(a.id) - latestIds.indexOf(b.id))
        .slice(0, 4);
      
      // 2. 最近访问 (Recent) - 来自 localStorage (recentItems state)，限制显示 4 条
      const displayRecentItems = recentItems.slice(0, 4);

      // 合并为 flat 列表供键盘导航使用，按 UI 顺序排列
      const combined = [
        ...latestItems,
        ...displayRecentItems
      ];

      setDisplayedItems(combined);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      const lowerQuery = query.toLowerCase().trim();
      const results = items.filter(item => {
        const titleMatch = item.title?.toLowerCase().includes(lowerQuery);
        const descMatch = item.description?.toLowerCase().includes(lowerQuery);
        const idMatch = item.id?.toLowerCase().includes(lowerQuery);
        return titleMatch || descMatch || idMatch;
      });
      setDisplayedItems(results);
      setIsLoading(false);
    }, 150); // 稍微缩短延迟，提升响应感

    return () => clearTimeout(timer);
  }, [query, items, recentItems]);

  // 处理选择
  const handleSelect = (item: SearchItem) => {
    if (onSelect) {
      onSelect(item);
    }
    onOpenChange(false);
  };

  // 键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        onOpenChange(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < displayedItems.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < displayedItems.length) {
          handleSelect(displayedItems[selectedIndex]);
        } else if (displayedItems.length > 0) {
          handleSelect(displayedItems[0]);
        }
        break;
    }
  };

  // 滚动到选中项
  useEffect(() => {
    if (selectedIndex >= 0 && displayedItems[selectedIndex]) {
      const selectedId = `search-item-${displayedItems[selectedIndex].id}-${selectedIndex}`;
      const selectedElement = document.getElementById(selectedId);
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [selectedIndex, displayedItems]);

  // 点击遮罩关闭
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  // 渲染单个搜索项
  const renderItem = (item: SearchItem, index: number) => {
    const isSelected = index === selectedIndex;
    const normalizedType = (item.type || '').toString().toLowerCase();

    return (
      <li key={`${item.id}-${index}`} className="search-modal__item" role="option" aria-selected={isSelected}>
        <button
          id={`search-item-${item.id}-${index}`}
          className={`search-modal__button ${isSelected ? 'search-modal__button--selected' : ''}`}
          onClick={() => handleSelect(item)}
          onMouseEnter={() => setSelectedIndex(index)}
        >
          <div className="search-modal__item-icon">
            <Icon 
              name={item.type === 'component' ? 'ds-icon-box' : item.type === 'resource' ? 'ds-icon-file' : 'ds-icon-file-text'} 
              size={20} 
            />
          </div>
          <div className="search-modal__item-content">
            <div className="search-modal__item-title">
              {highlightText(item.title || item.id, query)}
              {normalizedType && normalizedType !== 'page' && (
                <span className="search-modal__item-tag">{normalizedType.toUpperCase()}</span>
              )}
            </div>
            {item.description && (
              <div className="search-modal__item-description">
                {highlightText(item.description, query)}
              </div>
            )}
          </div>
          <div className="search-modal__item-enter" aria-hidden="true">
            <Icon name="ds-icon-arrow-right" size={16} />
          </div>
        </button>
      </li>
    );
  };

  // 高亮匹配文本
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="search-modal__highlight">{part}</mark>
      ) : (
        part
      )
    );
  };

  if (!mounted || !open) return null;

  const content = (
    <div 
      className="search-modal__portal" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="search-modal-title"
    >
      {/* 遮罩层 */}
      <div 
        className="search-modal__backdrop"
        onClick={handleBackdropClick}
      />
      
      {/* 搜索容器 */}
      <div 
        className="search-modal__container"
      >
        <div 
          ref={modalRef}
          className="search-modal__content"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 隐藏的标题用于可访问性 */}
          <h2 id="search-modal-title" className="sr-only">搜索设计规范</h2>

          {/* 输入区 */}
          <div className="search-modal__input-wrapper">
            <Icon 
              name="ds-icon-search-01" 
              size={20}
              className="search-modal__search-icon"
            />
            <input
              ref={inputRef}
              type="text"
              className="search-modal__input"
              placeholder="搜索规范、组件或资源…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(-1);
              }}
            onKeyDown={handleKeyDown}
            aria-autocomplete="list"
            aria-controls="search-results-list"
            aria-activedescendant={selectedIndex >= 0 ? `search-item-${displayedItems[selectedIndex]?.id}-${selectedIndex}` : undefined}
          />
            
            <div className="search-modal__input-return" aria-hidden="true">
              RETURN
            </div>

            {/* 清空按钮 */}
            {query && (
              <button 
                className="search-modal__clear-button"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                aria-label="清空搜索内容"
              >
                <Icon name="ds-icon-close" size={16} />
              </button>
            )}
          </div>

          {/* 结果区 */}
          <div className="search-modal__results" id="search-results-list" role="listbox">
            {isLoading ? (
              // 加载状态：骨架屏占位
              <div className="search-modal__loading">
                {[1, 2, 3].map(i => (
                  <div key={i} className="search-modal__skeleton-item">
                    <div className="search-modal__skeleton-icon" />
                    <div className="search-modal__skeleton-content">
                      <div className="search-modal__skeleton-title" />
                      <div className="search-modal__skeleton-desc" />
                    </div>
                  </div>
                ))}
              </div>
            ) : displayedItems.length === 0 ? (
              // 空状态
              <div className="search-modal__empty">
                <div className="search-modal__empty-icon">
                  <Icon name="ds-icon-search-01" size={32} />
                </div>
                <div className="search-modal__empty-text">
                  <p className="search-modal__empty-main">未找到关于 “{query}” 的结果</p>
                  <p className="search-modal__empty-sub">请尝试更通用的关键词，或检查拼写是否正确。</p>
                </div>
              </div>
            ) : !query.trim() ? (
              // 默认视图：分组展示
              <div ref={listRef}>
                {(() => {
                  const latestIds = ['button', 'tabs', 'filter', 'badge'];
                  const latestItems = items.filter(item => latestIds.includes(item.id)).slice(0, 4);
                  const latestLen = latestItems.length;
                  const displayRecentItems = recentItems.slice(0, 4);
                  const recentLen = displayRecentItems.length;

                  return (
                    <>
                      {/* 1. 最近更新 */}
                      {latestLen > 0 && (
                        <div className="search-modal__section">
                          <div className="search-modal__section-title">最近更新</div>
                          <ul className="search-modal__list" role="presentation">
                            {displayedItems.slice(0, latestLen).map((item, index) => renderItem(item, index))}
                          </ul>
                        </div>
                      )}

                      {/* 2. 最近访问 */}
                      {recentLen > 0 && (
                        <div className="search-modal__section">
                          <div className="search-modal__section-title">最近访问</div>
                          <ul className="search-modal__list" role="presentation">
                            {displayedItems.slice(latestLen, latestLen + recentLen).map((item, index) => renderItem(item, index + latestLen))}
                          </ul>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            ) : (
              <>
                {/* 搜索结果标题 */}
                <div className="search-modal__section-title">
                  {`共找到 ${displayedItems.length} 个结果`}
                </div>
                
                {/* 搜索结果列表 */}
                <ul ref={resultsListRef} className="search-modal__list" role="presentation">
                  {displayedItems.map((item, index) => renderItem(item, index))}
                </ul>
              </>
            )}
          </div>

          {/* 底部提示 */}
          <div className="search-modal__footer">
            <div className="search-modal__help">
              <div className="search-modal__help-item">
                <kbd>↑</kbd><kbd>↓</kbd>
                <span>选择</span>
              </div>
              <div className="search-modal__help-item">
                <kbd>ENTER</kbd>
                <span>打开</span>
              </div>
              <div className="search-modal__help-item">
                <kbd>ESC</kbd>
                <span>关闭</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 使用 Portal 挂载到 document.body
  return createPortal(content, document.body);
}
