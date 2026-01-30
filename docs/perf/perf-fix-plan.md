# 性能修复任务列表（可执行）

基于 [性能审查报告](../PERFORMANCE_AUDIT_REPORT.md) 中的修复清单拆分，按批次与模块/组件归类，便于单次 PR 内完成或拆分提交。

---

## Batch A：高优先级 + 低风险（1 次 PR 内完成）

- [ ] **首页去掉多余 Promise.resolve**
  - **涉及文件**：`app/page.tsx`
  - **预期收益**：消除误导性异步包装，首页数据准备逻辑更清晰。
  - **验证方式**：`npm run build`；打开首页确认卡片与最近更新正常展示。

- [ ] **next.config 增加 optimizePackageImports**
  - **涉及文件**：`next.config.mjs`
  - **预期收益**：对 react-markdown / remark-gfm 等包做导入优化，减轻构建与冷启。
  - **验证方式**：`npm run build`，对比构建时间与产物体积（可选）。

- [ ] **Header 搜索结果用 toSorted 替代 sort**
  - **涉及文件**：`components/Header.tsx`
  - **预期收益**：避免原地修改数组，符合 React 不可变数据习惯，减少隐性 bug。
  - **验证方式**：`npm run build`；在规范页展开 Header 内搜索框，输入关键词确认结果排序与高亮正常。

- [ ] **长列表项增加 content-visibility**
  - **涉及文件**：`components/SearchResults.tsx`、`app/globals.css` 或对应模块样式（如 `styles/theme.css`）；若 NavDrawer / TokenNav / 文档区有长列表，可一并加 class 与样式。
  - **预期收益**：首屏外列表项延迟布局/绘制，加快首屏渲染与滚动性能。
  - **验证方式**：`npm run build`；本地运行页面，打开搜索结果/侧栏/文档列表，滚动与折叠展开无错位、无闪烁。

---

## Batch B：高优先级 + 中风险（可拆成 1～2 次 PR）

- [ ] **DocContent 或 react-markdown 改为动态加载**
  - **涉及文件**：`components/DocContent.tsx`；引用 DocContent 的页面（如 `app/docs/[[...slug]]/DocsPageView.tsx` 或对应 layout/page）。
  - **预期收益**：减小首包体积，改善 TTI/LCP，文档区首屏可先出骨架再加载 Markdown 渲染。
  - **验证方式**：`npm run build`；打开若干文档页，确认 Markdown 渲染、callout、表格、代码块正常，无布局跳动（必要时保留骨架占位）。

- [ ] **（可选）DocContent 内部按需动态 import react-markdown**
  - **涉及文件**：`components/DocContent.tsx`
  - **预期收益**：与上一条二选一或组合使用；进一步将重依赖从主 chunk 剥离。
  - **验证方式**：同 Batch B 第一条，重点检查文档页 SSR/CSR 与样式一致。

---

## Batch C：中优先级（按模块归类）

### Header 模块

- [ ] **Header 滚动 effect 移除 isScrolled 依赖**
  - **涉及文件**：`components/Header.tsx`
  - **预期收益**：避免因 isScrolled 变化导致 effect 重复执行，减少多余监听与 setState。
  - **验证方式**：`npm run build`；滚动页面确认顶栏阴影在滚动时仍正确出现/消失。

### AppShell 模块

- [ ] **AppShell 滚动高亮用函数式 setState 更新 activeToken**
  - **涉及文件**：`components/AppShell.tsx`
  - **预期收益**：避免闭包陈旧导致滚动高亮与真实视口不一致。
  - **验证方式**：本地运行文档页，快速滚动侧栏与内容区，确认当前章节高亮与 URL hash 一致。

- [ ] **AppShell 移动端检测 effect 用 ref 存 wasMobile 并收窄依赖**
  - **涉及文件**：`components/AppShell.tsx`
  - **预期收益**：减少 effect 重跑，避免 isMobile/mobileOpen 依赖链引起的多余行为。
  - **验证方式**：本地运行，切换视口宽度过 768px 断点，确认 drawer 在放大时关闭、缩小时不误关；菜单与侧栏行为正常。

### SearchModal 模块

- [ ] **SearchModal recentItems 惰性初始化自 localStorage**
  - **涉及文件**：`components/SearchModal.tsx`
  - **预期收益**：首帧即可展示最近访问，减少一次空列表再刷新的闪烁。
  - **验证方式**：打开搜索弹窗，确认「最近访问」在首次打开时即正确显示（若此前有访问记录）。

- [ ] **SearchModal 骨架屏 JSX 提升到模块级常量**
  - **涉及文件**：`components/SearchModal.tsx`
  - **预期收益**：避免每次渲染重新创建骨架节点，减轻无谓的 JSX 创建。
  - **验证方式**：`npm run build`；打开搜索弹窗并输入触发加载态，确认骨架样式与过渡正常。

- [ ] **SearchModal 列表排序改用 toSorted**
  - **涉及文件**：`components/SearchModal.tsx`
  - **预期收益**：与 Header 一致，保持不可变写法，避免习惯性误用 sort。
  - **验证方式**：打开搜索弹窗，确认「最近更新」等列表顺序与交互正常。

- [ ] **SearchModal / SearchResults 高亮用 useMemo 生成 regex**
  - **涉及文件**：`components/SearchModal.tsx`、`components/SearchResults.tsx`
  - **预期收益**：按 query 缓存正则，减少重复创建与带 g 的 regex 在 map 中的状态问题。
  - **验证方式**：Header 内搜索与搜索弹窗内输入关键词，确认高亮正确、无控制台报错。

### TokenProvider + 根 layout（主题水合）

- [ ] **主题初始化与水合：同步脚本或惰性 theme 避免闪烁**
  - **涉及文件**：`components/TokenProvider.tsx`、根 layout（如 `app/layout.tsx`）
  - **预期收益**：首帧主题与 localStorage 一致，避免 light→dark 或反方向的闪烁。
  - **验证方式**：设置系统/本地为 dark，刷新页面确认无主题闪烁；切换主题后刷新，主题保持。

---

## Batch D：低优先级（监听去重等，按组件归类）

### SearchProvider

- [ ] **SearchProvider 全局 keydown 单监听 + 回调注册表**
  - **涉及文件**：`components/SearchProvider.tsx`
  - **预期收益**：多实例时仍只注册一个 keydown，减少重复触发与清理复杂度。
  - **验证方式**：本地运行，Cmd/Ctrl+K 打开/关闭搜索、ESC 关闭，多次切换无异常；若有多个 SearchProvider 占位，行为一致。

### AppShell

- [ ] **AppShell hashchange / scroll / keydown 模块级单监听（或注释单例）**
  - **涉及文件**：`components/AppShell.tsx`
  - **预期收益**：避免多实例时重复监听，或明确文档“单例使用”以利后续重构。
  - **验证方式**：文档页内 hash 切换、滚动高亮、ESC 关 drawer 均正常；build 通过。

### Header

- [ ] **Header scroll 监听去重或注释单例**
  - **涉及文件**：`components/Header.tsx`
  - **预期收益**：与 AppShell 一致，统一全局 scroll 策略或明确单例前提。
  - **验证方式**：滚动时顶栏阴影正确；build 通过。

### Tooltip

- [ ] **Tooltip scroll/resize 单监听 + 实例回调集合**
  - **涉及文件**：`components/Tooltip.tsx`
  - **预期收益**：多个 Tooltip 同时打开时只注册一组 scroll/resize，减少监听数。
  - **验证方式**：同时悬停多个带 Tooltip 的元素，滚动/缩放窗口时 tooltip 位置更新正确、无报错。

### 服务端 / RSC（可选）

- [ ] **getContentTree 若改为异步则用 React.cache() 包装**
  - **涉及文件**：`lib/content/tree.ts`、`app/docs/[[...slug]]/layout.tsx`、`app/docs/[[...slug]]/page.tsx`
  - **预期收益**：同请求内 layout 与 page 只计算一次 content tree，避免重复 I/O。
  - **验证方式**：仅在将 getContentTree 改为 async 后执行；build 与文档页导航、侧栏数据一致。

- [ ] **DocsPageView 仅向 client 传必要 props**
  - **涉及文件**：`app/docs/[[...slug]]/page.tsx`、`app/docs/[[...slug]]/DocsPageView.tsx` 及下游 client 组件。
  - **预期收益**：减小 RSC 边界序列化体积，加快文档页响应。
  - **验证方式**：`npm run build`；文档页渲染、元信息与导航正常。

---

## 使用说明

- **Batch A**：建议在一个 PR 内完成，全部为低风险、高优先级。
- **Batch B**：可视改动大小拆成 1～2 个 PR，合并前重点验证文档页与构建。
- **Batch C**：按模块（Header / AppShell / SearchModal / TokenProvider）分 PR 或同模块合并，便于 review 与回滚。
- **Batch D**：按组件或“监听去重”主题分 PR，可与 C 并行或排在 C 之后。

每完成一项可在本文件中勾选对应 `- [ ]` 为 `- [x]`，并可在 PR 描述中引用本文件与《性能审查报告》中的具体章节。
