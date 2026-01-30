# YDS 性能审查与重构建议

> 基于 Vercel React Best Practices (AGENTS.md) 规则集  
> 审查顺序：async → bundle → server → client → rerender → rendering

---

## 一、Async（消除瀑布流）

### 1.1 触犯规则：async-parallel (1.4 Promise.all)

| 项目 | 说明 |
|------|------|
| **所在文件** | `lib/content/nav-index.ts:167-175` |
| **规则** | async-parallel |
| **简要原因** | `getQuickStartCardsFromIndex` 内 `getContentTree` 与 `fs.readFileSync` 无依赖关系，当前为串行执行。`findNavIndexPath` + 读文件 与 `getContentTree` 可并行。 |
| **修改建议** | 改为异步，使用 `Promise.all` 并行读取索引文件与 content tree。 |

```typescript
// 修改后（需将函数改为 async）
export async function getQuickStartCardsFromIndex(contentRoot?: string): Promise<QuickStartCard[]> {
  const root = contentRoot ?? getContentRoot();
  const indexPath = findNavIndexPath(root);
  if (!indexPath || !fs.existsSync(indexPath)) return [];

  const [raw, tree] = await Promise.all([
    fs.promises.readFile(indexPath, "utf-8"),
    Promise.resolve(getContentTree(root)),
  ]);
  const body = stripFrontMatter(raw);
  const resolveHref = buildDocIdToHref(tree);
  // ... 后续解析逻辑
}
```

**注意**：`app/page.tsx` 已用 `Promise.all` 并行 `getQuickStartCardsFromIndex` 与 `getRecentUpdates`，此处优化的是 `getQuickStartCardsFromIndex` 内部。

---

### 1.2 触犯规则：async-parallel (1.4)

| 项目 | 说明 |
|------|------|
| **所在文件** | `lib/content/recent-updates.ts:29-40` |
| **规则** | async-parallel |
| **简要原因** | `getRecentUpdates` 用 `map` 串行调用 9 次 `getDocTitleAndDescription`，每次内部有 `fs.readFileSync`，形成同步 I/O 瀑布。 |
| **修改建议** | 改为异步，用 `Promise.all` 并行读取各文档。 |

```typescript
// 新增 async 版本（或替换现有实现）
export async function getRecentUpdates(contentRoot?: string): Promise<RecentUpdate[]> {
  const results = await Promise.all(
    recentUpdatesMeta.map(async (meta) => {
      const { title, description } = await getDocTitleAndDescriptionAsync(meta.contentPath, contentRoot);
      return {
        id: meta.id,
        title: title || meta.id,
        description: description ?? null,
        status: meta.status,
        href: meta.href,
      };
    })
  );
  return results;
}
```

需在 `loaders.ts` 中新增 `getDocTitleAndDescriptionAsync`（基于 `fs.promises`），或复用现有逻辑封装为 Promise。

---

## 二、Bundle

### 2.1 已符合规则：bundle-dynamic-imports

- `AppShell.tsx` 已对 `SearchModal` 使用 `dynamic(..., { ssr: false })`。
- `next.config.mjs` 已配置 `optimizePackageImports: ['react-markdown', 'remark-gfm']`。

### 2.2 触犯规则：bundle-preload (2.5)

| 项目 | 说明 |
|------|------|
| **所在文件** | `components/Header.tsx`（搜索按钮）、`components/AppShell.tsx` |
| **规则** | bundle-preload |
| **简要原因** | SearchModal 仅在点击后加载，首屏无预加载，打开有延迟。 |
| **修改建议** | 在搜索按钮 `onMouseEnter` / `onFocus` 时预加载 SearchModal。 |

```tsx
// 在 Header 或 AppShell 中，搜索按钮：
const preloadSearch = () => {
  if (typeof window !== 'undefined') {
    import('./SearchModal');
  }
};

<button onMouseEnter={preloadSearch} onFocus={preloadSearch} onClick={() => openSearch()}>
```

---

## 三、Server

### 3.1 触犯规则：server-cache-react (3.4)

| 项目 | 说明 |
|------|------|
| **所在文件** | `lib/content/tree.ts`、`app/docs/[[...slug]]/layout.tsx:12`、`app/docs/[[...slug]]/page.tsx:11,77,89` |
| **规则** | server-cache-react |
| **简要原因** | `getContentTree` 在同一请求内被多次调用（layout 1 次、page 2 次：redirect 分支 + 主逻辑），无去重。 |
| **修改建议** | 用 `React.cache()` 包装，同请求内只执行一次。 |

```typescript
// lib/content/tree.ts
import { cache } from 'react';

export const getContentTree = cache(function getContentTree(contentRoot?: string): ContentTree {
  // 原有实现不变
});
```

---

### 3.2 触犯规则：server-serialization (3.2)

| 项目 | 说明 |
|------|------|
| **所在文件** | `app/overview/page.tsx:14`、`components/AppShell.tsx` |
| **规则** | server-serialization |
| **简要原因** | Overview 将完整 `docs` 数组传给 AppShell，含大量 markdown 字符串，RSC 边界序列化负担大。 |
| **修改建议** | 仅传递 AppShell 所需字段（如 `id`、`markdown` 的摘要或首段），或按需拆分 Client 组件，减少过大 payload。 |

```tsx
// 方案 A：仅传 id 列表 + 当前页 markdown，其余按需 fetch
// 方案 B：将 Overview 的 DocContent 区用 Suspense 包裹，数据在子组件内 fetch
```

根据当前架构，可先保留；若后续发现首屏 HTML 过大再优化。

---

### 3.3 触犯规则：server-parallel-fetching (3.3)

| 项目 | 说明 |
|------|------|
| **所在文件** | `app/docs/[[...slug]]/page.tsx:73-99` |
| **规则** | server-parallel-fetching |
| **简要原因** | `getContentTree` 与 `getMarkdownAndFrontmatter` 存在依赖：后者依赖 tree 解析出的 `relativePath`。但 `redirect` 分支仅需 tree，可提前并行 tree 与 params，减少阻塞。 |
| **修改建议** | 先 `await params`，再根据 slug 决定是 redirect 还是 fetch 内容；若需 tree + markdown，两者可并行（tree 用于 `rewriteWikiLinks`，markdown 独立读取）。 |

```typescript
// 当前：先 redirect 判断（需 tree），再 tree + getMarkdownAndFrontmatter
// 优化：params 解析后，tree 与 getMarkdownAndFrontmatter 可并行
const tree = getContentTree(DEFAULT_CONTENT_DIR);
const relativePath = item?.path ?? `...`;
const { markdown, frontmatter } = getMarkdownAndFrontmatter(relativePath, DEFAULT_CONTENT_DIR);
// tree 与 getMarkdownAndFrontmatter 无互相依赖，可 Promise.all（若改为 async）
```

当前为同步，若保持同步则无需大改；若将来改为 async，应确保 tree 与 markdown 并行。

---

## 四、Client

### 4.1 触犯规则：client-event-listeners (4.1)

| 项目 | 说明 |
|------|------|
| **所在文件** | `components/SearchProvider.tsx:37-51`、`components/AppShell.tsx:182`、`components/Header.tsx:139-151` |
| **规则** | client-event-listeners |
| **简要原因** | 多处注册 `keydown`、`scroll` 等全局监听。SearchProvider 与 AppShell 各自监听，若多实例会重复。当前为单实例，影响有限。 |
| **修改建议** | 保持现状即可；若未来出现多 Provider 实例，可考虑集中管理全局监听（如单一 keydown 分发）。 |

---

### 4.2 触犯规则：js-cache-storage (7.5)

| 项目 | 说明 |
|------|------|
| **所在文件** | `components/AppShell.tsx:396-419`、`components/SearchModal.tsx:77-88` |
| **规则** | js-cache-storage |
| **简要原因** | `localStorage.getItem('search-recent')` 在每次打开 SearchModal 时调用，且 AppShell 的 `useEffect` 在 `activeToken` 变化时写入，读取无内存缓存。 |
| **修改建议** | 对 `search-recent` 做模块级缓存，读取时优先走缓存，写入时同步更新缓存；在 `storage` 事件中清理缓存以应对跨标签修改。 |

```typescript
const searchRecentCache = new Map<string, SearchItem[]>();

function getSearchRecent(): SearchItem[] {
  const key = 'search-recent';
  if (searchRecentCache.has(key)) return searchRecentCache.get(key)!;
  try {
    const raw = localStorage.getItem(key);
    const data = raw ? JSON.parse(raw) : [];
    searchRecentCache.set(key, data);
    return data;
  } catch {
    return [];
  }
}
```

---

## 五、Rerender

### 5.1 触犯规则：rerender-lazy-state-init (5.6)

| 项目 | 说明 |
|------|------|
| **所在文件** | `components/SearchModal.tsx:68,77-89` |
| **规则** | rerender-lazy-state-init |
| **简要原因** | `recentItems` 初始为 `[]`，在 `useEffect` 中从 localStorage 读取再 `setState`，导致首帧空列表再更新，有闪烁。 |
| **修改建议** | 使用惰性初始化，在 `useState` 中同步读取 localStorage（仅客户端）。 |

```tsx
const [recentItems, setRecentItems] = useState<SearchItem[]>(() => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('search-recent');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
});

// 打开时刷新一次（可选，保证跨标签最新）
useEffect(() => {
  if (open && typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('search-recent');
      if (saved) setRecentItems(JSON.parse(saved));
    } catch (e) {
      console.error('Failed to parse recent items', e);
    }
  }
}, [open]);
```

---

### 5.2 触犯规则：rerender-transitions (5.7)

| 项目 | 说明 |
|------|------|
| **所在文件** | `components/AppShell.tsx:167-181`、`components/Header.tsx:139-151` |
| **规则** | rerender-transitions |
| **简要原因** | 滚动时 `setActiveToken` / `setIsScrolled` 直接更新，高频率更新可能阻塞主线程。 |
| **修改建议** | 用 `startTransition` 包裹非紧急的 state 更新。 |

```tsx
import { startTransition } from 'react';

// AppShell onScrollHighlight
if (current) {
  startTransition(() => {
    setActiveToken((prev) => (current.id !== prev ? current.id : prev));
  });
}

// Header handleScroll
if (lastIsScrolledRef.current !== newIsScrolled) {
  lastIsScrolledRef.current = newIsScrolled;
  startTransition(() => setIsScrolled(newIsScrolled));
}
```

---

### 5.3 触犯规则：rerender-dependencies (5.3)

| 项目 | 说明 |
|------|------|
| **所在文件** | `components/AppShell.tsx:241-255` |
| **规则** | rerender-dependencies (narrow-effect-dependencies) |
| **简要原因** | `useEffect` 依赖 `[isMobile, mobileOpen]`，`checkMobile` 会调用 `setIsMobile`，可能引发多余 effect 重跑。 |
| **修改建议** | 依赖收窄为 `[mobileOpen]`，`isMobile` 由 `mediaQuery.matches` 推导，避免在 effect 内写 `setIsMobile` 再依赖它。或拆成独立 effect 仅监听 `mediaQuery`。 |

```tsx
useEffect(() => {
  const mediaQuery = window.matchMedia('(max-width: 767px)');
  const checkMobile = () => {
    const mobile = mediaQuery.matches;
    setIsMobile(mobile);
    // 仅处理 drawer 关闭逻辑，不依赖 isMobile
    if (mobileOpen && !mobile) setMobileOpen(false);
  };
  checkMobile();
  mediaQuery.addEventListener('change', checkMobile);
  return () => mediaQuery.removeEventListener('change', checkMobile);
}, [mobileOpen]); // 移除 isMobile
```

---

## 六、Rendering

### 6.1 触犯规则：rendering-hydration-no-flicker (6.5)

| 项目 | 说明 |
|------|------|
| **所在文件** | `components/TokenProvider.tsx:13-19` |
| **规则** | rendering-hydration-no-flicker |
| **简要原因** | `theme` 默认 `'light'`，未从 localStorage 读取；若用户偏好 dark，会在 hydration 后 `useEffect` 中才更新，出现 light→dark 闪烁。 |
| **修改建议** | 在根 layout 注入同步脚本，在 React 水合前根据 localStorage 设置 `document.documentElement.dataset.theme`。 |

```tsx
// app/layout.tsx <body> 内
<body data-layout="root">
  <script
    dangerouslySetInnerHTML={{
      __html: `
        (function() {
          try {
            var t = localStorage.getItem('yami-theme') || 'light';
            document.documentElement.dataset.theme = t;
          } catch (e) {}
        })();
      `,
    }}
  />
  <TokenProvider>{children}</TokenProvider>
</body>
```

```tsx
// TokenProvider - 初始值从 DOM 读取（脚本已执行）
const [theme, setTheme] = useState<Theme>(() => {
  if (typeof document === 'undefined') return 'light';
  return (document.documentElement.dataset.theme as Theme) || 'light';
});

// toggle 时写回 localStorage
const toggle = useCallback(() => {
  setTheme((t) => {
    const next = t === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('yami-theme', next); } catch (e) {}
    return next;
  });
}, []);
```

---

### 6.2 触犯规则：rendering-hoist-jsx (6.3)

| 项目 | 说明 |
|------|------|
| **所在文件** | `components/SearchModal.tsx:48-56` |
| **规则** | rendering-hoist-jsx |
| **简要原因** | `SEARCH_MODAL_SKELETON_ITEMS` 用 `[1,2,3].map()` 在模块顶层创建，已合理；加载骨架为静态 JSX，可提升到组件外避免每次渲染重建。 |
| **修改建议** | 确认骨架为常量，已基本符合；若无必要可不改。 |

---

### 6.3 触犯规则：rendering-content-visibility (6.2)

| 项目 | 说明 |
|------|------|
| **所在文件** | `components/DocContent.tsx`、文档列表容器 |
| **规则** | rendering-content-visibility |
| **简要原因** | 长文档列表（如 Overview 多段 DocContent）未使用 `content-visibility: auto`，离屏内容仍参与布局与绘制。 |
| **修改建议** | 为文档块添加 `content-visibility: auto` 与合适的 `contain-intrinsic-size`。 |

```css
.doc {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;
}
```

---

### 6.4 触犯规则：js-hoist-regexp (7.9)

| 项目 | 说明 |
|------|------|
| **所在文件** | `components/Header.tsx:205` |
| **规则** | js-hoist-regexp |
| **简要原因** | `performSearch` 的 `forEach` 内对每个 page 都执行 `new RegExp(...)`，同一 query 下重复创建。 |
| **修改建议** | 在循环外创建 RegExp，或对 `lowerQuery` 做 `useMemo`。 |

```tsx
const performSearch = useCallback((query: string) => {
  // ...
  const regex = lowerQuery
    ? new RegExp(lowerQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    : null;

  docs.forEach(page => {
    // ...
    const matchCount = regex ? (page.markdown.match(regex) || []).length : 0;
    // ...
  });
}, [docs]);
```

---

### 6.5 触犯规则：js-index-maps (7.2) / js-set-map-lookups (7.11)

| 项目 | 说明 |
|------|------|
| **所在文件** | `components/AppShell.tsx:319-328`、`app/docs/[[...slug]]/page.tsx:34-44` |
| **规则** | js-index-maps / js-set-map-lookups |
| **简要原因** | `contentTree.sections.find(...)` 和 `section.items.some(...)` 等多次线性查找。 |
| **修改建议** | 预构建 `docId -> section` 的 Map，查找时用 O(1)。当前 `docRouteMap` 已为 Map，可检查是否覆盖所有查找路径。 |

---

## 七、按优先级排序的修复清单

| 优先级 | 文件 | 规则 | 改动量 | 预期收益 |
|--------|------|------|--------|----------|
| **P0** | `lib/content/tree.ts` | server-cache-react | 小 | 同请求内减少重复 I/O |
| **P0** | `components/TokenProvider.tsx` + `app/layout.tsx` | rendering-hydration-no-flicker | 中 | 消除主题闪烁 |
| **P1** | `components/SearchModal.tsx` | rerender-lazy-state-init | 小 | 最近访问首帧无空白 |
| **P1** | `lib/content/nav-index.ts` | async-parallel | 中 | 首页数据加载更快 |
| **P1** | `lib/content/recent-updates.ts` | async-parallel | 中 | 首页数据加载更快 |
| **P2** | `components/AppShell.tsx`、`Header.tsx` | rerender-transitions | 小 | 滚动更流畅 |
| **P2** | `components/SearchModal.tsx` + `AppShell.tsx` | js-cache-storage | 小 | 减少 localStorage 读取 |
| **P2** | `components/Header.tsx` | js-hoist-regexp | 小 | 搜索性能提升 |
| **P2** | `components/AppShell.tsx` | rerender-dependencies | 小 | 减少 effect 重跑 |
| **P3** | `components/Header.tsx`、`AppShell.tsx` | bundle-preload | 小 | 搜索弹窗打开更快 |
| **P3** | `app/overview/page.tsx` | server-serialization | 大 | 减小 RSC payload（可选） |
| **P3** | `.doc` 样式 | rendering-content-visibility | 小 | 长文档列表渲染更快 |

---

## 八、总结

- **Async**：`getQuickStartCardsFromIndex`、`getRecentUpdates` 内部可并行化 I/O。
- **Bundle**：SearchModal 已动态加载，可加预加载。
- **Server**：`getContentTree` 建议用 `React.cache()` 去重。
- **Client**：`search-recent` 的 localStorage 可加内存缓存。
- **Rerender**：`recentItems` 惰性初始化、滚动更新用 `startTransition`、effect 依赖收窄。
- **Rendering**：主题用同步脚本防水合闪烁、文档块可加 `content-visibility`。

建议先完成 P0、P1，再视情况做 P2、P3。
