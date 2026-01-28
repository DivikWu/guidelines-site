'use client';

import { getSectionConfig } from '../config/navigation';
import { useRouter, usePathname } from 'next/navigation';

export default function TokenNav({
  className = '',
  category,
  activeToken,
  onTokenChange
}: {
  className?: string;
  category: string;
  activeToken: string;
  onTokenChange: (id: string) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sectionConfig = getSectionConfig(category);
  
  // 始终显示二级导航栏，即使没有items也要显示（保持布局一致性）
  if (!sectionConfig) return null;

  const items = sectionConfig.items || [];

  // 路由映射函数
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
          items.map(item => (
            <button
              key={item.id}
              className={`token-nav__item ${activeToken === item.id ? 'active' : ''}`}
              onClick={() => handleItemClick(item.id)}
            >
              <span className="token-nav__icon">{item.icon}</span>
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
