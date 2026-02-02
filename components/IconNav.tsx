'use client';

import { navigationConfig } from '../config/navigation';
import Icon from './Icon';
import Tooltip from './Tooltip';
import { useRouter, usePathname } from 'next/navigation';

export default function IconNav({ 
  className = '',
  activeCategory, 
  onCategoryChange 
}: { 
  className?: string;
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const getSectionRoute = (sectionId: string) => {
    if (sectionId === 'home') return '/';
    if (sectionId === 'foundations') return '/overview';
    if (sectionId === 'components') return '/foundations/brand';
    if (sectionId === 'tokens') return '/foundations';
    if (sectionId === 'patterns') return '/components';
    if (sectionId === 'resources') return '/resources';
    return null;
  };

  const handleCategoryClick = (sectionId: string) => {
    const route = getSectionRoute(sectionId);
    if (route && route !== pathname) {
      router.push(route);
      return;
    }
    onCategoryChange(sectionId);
  };

  // 根据当前路径确定 active category
  const getActiveCategory = () => {
    if (pathname === '/') return 'home';
    return activeCategory;
  };

  return (
    <nav className={`icon-nav ${className}`}>
      {navigationConfig.filter(section => section.id !== 'home').map(section => {
        const isActive = getActiveCategory() === section.id;
        return (
          <Tooltip key={section.id} content={section.label} position="right">
            <button
              className={`icon-nav__item ${isActive ? 'active' : ''}`}
              onClick={() => handleCategoryClick(section.id)}
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
        );
      })}
    </nav>
  );
}
