'use client';

import { getSectionConfig } from '../config/navigation';

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
  const sectionConfig = getSectionConfig(category);
  
  // 始终显示二级导航栏，即使没有items也要显示（保持布局一致性）
  if (!sectionConfig) return null;

  const items = sectionConfig.items || [];

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
              onClick={() => onTokenChange(item.id)}
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
