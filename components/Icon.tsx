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
    // 检查字体是否已加载
    const checkFontLoaded = () => {
      try {
        if (document.fonts && document.fonts.check) {
          const fontLoaded = document.fonts.check('16px iconfont');
          const computedStyle = window.getComputedStyle(document.body);
          const basePath = window.location.pathname.split('/')[1] || '';
          
          fetch('http://127.0.0.1:7243/ingest/bec5ef14-f4e7-4569-92de-812c24e45b28', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              location: 'Icon.tsx:checkFontLoaded',
              message: 'Font loading check',
              data: {
                fontLoaded,
                iconName: name,
                iconClassName: iconClassName,
                basePath,
                currentPath: window.location.pathname,
                fontFamily: computedStyle.fontFamily,
                fontsAvailable: document.fonts ? Array.from(document.fonts).map(f => f.family).join(', ') : 'N/A'
              },
              timestamp: Date.now(),
              sessionId: 'debug-session',
              runId: 'run1',
              hypothesisId: 'A'
            })
          }).catch(() => {});
        }
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
            runId: 'run1',
            hypothesisId: 'A'
          })
        }).catch(() => {});
      }
    };
    
    // 延迟检查以确保 DOM 已渲染
    setTimeout(checkFontLoaded, 100);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        checkFontLoaded();
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
