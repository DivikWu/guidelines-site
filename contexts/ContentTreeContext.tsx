'use client';

import React, { createContext, useContext } from 'react';
import type { ContentTree } from '@/lib/content/tree';

const ContentTreeContext = createContext<ContentTree | null>(null);

export function ContentTreeProvider({
  tree,
  children,
}: {
  tree: ContentTree;
  children: React.ReactNode;
}) {
  return (
    <ContentTreeContext.Provider value={tree}>
      {children}
    </ContentTreeContext.Provider>
  );
}

export function useContentTree(): ContentTree | null {
  return useContext(ContentTreeContext);
}
