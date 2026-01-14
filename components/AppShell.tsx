'use client';

import Header from './Header';
import IconNav from './IconNav';
import TokenNav from './TokenNav';
import DocContent from './DocContent';
import { useState, useEffect } from 'react';
import { DocPage } from '../data/docs';
import { getSectionConfig, findSectionByItemId } from '../config/navigation';

export default function AppShell({ docs }: { docs: DocPage[] }) {
  const [category, setCategory] = useState<string>('foundations');
  const [activeToken, setActiveToken] = useState<string>('overview');
  const [mobileOpen, setMobileOpen] = useState(false);

  // 当 category 变化时，自动选择第一个 token
  useEffect(() => {
    const sectionConfig = getSectionConfig(category);
    if (sectionConfig) {
      const itemIds = sectionConfig.items.map(item => item.id);
      // 如果当前 activeToken 不在新分类的 items 中，切换到默认或第一个 item
      if (itemIds.length > 0 && !itemIds.includes(activeToken)) {
        setActiveToken(sectionConfig.defaultItem || itemIds[0]);
      }
    }
  }, [category, activeToken]);

  useEffect(() => {
    const onScroll = () => {
      const sections = docs.map(d => document.getElementById(d.id)).filter(Boolean) as HTMLElement[];
      const current = sections.find(section => {
        const rect = section.getBoundingClientRect();
        return rect.top <= window.innerHeight * 0.3 && rect.bottom >= window.innerHeight * 0.3;
      });
      if (current && current.id !== activeToken) setActiveToken(current.id);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [activeToken, docs]);

  // 小屏 drawer 打开时锁定背景滚动
  useEffect(() => {
    if (mobileOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [mobileOpen]);

  // ESC 键关闭 drawer
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [mobileOpen]);


  const handleSearchSelect = (pageId: string) => {
    // 根据 pageId 找到对应的 section
    const sectionId = findSectionByItemId(pageId);
    if (sectionId) {
      setCategory(sectionId);
    }

    // 设置激活的 token 并滚动
    setActiveToken(pageId);
    setMobileOpen(false);
    setTimeout(() => {
      document.getElementById(pageId)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="app-shell" suppressHydrationWarning>
      <Header 
        onToggleSidebar={() => setMobileOpen(v => !v)} 
        docs={docs}
        onSearchSelect={handleSearchSelect}
      />
      {/* 小屏遮罩层 */}
      <div 
        className={`drawer-overlay ${mobileOpen ? 'active' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      />
      <div className="app-body">
        <IconNav 
          className={mobileOpen ? 'open' : ''}
          activeCategory={category}
          onCategoryChange={(id) => {
            setCategory(id);
            setMobileOpen(false);
          }}
        />
        <TokenNav
          className={mobileOpen ? 'open' : ''}
          category={category}
          activeToken={activeToken}
          onTokenChange={(id) => {
            setActiveToken(id);
            setMobileOpen(false);
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
        <main className="content" id="main-content">
          {docs.map(page => (
            <DocContent
              key={page.id}
              page={page}
              hidden={page.id !== activeToken}
            />
          ))}
        </main>
      </div>
    </div>
  );
}
