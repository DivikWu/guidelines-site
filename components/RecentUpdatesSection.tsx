'use client';

import { useState } from 'react';
import Link from 'next/link';
import SectionTitle from './SectionTitle';
import Icon from './Icon';
import type { RecentUpdate } from '@/data/home';

type ViewMode = 'list' | 'grid';

export default function RecentUpdatesSection({ updates }: { updates?: RecentUpdate[] | null }) {
  const recentUpdates = updates ?? [];
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

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
                {update.description != null && update.description !== '' && (
                  <p className="recent-updates-card__description">{update.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
