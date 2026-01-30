# YAMI Design Guidelines (YDS) 项目报告

> 功能描述与技术实现总结文档

---

## 一、项目概述

### 1.1 项目简介

**YAMI Design Guidelines**（简称 YDS）是 YAMI 设计系统的官方文档站点，用于维护与展示 YAMI 设计规范、设计 Token 及相关技术文档。该项目面向设计、产品与开发团队，提供设计规范的集中查阅入口。

### 1.2 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 14.2.5 (App Router) |
| UI | React 18.2.0 |
| 文档渲染 | react-markdown + remark-gfm |
| 语言 | TypeScript 5.3+ |
| 样式 | CSS Variables + 设计 Token |
| 部署 | 静态导出 (output: export) → GitHub Pages |

### 1.3 核心能力

- 设计规范文档浏览与搜索
- 设计 Token 体系（色彩、间距、 typography 等）的集中管理
- 支持 Markdown 内容源（项目内 `content/` 或外部 Obsidian 库）
- 深色/浅色主题、响应式布局、全局搜索
- GitHub Pages 静态部署

---

## 二、功能模块

### 2.1 首页 (Home)

**路由**: `/`

**功能描述**:
- 展示快速入口卡片（Quick Start Cards），从内容索引或 `00_📚内容索引.md` 解析
- 展示最近更新列表（Recent Updates），展示各规范条目的状态与更新时间
- Hero 区品牌展示
- 全局搜索入口（Cmd/Ctrl+K）

**技术实现**:
- Server Component 预拉取 `getQuickStartCardsFromIndex()`、`getRecentUpdates()`
- `force-static` 导出静态页面
- `HomePageClient` 作为 Client Component 管理搜索与交互

### 2.2 文档系统 (Docs)

**路由**: `/docs/[section]/[file]`

**功能描述**:
- 以目录树形式展示 `content/docs/` 下的 Markdown 文档
- 支持分组：A_快速开始、B_品牌、C_基础规范、D_组件、E_内容策略、F_资源
- 支持 Obsidian 风格 `[[目标|标签]]` 内部链接，自动转为站点内链接
- 支持文档 front matter：`category`、`status`、`last_updated`、`title`、`description`
- 文档内 Callout 语法 `[!info]`、`[!note]` 等

**技术实现**:
- `getContentTree()` 扫描 `content/docs/` 生成目录树
- `getMarkdownAndFrontmatter()` 读取 Markdown 并解析 front matter
- `generateStaticParams()` 为所有文档生成静态参数
- `rewriteWikiLinks()` 将 `[[target|label]]` 转为 `/docs/section/file` 链接
- `DocContent` 使用 `react-markdown` + `remark-gfm` 渲染，自定义组件支持表格、代码块、Callout

### 2.3 全局搜索 (Search)

**功能描述**:
- 快捷键 `Cmd+K` (Mac) / `Ctrl+K` (Win) 打开搜索弹窗
- `ESC` 关闭
- 支持标题、描述、id 模糊匹配
- 展示「最近更新」与「最近访问」（localStorage）
- 键盘导航：上下选择、Enter 打开
- 点击遮罩关闭

**技术实现**:
- `SearchProvider` Context 管理 `isOpen`、`openSearch`、`closeSearch`、`toggleSearch`
- `useEventListener` 注册全局 keydown，`passive: false` 以 `preventDefault`
- `SearchModal` 使用 `createPortal` 挂载到 `document.body`
- 锁滚动时保留 `padding-right` 避免滚动条消失导致布局跳动
- `dynamic import` 实现 SearchModal 按需加载（SSR 关闭）

### 2.4 导航与布局

**功能描述**:
- 一级导航 IconNav：Home、入门指南、品牌、基础规范、组件、内容策略、资源
- 二级导航 TokenNav：根据当前 section 展示子项
- 桌面端可折叠侧边栏
- 移动端 Drawer 抽屉式导航
- 路由与 hash 同步：`/docs/A_快速开始/A01_介绍#anchor`
- 滚动时自动高亮当前文档（视口 30% 中心线判断）

**技术实现**:
- `AppShell` 统一管理 `category`、`activeToken`、`mobileOpen`、`sidebarCollapsed`
- `getRouteState(pathname)` 从 pathname 解析 `category` 与 `token`
- `IntersectionObserver` 监听 sentinel 判断 Header 搜索栏显示状态
- `useEventListener` + `requestAnimationFrame` 实现滚动高亮（passive: true）
- `matchMedia('(max-width: 767px)')` 判断移动端，断点变化时自动关闭 drawer
- 路由变化时关闭移动端 drawer

### 2.5 设计 Token 系统

**功能描述**:
- 单源定义：`tokens/tokens.json` 为唯一真相源
- 自动生成 `styles/tokens.css`（CSS 变量）、`tokens/tokens.d.ts`（TypeScript 类型）
- 支持色彩、间距、字体、布局、圆角、阴影、按钮、图标、徽章、层级、动画等

**技术实现**:
- `scripts/generate-tokens.py` 从 `tokens.json` 生成 CSS 与 `.d.ts`
- `TokenProvider` 提供主题切换能力（`data-theme="dark"`）
- `lib/tokens/index.ts` 导出 `designTokens` 供运行时使用
- `theme.css` 基于 tokens 定义主题变量

### 2.6 内容源与同步

**功能描述**:
- 默认内容根目录：`content/`
- 可选 `YDS_CONTENT_DIR` 指向本地 Obsidian 库，开发时直接读取
- `sync-obsidian-content.mjs` 将 Obsidian 内容同步到项目 `content/docs/`
- `content-mapping.json` 支持 Obsidian 文件名与 canonical 路径映射

**技术实现**:
- `lib/content/constants.ts` 定义 `getContentRoot()`
- `loaders.ts` 中 `getSourcePathForCanonical()` 按 mapping 反查源路径
- `sync-obsidian-content.mjs` 支持 `.md`、`.mdx`、图片，排除 `.obsidian`、`.trash`

### 2.7 Foundations / Components 静态页面

**路由**: `/foundations/*`、`/foundations/brand`、`/getting-started/introduction`、`/overview`、`/content`、`/resources`

**功能描述**:
- 部分路由使用内联 `data/docs.ts` 中的 Markdown 作为 fallback
- Overview 使用 Tabs 切换 overview、changelog、update-process
- 与 content-tree 模式并存，部分入口仍指向静态路由

**技术实现**:
- `data/docs.ts` 导出 `DocPage[]`，包含 color、typography、button 等内联文档
- `config/navigation.ts` 定义 `SectionConfig[]`，与 docs 的 id 对应
- AppShell 根据 `contentTree` 存在与否选择 doc 来源与路由解析逻辑

---

## 三、技术实现细节

### 3.1 目录与内容树

| 路径 | 说明 |
|------|------|
| `content/docs/` | 文档根目录，按 `{前缀}_{分组}/` 组织 |
| `content/docs/00_📚 内容索引.md` | 导航索引，解析 Quick Start 卡片 |
| `lib/content/tree.ts` | `getContentTree()`、`normalizeDocId()` |
| `lib/content/loaders.ts` | `getMarkdownByRelativePath()`、`getDocFrontmatter()`、`getMarkdownAndFrontmatter()` |
| `lib/content/nav-index.ts` | `getQuickStartCardsFromIndex()` 解析索引表格/段落 |
| `lib/content/recent-updates.ts` | `getRecentUpdates()` 基于配置 + 文档解析 |

### 3.2 Doc id 规范化

- 去掉 `.md`、emoji、空格，得到 slug：`normalizeDocId(name)`
- 用于 URL、锚点、搜索索引

### 3.3 路由与静态生成

- `generateStaticParams()` 基于 `getContentTree(DEFAULT_CONTENT_DIR)` 生成所有 `[section, file]` 组合
- 支持编码与非编码 slug，确保开发与静态导出均可匹配
- 根路径 `/docs` 或 `/docs/` 重定向到首篇文档

### 3.4 性能与体验

- `optimizePackageImports: ['react-markdown', 'remark-gfm']` 减少包体积
- SearchModal 使用 `dynamic` 且 `ssr: false` 降低首屏负担
- 字体预加载：`icofont.css`、`icofont.woff2`
- 滚动高亮使用 RAF + passive listener，避免阻塞主线程
- `useEventListener` 统一管理事件注册与清理

### 3.5 可访问性

- 搜索弹窗 `role="dialog"`、`aria-modal="true"`、`aria-labelledby`
- 列表 `role="listbox"`、`role="option"`、`aria-activedescendant`
- 快捷键提示 `kbd`、`sr-only` 标题

### 3.6 部署

- GitHub Pages：`GITHUB_PAGES=true`、`NEXT_PUBLIC_BASE_PATH=/guidelines-site`
- `output: 'export'` 生成 `out/` 静态站点
- `assetPrefix`、`basePath` 与 base path 一致

---

## 四、脚本与工具

| 脚本 | 命令 | 说明 |
|------|------|------|
| 开发 | `npm run dev` | 启动 Next.js dev server（127.0.0.1） |
| 构建 | `npm run build` | Next build + `fix-font-paths.js` |
| 结构检查 | `npm run lint:structure` | `check-structure.mjs` |
| 文档链接检查 | `npm run docs:check` | `check-doc-links.mjs` |
| 内容同步 | `npm run sync:content` | `sync-obsidian-content.mjs` |
| Token 生成 | `python3 scripts/generate-tokens.py` | 生成 `tokens.css`、`tokens.d.ts` |

---

## 五、路径别名

| 别名 | 目标 |
|------|------|
| `@/*` | 项目根目录 |
| `@/components/*` | `components/` |
| `@/lib/*` | `lib/` |
| `@/styles/*` | `styles/` |
| `@/tokens/*` | `tokens/` |
| `@/config/*` | `config/` |

---

## 六、依赖关系

```
next 14.2.5
react 18.2.0
react-markdown ^9.0.1
remark-gfm ^4.0.1
typescript ^5.3.0
```

---

## 七、内容结构概览

```
content/docs/
├── 00_📚 内容索引.md
├── A_快速开始/          # 介绍、设计原则、Figma、常见问题、更新日志
├── B_品牌/              # 品牌愿景、色彩策略、Logo、品牌原则、应用图标
├── C_基础规范/          # 颜色、字体、间距、布局、圆角、阴影、图标、动效、无障碍、国际化
├── D_组件/              # 按钮、标签页、筛选器、徽标、标题、组件原则、业务组件
├── E_内容策略/          # UI 文案、本地化、语气与风格、内容层级、内容原则
└── F_资源/              # Token 概述、文件结构、命名规范、平台映射、设计/开发资源
```

---

## 八、总结

YDS 是一个基于 Next.js App Router 的设计规范文档站点，具备以下特点：

1. **双内容源**：支持项目内 `content/` 与 Obsidian 库，通过环境变量与同步脚本灵活切换
2. **静态优先**：文档通过 `generateStaticParams` 预生成，适合 GitHub Pages 部署
3. **统一导航**：IconNav + TokenNav + 搜索，路由与 hash 保持一致
4. **设计 Token**：单源 JSON，自动生成 CSS 与 TypeScript 类型
5. **性能与可访问性**：按需加载、事件优化、ARIA 与键盘支持

该报告可作为项目维护、扩展与交接的参考文档。
