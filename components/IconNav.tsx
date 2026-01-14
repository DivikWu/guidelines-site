'use client';

import { navigationConfig } from '../config/navigation';

export default function IconNav({ 
  className = '',
  activeCategory, 
  onCategoryChange 
}: { 
  className?: string;
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}) {
  return (
    <nav className={`icon-nav ${className}`}>
      {navigationConfig.map(section => (
        <button
          key={section.id}
          className={`icon-nav__item ${activeCategory === section.id ? 'active' : ''}`}
          onClick={() => onCategoryChange(section.id)}
          aria-label={section.label}
          title={section.label}
        >
          <span className="icon-nav__icon">
            <img 
              src={section.iconPath} 
              alt={section.label}
              width={20}
              height={20}
              style={{ display: 'block' }}
              loading={section.id === 'foundations' ? 'eager' : 'lazy'}
              fetchPriority={section.id === 'foundations' ? 'high' : 'auto'}
            />
          </span>
          <span className="icon-nav__label">{section.label}</span>
        </button>
      ))}
    </nav>
  );
}
