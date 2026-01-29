'use client';

import { getSectionConfig } from '../config/navigation';
import { useRouter, usePathname } from 'next/navigation';
import type { ContentTree } from '@/lib/content/tree';

export default function TokenNav({
  className = '',
  category,
  activeToken,
  onTokenChange,
  contentTree = null,
}: {
  className?: string;
  category: string;
  activeToken: string;
  onTokenChange: (id: string) => void;
  contentTree?: ContentTree | null;
}) {
  const router = useRouter();
  const pathname = usePathname();

  /** 展示名：仅显示 "_" 之后的文本 */
  const displayLabel = (raw: string) => {
    const i = raw.indexOf("_");
    return i >= 0 ? raw.slice(i + 1) : raw;
  };

  if (contentTree) {
    const section = contentTree.sections.find((s) => s.id === category);
    if (!section) return null;

    const items = section.items;
    const getItemRoute = (itemId: string) =>
      `/docs/${encodeURIComponent(category)}/${encodeURIComponent(itemId)}`;

    const handleItemClick = (itemId: string) => {
      const route = getItemRoute(itemId);
      router.push(route);
      if (pathname === route.split('#')[0]) {
        onTokenChange(itemId);
      }
    };

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
                onClick={() => handleItemClick(item.id)}
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

  const getItemRoute = (itemId: string, sectionId: string) => {
    if (sectionId === 'home' && itemId === 'home') return '/';
    if (sectionId === 'getting-started') {
      return `/getting-started/${itemId}`;
    }
    if (sectionId === 'brand') {
      return `/foundations/brand${itemId !== 'logo' ? `#${itemId}` : ''}`;
    }
    if (sectionId === 'foundations') {
      return `/foundations/${itemId}`;
    }
    if (sectionId === 'components') {
      return `/components/${itemId}`;
    }
    if (sectionId === 'content') {
      return `/content${itemId !== 'content-overview' ? `#${itemId}` : ''}`;
    }
    if (sectionId === 'resources') {
      return `/resources${itemId !== 'resources-overview' ? `#${itemId}` : ''}`;
    }
    return null;
  };

  const handleItemClick = (itemId: string) => {
    const route = getItemRoute(itemId, category);
    if (route) {
      router.push(route);
      const baseRoute = route.split('#')[0];
      if (baseRoute === pathname) {
        onTokenChange(itemId);
      }
    } else {
      onTokenChange(itemId);
    }
  };

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
              onClick={() => handleItemClick(item.id)}
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
