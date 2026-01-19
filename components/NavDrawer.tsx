'use client';

import { navigationConfig } from '../config/navigation';
import { getSectionConfig } from '../config/navigation';
import Icon from './Icon';

interface NavDrawerProps {
  isOpen: boolean;
  activeCategory: string;
  activeToken: string;
  onClose: () => void;
  onCategoryChange: (id: string) => void;
  onTokenChange: (id: string) => void;
}

export default function NavDrawer({
  isOpen,
  activeCategory,
  activeToken,
  onClose,
  onCategoryChange,
  onTokenChange
}: NavDrawerProps) {
  const currentSection = getSectionConfig(activeCategory);

  // 如果未打开，不渲染 overlay 和 panel，避免影响布局
  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Fullscreen Drawer Panel */}
      <aside className={`nav-drawer-panel ${isOpen ? 'open' : ''}`}>
        <div className="nav-drawer__fullscreen-content">
          <nav className="nav-drawer__full-nav">
            {navigationConfig.map(section => (
              <div key={section.id} className="nav-drawer__full-section">
                <div 
                  className={`nav-drawer__full-section-header ${activeCategory === section.id ? 'active' : ''}`}
                  onClick={() => onCategoryChange(section.id)}
                >
                  <Icon 
                    name={section.iconClass}
                    size={24}
                    className="nav-drawer__full-section-icon"
                  />
                  <span>{section.label}</span>
                </div>
                
                {/* 总是显示当前激活 section 的 items，或者根据设计展示所有 */}
                <div className="nav-drawer__full-items">
                  {section.items.map(item => (
                    <button
                      key={item.id}
                      className={`nav-drawer__full-item ${activeToken === item.id ? 'active' : ''}`}
                      onClick={() => {
                        onCategoryChange(section.id);
                        onTokenChange(item.id);
                      }}
                    >
                      <span className="nav-drawer__full-item-icon">{item.icon}</span>
                      <span className="nav-drawer__full-item-label">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>
      
      <style jsx>{`
        .nav-drawer-panel {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          background: var(--background-primary, #FFFFFF);
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
          padding: calc(var(--header-height) + 32px) 20px 64px;
          flex: 1;
          max-width: 600px;
          margin: 0 auto;
          width: 100%;
        }

        .nav-drawer__full-nav {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .nav-drawer__full-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .nav-drawer__full-section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--foreground-tertiary);
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .nav-drawer__full-section-header.active {
          color: var(--color-ui-primary);
          border-bottom-color: var(--color-ui-primary);
        }

        .nav-drawer__full-items {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        @media (max-width: 480px) {
          .nav-drawer__full-items {
            grid-template-columns: 1fr;
          }
        }

        .nav-drawer__full-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border: 1px solid transparent;
          background: var(--fill-secondary, #F4F4F5);
          border-radius: var(--radius-md, 8px);
          text-align: left;
          font-size: 15px;
          color: var(--foreground-secondary);
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .nav-drawer__full-item:active {
          background: var(--state-pressed);
          transform: scale(0.98);
        }

        .nav-drawer__full-item.active {
          background: var(--state-selected);
          color: var(--foreground-primary);
          font-weight: 600;
          border-color: var(--color-ui-primary);
        }

        .nav-drawer__full-item-icon {
          font-size: 18px;
        }

        [data-theme='dark'] .nav-drawer-panel {
          background: var(--yami-color-background-dark);
        }

        [data-theme='dark'] .nav-drawer__full-item {
          background: rgba(255, 255, 255, 0.04);
        }
        
        [data-theme='dark'] .nav-drawer__full-item.active {
          background: rgba(255, 0, 0, 0.1);
        }
      `}</style>
    </>
  );
}
