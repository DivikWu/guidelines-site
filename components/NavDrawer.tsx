'use client';

import TreeNav from './TreeNav';
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
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <aside className={`nav-drawer-panel ${isOpen ? 'open' : ''}`}>
        <div className="nav-drawer__fullscreen-content">
          <TreeNav
            activeCategory={activeCategory}
            activeToken={activeToken}
            onCategoryChange={onCategoryChange}
            onTokenChange={onTokenChange}
            contentTree={contentTree}
            onItemClick={onClose}
          />
        </div>
      </aside>

      <style jsx>{`
        .nav-drawer-panel {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          background: var(--background-primary, var(--color-bg));
          z-index: 1060;
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

        [data-theme='dark'] .nav-drawer-panel {
          background: var(--yami-color-background-dark);
        }
      `}</style>
    </>
  );
}
