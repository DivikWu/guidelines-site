'use client';

import HomeHero from './HomeHero';
import QuickStartSection from './QuickStartSection';
import RecentUpdatesSection from './RecentUpdatesSection';
import HomeFooter from './HomeFooter';

export default function HomePage() {
  return (
    <div className="home-page page-with-header">
      <HomeHero />
      <div className="home-page__content">
        <QuickStartSection />
        <RecentUpdatesSection />
      </div>
      <HomeFooter />
    </div>
  );
}
