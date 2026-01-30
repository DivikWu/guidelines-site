'use client';

import React, { useState, Children, useEffect } from 'react';
import Tabs from './Tabs';

const TAB_IDS = ['overview', 'changelog', 'update-process'] as const;

interface OverviewContentProps {
  children?: React.ReactNode;
}

export default function OverviewContent({ children }: OverviewContentProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const items = Children.toArray(children);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'changelog', label: 'Changelog' },
    { id: 'update-process', label: 'Update Process' }
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--tabs-count', String(tabs.length));
    }
  }, [tabs.length]);

  const activeIndex = Math.max(0, TAB_IDS.indexOf(activeTab as (typeof TAB_IDS)[number]));
  const visibleChild = items[activeIndex] ?? null;

  return (
    <div className="overview-content">
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      {visibleChild}
    </div>
  );
}
