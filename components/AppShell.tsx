'use client';

import Header from './Header';
import IconNav from './IconNav';
import TokenNav from './TokenNav';
import NavDrawer from './NavDrawer';
import DocContent from './DocContent';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { DocPage } from '../data/docs';
import { getSectionConfig, findSectionByItemId } from '../config/navigation';

export default function AppShell({ docs }: { docs: DocPage[] }) {
  const [category, setCategory] = useState<string>('foundations');
  const [activeToken, setActiveToken] = useState<string>('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prevPathname, setPrevPathname] = useState<string>('');
  const pathname = usePathname();

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

  // 检测是否为移动端（使用与 CSS 一致的断点 1024px）
  // 使用 matchMedia 确保稳定判断，避免 resize 时频繁触发
  useEffect(() => {
    // 使用 matchMedia 进行稳定判断
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    
    const checkMobile = () => {
      const mobile = mediaQuery.matches;
      const wasMobile = isMobile;
      setIsMobile(mobile);
      
      // 仅在跨越断点时关闭 drawer：
      // 1. 从小屏变为大屏：强制关闭 drawer
      // 2. 从大屏变为小屏：保持 drawer 状态（不自动关闭）
      if (wasMobile && !mobile && mobileOpen) {
        // 从小屏变为大屏，关闭 drawer
        setMobileOpen(false);
      }
      // 注意：从大屏变为小屏时，不自动关闭 drawer，让用户保持当前状态
    };

    // 初始检查
    checkMobile();
    
    // 使用 matchMedia 的 change 事件，比 resize 更稳定
    mediaQuery.addEventListener('change', checkMobile);
    return () => mediaQuery.removeEventListener('change', checkMobile);
  }, [isMobile, mobileOpen]);

  // 路由切换后自动关闭 drawer（小屏）
  // 仅在 pathname 真正变化时关闭，避免初始渲染时误关闭
  useEffect(() => {
    // 初始化 prevPathname
    if (!prevPathname) {
      setPrevPathname(pathname);
      return;
    }
    
    // 仅在 pathname 真正变化且 drawer 打开时关闭
    if (isMobile && mobileOpen && pathname !== prevPathname) {
      setMobileOpen(false);
    }
    
    // 更新 prevPathname
    setPrevPathname(pathname);
  }, [pathname, isMobile, mobileOpen, prevPathname]);


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
      
      {/* 小屏单列 Drawer - 始终渲染，通过 CSS 控制显示/隐藏 */}
      <NavDrawer
        isOpen={isMobile && mobileOpen}
        activeCategory={category}
        activeToken={activeToken}
        onClose={() => setMobileOpen(false)}
        onCategoryChange={(id) => {
          setCategory(id);
          // 切换 section 时不关闭 drawer，让用户看到新的二级列表
        }}
        onTokenChange={(id) => {
          setActiveToken(id);
          setMobileOpen(false);
          setTimeout(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      />

      <div className="app-body">
        {/* 桌面端双栏导航 */}
        {!isMobile && (
          <>
            <IconNav 
              className=""
              activeCategory={category}
              onCategoryChange={(id) => {
                setCategory(id);
              }}
            />
            <TokenNav
              className=""
              category={category}
              activeToken={activeToken}
              onTokenChange={(id) => {
                setActiveToken(id);
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </>
        )}
        
        {/* 内容区（桌面/小屏共用） */}
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
