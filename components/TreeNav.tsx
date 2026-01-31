'use client';

import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { navigationConfig } from '../config/navigation';
import { getSectionIcon } from '../config/content-icons';
import Icon from './Icon';
import {
  displayLabel,
  getItemRoute,
  isContentTreeSection,
} from '@/lib/nav-utils';
import type { ContentTree } from '@/lib/content/tree';

interface NavSection {
  id: string;
  label: string;
  items: { id: string; label: string }[];
  iconClass?: string;
}

export interface TreeNavProps {
  activeCategory: string;
  activeToken: string;
  onCategoryChange: (id: string) => void;
  onTokenChange: (id: string) => void;
  contentTree: ContentTree | null;
  onItemClick?: () => void;
  onNavigationStart?: (route: string) => void;
}

function TreeNavInner({
  activeCategory,
  activeToken,
  onCategoryChange,
  onTokenChange,
  contentTree = null,
  onItemClick,
  onNavigationStart,
}: TreeNavProps) {
  const router = useRouter();
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(
    activeCategory
  );

  useEffect(() => {
    setExpandedSectionId(activeCategory || null);
  }, [activeCategory]);

  const sections = useMemo((): NavSection[] => {
    if (contentTree) {
      return contentTree.sections;
    }
    return navigationConfig.filter((s) => s.id !== 'home') as NavSection[];
  }, [contentTree]);

  const handleSectionClick = useCallback(
    (sectionId: string) => {
      const newExpanded = expandedSectionId === sectionId ? null : sectionId;
      setExpandedSectionId(newExpanded);
      onCategoryChange(sectionId);
    },
    [expandedSectionId, onCategoryChange]
  );

  const handleItemClick = useCallback(
    (itemId: string, sectionId: string) => {
      const route = getItemRoute(itemId, sectionId, contentTree);
      if (route) {
        onNavigationStart?.(route);
        router.push(route);
      }
      onCategoryChange(sectionId);
      onTokenChange(itemId);
      onItemClick?.();
    },
    [contentTree, onCategoryChange, onTokenChange, onItemClick, onNavigationStart, router]
  );

  return (
    <nav className="tree-nav" aria-label="主导航">
      {sections.map((section) => {
        const isExpanded = expandedSectionId === section.id;
        const isActive = activeCategory === section.id;
        const isTriggerActive = isActive && !isExpanded;
        const useContentTree = isContentTreeSection(section, contentTree);
        const regionId = `tree-nav-region-${section.id}`;

        return (
          <div key={section.id} className="tree-nav__section">
            <button
              type="button"
              className={`tree-nav__trigger ${isTriggerActive ? 'active' : ''} ${isExpanded ? 'expanded' : ''} ${isActive ? 'is-active-section' : ''}`}
              aria-expanded={isExpanded}
              aria-controls={regionId}
              onClick={() => handleSectionClick(section.id)}
            >
              <span className="tree-nav__trigger-icon" aria-hidden>
                <Icon
                  name={
                    useContentTree
                      ? getSectionIcon(section.id)
                      : (section.iconClass ?? 'ds-icon-folder-02')
                  }
                  size={20}
                  className="tree-nav__trigger-icon-original block leading-none"
                />
                <Icon
                  name="ds-icon-arrow-right-01"
                  size={20}
                  className="tree-nav__trigger-icon-right block leading-none"
                />
                {isActive && (
                  <Icon
                    name="ds-icon-arrow-down-01"
                    size={20}
                    className="tree-nav__trigger-icon-down block leading-none"
                  />
                )}
              </span>
              <span className="tree-nav__trigger-label">
                {displayLabel(section.label)}
              </span>
              <span className="tree-nav__trigger-count" aria-hidden>
                {section.items.length}
              </span>
            </button>

            <div
              id={regionId}
              className={`tree-nav__group ${isExpanded ? 'expanded' : ''}`}
              role="group"
              aria-label={displayLabel(section.label)}
              aria-hidden={!isExpanded}
            >
              <div className="tree-nav__group-inner">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`tree-nav__subitem ${activeToken === item.id ? 'active' : ''}`}
                    onClick={() => handleItemClick(item.id, section.id)}
                  >
                    <span className="tree-nav__subitem-label">
                      {displayLabel(item.label)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}

export default memo(TreeNavInner);
