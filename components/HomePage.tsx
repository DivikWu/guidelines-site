'use client';

import HomeHero from './HomeHero';
import QuickStartSection from './QuickStartSection';
import RecentUpdatesSection from './RecentUpdatesSection';
import HomeFooter from './HomeFooter';
import type { QuickStartCard } from '@/lib/content/nav-index';
import type { RecentUpdate } from '@/data/home';

export default function HomePage({
  initialQuickStartCards,
  initialRecentUpdates,
}: {
  initialQuickStartCards?: QuickStartCard[] | null;
  initialRecentUpdates?: RecentUpdate[] | null;
}) {
  return (
    <div className="home-page page-with-header">
      <HomeHero />
      <div className="home-page__content">
        <QuickStartSection cards={initialQuickStartCards} />
        <RecentUpdatesSection updates={initialRecentUpdates} />
      </div>
      <HomeFooter />
    </div>
  );
}
