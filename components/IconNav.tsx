'use client';

import { navigationConfig } from '../config/navigation';
import Icon from './Icon';

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
            <Icon 
              name={section.iconClass}
              title={section.label}
              size={20}
              className="block leading-none"
            />
          </span>
          <span className="icon-nav__label">{section.label}</span>
        </button>
      ))}
    </nav>
  );
}
