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
      {/* Overlay */}
      <div 
        className="nav-drawer-overlay active"
        onClick={onClose}
        aria-hidden={false}
      />
      
      {/* Drawer Panel */}
      <aside className="nav-drawer-panel open">
        {/* 左右两列容器 */}
        <div className="nav-drawer__container">
          {/* 左列：一级导航 */}
          <div className="nav-drawer__primary">
            <nav className="nav-drawer__sections">
              {navigationConfig.map(section => (
                <button
                  key={section.id}
                  className={`nav-drawer__section-item ${activeCategory === section.id ? 'active' : ''}`}
                  onClick={() => {
                    onCategoryChange(section.id);
                    // 切换 section 后不关闭 drawer，让用户看到新的二级列表
                  }}
                  aria-label={section.label}
                >
                  <Icon 
                    name={section.iconClass}
                    size={20}
                    className="leading-none"
                  />
                  <span>{section.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* 右列：二级导航 */}
          {currentSection && (
            <div className="nav-drawer__secondary">
              <div className="nav-drawer__header">
                <h2 className="nav-drawer__title">{currentSection.label}</h2>
              </div>
              <nav className="nav-drawer__list">
                {currentSection.items.length > 0 ? (
                  currentSection.items.map(item => (
                    <button
                      key={item.id}
                      className={`nav-drawer__item ${activeToken === item.id ? 'active' : ''}`}
                      onClick={() => {
                        onTokenChange(item.id);
                        onClose(); // 点击后关闭 drawer
                      }}
                    >
                      <span className="nav-drawer__item-icon">{item.icon}</span>
                      <span className="nav-drawer__item-label">{item.label}</span>
                    </button>
                  ))
                ) : (
                  <div className="nav-drawer__empty">
                    <p className="nav-drawer__empty-text">暂无内容</p>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
