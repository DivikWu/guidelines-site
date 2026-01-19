'use client';

import { navigationConfig } from '../config/navigation';
import Icon from './Icon';
import Tooltip from './Tooltip';

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
        <Tooltip key={section.id} content={section.label} position="right">
          <button
            className={`icon-nav__item ${activeCategory === section.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(section.id)}
            aria-label={section.label}
          >
            <span className="icon-nav__icon">
              <Icon 
                name={section.iconClass}
                size={20}
                className="block leading-none"
              />
            </span>
            {/* 仅在小屏或展开模式下可能需要 Label，但根据需求，侧栏不再展开 */}
            <span className="icon-nav__label sr-only">{section.label}</span>
          </button>
        </Tooltip>
      ))}
    </nav>
  );
}
