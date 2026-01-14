'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const TokenContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: 'light',
  toggle: () => {}
});

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  // #region agent log
  const isServer = typeof window === 'undefined';
  fetch('http://127.0.0.1:7243/ingest/bec5ef14-f4e7-4569-92de-812c24e45b28',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TokenProvider.tsx:12',message:'TokenProvider render',data:{isServer},timestamp:Date.now(),sessionId:'debug-session',runId:'hydrate-debug',hypothesisId:'H2'})}).catch(()=>{});
  // #endregion
  const [theme, setTheme] = useState<Theme>('light');
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/bec5ef14-f4e7-4569-92de-812c24e45b28',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TokenProvider.tsx:17',message:'TokenProvider theme state',data:{theme,isServer},timestamp:Date.now(),sessionId:'debug-session',runId:'hydrate-debug',hypothesisId:'H2'})}).catch(()=>{});
  // #endregion

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/bec5ef14-f4e7-4569-92de-812c24e45b28',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TokenProvider.tsx:24',message:'TokenProvider effect (client only)',data:{theme,hasDocument:typeof document !== 'undefined'},timestamp:Date.now(),sessionId:'debug-session',runId:'hydrate-debug',hypothesisId:'H2'})}).catch(()=>{});
    // #endregion
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
