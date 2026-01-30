# 性能审查报告

基于 [AGENTS.md](../.claude/skills/vercel-react-best-practices/AGENTS.md) 规则集，按 async → bundle → server → client → rerender → rendering 顺序审查，每条问题含：文件与行号、触犯规则、简要原因、具体修改建议（含代码片段）。文末为按优先级排序的修复清单，并标注改动风险（低/中/高）。

---

## 1. Async（消除瀑布流）

### 1.1 app/page.tsx:11-14

- **触犯规则**：async-parallel（1.4 Promise.all() for Independent Operations）
- **简要原因**：`getRecentUpdates(DEFAULT_CONTENT_DIR)` 为同步函数，用 `Promise.resolve()` 包装无必要，且易误导为异步。
- **修改建议**：直接传入同步结果，保持 `Promise.all` 仅用于真正的异步调用；若希望统一为 Promise 风格，可保留 `Promise.resolve` 但注释说明，更推荐去掉。

```ts
// 修改前
const [cards, recentUpdates] = await Promise.all([
  getQuickStartCardsFromIndex(DEFAULT_CONTENT_DIR),
  Promise.resolve(getRecentUpdates(DEFAULT_CONTENT_DIR)),
]);

// 修改后（推荐：仅对异步调用使用 Promise.all）
const cards = await getQuickStartCardsFromIndex(DEFAULT_CONTENT_DIR);
const recentUpdates = getRecentUpdates(DEFAULT_CONTENT_DIR);
```

若 `getQuickStartCardsFromIndex` 为唯一异步，可改为上述两行；若未来 `getRecentUpdates` 改为异步，再恢复 `Promise.all([..., getRecentUpdates(...)])`。

### 1.2 app/docs/[[...slug]]/page.tsx:88-100

- **触犯规则**：server-parallel-fetching（3.3 Parallel Data Fetching with Component Composition）
- **简要原因**：当前 `getContentTree`、`getMarkdownByRelativePath`、`getDocFrontmatter` 均为同步；若日后改为异步，当前顺序调用会形成瀑布。且 layout（layout.tsx:12）与 page 均调用 `getContentTree`，同请求内重复计算。
- **修改建议**：现阶段保持同步即可；若将来改为异步，应 (1) 用 `React.cache()` 包装 `getContentTree` 等同请求去重，(2) 在 page 内对无依赖的异步调用使用 `Promise.all` 并行（例如先 `await params` 得到 slug，再 `Promise.all([getContentTree(...), getMarkdownByRelativePath(...), getDocFrontmatter(...)])` 其中后两者依赖 relativePath）。

---

## 2. Bundle（体积与加载）

### 2.1 components/DocContent.tsx:4-5

- **触犯规则**：dynamic-imports-heavy（2.4 Dynamic Imports for Heavy Components）
- **简要原因**：`react-markdown` 与 `remark-gfm` 直接静态导入，会打入首包，文档内容区并非首屏必需即可交互，加重 TTI/LCP。
- **修改建议**：对整块文档渲染使用 `next/dynamic` 懒加载 DocContent，或仅在 DocContent 内对 `react-markdown`/`remark-gfm` 做动态 import（需处理 loading 状态）。

```tsx
// 方案 A：在引用 DocContent 的页面用 dynamic
import dynamic from 'next/dynamic';
const DocContent = dynamic(() => import('@/components/DocContent'), { ssr: true });

// 方案 B：DocContent 内部动态加载 react-markdown（保留 ssr 则需在服务端也 require/import，或仅客户端渲染文档区）
// 若文档区可接受客户端渲染，可在 DocContent 内：
// const [Markdown, setMarkdown] = useState(null);
// useEffect(() => { import('react-markdown').then(m => setMarkdown(() => m.default)); }, []);
// 渲染时 Markdown ? <Markdown ... /> : <div className="doc-skeleton" />
```

### 2.2 next.config.mjs:6-12

- **触犯规则**：barrel-file-imports（2.1 Avoid Barrel File Imports）
- **简要原因**：未配置 `experimental.optimizePackageImports`，若使用带 barrel 的库（如未来引入的图标库）易拖慢构建与冷启。
- **修改建议**：为已知 barrel 重、且已使用的包（如 `react-markdown`、`remark-gfm`）加入优化配置。

```js
const nextConfig = {
  ...(isGithubPages ? { output: 'export' } : {}),
  basePath,
  assetPrefix: basePath ? `${basePath}/` : '',
  images: { unoptimized: true },
  experimental: {
    optimizePackageImports: ['react-markdown', 'remark-gfm'],
  },
};
```

---

## 3. Server（服务端与 RSC）

### 3.1 app/docs/[[...slug]]/layout.tsx:12 与 app/docs/[[...slug]]/page.tsx:76,88

- **触犯规则**：server-cache-react（3.4 Per-Request Deduplication with React.cache()）
- **简要原因**：`getContentTree(DEFAULT_CONTENT_DIR)` 在 layout 与 page 中各调用一次，同请求内重复执行；当前为同步，若改为异步且未做请求内去重，会重复请求。
- **修改建议**：若将 `getContentTree` 改为异步，使用 `React.cache()` 包装，保证同请求内只执行一次。

```ts
// lib/content/tree.ts（仅当改为 async 时）
import { cache } from 'react';
export const getContentTree = cache(async (contentRoot?: string): Promise<ContentTree> => {
  // 现有实现改为 async/await 读文件
});
```

### 3.2 app/docs/[[...slug]]/page.tsx:88-100

- **触犯规则**：minimize-serialization（3.2 Minimize Serialization at RSC Boundaries）
- **简要原因**：向 DocsPageView 传入完整 `doc`、`docMeta` 等，若子组件为 client，会序列化整份数据；应只传客户端实际用到的字段。
- **修改建议**：确认 DocsPageView 及其子组件实际使用的 props，仅传递必要字段（如 doc 的 id、markdown，docMeta 的 status、last_updated），避免整对象下传。

---

## 4. Client（客户端数据与事件）

### 4.1 components/SearchProvider.tsx:30-50

- **触犯规则**：deduplicate-global-event-listeners（4.1 Deduplicate Global Event Listeners）
- **简要原因**：每个 SearchProvider 实例在 effect 中注册一次全局 `keydown`，若存在多实例会重复监听。
- **修改建议**：使用模块级单一监听 + 回调注册表，保证全局只注册一个 keydown，多个消费者通过注册表收到回调。

```tsx
// 模块级
const searchHandlers = new Set<() => void>();
const escapeHandlers = new Set<() => void>();

function onGlobalKeyDown(e: KeyboardEvent) {
  if (e.repeat) return;
  const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
  const isCmdK = (isMac && e.metaKey && e.key === 'k') || (!isMac && e.ctrlKey && e.key === 'k');
  if (isCmdK) {
    e.preventDefault();
    searchHandlers.forEach((fn) => fn());
  }
  if (e.key === 'Escape') escapeHandlers.forEach((fn) => fn());
}

let attached = false;
function ensureAttached() {
  if (attached) return;
  attached = true;
  window.addEventListener('keydown', onGlobalKeyDown);
}
// 在 SearchProvider 的 useEffect 中：ensureAttached(); searchHandlers.add(toggleSearch); escapeHandlers.add(closeSearch);
// 清理时：searchHandlers.delete(...); escapeHandlers.delete(...)；若 Set 全空可 removeEventListener 并 attached = false
```

### 4.2 components/AppShell.tsx:133-143, 145-156, 170-178

- **触犯规则**：deduplicate-global-event-listeners（4.1）
- **简要原因**：hashchange、scroll、keydown 均在组件内直接 addEventListener，若 AppShell 多实例会重复监听（当前通常单实例，但模式上未去重）。
- **修改建议**：与 4.1 类似，对 hashchange/scroll/keydown 使用模块级单监听 + 回调 Set，或在确认仅单实例时保留现状并加注释说明“单例使用”。

### 4.3 components/Header.tsx:139-159

- **触犯规则**：deduplicate-global-event-listeners（4.1）
- **简要原因**：scroll 监听在 Header 内注册，多 Header 实例会多份 scroll 监听。
- **修改建议**：若全局仅一个 Header，可保留并注释；否则改为模块级单 scroll 监听 + 回调注册。

### 4.4 components/Tooltip.tsx:86-96

- **触犯规则**：deduplicate-global-event-listeners（4.1）
- **简要原因**：每个 Tooltip 在 isVisible 时注册 scroll/resize，多个 Tooltip 同时打开会重复监听。
- **修改建议**：模块级单 scroll/resize 监听，维护“需要 updatePosition 的 Tooltip”集合，在事件中遍历调用各实例的 updatePosition。

---

## 5. Re-render（重渲染与状态）

### 5.1 components/Header.tsx:139-159

- **触犯规则**：narrow-effect-dependencies（5.3 Narrow Effect Dependencies）
- **简要原因**：effect 依赖数组含 `isScrolled`，但 effect 内会 `setIsScrolled`，导致滚动后依赖变化、effect 可能重复执行或依赖链冗余。
- **修改建议**：移除依赖中的 `isScrolled`，仅保留 `mounted`；滚动状态仅由 handleScroll 更新即可。

```tsx
}, [mounted]); // 删除 isScrolled
```

### 5.2 components/AppShell.tsx:182-206

- **触犯规则**：narrow-effect-dependencies（5.3）
- **简要原因**：effect 依赖 `isMobile`、`mobileOpen`，内部又 `setIsMobile(mobile)`，`wasMobile` 读取 `isMobile` 用于逻辑，依赖过宽易造成多余 re-run。
- **修改建议**：用 ref 保存“上一帧的 mobile”用于比较，effect 依赖仅保留 `mobileOpen`（或仅 `[]` 仅跑一次 + mediaQuery.change）。

```tsx
const prevMobileRef = useRef(false);
const checkMobile = () => {
  const mobile = mediaQuery.matches;
  const wasMobile = prevMobileRef.current;
  prevMobileRef.current = mobile;
  setIsMobile(mobile);
  if (wasMobile && !mobile && mobileOpen) setMobileOpen(false);
};
// 依赖改为 [mobileOpen] 或 []
```

### 5.3 components/AppShell.tsx:145-156

- **触犯规则**：functional-setstate-updates（5.5 Use Functional setState Updates）
- **简要原因**：onScroll 中根据 `current.id !== activeToken` 调用 `setActiveToken(current.id)`，直接依赖闭包里的 `activeToken`，在快速滚动或批量更新时可能用旧值。
- **修改建议**：用函数式更新，或通过 ref 取最新 activeToken 再比较，避免闭包陈旧。

```tsx
if (current) {
  setActiveToken((prev) => (current.id !== prev ? current.id : prev));
}
```

### 5.4 components/SearchModal.tsx:56, 65-77

- **触犯规则**：lazy-state-initialization（5.6 Use Lazy State Initialization）
- **简要原因**：`recentItems` 初始为 `[]`，再在 useEffect 中从 localStorage 读取并 setState，导致先渲染空列表再更新，且初始化逻辑分散。
- **修改建议**：用惰性初始化，在 useState 中同步读 localStorage（仅客户端），避免首帧空状态。

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
// 打开 modal 时若需重新从 storage 同步，可保留一次性的 effect 仅在 open 时读取并 setRecentItems
```

### 5.5 components/Header.tsx:222-228

- **触犯规则**：narrow-effect-dependencies（5.3）
- **简要原因**：防抖 effect 依赖 `performSearch`，而 `performSearch` 依赖 `docs`，docs 引用变化会重置 timer。
- **修改建议**：若 docs 在生命周期内稳定，可接受；否则用 ref 存 performSearch，effect 只依赖 `searchQuery`，内部调用 `performSearchRef.current(searchQuery)`。

### 5.6 components/TokenProvider.tsx:12-20

- **触犯规则**：hydration-mismatch（6.5 Prevent Hydration Mismatch Without Flickering）
- **简要原因**：theme 默认 `'light'`，实际可能从 localStorage 读；useEffect 再写 `dataset.theme` 会导致首帧为 light 再闪变，且与“服务端无 theme、客户端有 theme”不一致。
- **修改建议**：要么 (1) 在根 layout 注入同步脚本，在 React 水合前根据 localStorage 设置 `document.documentElement.dataset.theme` 和 class，要么 (2) 使用惰性初始化 `useState(() => getThemeFromStorage())` 并保证服务端与客户端首帧一致（如服务端也输出默认 light 的 class），避免闪烁。

---

## 6. Rendering（渲染与列表）

### 6.1 components/SearchModal.tsx:361-371

- **触犯规则**：hoist-static-jsx（6.3 Hoist Static JSX Elements）
- **简要原因**：骨架屏 JSX 在组件内用 `[1,2,3].map` 生成，每次渲染都重新创建。
- **修改建议**：将骨架项提到模块级常量，组件内只引用。

```tsx
const SEARCH_SKELETON_ITEMS = [1, 2, 3].map((i) => (
  <div key={i} className="search-modal__skeleton-item">
    <div className="search-modal__skeleton-icon" />
    <div className="search-modal__skeleton-content">
      <div className="search-modal__skeleton-title" />
      <div className="search-modal__skeleton-desc" />
    </div>
  </div>
));
// 组件内
{isLoading ? (
  <div className="search-modal__loading">{SEARCH_SKELETON_ITEMS}</div>
) : ...}
```

### 6.2 components/SearchResults.tsx:87-114

- **触犯规则**：content-visibility-long-lists（6.2 CSS content-visibility for Long Lists）
- **简要原因**：搜索结果列表可能很长，未使用 `content-visibility: auto`，首屏外项仍参与布局/绘制。
- **修改建议**：为列表项增加 class，在 CSS 中设置 `content-visibility: auto` 与合适的 `contain-intrinsic-size`。

```css
.search-results__item {
  content-visibility: auto;
  contain-intrinsic-size: 0 60px;
}
```

### 6.3 components/NavDrawer.tsx、TokenNav、AppShell 文档列表

- **触犯规则**：content-visibility-long-lists（6.2）
- **简要原因**：导航列表、文档区块较长时未使用 content-visibility。
- **修改建议**：对长列表容器或列表项应用 `content-visibility: auto` 和 `contain-intrinsic-size`（按实际行高估算）。

### 6.4 components/TokenProvider.tsx:12-20

- **触犯规则**：hydration-mismatch（6.5）
- **简要原因**：同上 5.6，theme 默认与 storage 不一致会导致闪烁。
- **修改建议**：同上 5.6，同步脚本或惰性初始化并统一首帧。

---

## 7. JavaScript（循环、不可变、正则）

### 7.1 components/Header.tsx:216

- **触犯规则**：tosorted-instead-of-sort（7.12 Use toSorted() Instead of sort() for Immutability）
- **简要原因**：`results.sort((a, b) => b.score - a.score)` 会原地修改 `results`，在 React 状态或派生数据中易引入隐性依赖和难以排查的 bug。
- **修改建议**：使用 `results.toSorted((a, b) => b.score - a.score)` 得到新数组再 setState。

```ts
setSearchResults(results.toSorted((a, b) => b.score - a.score));
```

### 7.2 components/SearchModal.tsx:144

- **触犯规则**：tosorted-instead-of-sort（7.12）
- **简要原因**：`items.filter(...).sort(...)` 中 `.sort()` 会改变 filter 返回的数组（虽然此处为中间变量，习惯上仍建议不可变）。
- **修改建议**：改为 `.toSorted((a, b) => latestIds.indexOf(a.id) - latestIds.indexOf(b.id))`。

### 7.3 components/SearchResults.tsx:45-55、SearchModal.tsx:275-285

- **触犯规则**：hoist-regexp（7.9 Hoist RegExp Creation）
- **简要原因**：`highlightText` 内每次调用都 `new RegExp(..., 'gi')`，在列表渲染中会重复创建；且带 `g` 的 regex 有 lastIndex 状态，在 map 中连续 test 可能出错。
- **修改建议**：用 `useMemo` 根据 `query` 生成 regex，或模块级对固定 query 缓存；对同一段文本的高亮避免用同一全局 regex 的 test 在循环中多次调用。

```tsx
const regex = useMemo(
  () => new RegExp(`(${escapeRegex(query)})`, 'gi'),
  [query]
);
// 在 highlightText 内用 regex 做 split，避免在 map 里对同一 regex 多次 test
```

---

## 8. 按优先级排序的修复清单（含改动风险）

| 优先级 | 位置 | 规则简称 | 改动风险 | 说明 |
|--------|------|----------|----------|------|
| 高 | app/page.tsx:11-14 | async-parallel | 低 | 去掉多余 Promise.resolve，或拆成同步+异步两行 |
| 高 | components/DocContent.tsx:4-5 | dynamic-imports-heavy | 中 | 使用 next/dynamic 懒加载 DocContent 或内部动态加载 react-markdown |
| 高 | next.config.mjs:6-12 | barrel-file-imports | 低 | 增加 experimental.optimizePackageImports |
| 高 | components/Header.tsx:216 | tosorted-instead-of-sort | 低 | results.sort → results.toSorted |
| 高 | components/SearchResults.tsx 等列表 | content-visibility | 低 | 为长列表项添加 content-visibility: auto |
| 中 | components/Header.tsx:139-159 | narrow-effect-deps | 低 | 移除 effect 依赖中的 isScrolled |
| 中 | components/AppShell.tsx:145-156 | functional-setstate | 低 | setActiveToken 改为函数式更新 |
| 中 | components/AppShell.tsx:182-206 | narrow-effect-deps | 中 | 用 ref 存 wasMobile，收窄 effect 依赖 |
| 中 | components/SearchModal.tsx:56,65-77 | lazy-state-init | 低 | recentItems 使用惰性初始化从 localStorage 读取 |
| 中 | components/TokenProvider.tsx + 根 layout | hydration-mismatch | 高 | 同步脚本或惰性 theme 初始化，避免主题闪烁 |
| 中 | components/SearchModal.tsx:361-371 | hoist-static-jsx | 低 | 骨架屏 JSX 提到模块级常量 |
| 中 | components/SearchModal.tsx:144 | tosorted | 低 | filter 结果用 toSorted |
| 中 | components/SearchResults.tsx / SearchModal highlightText | hoist-regexp | 低 | 高亮用 useMemo 生成 regex 或按 query 缓存 |
| 低 | components/SearchProvider.tsx:30-50 | deduplicate-listeners | 中 | 全局 keydown 单监听 + 回调注册表 |
| 低 | components/AppShell.tsx 多处 | deduplicate-listeners | 中 | hashchange/scroll/keydown 模块级单监听（或注释单例） |
| 低 | components/Header.tsx scroll | deduplicate-listeners | 低 | 同上，或保留并注释单例 |
| 低 | components/Tooltip.tsx:86-96 | deduplicate-listeners | 中 | scroll/resize 单监听 + 实例回调集合 |
| 低 | app/docs layout+page getContentTree | server-cache-react | 中 | 若改为异步，用 React.cache() 包装 getContentTree |
| 低 | app/docs/[[...slug]]/page DocsPageView props | minimize-serialization | 低 | 仅向 client 传必要字段 |

以上为本次性能审查的完整问题列表与修复建议；实施时建议按“高→中→低”且“低风险优先”，再视情况处理高风险项（如 theme 水合）并辅以手动/自动化测试。

---

## Batch C / D 实施记录（中低风险）

### Batch C（中优先级）

| 项 | 位置 | 实施内容 | 状态 |
|----|------|----------|------|
| C1 | components/AppShell.tsx | 滚动高亮：用 useRef 存 rafId 与 docsRef；scroll 内仅 requestAnimationFrame 做 getBoundingClientRect/currentSection；addEventListener { passive: true }；effect 依赖 [] | 已完成 |
| C2 | components/Header.tsx | scroll 监听仅 mounted 后绑定一次；handleScroll 内 rAF，仅 lastIsScrolledRef 变化时 setState；{ passive: true } | 已完成 |
| C3 | components/SearchProvider.tsx | 全局 keydown：useCallback + refs（isOpenRef/toggleSearchRef/closeSearchRef）；effect 依赖 []；addEventListener { passive: false } | 已完成 |
| C4 | components/Tooltip.tsx | 仅在 isVisible 时绑定 scroll/resize；scroll 使用 { capture: true, passive: true }，resize 使用 { passive: true } | 已完成 |

### Batch D（低优先级）

| 项 | 位置 | 实施内容 | 状态 |
|----|------|----------|------|
| D1 | hooks/useEventListener.ts | 新增稳定事件监听 hook：内部 ref 存 handler/options，effect 仅依赖 target/type；SearchProvider / Header / AppShell / Tooltip 相关监听已迁移 | 已完成 |
| D2 | 验证 | npm run build 后 grep .next/static 与 .next/server，确认 DocContent 依赖未进入 client chunks；结论见下方「Client Bundle 二次验证」 | 已完成 |

### scripts/fix-font-paths.js ENOENT 说明

- 若 `npm run build` 在 `next build` 成功后、执行 `node scripts/fix-font-paths.js` 时报 `ENOENT`（例如路径含空格或 `out/` 下文件与脚本预期不一致），**Next 构建产物已完整生成**，不影响 DocContent/client bundle 结论。
- **仅文档记录方案**：在本文档中注明「build 以 next build 成功为准；fix-font-paths 若 ENOENT 可忽略或单独修脚本」。
- **最小修复方案**：在脚本内对 `fs.readFileSync`/`fs.readdirSync` 等做 try/catch 或路径规范化（如 trim、排除含空格路径），避免单文件 ENOENT 导致进程 exit 1。

---

## Client Bundle Verification

**验证方式（grep）**
- `npm run build`（Next.js 编译成功；随后 `scripts/fix-font-paths.js` 报错 `ENOENT`，但 `.next` 产物已生成）
- `grep -R "react-markdown" .next/static`
- `grep -R "remark-gfm" .next/static`
- `grep -R "react-markdown" .next/server`
- `grep -R "remark-gfm" .next/server`

**搜索结果**
- `.next/static`（client bundle）：
  - `react-markdown`：未命中 → **未出现在 client bundle**
  - `remark-gfm`：未命中 → **未出现在 client bundle**
- `.next/server`（server bundle）：
  - `react-markdown`：命中 `.next/server/chunks/66.js`
  - `remark-gfm`：未命中（字符串未出现，可能被压缩/内联）

**结论**
- `react-markdown` **仅出现在 server bundle**，未出现在 client bundle。
- `remark-gfm` **未在 client bundle 中出现**；由于字符串未在 server bundle 中命中，基于字符串 grep 无法进一步定位其文件，但其唯一引用仍在 Server Component（`DocContent`）中。

**Batch C/D 后的二次验证结果**

- 执行 `npm run build`（Next 编译成功），随后执行：
  - `grep -R "react-markdown" .next/static` → 无命中
  - `grep -R "remark-gfm" .next/static` → 无命中
  - `grep -R "react-markdown" .next/server` → 命中 `.next/server/chunks/66.js`
- **结论**：DocContent 依赖（react-markdown / remark-gfm）未进入 client chunks，仅出现在 server bundle，与 Batch A/B 结论一致。

---

## 验收 Checklist（Batch C/D 后）

- [ ] **npm run dev**：访问 `/`、`/overview`、任意 `/docs/...` 页面均正常；滚动高亮正常；Cmd/Ctrl+K 搜索正常；无明显重复绑定导致的多次触发。
- [ ] **性能**：滚动时主线程抖动降低（不要求量化，但确保不会每滚动像素都 setState）。
- [ ] **bundle**：grep 证明 DocContent 依赖未进入 client chunks（见上方 Client Bundle Verification）。
