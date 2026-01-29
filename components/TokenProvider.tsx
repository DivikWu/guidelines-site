'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const TokenContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: 'light',
  toggle: () => {}
});

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // 只在客户端运行，避免水合错误
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = theme;
    }
  }, [theme]);

  return (
    <TokenContext.Provider value={{ theme, toggle: () => setTheme(t => t === 'light' ? 'dark' : 'light') }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useTokenTheme = () => useContext(TokenContext);
