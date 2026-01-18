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

// 按类型分组
const groupItemsByType = (items: SearchItem[]) => {
  const grouped: Record<string, SearchItem[]> = {
    page: [],
    component: [],
    resource: [],
  };
  items.forEach(item => {
    if (grouped[item.type]) {
      grouped[item.type].push(item);
    }
  });
  return grouped;
};

export default function SearchModal({
  open,
  onOpenChange,
  items = DEFAULT_MOCK_ITEMS,
  onSelect,
  triggerRef,
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [mounted, setMounted] = useState(false);
  const previousBodyOverflowRef = useRef<string>('');

  // 仅在客户端挂载
  useEffect(() => {
    setMounted(true);
  }, []);

  // 打开时：锁滚动、聚焦输入框、设置全局标记
  useEffect(() => {
    if (!mounted) return;
    
    if (open) {
      // 保存当前 body overflow
      previousBodyOverflowRef.current = document.body.style.overflow;
      // 锁滚动
      document.body.style.overflow = 'hidden';
      // 设置全局标记：SearchModal 打开状态
      document.documentElement.dataset.searchOpen = 'true';
      // 聚焦输入框（延迟确保 Portal 已渲染）
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      // 重置搜索状态
      setQuery('');
      setSelectedIndex(-1);
    } else {
      // 恢复滚动
      document.body.style.overflow = previousBodyOverflowRef.current;
      // 移除全局标记
      delete document.documentElement.dataset.searchOpen;
      // Focus 回到触发按钮
      if (triggerRef?.current) {
        triggerRef.current.focus();
      }
    }

    return () => {
      // 清理时恢复滚动和移除标记
      if (!open) {
        document.body.style.overflow = previousBodyOverflowRef.current;
        delete document.documentElement.dataset.searchOpen;
      }
    };
  }, [open, mounted, triggerRef]);

  // 过滤搜索结果
  const filteredItems = useCallback(() => {
    if (!query.trim()) {
      // 无输入：返回推荐项（前 8 个）
      return items.slice(0, 8);
    }
    const lowerQuery = query.toLowerCase().trim();
    return items.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(lowerQuery);
      const descMatch = item.description?.toLowerCase().includes(lowerQuery);
      return titleMatch || descMatch;
    });
  }, [query, items]);

  const displayedItems = filteredItems();

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
      // Tab: 允许在弹窗内循环，但不阻止默认行为
    }
  };

  // 滚动到选中项
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [selectedIndex]);

  // 点击遮罩关闭
  const handleBackdropClick = (e: React.MouseEvent) => {
    // 如果点击的是遮罩层本身，关闭 Modal
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };
  
  // 点击容器（但不在内容上）关闭
  const handleContainerClick = (e: React.MouseEvent) => {
    // 如果点击的是容器本身（不是内容），关闭 Modal
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
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
    <>
      {/* 遮罩层 */}
      <div 
        className="search-modal__backdrop"
        onClick={handleBackdropClick}
      />
      
      {/* 搜索卡片 */}
      <div 
        ref={modalRef}
        className="search-modal__container"
        onClick={handleContainerClick}
      >
        <div 
          className="search-modal__content"
          onClick={(e) => e.stopPropagation()}
        >
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
              placeholder="搜索设计规范..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(-1);
              }}
              onKeyDown={handleKeyDown}
            />
            {/* 快捷键提示 */}
            <div className="search-modal__shortcut-hint">
              {typeof window !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform) ? '⌘K' : 'Ctrl+K'}
            </div>
          </div>

          {/* 结果区 */}
          <div className="search-modal__results">
            {displayedItems.length === 0 ? (
              <div className="search-modal__empty">
                <div className="search-modal__empty-icon">
                  <Icon name="ds-icon-search-01" size={24} />
                </div>
                <div className="search-modal__empty-text">未找到匹配结果</div>
              </div>
            ) : (
              <>
                {/* 标题 */}
                {!query.trim() ? (
                  <div className="search-modal__section-title">推荐</div>
                ) : (
                  <div className="search-modal__section-title">
                    找到 {displayedItems.length} 个结果
                  </div>
                )}
                
                {/* 列表 */}
                <ul ref={listRef} className="search-modal__list">
                  {displayedItems.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <li key={item.id} className="search-modal__item">
                        <button
                          className={`search-modal__button ${isSelected ? 'search-modal__button--selected' : ''}`}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(index)}
                        >
                          {item.icon && (
                            <div className="search-modal__item-icon">{item.icon}</div>
                          )}
                          <div className="search-modal__item-content">
                            <div className="search-modal__item-title">
                              {highlightText(item.title, query)}
                            </div>
                            {item.description && (
                              <div className="search-modal__item-description">
                                {highlightText(item.description, query)}
                              </div>
                            )}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );

  // 使用 Portal 挂载到 document.body
  return createPortal(content, document.body);
}
