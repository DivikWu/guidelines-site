'use client';

import React, { createContext, useContext, useRef } from 'react';
import { useEventListener } from '@/hooks/useEventListener';

export interface GlobalShortcutsRefs {
  search: {
    toggleRef: React.MutableRefObject<(() => void) | null>;
    closeRef: React.MutableRefObject<(() => void) | null>;
    isOpenRef: React.MutableRefObject<boolean>;
  };
  drawer: {
    closeRef: React.MutableRefObject<(() => void) | null>;
    isOpenRef: React.MutableRefObject<boolean>;
  };
}

const GlobalShortcutsContext = createContext<GlobalShortcutsRefs | null>(null);

/** 单一全局 keydown 监听，按 ref 分发 Cmd+K / Escape，减少重复监听（client-event-listeners） */
export function GlobalShortcutsProvider({ children }: { children: React.ReactNode }) {
  const searchToggleRef = useRef<(() => void) | null>(null);
  const searchCloseRef = useRef<(() => void) | null>(null);
  const searchIsOpenRef = useRef(false);
  const drawerCloseRef = useRef<(() => void) | null>(null);
  const drawerIsOpenRef = useRef(false);

  const handleKeyDown = (e: Event) => {
    const ev = e as KeyboardEvent;
    if (ev.repeat) return;
    const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform);
    const isCmdK = (isMac && ev.metaKey && ev.key === 'k') || (!isMac && ev.ctrlKey && ev.key === 'k');
    if (isCmdK) {
      ev.preventDefault();
      searchToggleRef.current?.();
      return;
    }
    if (ev.key === 'Escape') {
      if (searchIsOpenRef.current) {
        searchCloseRef.current?.();
        return;
      }
      if (drawerIsOpenRef.current) {
        drawerCloseRef.current?.();
      }
    }
  };

  useEventListener(typeof window !== 'undefined' ? window : null, 'keydown', handleKeyDown, { passive: false });

  const value: GlobalShortcutsRefs = {
    search: { toggleRef: searchToggleRef, closeRef: searchCloseRef, isOpenRef: searchIsOpenRef },
    drawer: { closeRef: drawerCloseRef, isOpenRef: drawerIsOpenRef },
  };

  return (
    <GlobalShortcutsContext.Provider value={value}>
      {children}
    </GlobalShortcutsContext.Provider>
  );
}

export function useGlobalShortcuts(): GlobalShortcutsRefs | null {
  return useContext(GlobalShortcutsContext);
}
