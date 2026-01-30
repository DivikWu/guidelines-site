'use client';

import { memo, useCallback } from 'react';
import { getSectionConfig } from '../config/navigation';
import { useRouter } from 'next/navigation';
import type { ContentTree } from '@/lib/content/tree';

/** 展示名：仅显示 "_" 之后的文本（模块级，避免每轮渲染新建） */
function displayLabel(raw: string): string {
  const i = raw.indexOf('_');
  return i >= 0 ? raw.slice(i + 1) : raw;
}

/** 静态配置下的路由映射（模块级） */
function getItemRouteForSection(itemId: string, sectionId: string): string | null {
  if (sectionId === 'home' && itemId === 'home') return '/';
  if (sectionId === 'getting-started') return `/getting-started/${itemId}`;
  if (sectionId === 'brand') return `/foundations/brand${itemId !== 'logo' ? `#${itemId}` : ''}`;
  if (sectionId === 'foundations') return `/foundations/${itemId}`;
  if (sectionId === 'components') return `/components/${itemId}`;
  if (sectionId === 'content') return `/content${itemId !== 'content-overview' ? `#${itemId}` : ''}`;
  if (sectionId === 'resources') return `/resources${itemId !== 'resources-overview' ? `#${itemId}` : ''}`;
  return null;
}

function TokenNavInner({
  className = '',
  category,
  activeToken,
  onTokenChange,
  onNavigationStart,
  contentTree = null,
}: {
  className?: string;
  category: string;
  activeToken: string;
  onTokenChange: (id: string) => void;
  onNavigationStart?: (route: string) => void;
  contentTree?: ContentTree | null;
}) {
  const router = useRouter();

  const getItemRouteContentTree = useCallback(
    (itemId: string) => `/docs/${encodeURIComponent(category)}/${encodeURIComponent(itemId)}`,
    [category]
  );
  const handleItemClickContentTree = useCallback(
    (itemId: string) => {
      onTokenChange(itemId);
      const route = getItemRouteContentTree(itemId);
      onNavigationStart?.(route);
      router.push(route);
    },
    [onTokenChange, onNavigationStart, router, getItemRouteContentTree]
  );
  const handleItemClickConfig = useCallback(
    (itemId: string) => {
      onTokenChange(itemId);
      const route = getItemRouteForSection(itemId, category);
      if (route) {
        onNavigationStart?.(route);
        router.push(route);
      }
    },
    [onTokenChange, onNavigationStart, router, category]
  );

  if (contentTree) {
    const section = contentTree.sections.find((s) => s.id === category);
    if (!section) return null;

    const items = section.items;
    return (
      <aside className={`token-nav ${className}`}>
        <div className="token-nav__header">
          <h2 className="token-nav__title">{displayLabel(section.label)}</h2>
        </div>
        <nav className="token-nav__list">
          {items.length > 0 ? (
            items.map((item) => (
              <button
                key={item.id}
                className={`token-nav__item ${activeToken === item.id ? 'active' : ''}`}
                onClick={() => handleItemClickContentTree(item.id)}
              >
                <span className="token-nav__label">{displayLabel(item.label)}</span>
              </button>
            ))
          ) : (
            <div className="token-nav__empty">
              <p className="token-nav__empty-text">暂无内容</p>
            </div>
          )}
        </nav>
      </aside>
    );
  }

  const sectionConfig = getSectionConfig(category);
  if (!sectionConfig) return null;

  const items = sectionConfig.items || [];

  return (
    <aside className={`token-nav ${className}`}>
      <div className="token-nav__header">
        <h2 className="token-nav__title">{sectionConfig.label}</h2>
      </div>
      <nav className="token-nav__list">
        {items.length > 0 ? (
          items.map((item) => (
            <button
              key={item.id}
              className={`token-nav__item ${activeToken === item.id ? 'active' : ''}`}
              onClick={() => handleItemClickConfig(item.id)}
            >
              <span className="token-nav__label">{item.label}</span>
            </button>
          ))
        ) : (
          <div className="token-nav__empty">
            <p className="token-nav__empty-text">暂无内容</p>
          </div>
        )}
      </nav>
    </aside>
  );
}

export default memo(TokenNavInner);
