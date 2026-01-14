'use client';

import { useState } from 'react';
import Tabs from './Tabs';
import DocContent from './DocContent';
import { DocPage } from '../data/docs';

interface OverviewContentProps {
  overviewPage: DocPage;
  changelogPage: DocPage;
  updateProcessPage: DocPage;
}

export default function OverviewContent({ 
  overviewPage, 
  changelogPage, 
  updateProcessPage 
}: OverviewContentProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'changelog', label: 'Changelog' },
    { id: 'update-process', label: 'Update Process' }
  ];

  // 设置 CSS 变量用于指示器宽度计算
  if (typeof window !== 'undefined') {
    document.documentElement.style.setProperty('--tabs-count', tabs.length.toString());
  }

  const getActivePage = () => {
    switch (activeTab) {
      case 'overview':
        return overviewPage;
      case 'changelog':
        return changelogPage;
      case 'update-process':
        return updateProcessPage;
      default:
        return overviewPage;
    }
  };

  return (
    <div className="overview-content">
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <DocContent page={getActivePage()} hidden={false} />
    </div>
  );
}
