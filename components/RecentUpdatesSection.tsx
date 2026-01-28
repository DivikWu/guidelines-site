'use client';

import { useState } from 'react';
import Link from 'next/link';
import { recentUpdates } from '../data/home';
import SectionTitle from './SectionTitle';
import Icon from './Icon';

type ViewMode = 'list' | 'grid';

export default function RecentUpdatesSection() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const getStatusTagClass = (status: string) => {
    switch (status) {
      case 'Released':
        return 'status-tag status-tag--released';
      case 'Not Started':
        return 'status-tag status-tag--not-started';
      case 'Review':
        return 'status-tag status-tag--review';
      case 'Draft':
        return 'status-tag status-tag--draft';
      default:
        return 'status-tag';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Released':
        return 'Released';
      case 'Not Started':
        return 'Not Started';
      case 'Review':
        return 'Review';
      case 'Draft':
        return 'Draft';
      default:
        return status;
    }
  };

  return (
    <section className="recent-updates-section">
      <div className="recent-updates-section__container">
        <div className="recent-updates-section__header">
          <SectionTitle>最近更新</SectionTitle>
          <div className="recent-updates-section__view-toggle" role="group" aria-label="视图切换">
            <button
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="列表视图"
              aria-pressed={viewMode === 'list'}
            >
              <Icon name="ds-icon-menu-01" className="view-toggle-btn__icon" />
              <span className="view-toggle-btn__label">List</span>
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="网格视图"
              aria-pressed={viewMode === 'grid'}
            >
              <Icon name="ds-icon-grid-view" className="view-toggle-btn__icon" />
              <span className="view-toggle-btn__label">Grid</span>
            </button>
          </div>
        </div>
        <div className={`recent-updates-${viewMode}`}>
          {recentUpdates.map((update) => (
            <Link key={update.id} href={update.href} className="recent-updates-card">
              <div className="recent-updates-card__content">
                <h3 className="recent-updates-card__title">{update.title}</h3>
                <p className="recent-updates-card__description">{update.description}</p>
              </div>
              <div className="recent-updates-card__tags">
                <span className={getStatusTagClass(update.status)}>
                  {getStatusText(update.status)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
