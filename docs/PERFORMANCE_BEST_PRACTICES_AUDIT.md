# 性能最佳实践审查报告

基于 Vercel React Best Practices 对本站代码进行的性能审查（2026-01-30）。

---

## 一、已符合的最佳实践

### 1. 消除瀑布流 (Eliminating Waterfalls)

| 项目 | 状态 | 说明 |
|------|------|------|
| **首页数据并行** | ✅ | `app/page.tsx` 使用 `Promise.all([getQuickStartCardsFromIndex, getRecentUpdates])` 并行拉取，符合 async-parallel。 |
| **最近更新并行** | ✅ | `lib/content/recent-updates.ts` 使用 `Promise.all(recentUpdatesMeta.map(...))` 并行读取各文档 title/description。 |
| **导航索引 I/O** | ✅ | `nav-index.ts` 中 `rawPromise` 与同步 `getContentTree` 并行，再 await raw。 |

### 2. 服务端与数据加载

| 项目 | 状态 | 说明 |
|------|------|------|
| **loaders 无多余 await** | ✅ | `loaders.ts` 中按需读取，无“先 await 再分支”的反模式。 |
| **tree 使用 toSorted** | ✅ | `lib/content/tree.ts` 使用 `.toSorted()` 而非 `.sort()`，避免原地修改，符合 js-tosorted-immutable。 |
| **SearchModal 过滤** | ✅ | `SearchModal.tsx` 中对 `items.filter(...).toSorted(...)` 使用 toSorted，保持不可变。 |

### 3. 客户端与 Re-render

| 项目 | 状态 | 说明 |
|------|------|------|
| **SearchProvider setState** | ✅ | `toggleSearch` 使用 `setIsOpen(prev => !prev)`，符合 functional setState。 |
| **TokenProvider toggle** | ✅ | `toggle` 使用 `setTheme(prev => ...)` 并写入 localStorage，避免闭包依赖。 |
| **SearchModal 键盘索引** | ✅ | ArrowDown/ArrowUp 使用 `setSelectedIndex(prev => ...)`，稳定且无闭包风险。 |
| **SearchModal 初始 recent** | ✅ | `useState(() => getSearchRecent())` 惰性初始化，符合 rerender-lazy-state-init。 |
| **useEventListener** | ✅ | 使用 ref 存 handler，effect 仅依赖 `[target, type]`，符合 advanced-event-handler-refs。 |
| **SearchProvider 快捷键** | ✅ | 通过 ref 存 `toggleSearch`/`closeSearch`，keydown 只依赖稳定 handler，避免重复注册。 |

### 4. 渲染与资源

| 项目 | 状态 | 说明 |
|------|------|------|
| **主题防闪烁** | ✅ | `layout.tsx` 使用 `beforeInteractive` 脚本在 React 水合前设置 `dataset.theme`，符合 rendering-hydration-no-flicker。 |
| **SearchModal 锁滚动** | ✅ | 使用单次 `document.body.style.cssText` 赋值，减少 reflow，符合 js-batch-dom-css。 |
| **search-recent 缓存** | ✅ | `lib/search-recent-cache.ts` 使用内存 Map 缓存 localStorage 读取，并在 storage 事件时失效，符合 js-cache-storage。 |
| **SearchModal 预加载** | ✅ | `SearchProvider.preloadSearch` 中 `import('@/components/SearchModal')` 按需加载，配合 hover/focus 可做 bundle-preload。 |
| **包导入优化** | ✅ | `next.config.mjs` 中 `optimizePackageImports: ['react-markdown', 'remark-gfm']`，减轻 barrel 导入成本。 |

### 5. 其他

| 项目 | 状态 | 说明 |
|------|------|------|
| **RegExp 与 query** | ✅ | `SearchModal` 中 `highlightRegex` 使用 `useMemo(..., [query])`，符合 js-hoist-regexp（避免每次 render 新建）。 |
| **Index Map** | ✅ | `docs/[[...slug]]/page.tsx` 中 `buildDocIdToSectionMap(tree)` 用 Map 做 O(1) 查找；`nav-index` 中 `buildDocIdToHref` 同理，符合 js-index-maps。 |

---

## 二、发现的问题与建议

### 1. 文档页与 Layout 重复调用 getContentTree（中）

- **位置**：`app/docs/[[...slug]]/layout.tsx` 与 `app/docs/[[...slug]]/page.tsx` 均调用 `getContentTree(DEFAULT_CONTENT_DIR)`。
- **规则**：server-cache-react（同请求内去重）。
- **说明**：项目文档已记录在 Next.js 14.x 静态导出下使用 `React.cache()` 包装 `getContentTree` 曾导致序列化错误并已回滚，故当前未使用 React.cache。
- **建议**（此处「保持现状」仅指**不要**对 getContentTree 再启用 React.cache）：
  - 短期：不恢复 `React.cache(getContentTree)`，避免再次触发序列化问题。
  - 中期：随 Next.js 升级再评估 `React.cache(getContentTree)`；若仍不适用，可在 page 内复用 layout 通过 context 传入的 tree（需调整数据流，避免 layout 与 page 各算一遍）。

### 2. SearchModal 仅在打开时挂载，未使用 next/dynamic（低）

- **位置**：`components/HomePageClient.tsx` 直接 `import SearchModal`，未用 `next/dynamic`。
- **规则**：bundle-dynamic-imports（重型组件懒加载）。
- **说明**：已有 `preloadSearch` 做 `import('@/components/SearchModal')`，但首页仍静态引用 SearchModal，首包会包含其代码。
- **建议**：使用 `next/dynamic` 懒加载 SearchModal，并在 SearchBar/Header 的搜索入口上保留 `onMouseEnter`/`onFocus` 调用 `preloadSearch`，以兼顾首屏体积与打开速度。例如：

```tsx
const SearchModal = dynamic(
  () => import('@/components/SearchModal').then(m => ({ default: m.default })),
  { ssr: false }
);
```

### 3. HomePageClient 中 handleSearchSelect 未用 useCallback（低）

- **位置**：`components/HomePageClient.tsx` 中 `handleSearchSelect` 直接定义，传给 `Header` 与 `SearchModal`。
- **规则**：rerender 优化（减少子组件因回调引用变化而重渲染）。
- **说明**：`handleSearchSelect` 依赖 `router`、`closeSearch`、`searchItems`；`searchItems` 已由 `useMemo(..., [])` 稳定。用 `useCallback` 包一层可避免每次渲染传递新函数。
- **建议**：

```tsx
const handleSearchSelect = useCallback((pageId: string) => {
  const item = searchItems.find(i => i.id === pageId);
  if (item) {
    router.push(item.href, { scroll: false });
    closeSearch();
  }
}, [router, closeSearch, searchItems]);
```

### 4. 文档页无 Suspense 流式（可选）

- **位置**：`app/docs/[[...slug]]/page.tsx` 为 async，在组件内 await 全部数据后再渲染。
- **规则**：async-suspense-boundaries（先出壳再流式数据）。
- **说明**：当前为同步 getContentTree + getMarkdownAndFrontmatter，无网络请求；若未来文档改为远程或异步加载，可考虑将“正文区”放入 Suspense，先渲染壳（侧栏、顶栏），再流式展示正文，以提升首屏感知。
- **建议**：现阶段可维持现状；引入异步文档源时再评估 Suspense 边界。

### 5. TokenProvider 初始 theme 在服务端为默认值（已知设计）

- **位置**：`components/TokenProvider.tsx` 中 `useState(() => document.documentElement.dataset.theme ...)`。
- **说明**：服务端无 `document`，初始为 `'light'`；客户端水合前已由 layout 的 `beforeInteractive` 脚本设置好 `dataset.theme`，因此初始器在客户端会读到正确值，不会闪屏。
- **结论**：符合“防止水合闪烁”的最佳实践，无需修改。

---

## 三、可选优化（低优先级）

| 项目 | 规则 | 说明 |
|------|------|------|
| **长列表 content-visibility** | rendering-content-visibility | 若文档侧栏或搜索结果列表很长，可为列表项增加 `content-visibility: auto` 与合适的 `contain-intrinsic-size`，减少首屏外节点的布局/绘制。 |
| **SearchModal 列表虚拟化** | 通用 | 若搜索结果为数百条以上，可考虑虚拟列表，仅渲染可视区域。 |
| **首页 SearchProvider 作用域** | 结构 | 当前首页在 page 层包一层 SearchProvider，若全站都需要搜索，可考虑将 SearchProvider 上移到 root layout，与 TokenProvider 并列，避免多页重复包裹。 |

---

## 四、总结

- **强项**：并行请求、functional setState、惰性状态初始化、事件监听稳定引用、主题防闪烁、localStorage 缓存、toSorted 不可变、RegExp/Map 等小优化已落实。
- **已知限制**：`React.cache(getContentTree)` 因 Next 14 静态导出兼容性已回滚，保留重复调用以换取稳定性。
- **已落实**：SearchModal 已用 `next/dynamic` 懒加载；`handleSearchSelect` 已用 `useCallback`；搜索入口（HomeHero、SearchBar、Header）已绑定 `preloadSearch` 的 onMouseEnter/onFocus。

### 后续可做（可选）

| 是否建议 | 项目 | 说明 |
|----------|------|------|
| 可选 | **SearchProvider 上移到 root layout** | 详见下方「SearchProvider 上移：影响与收益」。 |
| 按需 | content-visibility / 虚拟列表 | 仅当文档侧栏或搜索结果条数很多时再考虑。 |

---

## 附录：SearchProvider 上移到 root layout —— 影响与收益

### 当前状况

- **SearchProvider 出现位置**：`app/page.tsx`、`app/docs/[[...slug]]/layout.tsx`、`app/overview/page.tsx`、`app/content/page.tsx`、`app/resources/page.tsx`、`app/components/page.tsx`、`app/components/[id]/page.tsx`（共 7 处页面/布局各自包一层）。
- **使用 useSearch 的组件**：HomePageClient、AppShell、HomeHero、SearchBar、Header（均在这些页面之下）。

### 收益

| 收益 | 说明 |
|------|------|
| **结构更清晰** | 搜索上下文只在一个地方（root layout）声明，新加路由不用再记得包一层 SearchProvider。 |
| **维护成本更低** | 以后改搜索逻辑或依赖（如 preload、快捷键）只改 root 一处，不会漏掉某页。 |
| **行为更一致** | 全站同一套 SearchProvider 实例，快捷键、preload 在所有路由下表现一致。 |
| **新增路由自动带搜索** | 新页面天然在 SearchProvider 之下，直接 `useSearch()` 即可，无需改 layout。 |

### 影响与注意点

| 影响 | 说明 |
|------|------|
| **路由切换时搜索框是否关闭** | 当前：每次进新页面会挂载新的 SearchProvider，搜索弹层会随页面切换而关闭。上移后：同一实例跨路由存在，从首页打开搜索再点链接跳转，弹层可能仍打开。若希望「换页就关闭搜索」，在 SearchProvider 内根据 `usePathname()` 变化时调用 `closeSearch()` 即可（约一两行逻辑）。 |
| **根 layout 的客户端范围** | Root layout 会多包一层 `'use client'` 的 SearchProvider，与现有 TokenProvider 类似；首屏已加载的客户端代码略增，体积影响很小。 |
| **需要改动的文件** | 在 `app/layout.tsx` 用 SearchProvider 包住 children（与 TokenProvider 并列或嵌套）；从上述 7 处页面/布局中删除各自的 `<SearchProvider>` 包裹及对应 import。 |

### 小结

- **益处**：结构更清晰、维护更简单、新路由自动带搜索、行为一致。
- **影响**：需在 7 处去掉重复包裹；若希望「路由变化时关闭搜索」需在 Provider 内加一次 pathname 监听并调用 `closeSearch()`；根 layout 多一层 client 包裹，对体积影响可忽略。

审查依据：`.claude/skills/vercel-react-best-practices/` 下 AGENTS.md 与各规则文件。
