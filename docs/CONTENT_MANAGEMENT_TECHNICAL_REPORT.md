# YDS 内容管理技术报告

## 1. 概述

### 1.1 项目背景

YAMI Design Guidelines（YDS）是 YAMI 设计系统的文档站点，基于 Next.js App Router 构建，用于展示设计规范、基础规范（Foundations）、组件说明及资源入口。站点内容以文档页为主，辅以首页、概述（Overview）与多级导航，内容管理方式直接影响路由设计、渲染策略与搜索能力。

### 1.2 报告目的

本报告对 YDS 项目的内容管理方式与实现技术进行梳理，包括：内容源与数据模型、路由与内容的对应关系、文档渲染与多文档展示策略、导航与状态同步、搜索机制、校验与一致性，以及技术栈与数据流小结。目标读者为参与站点维护或扩展的开发者与文档维护者，便于理解现有架构并在后续迭代中保持一致性。

---

## 2. 内容管理架构

### 2.1 数据源与模型

#### 主数据源：`data/docs.ts`

- **类型定义**：`DocPage = { id: string; markdown: string }`
- **存储方式**：所有文档为**内联 Markdown 字符串**，在 TypeScript 中定义为常量（如 `const color = \`# 色彩 Color\n...\`;`），无独立 `.md` 文件。
- **规模**：约 30 个文档，覆盖 overview、changelog、update-process、品牌（logo、brand-colors、typeface）、基础规范（color、typography、spacing、layout、radius、elevation、iconography、motion）、组件（button、tabs、badge、heading、filter、navbar、product-card、forms、patterns-overview）、资源（resources-overview）等。
- **导出**：统一导出为数组 `docs: DocPage[]`，供各页面与 AppShell 按需过滤或全量使用。

#### 导航配置：`config/navigation.ts`

- **结构**：`SectionConfig[]`，每个 section 包含 `id`、`label`、`iconClass`、`items: NavItem[]`、可选 `defaultItem`。
- **一级分类**：Home、入门指南（getting-started）、品牌（brand）、基础规范（foundations）、组件（components）、内容策略（content）、资源（resources）。
- **二级项**：`NavItem` 含 `id`、`label`、`icon`；`id` 与文档 `id` 对应（如 `color`、`button`）。部分 nav 项在 docs 中仅有占位内容（如 filter、navbar）。
- **工具函数**：`getSectionConfig(sectionId)`、`getAllSectionIds()`、`getSectionItemIds(sectionId)`、`findSectionByItemId(itemId)`，用于侧栏与路由解析。

#### 首页数据：`data/home.ts`

- **内容**：快速入口卡片（`quickStartCards`）、最近更新列表（`recentUpdates`）、版本号（`version`）。
- **与文档关系**：与 `data/docs.ts` 分离，仅供首页使用；卡片 `href` 指向各 section 或子路径，不直接引用 doc id。

### 2.2 与导航的关系

- 导航 id 与文档 id 在多数情况下一一对应（如 foundations 下的 color、typography；components 下的 button、tabs）。
- 例外：Overview 页面对应 overview、changelog、update-process 三条 doc，通过 Tabs 切换；content、resources 的“概述”对应 content-overview、resources-overview；getting-started 的 introduction 在 docs 中无条目，由页面内联构造。
- 新增文档时需同时考虑：在 `data/docs.ts` 中增加 `DocPage`，在 `config/navigation.ts` 中对应 section 的 `items` 中增加 `NavItem`（若需在侧栏展示），以及在 AppShell 的 `getDocRoute` / 页面过滤逻辑中保持一致。

---

## 3. 路由与内容映射

### 3.1 映射表

| 路由 | 内容来源 | 说明 |
|------|----------|------|
| `/` | 首页组件 | 不传 docs，独立首页（HomePage） |
| `/overview` | `docs` 全量 | AppShell 接收全部 docs；Overview 内用 Tabs 切 overview / changelog / update-process |
| `/getting-started/introduction` | 内联 `introductionDoc` + `docs` | 页面内构造 introduction 文档后与 docs 拼接传入 AppShell |
| `/foundations` | `docs.filter(foundationsIds)` | 仅 8 条：color、typography、spacing、layout、radius、elevation、iconography、motion |
| `/foundations/[slug]`（如 color） | `docs.find(id === slug)` | 单条 doc，以单元素数组传 AppShell（保证当前页搜索可用） |
| `/foundations/brand` | `docs.find(brand 相关)` | 品牌下多条 doc（logo、brand-colors、typeface），由 AppShell 按 activeToken 显隐 |
| `/components` | `docs.filter(componentIds)` | 含 button、tabs、badge、heading、filter、navbar、product-card、forms、patterns-overview 等 |
| `/components/[id]` | `docs.find(id === params.id)` | `generateStaticParams` 固定 id 列表，动态页取单条 |
| `/content` | 内联 `contentDoc` | 单条占位文档，不来自 data/docs.ts |
| `/resources` | `docs.filter(id === 'resources-overview')` 或内联占位 | 有则用 docs，无则页面内造一条占位 |

### 3.2 典型页面逻辑

- **规律**：页面级按“当前 section”过滤或单条查 doc，将得到的 `DocPage[]` 传给 AppShell；AppShell 不解析路由，仅根据 `activeToken` 决定展示哪一条文档（见下文“文档渲染与多文档展示”）。
- **foundations 索引页**（`/foundations`）：过滤出 8 条 foundations 文档，用户通过侧栏或 hash 切换 activeToken。
- **components 动态页**（`/components/[id]`）：`generateStaticParams` 返回固定 id 列表以支持静态生成；页面根据 `params.id` 从 docs 中取对应 doc，未找到时回退为传全量 docs（避免空白）。
- **content / resources**：content 固定使用内联占位；resources 优先使用 docs 中的 resources-overview，缺失时使用内联占位，保证页面始终有内容可展示。

---

## 4. 文档渲染与多文档展示

### 4.1 DocContent 组件

- **位置**：`components/DocContent.tsx`
- **职责**：接收 `page: DocPage` 与 `hidden: boolean`，使用 `react-markdown` 将 `page.markdown` 渲染为 HTML。
- **样式映射**：标题（h1–h3）、段落（p）、列表（ul、ol、li）、行内/块代码（code）映射到项目 typography 类（如 `typo-h1`、`typo-p`、`token-inline`、`token-block`）。
- **根节点**：`<article id={page.id}>`，便于锚点（`#id`）与滚动联动、以及侧栏高亮当前文档。

### 4.2 AppShell 多文档显隐策略

- **位置**：`components/AppShell.tsx`
- **行为**：同一路由下传入的 `docs` 全部渲染为多个 `<DocContent>`，每个 `DocContent` 的 `hidden` 为 `page.id !== activeToken`。
- **效果**：仅当前 `activeToken` 对应的文档可见，其余保留在 DOM 中但通过 CSS 隐藏（如 `doc--hidden`）。这样既支持通过侧栏或 hash 切换文档无需重新请求，又保证当前文档的 id 可用于滚动与搜索跳转。

### 4.3 Overview 特例

- **位置**：`app/overview/page.tsx` 使用 AppShell 传入全量 docs；内容区由 `OverviewContent`（`components/OverviewContent.tsx`）渲染。
- **行为**：Overview 页内通过 Tabs 在 overview、changelog、update-process 三者间切换，仅渲染**一个** DocContent（`getActivePage()` 根据 activeTab 返回对应 doc），无“多 doc 同屏显隐”模式，与 foundations/components 等页的“多 doc 同屏、单 doc 可见”不同。

---

## 5. 导航与状态同步

### 5.1 路由 → 状态：getRouteState

- **位置**：`AppShell` 内 `getRouteState(pathname)`。
- **逻辑**：根据 `pathname` 解析出 `category`（一级分类）与 `token`（当前文档 id）。例如：
  - `/` → category: 'home', token: 'home'
  - `/foundations/color` → category: 'foundations', token: 'color'
  - `/foundations/brand` → category: 'brand', token: 'logo'（默认）
  - `/components` → category: 'components', token: 'button'（默认）
  - `/overview` → category: 'getting-started', token: 'introduction'（与 Overview 实际 Tabs 对应关系由 OverviewContent 自行管理）
- **同步**：`useEffect` 监听 `pathname` 与 `window.location.hash`，更新 `category` 与 `activeToken`，保证地址栏与侧栏、内容区一致。

### 5.2 侧栏：TokenNav

- **位置**：`components/TokenNav.tsx`
- **数据**：通过 `getSectionConfig(category)` 获取当前 section 的 `items`，渲染为按钮列表，`activeToken === item.id` 时高亮。
- **跳转**：`getItemRoute(itemId, sectionId)` 根据 section 与 item 生成路径（如 foundations → `/foundations/${itemId}`，brand → `/foundations/brand#${itemId}`），点击时 `router.push(route)`；若当前已在同页，则仅更新 `activeToken` 并滚动到 `#id`。

### 5.3 滚动与 hash 联动

- **滚动 → activeToken**：监听 `scroll`，对当前传入的 `docs` 对应的 DOM 元素（`document.getElementById(d.id)`）用 `getBoundingClientRect` 判断是否进入视口（如 top ≤ 30% 视高且 bottom ≥ 30% 视高），将第一个满足条件的 doc id 设为 `activeToken`。
- **hash → activeToken**：监听 `hashchange`，将 `location.hash` 去掉 `#` 后设为 `activeToken`，保证直接打开带 hash 的链接时侧栏与内容正确对应。

### 5.4 Doc id → 路由：getDocRoute

- **位置**：`AppShell` 内 `getDocRoute(docId)`（及搜索用 `getDocRouteForSearch`）。
- **用途**：搜索选中某 doc 时，需要跳转到对应页面并定位到该 doc；getDocRoute 集中维护 doc id 到 URL 的映射（overview/changelog/update-process → `/overview`；brand 系 → `/foundations/brand`；foundations 单页 → `/foundations/${id}`；components → `/components/${id}`；patterns-overview → `/components`；resources-overview → `/resources`；introduction → `/getting-started/introduction` 等），避免散落在多处。

---

## 6. 搜索机制

### 6.1 Header 内联搜索

- **位置**：`components/Header.tsx`
- **数据**：使用当前页传入的 `docs`（与 AppShell 接收的 docs 一致）。
- **检索**：对每条 doc 的 `markdown` 做**全文检索**（标题 + 正文），匹配时记录 matches 并打分（标题匹配权重更高，正文匹配与出现次数加权）。
- **展示**：结果在 `SearchResults` 下拉中展示，支持键盘上下与 Enter 选择；选择后调用 `onSearchSelect(pageId)`，由 AppShell 执行 `getDocRoute` 跳转并滚动到对应 doc。
- **特点**：检索范围受当前页传入的 docs 限制（如 foundations 页仅能搜到 8 条 foundations 文档）；全文检索，适合在单 section 内精搜。

### 6.2 全局 Cmd+K 搜索（SearchModal）

- **位置**：`components/SearchModal.tsx`；数据与跳转逻辑由 `AppShell` 提供（`searchItems`、`onSelect`）。
- **数据**：`searchItems` 在 AppShell 中由当前页 `docs` 映射而成：标题取 markdown 首行 `#`，描述取首段前约 60 字，类型根据 id 规则判为 component / resource / page；href 由 `getDocRouteForSearch` 生成。
- **检索**：仅针对 **title、description、id** 的字符串包含关系，不做 markdown 正文全文检索。
- **无输入时**：展示“最近更新”（固定 id 列表的子集）与 localStorage “最近访问”（选择 doc 时写入）。
- **选择后**：与 Header 搜索相同，通过 `handleSearchSelect(pageId)` 跳转并关闭 modal。

### 6.3 两套入口对比

- **数据源**：均为当前页传入的 `docs`，因此 Cmd+K 结果也受当前路由影响（例如在 foundations 页打开 Cmd+K 只能看到 foundations 的 doc 列表）。
- **检索粒度**：Header 为全文检索；SearchModal 为元数据（title/description/id）检索，无正文全文。
- **体验**：Header 适合在页内快速搜正文；Cmd+K 适合按标题/描述快速跳转与最近访问。

---

## 7. 校验与一致性

### 7.1 check-doc-links 脚本

- **位置**：`scripts/check-doc-links.mjs`
- **行为**：扫描 `docs/`、`tokens/` 目录下所有 `.md` 文件，提取 Markdown 链接，解析为本地路径并检查目标文件是否存在。
- **范围**：**不包含** `data/docs.ts` 中的内嵌 markdown，因此文档正文内的链接（如 `[查看规范](#button)` 或相对路径）目前未被该脚本校验。
- **建议**：若希望校验站点内链，可扩展脚本以解析 `data/docs.ts` 中的字符串，或考虑将部分文档迁出为 .md 再统一校验。

### 7.2 导航 id 与 doc id 对应关系

- **一致**：foundations、components 下多数 item id 与 docs 中 id 一致（如 color、button、tabs）。
- **差异**：content 的 item id 为 content-overview，resources 为 resources-overview，与 docs 中 id 一致；getting-started 的 introduction 在 docs 中无条目；部分 components 项（如 filter、navbar）在 docs 中仅有占位内容，导航与文档需人工保持同步。

---

## 8. 技术栈与数据流小结

- **技术栈**：Next.js（App Router）、React、TypeScript；样式为全局 CSS + 设计 token（`styles/tokens.css`、`styles/theme.css`），无 CSS-in-JS。
- **数据流**：
  - 服务端/客户端页面组件从 `data/docs.ts` 读入 `docs`，按路由过滤或拼接后传给 AppShell。
  - AppShell、TokenNav、Header、SearchModal 等均为 client 组件，依赖 `usePathname`、`useRouter`、`window.location.hash`、scroll 监听维护 `category` 与 `activeToken`，并驱动侧栏高亮、DocContent 显隐与搜索跳转。
- **静态化**：`/components/[id]` 通过 `generateStaticParams` 预生成已知 id 列表，其余页面为默认服务端渲染。
- **可访问性与体验**：SearchModal 使用 `createPortal` 挂载到 body、锁 body 滚动、ARIA 与键盘导航；Header 搜索与 SearchModal 并存，数据源一致但检索粒度不同（全文 vs 元数据），便于不同场景下快速定位内容。

---

## 9. 改进建议（可选）

- **文档与校验**：将 `data/docs.ts` 中部分或全部文档迁出为独立 `.md` 文件，由构建或脚本统一加载并参与 `check-doc-links`，可提高内链可校验性与编辑体验；若保留内联，可增加针对 docs 字符串的链接解析与校验步骤。
- **搜索统一**：若希望 Cmd+K 支持全文检索，可将 SearchModal 的数据源扩展为与 Header 相同的全文检索结果，或在后端/构建时生成统一搜索索引（如 Fuse.js、Pagefind 等），避免两套逻辑长期分叉。
- **nav-doc 单一来源**：考虑由 `data/docs.ts` 或统一配置导出“文档 id + 所属 section”，导航配置仅保留 label/icon 等展示信息，section 与 item 列表由数据源派生，减少 nav 与 doc 不一致的可能。
- **Overview 与 AppShell 文档集**：Overview 使用 Tabs 仅渲染一条 doc，与其余页“多 doc 显隐”模式不同；若未来 Overview 需支持 hash 直接定位到 changelog/update-process，可让 Overview 也传入三条 doc 并由 AppShell 按 hash 设 activeToken，或保持现状并在文档中明确说明差异。

---

*报告版本：1.0 | 基于当前代码库梳理*
