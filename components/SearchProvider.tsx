'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface SearchContextType {
  isOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openSearch = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // 全局快捷键监听（在这里统一管理，确保唯一性）
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 防止长按引起的重复触发
      if (e.repeat) return;

      const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
      const isCmdK = (isMac && e.metaKey && e.key === 'k') || (!isMac && e.ctrlKey && e.key === 'k');
      
      if (isCmdK) {
        e.preventDefault();
        toggleSearch();
      }

      if (e.key === 'Escape' && isOpen) {
        closeSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggleSearch, closeSearch]);

  return (
    <SearchContext.Provider value={{ isOpen, openSearch, closeSearch, toggleSearch }}>
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
