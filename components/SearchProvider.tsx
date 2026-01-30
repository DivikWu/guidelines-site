'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useEventListener } from '@/hooks/useEventListener';

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

  const toggleSearchRef = useRef(toggleSearch);
  const closeSearchRef = useRef(closeSearch);
  toggleSearchRef.current = toggleSearch;
  closeSearchRef.current = closeSearch;

  // 全局快捷键：稳定 handler + useEventListener，passive: false 以 allow preventDefault
  const handleKeyDown = useCallback((e: Event) => {
    const ev = e as KeyboardEvent;
    if (ev.repeat) return;
    const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
    const isCmdK = (isMac && ev.metaKey && ev.key === 'k') || (!isMac && ev.ctrlKey && ev.key === 'k');
    if (isCmdK) {
      ev.preventDefault();
      toggleSearchRef.current();
    }
    if (ev.key === 'Escape' && isOpenRef.current) {
      closeSearchRef.current();
    }
  }, []);
  useEventListener(typeof window !== 'undefined' ? window : null, 'keydown', handleKeyDown, { passive: false });

  const pathname = usePathname();
  useEffect(() => {
    closeSearch();
  }, [pathname, closeSearch]);

  return (
    <SearchContext.Provider value={{ isOpen, openSearch, closeSearch, toggleSearch, preloadSearch }}>
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
