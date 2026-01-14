'use client';

import { useEffect } from 'react';

export default function FontDebugger() {
  useEffect(() => {
    // #region agent log
    // 检查字体文件加载状态
    const checkFontFiles = () => {
      const basePath = window.location.pathname.split('/')[1] || '';
      const fontPaths = [
        '/fonts/icofont/icofont.woff2',
        '/guidelines-site/fonts/icofont/icofont.woff2',
        basePath ? `/${basePath}/fonts/icofont/icofont.woff2` : '/fonts/icofont/icofont.woff2'
      ];
      
      fontPaths.forEach((path, idx) => {
        fetch(path, { method: 'HEAD' })
          .then(res => {
            const logData = {
              location: 'FontDebugger.tsx:checkFontFiles',
              message: 'Font file accessibility check',
              data: {
                path,
                status: res.status,
                statusText: res.statusText,
                accessible: res.ok,
                basePath,
                currentPath: window.location.pathname
              },
              timestamp: Date.now(),
              sessionId: 'debug-session',
              runId: 'run1',
              hypothesisId: idx === 0 ? 'B' : idx === 1 ? 'D' : 'B'
            };
            // Try HTTP first, fallback to console
            fetch('http://127.0.0.1:7243/ingest/bec5ef14-f4e7-4569-92de-812c24e45b28', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(logData)
            }).catch(() => {
              console.log('[DEBUG]', JSON.stringify(logData));
            });
          })
          .catch(err => {
            const logData = {
              location: 'FontDebugger.tsx:checkFontFiles',
              message: 'Font file check error',
              data: {
                path,
                error: String(err),
                basePath
              },
              timestamp: Date.now(),
              sessionId: 'debug-session',
              runId: 'run1',
              hypothesisId: 'B'
            };
            fetch('http://127.0.0.1:7243/ingest/bec5ef14-f4e7-4569-92de-812c24e45b28', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(logData)
            }).catch(() => {
              console.log('[DEBUG]', JSON.stringify(logData));
            });
          });
      });
      
      // 检查 CSS 中定义的字体路径和图标规则
      const styleSheets = Array.from(document.styleSheets);
      styleSheets.forEach((sheet, sheetIdx) => {
        try {
          const rules = Array.from(sheet.cssRules || []);
          rules.forEach((rule, ruleIdx) => {
            if (rule instanceof CSSFontFaceRule) {
              const src = rule.style.getPropertyValue('src');
              const logData = {
                location: 'FontDebugger.tsx:checkFontFiles',
                message: 'CSS @font-face rule found',
                data: {
                  fontFamily: rule.style.getPropertyValue('font-family'),
                  src,
                  basePath,
                  currentPath: window.location.pathname
                },
                timestamp: Date.now(),
                sessionId: 'debug-session',
                runId: 'run2',
                hypothesisId: 'A'
              };
              fetch('http://127.0.0.1:7243/ingest/bec5ef14-f4e7-4569-92de-812c24e45b28', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(logData)
              }).catch(() => {
                console.log('[DEBUG]', JSON.stringify(logData));
              });
            }
            // 检查图标类的 content 规则
            if (rule instanceof CSSStyleRule && rule.selectorText && rule.selectorText.includes('ds-icon-dashboard-circle')) {
              const content = rule.style.getPropertyValue('content');
              const logData = {
                location: 'FontDebugger.tsx:checkFontFiles',
                message: 'Icon class rule found',
                data: {
                  selector: rule.selectorText,
                  content,
                  fontFamily: rule.style.getPropertyValue('font-family'),
                  basePath
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
            }
          });
        } catch (e) {
          // 跨域样式表可能无法访问
        }
      });
      
      // 检查实际图标元素的 computed style
      const iconElements = document.querySelectorAll('.ds-icon-dashboard-circle');
      iconElements.forEach((el, idx) => {
        const computed = window.getComputedStyle(el, '::before');
        const logData = {
          location: 'FontDebugger.tsx:checkFontFiles',
          message: 'Icon element computed style',
          data: {
            elementIndex: idx,
            fontFamily: computed.fontFamily,
            content: computed.content,
            display: computed.display,
            visibility: computed.visibility,
            className: el.className,
            basePath
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
      });
      
      // 检查网络请求中的字体文件
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name.includes('icofont') || entry.name.includes('font')) {
            fetch('http://127.0.0.1:7243/ingest/bec5ef14-f4e7-4569-92de-812c24e45b28', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                location: 'FontDebugger.tsx:performanceObserver',
                message: 'Font resource loaded',
                data: {
                  name: entry.name,
                  duration: entry.duration,
                  transferSize: (entry as any).transferSize,
                  basePath
                },
                timestamp: Date.now(),
                sessionId: 'debug-session',
                runId: 'run1',
                hypothesisId: 'B'
              })
            }).catch(() => {});
          }
        }
      });
      
      try {
        observer.observe({ entryTypes: ['resource'] });
      } catch (e) {
        // PerformanceObserver may not be supported
      }
    };
    
    // 延迟检查以确保 DOM 已渲染
    setTimeout(checkFontFiles, 500);
    
    // 监听字体加载事件
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        checkFontFiles();
      });
    }
    // #endregion
  }, []);
  
  return null;
}
