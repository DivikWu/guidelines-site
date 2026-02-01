'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark';

const TokenContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: 'light',
  toggle: () => {}
});

/** 与根 layout 内联脚本同一 key，保证主题单一数据源 */
const THEME_STORAGE_KEY = 'yami-theme';

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  // 首屏固定为 light，保证服务端与客户端水合时一致，避免水合错误
  const [theme, setTheme] = useState<Theme>('light');

  // 挂载后从 localStorage 同步用户上次选择的主题（与根 layout 内联脚本同一 key）
  useEffect(() => {
    if (typeof document === 'undefined') return;
    try {
      const t = localStorage.getItem(THEME_STORAGE_KEY);
      const stored = (t === 'dark' || t === 'light') ? t : 'light';
      setTheme(stored);
    } catch {
      // ignore
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch (e) {
        // ignore
      }
      return next;
    });
  }, []);

  // 主题变化时同步到 DOM，供 CSS 与 layout 脚本一致（首帧防闪由 layout 脚本负责）
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = theme;
    }
  }, [theme]);

  const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);

  return (
    <TokenContext.Provider value={value}>
      {children}
    </TokenContext.Provider>
  );
};

export const useTokenTheme = () => useContext(TokenContext);
