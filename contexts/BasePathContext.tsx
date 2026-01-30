'use client';

import React, { createContext, useContext } from 'react';

const BasePathContext = createContext<string>('');

export function BasePathProvider({
  basePath,
  children,
}: {
  basePath: string;
  children: React.ReactNode;
}) {
  return (
    <BasePathContext.Provider value={basePath}>
      {children}
    </BasePathContext.Provider>
  );
}

export function useBasePath(): string {
  return useContext(BasePathContext);
}
