const CACHE_KEY = 'search-recent';

export interface SearchRecentItem {
  id: string;
  type: string;
  title: string;
  description?: string;
  href: string;
}

const memoryCache = new Map<string, SearchRecentItem[]>();

export function getSearchRecent(): SearchRecentItem[] {
  if (memoryCache.has(CACHE_KEY)) {
    return memoryCache.get(CACHE_KEY)!;
  }
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const data: SearchRecentItem[] = raw ? JSON.parse(raw) : [];
    memoryCache.set(CACHE_KEY, data);
    return data;
  } catch {
    return [];
  }
}

export function setSearchRecent(items: SearchRecentItem[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(items));
    memoryCache.set(CACHE_KEY, items);
  } catch (e) {
    console.error('Failed to save search-recent', e);
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === CACHE_KEY) {
      memoryCache.delete(CACHE_KEY);
    }
  });
}
