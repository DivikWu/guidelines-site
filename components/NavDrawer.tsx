'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { navigationConfig } from '../config/navigation';
import { getSectionIcon } from '../config/content-icons';
import Icon from './Icon';
import type { ContentTree } from '@/lib/content/tree';

interface NavDrawerProps {
  isOpen: boolean;
  activeCategory: string;
  activeToken: string;
  onClose: () => void;
  onCategoryChange: (id: string) => void;
  onTokenChange: (id: string) => void;
  contentTree?: ContentTree | null;
}

export default function NavDrawer({
  isOpen,
  activeCategory,
  activeToken,
  onClose,
  onCategoryChange,
  onTokenChange,
  contentTree = null,
}: NavDrawerProps) {
  const router = useRouter();

  // Mobile-only: Accordion behavior (one open at a time). Hooks must run before any conditional return.
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(activeCategory);

  // When current activeCategory changes while drawer is open, auto-expand it
  useEffect(() => {
    setExpandedSectionId(activeCategory || null);
  }, [activeCategory]);

  const sections = useMemo(() => {
    if (contentTree) {
      return contentTree.sections;
    }
    return navigationConfig.filter(section => section.id !== 'home');
  }, [contentTree]);

  // 路由映射函数（与 TokenNav 保持一致）
  const getItemRoute = (itemId: string, sectionId: string) => {
    if (contentTree) {
      return `/docs/${encodeURIComponent(sectionId)}/${encodeURIComponent(itemId)}`;
    }
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

  const getSectionRoute = (sectionId: string) => {
    if (contentTree) {
      const section = contentTree.sections.find((s) => s.id === sectionId);
      const firstFile = section?.items[0];
      if (section && firstFile) {
        return `/docs/${encodeURIComponent(sectionId)}/${encodeURIComponent(firstFile.id)}`;
      }
      return null;
    }
    if (sectionId === 'home') return '/';
    if (sectionId === 'getting-started') return '/getting-started/introduction';
    if (sectionId === 'brand') return '/foundations/brand';
    if (sectionId === 'foundations') return '/foundations';
    if (sectionId === 'components') return '/components';
    if (sectionId === 'content') return '/content';
    if (sectionId === 'resources') return '/resources';
    return null;
  };

  const isContentTreeSection = (s: { id: string; label: string; items: { id: string; label: string }[] }) =>
    contentTree && contentTree.sections.some((sec) => sec.id === s.id);

  /** 展示名：仅显示 "_" 之后的文本，与 content tree label 规则一致 */
  const displayLabel = (raw: string) => {
    const i = raw.indexOf("_");
    return i >= 0 ? raw.slice(i + 1) : raw;
  };

  // 如果未打开，不渲染 overlay 和 panel，避免影响布局（放在所有 Hooks 之后以符合 Rules of Hooks）
  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Fullscreen Drawer Panel */}
      <aside className={`nav-drawer-panel ${isOpen ? 'open' : ''}`}>
        <div className="nav-drawer__fullscreen-content">
          <nav className="nav-drawer__menu" aria-label="Mobile navigation menu">
            {sections.map((section: { id: string; label: string; items: { id: string; label: string }[]; iconClass?: string }) => {
              const isExpanded = expandedSectionId === section.id;
              const isActive = activeCategory === section.id;
              const useContentTree = isContentTreeSection(section);
              return (
              <div key={section.id} className="nav-drawer__section">
                <button
                  type="button"
                  className={`nav-drawer__section-trigger ${isActive ? 'active' : ''} ${isExpanded ? 'expanded' : ''}`}
                  aria-expanded={isExpanded}
                  onClick={() => {
                    const newExpanded = expandedSectionId === section.id ? null : section.id;
                    setExpandedSectionId(newExpanded);
                    onCategoryChange(section.id);
                  }}
                >
                  {useContentTree ? (
                    <Icon
                      name={getSectionIcon(section.id)}
                      size={20}
                      className="nav-drawer__section-icon"
                    />
                  ) : (
                    <Icon
                      name={(section as { iconClass: string }).iconClass}
                      size={20}
                      className="nav-drawer__section-icon"
                    />
                  )}
                  <span>{displayLabel(section.label)}</span>
                  <span className={`nav-drawer__chevron ${isExpanded ? 'expanded' : ''}`} aria-hidden="true">
                    <Icon name="ds-icon-arrow-right-01" size={16} />
                  </span>
                </button>
                
                <div
                  className={`nav-drawer__group ${isExpanded ? 'expanded' : ''}`}
                  role="group"
                  aria-label={displayLabel(section.label)}
                >
                  <div className="nav-drawer__group-inner">
                    {section.items.map(item => (
                      <button
                        key={item.id}
                        type="button"
                        className="nav-drawer__subitem"
                        onClick={() => {
                          const route = getItemRoute(item.id, section.id);
                          if (route) {
                            router.push(route);
                          }
                          onCategoryChange(section.id);
                          onTokenChange(item.id);
                          onClose();
                        }}
                      >
                        <span className="nav-drawer__subitem-label">{displayLabel(item.label)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              );
            })}
          </nav>
        </div>
      </aside>
      
      <style jsx>{`
        .nav-drawer-panel {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          background: var(--background-primary, var(--color-bg));
          z-index: 1060; /* 确保在 Header (1070) 之下 */
          transform: translateY(-100%);
          transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          visibility: hidden;
        }

        .nav-drawer-panel.open {
          transform: translateY(0);
          visibility: visible;
        }

        .nav-drawer__fullscreen-content {
          padding: calc(var(--header-height) + var(--spacing-100, 8px)) var(--spacing-100, 8px) var(--spacing-600, 48px);
          flex: 1;
          width: 100%;
          height: 100%;
        }

        /* Menu container (matches Figma "Menu") */
        .nav-drawer__menu {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: fit-content;
          gap: 8px;
          padding: 0px;
          background: var(--background-primary, var(--color-bg));
          box-shadow: none;
        }

        .nav-drawer__section {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-050, 4px);
        }

        /* 一级项（Figma TAB/S） */
        .nav-drawer__section-trigger {
          display: flex;
          align-items: center;
          gap: var(--spacing-100, 8px);
          height: 40px;
          width: 100%;
          padding: var(--spacing-100, 8px) var(--spacing-150, 12px) var(--spacing-100, 8px) var(--spacing-150, 12px);
          border: none;
          background: transparent;
          border-radius: var(--radius-full, 999px);
          cursor: pointer;
          color: var(--foreground-primary, var(--color-text-primary));
          font-family: var(--body-m-font-family, var(--font-body));
          font-size: var(--body-m-size, 14px);
          font-weight: var(--body-m-font-weight, var(--fw-regular));
          line-height: var(--body-m-line-height, 20px);
          text-align: left;
        }

        .nav-drawer__section-trigger.active,
        .nav-drawer__section-trigger.expanded {
          background: var(--fill-secondary, var(--state-hover));
        }

        .nav-drawer__section-trigger:active {
          background: var(--state-pressed);
        }

        .nav-drawer__section-trigger:focus-visible {
          outline: 2px solid var(--state-focus);
          outline-offset: 2px;
        }

        .nav-drawer__section-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          color: inherit;
        }

        .nav-drawer__chevron {
          margin-left: auto;
          width: 16px;
          height: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: inherit;
          transform: rotate(0deg);
          transition: transform var(--yami-animation-duration-fast, 150ms) var(--yami-animation-easing-ease-out, ease-out);
        }

        .nav-drawer__chevron.expanded {
          transform: rotate(-90deg); /* arrow-right -> arrow-up */
        }

        /* 二级分组（缩进 + 左侧竖线），带轻量展开动效 */
        .nav-drawer__group {
          padding-left: 20px;
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transform: translateY(-2px);
          transition:
            max-height 200ms var(--yami-animation-easing-ease-out, ease-out),
            opacity 200ms var(--yami-animation-easing-ease-out, ease-out),
            transform 200ms var(--yami-animation-easing-ease-out, ease-out);
        }

        .nav-drawer__group.expanded {
          max-height: 480px;
          opacity: 1;
          transform: translateY(0);
        }

        .nav-drawer__group-inner {
          border-left: 2px solid var(--divider-normal, var(--border-subtle));
          padding-left: 6px;
          padding-top: 8px;
          padding-bottom: 8px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* 二级项（Figma TAB/S 36px） */
        .nav-drawer__subitem {
          display: flex;
          align-items: center;
          height: 36px;
          width: 100%;
          padding: var(--spacing-100, 8px) var(--spacing-150, 12px);
          border: none;
          background: transparent;
          border-radius: var(--radius-full, 999px);
          cursor: pointer;
          color: var(--foreground-primary, var(--color-text-primary));
          font-family: var(--body-m-font-family, var(--font-body));
          font-size: var(--body-m-size, 14px);
          font-weight: var(--body-m-font-weight, var(--fw-regular));
          line-height: var(--body-m-line-height, 20px);
          text-align: left;
        }

        .nav-drawer__subitem:active {
          background: var(--state-pressed);
        }

        .nav-drawer__subitem:hover:not(:active) {
          background: var(--state-hover);
        }

        .nav-drawer__subitem:focus-visible {
          outline: 2px solid var(--state-focus);
          outline-offset: 2px;
        }

        .nav-drawer__subitem-label {
          flex: 1 1 auto;
          min-width: 0;
        }

        [data-theme='dark'] .nav-drawer-panel {
          background: var(--yami-color-background-dark);
        }
      `}</style>
    </>
  );
}
