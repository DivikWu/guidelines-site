'use client';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: readonly Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  const activeIndex = Math.max(0, tabs.findIndex(t => t.id === activeTab));
  return (
    <div
      className="tabs"
      style={{ ['--active-index' as string]: activeIndex }}
    >
      <div className="tabs__list" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tabs__item ${activeTab === tab.id ? 'tabs__item--active' : ''}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs__indicator" aria-hidden />
    </div>
  );
}
