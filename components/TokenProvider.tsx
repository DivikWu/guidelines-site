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
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === 'undefined') return 'light';
    try {
      const t = localStorage.getItem(THEME_STORAGE_KEY);
      return (t === 'dark' || t === 'light') ? t : 'light';
    } catch {
      return 'light';
    }
  });

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
