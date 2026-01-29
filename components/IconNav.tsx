'use client';

import { navigationConfig } from '../config/navigation';
import Icon from './Icon';
import Tooltip from './Tooltip';
import { useRouter, usePathname } from 'next/navigation';
import { getSectionIcon } from '../config/content-icons';
import type { ContentTree } from '@/lib/content/tree';

export default function IconNav({ 
  className = '',
  activeCategory, 
  onCategoryChange,
  contentTree = null,
}: { 
  className?: string;
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  contentTree?: ContentTree | null;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const getSectionRoute = (sectionId: string) => {
    if (contentTree) {
      const section = contentTree.sections.find((s) => s.id === sectionId);
      const firstFile = section?.items[0];
      if (section && firstFile) {
        return `/docs/${encodeURIComponent(sectionId)}/${encodeURIComponent(firstFile.id)}`;
      }
      return null;
    }
    if (sectionId === 'getting-started') return '/getting-started/introduction';
    if (sectionId === 'brand') return '/foundations/brand';
    if (sectionId === 'foundations') return '/foundations';
    if (sectionId === 'components') return '/components';
    if (sectionId === 'content') return '/content';
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
    return activeCategory;
  };

  const displayLabel = (raw: string) => {
    const i = raw.indexOf("_");
    return i >= 0 ? raw.slice(i + 1) : raw;
  };

  if (contentTree) {
    return (
      <nav className={`icon-nav ${className}`}>
        {contentTree.sections.map((section) => {
          const isActive = getActiveCategory() === section.id;
          const label = displayLabel(section.label);
          return (
            <Tooltip key={section.id} content={label} position="right">
              <button
                className={`icon-nav__item ${isActive ? 'active' : ''}`}
                onClick={() => handleCategoryClick(section.id)}
                aria-label={label}
              >
                <span className="icon-nav__icon" aria-hidden>
                  <Icon
                    name={getSectionIcon(section.id)}
                    size={20}
                    className="block leading-none"
                  />
                </span>
                <span className="icon-nav__label sr-only">{label}</span>
              </button>
            </Tooltip>
          );
        })}
      </nav>
    );
  }

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
              <span className="icon-nav__label sr-only">{section.label}</span>
            </button>
          </Tooltip>
        );
      })}
    </nav>
  );
}
