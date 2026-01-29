import { SearchProvider } from '../components/SearchProvider';
import HomePageClient from '../components/HomePageClient';
import { getQuickStartCardsFromIndex } from '@/lib/content/nav-index';
import { getRecentUpdates } from '@/lib/content/recent-updates';
import { DEFAULT_CONTENT_DIR } from '@/lib/content/constants';

/** 首页卡片与最近更新来自 content，每次请求重新读取以保持与文档同步 */
export const revalidate = 0;

export default async function Page() {
  const [cards, recentUpdates] = await Promise.all([
    getQuickStartCardsFromIndex(DEFAULT_CONTENT_DIR),
    Promise.resolve(getRecentUpdates(DEFAULT_CONTENT_DIR)),
  ]);
  return (
    <SearchProvider>
      <HomePageClient
        initialQuickStartCards={cards.length > 0 ? cards : undefined}
        initialRecentUpdates={recentUpdates}
      />
    </SearchProvider>
  );
}
