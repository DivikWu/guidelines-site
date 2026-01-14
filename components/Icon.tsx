interface IconProps {
  name: string;
  className?: string;
  title?: string;
  size?: number; // 图标大小（px），默认 20
}

export default function Icon({ name, className = '', title, size = 20 }: IconProps) {
  // 默认样式：inline-flex 确保对齐，align-middle 垂直居中，leading-none 避免行高影响
  const defaultClassName = 'inline-flex align-middle leading-none';
  const iconClassName = `iconfont ${name} ${defaultClassName} ${className}`.trim();
  
  // #region agent log
  if (typeof window !== 'undefined') {
    // 检查字体是否已加载和图标规则
    const checkFontLoaded = () => {
      try {
        const basePath = window.location.pathname.split('/')[1] || '';
        
        // 检查字体加载状态
        let fontLoaded = false;
        let fontStatus = 'unknown';
        if (document.fonts && document.fonts.check) {
          fontLoaded = document.fonts.check('16px iconfont');
          fontStatus = fontLoaded ? 'loaded' : 'not-loaded';
        }
        
        // 检查所有字体
        const allFonts = document.fonts ? Array.from(document.fonts).map(f => ({
          family: f.family,
          status: f.status,
          loaded: f.loaded
        })) : [];
        
        // 检查当前元素的 computed style
        const iconElements = document.querySelectorAll(`.${name}`);
        let elementInfo = null;
        if (iconElements.length > 0) {
          const firstEl = iconElements[0];
          const computed = window.getComputedStyle(firstEl);
          const beforeComputed = window.getComputedStyle(firstEl, '::before');
          elementInfo = {
            fontFamily: computed.fontFamily,
            fontSize: computed.fontSize,
            content: beforeComputed.content,
            display: beforeComputed.display,
            visibility: beforeComputed.visibility,
            width: beforeComputed.width,
            height: beforeComputed.height
          };
        }
        
        const logData = {
          location: 'Icon.tsx:checkFontLoaded',
          message: 'Font and icon element check',
          data: {
            fontLoaded,
            fontStatus,
            iconName: name,
            iconClassName: iconClassName,
            basePath,
            currentPath: window.location.pathname,
            allFonts,
            elementInfo,
            elementCount: iconElements.length
          },
          timestamp: Date.now(),
          sessionId: 'debug-session',
          runId: 'run2',
          hypothesisId: 'C'
        };
        
        fetch('http://127.0.0.1:7243/ingest/bec5ef14-f4e7-4569-92de-812c24e45b28', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(logData)
        }).catch(() => {
          console.log('[DEBUG]', JSON.stringify(logData));
        });
      } catch (e) {
        fetch('http://127.0.0.1:7243/ingest/bec5ef14-f4e7-4569-92de-812c24e45b28', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'Icon.tsx:checkFontLoaded',
            message: 'Font check error',
            data: { error: String(e), iconName: name },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run2',
            hypothesisId: 'C'
          })
        }).catch(() => {
          console.log('[DEBUG] Error:', String(e));
        });
      }
    };
    
    // 延迟检查以确保 DOM 已渲染
    setTimeout(checkFontLoaded, 500);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setTimeout(checkFontLoaded, 200);
      });
    }
  }
  // #endregion
  
  return (
    <i
      className={iconClassName}
      style={{ fontSize: `${size}px` }}
      role={title ? 'img' : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : 'true'}
    />
  );
}
