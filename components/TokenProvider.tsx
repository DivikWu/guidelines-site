'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const TokenContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: 'light',
  toggle: () => {}
});

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === 'undefined') return 'light';
    const t = document.documentElement.dataset.theme;
    return (t === 'dark' || t === 'light') ? t : 'light';
  });

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('yami-theme', next);
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

  return (
    <TokenContext.Provider value={{ theme, toggle }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useTokenTheme = () => useContext(TokenContext);
