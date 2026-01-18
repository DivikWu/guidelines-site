# SearchModal 实现审计清单与规范映射表

## 1. 设计规范入口（已确认）

### 1.1 Tokens 定义文件
- **tokens.json**: `/tokens/tokens.json` - 完整的 token 定义（JSON 格式）
- **CSS 变量文件**: `/styles/tokens.css` - 自动生成的 CSS 变量（`--yami-*` 前缀）
- **主题变量文件**: `/styles/theme.css` - 语义化主题变量（`--foreground-*`, `--state-*` 等）
- **全局样式**: `/app/globals.css` - 全局样式与语义变量映射

### 1.2 语义 Token 命名
- **背景**: `color.background.light` / `color.background.dark` → `--yami-color-background-light/dark` → `--background-primary`
- **表面**: `color.surface.light` / `color.surface.dark` → `--yami-color-surface-light/dark` → `--background-secondary`
- **文本**: `color.text.primary/secondary/tertiary` → `--foreground-primary/secondary/tertiary`
- **边框**: `color.border.subtle/strong` → `--border-subtle`, `--border-normal`
- **状态**: `state.hover/selected/pressed/focus` → `--state-hover/selected/pressed/focus`（透明叠加策略）

### 1.3 Opacity Tokens
- `opacity.04` (0.04) - hover/selected
- `opacity.12` (0.12) - pressed
- `opacity.16` (0.16) - focus
- 已集成到 `state.*` tokens 中，直接使用 `--state-hover` 等变量

### 1.4 其他 Tokens
- **圆角**: `borderRadius.medium` (8px) → `--radius-card`, `--yami-border-radius-medium`
- **阴影**: `shadow.e3` / `shadow.e4` → `--yami-shadow-e3/e4`
- **间距**: `spacing.*` → `--spacing-*`, `--space-*`
- **字体**: `typography.body.*` / `typography.heading.*` → `--body-m-*`, `--heading-s-*`
- **层级**: `zIndex.modal` (1050), `zIndex.modalBackdrop` (1040) → `--yami-z-index-modal`, `--yami-z-index-modal-backdrop`

## 2. 现有基础设施（已确认）

### 2.1 组件
- ✅ **Header**: `/components/Header.tsx` - 已有搜索框和搜索图标，需要集成 SearchModal
- ✅ **Icon**: `/components/Icon.tsx` - 使用 iconfont，支持 `ds-icon-*` 类名
- ✅ **SearchResults**: `/components/SearchResults.tsx` - 现有搜索结果组件，可复用样式思路
- ❌ **Modal/Portal**: 无现成组件，需使用 `React.createPortal`

### 2.2 样式参考
- **遮罩层**: `.drawer-overlay` 在 `globals.css` 中，使用 `--yami-color-overlay-light/dark`，z-index `--yami-z-index-modal-backdrop`
- **锁滚动**: `AppShell.tsx` 中有示例（`useEffect` 中设置 `body.style.overflow`）

### 2.3 路由
- 非路由跳转，使用页面内滚动定位（`document.getElementById(id)?.scrollIntoView()`）
- `onSearchSelect` 回调在 `AppShell` 中处理导航逻辑

## 3. 规范映射表（SearchModal 使用的 Tokens）

| 用途 | Token 路径 | CSS 变量 | 语义变量 | 值 |
|------|-----------|---------|---------|-----|
| **遮罩背景** | `color.overlay.light/dark` | `--yami-color-overlay-light/dark` | - | light: `rgba(0,0,0,0.45)`, dark: `rgba(0,0,0,0.65)` |
| **卡片背景** | `color.surface.light/dark` | `--yami-color-surface-light/dark` | `--background-secondary` | light: `#FFFFFF`, dark: `#2A2A2A` |
| **卡片边框** | `color.border.subtle` | `--yami-color-border-subtle-*` | `--border-subtle` | light: `#EBEBEB`, dark: `#2A2A2A` |
| **主要文本** | `color.text.primary` | `--yami-color-text-primary-*` | `--foreground-primary` | light: `#1A1A1A`, dark: `#FFFFFF` |
| **次要文本** | `color.text.secondary` | `--yami-color-text-secondary-*` | `--foreground-secondary` | light: `#666666`, dark: `#CCCCCC` |
| **辅助文本** | `color.text.tertiary` | `--yami-color-text-tertiary-*` | `--foreground-tertiary` | light: `#999999`, dark: `#B3B3B3` |
| **Focus Ring** | `state.focus` | `--yami-color-state-focus-*` | `--state-focus` | light: `rgba(0,0,0,0.16)`, dark: `rgba(255,255,255,0.16)` |
| **Hover 叠加** | `state.hover` | `--yami-color-state-hover-*` | `--state-hover` | light: `rgba(0,0,0,0.04)`, dark: `rgba(255,255,255,0.04)` |
| **Selected 叠加** | `state.selected` | `--yami-color-state-selected-*` | `--state-selected` | light: `rgba(0,0,0,0.04)`, dark: `rgba(255,255,255,0.04)` |
| **Pressed 叠加** | `state.pressed` | `--yami-color-state-pressed-*` | `--state-pressed` | light: `rgba(0,0,0,0.12)`, dark: `rgba(255,255,255,0.12)` |
| **卡片圆角** | `borderRadius.medium` | `--yami-border-radius-medium` | `--radius-card` | `8px` |
| **卡片阴影** | `shadow.e4` | `--yami-shadow-e4` | - | `0 8px 16px 0 rgba(0, 0, 0, 0.16)` |
| **卡片间距** | `spacing.*` | `--spacing-*` | `--space-*` | 详见 spacing tokens |
| **Modal Z-Index** | `zIndex.modal` | `--yami-z-index-modal` | - | `1050` |
| **Backdrop Z-Index** | `zIndex.modalBackdrop` | `--yami-z-index-modal-backdrop` | - | `1040` |
| **Body 字号** | `typography.body.medium` | `--body-m-size` | - | `14px` |
| **Heading 字号** | `typography.heading.small` | `--heading-s-size` | - | `16px` |

## 4. 实现要点

### 4.1 Portal 挂载
- 使用 `React.createPortal(children, document.body)`
- 仅在客户端挂载（`typeof document !== 'undefined'` 检查）

### 4.2 锁滚动
- 打开时：`document.body.style.overflow = 'hidden'`
- 关闭时：恢复原值（保存并还原）

### 4.3 快捷键监听
- `⌘K` (Mac) / `Ctrl+K` (Windows) 打开
- 仅在客户端监听（`useEffect` + `mounted` 状态）
- 阻止浏览器默认行为（`e.preventDefault()`）

### 4.4 透明叠加策略
- **浅色模式**: 使用 `--state-hover` = `rgba(0,0,0,0.04)`（透明黑）
- **深色模式**: 使用 `--state-hover` = `rgba(255,255,255,0.04)`（透明白）
- 自动通过 `data-theme` 属性切换，无需手动判断

### 4.5 Focus 管理
- 打开时自动 focus 输入框
- 关闭时 focus 回到触发按钮（使用 `ref` 保存）

### 4.6 键盘导航
- `↑/↓`: 切换高亮项（使用 `selectedIndex` state）
- `Enter`: 选择并关闭
- `Esc`: 关闭
- `Tab`: 基础 focus trap（允许在弹窗内循环）

## 5. 文件结构

```
components/
  SearchModal.tsx          # 新增：SearchModal 组件
  Header.tsx               # 修改：集成 SearchModal 和快捷键
app/
  globals.css              # 修改：添加 SearchModal 样式（基于 tokens）
```

## 6. 自测清单验证

待实现完成后逐项验证：
- [ ] 浅色/深色模式显示正常
- [ ] 透明叠加策略正确（light=透明黑 / dark=透明白）
- [ ] 点击搜索入口打开 Modal
- [ ] ⌘K / Ctrl+K 打开
- [ ] Esc 关闭
- [ ] 点击遮罩关闭
- [ ] 打开后自动 focus
- [ ] 关闭后 focus 回到触发按钮
- [ ] body 锁滚动正常
- [ ] ↑/↓ 导航正常
- [ ] Enter 跳转并关闭
- [ ] 无输入显示推荐
- [ ] 输入过滤正常
- [ ] 无结果显示空态
- [ ] 移动端显示正常
- [ ] SSR 无错误
- [ ] 所有样式来自 tokens（无硬编码）
