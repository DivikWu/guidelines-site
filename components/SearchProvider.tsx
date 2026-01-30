'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useGlobalShortcuts } from '@/contexts/GlobalShortcutsContext';

interface SearchContextType {
  isOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  preloadSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  const openSearch = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const preloadSearch = useCallback(() => {
    if (typeof window !== 'undefined') {
      import('@/components/SearchModal');
    }
  }, []);

  // 注册到全局快捷键（单一 keydown 监听，由 GlobalShortcutsProvider 分发）
  const shortcuts = useGlobalShortcuts();
  if (shortcuts) {
    shortcuts.search.toggleRef.current = toggleSearch;
    shortcuts.search.closeRef.current = closeSearch;
    shortcuts.search.isOpenRef.current = isOpen;
  }

  const pathname = usePathname();
  useEffect(() => {
    closeSearch();
  }, [pathname, closeSearch]);

  const value = useMemo(
    () => ({ isOpen, openSearch, closeSearch, toggleSearch, preloadSearch }),
    [isOpen, openSearch, closeSearch, toggleSearch, preloadSearch]
  );

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
