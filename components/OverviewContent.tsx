'use client';

import React, { useState, useCallback, Children, useEffect, isValidElement, cloneElement, startTransition } from 'react';
import Tabs from './Tabs';

const TAB_IDS = ['overview', 'changelog', 'update-process'] as const;

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'changelog', label: 'Changelog' },
  { id: 'update-process', label: 'Update Process' },
] as const;

interface OverviewContentProps {
  children?: React.ReactNode;
}

export default function OverviewContent({ children }: OverviewContentProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const items = Children.toArray(children);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--tabs-count', String(TABS.length));
    }
  }, []);

  const activeIndex = Math.max(0, TAB_IDS.indexOf(activeTab as (typeof TAB_IDS)[number]));

  const onTabChange = useCallback((tabId: string) => {
    startTransition(() => setActiveTab(tabId));
  }, []);

  return (
    <div className="overview-content">
      <Tabs tabs={TABS} activeTab={activeTab} onTabChange={onTabChange} />
      {items.map((item, i) =>
        isValidElement(item)
          ? cloneElement(item as React.ReactElement<{ hidden?: boolean }>, { key: TAB_IDS[i], hidden: i !== activeIndex })
          : item
      )}
    </div>
  );
}
