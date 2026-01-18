# UI 一致性修复修改报告

## 范围
- `components/Header.tsx`
- `components/SearchModal.tsx`
- `components/IconNav.tsx`（样式位于 `app/globals.css`）
- `app/globals.css`

## 目标达成情况
- A 可访问性必修：已完成 1-3
- B 一致性修复：已完成 4-6

## 修改明细（按文件）

### `components/SearchModal.tsx`
- 移除搜索结果按钮的 `tabIndex={-1}`，让 Tab 可自然聚焦。
- 仅在 backdrop 绑定点击关闭，container 不再绑定关闭事件；content 保持 `stopPropagation`。

### `components/Header.tsx`
- 主题切换按钮补齐 `aria-label`，保留原 `title`。

### `app/globals.css`
- Header 搜索图标按钮恢复标准 `hover/active/focus-visible` 交互态。
- 为 `.search-modal__button` 和 `.search-modal__clear-button` 增加 `:focus-visible` 样式。
- IconNav active 状态补齐字重（`.icon-nav__label` 使用 `var(--fw-medium)`）。

## 变更原因与回归风险

### 1) SearchModal Tab 可达性
- 原因：满足键盘可访问性要求，允许 Tab 访问每条搜索结果。
- 风险：Tab 顺序变化，可能影响既有使用习惯。

### 2) SearchModal 点击遮罩关闭逻辑收敛
- 原因：避免 container/backdrop 双重绑定导致冒泡风险，符合一致交互预期。
- 风险：点击 container 空白区域不再关闭，仅 backdrop 关闭。

### 3) Header 主题按钮 aria-label
- 原因：图标按钮必须具备可访问性标签，避免仅依赖 title。
- 风险：无视觉变化，影响仅限可访问性树。

### 4) Header 搜索按钮交互态恢复
- 原因：与全局按钮交互态一致（`--state-hover/pressed/focus`）。
- 风险：视觉反馈回归标准，若此前设计预期“无反馈”，需确认。

### 5) SearchModal focus-visible 补齐
- 原因：键盘导航时提供可见焦点指示，与导航组件一致。
- 风险：新增焦点描边，可能轻微影响视觉克制度。

### 6) IconNav active 字重对齐
- 原因：与 TokenNav / NavDrawer active 字重保持一致。
- 风险：active 项文字视觉稍重。

## 回归检查清单
- 键盘：Tab/Shift+Tab 是否能聚焦搜索输入、清空按钮、每条结果。
- 键盘：Esc 是否可关闭 SearchModal，焦点是否回到触发按钮。
- 鼠标：点击遮罩是否关闭；点击内容区域不关闭。
- 视觉：Header 搜索按钮 hover/active/focus-visible 是否与主题按钮一致。
- 视觉：SearchModal 内按钮 focus-visible 是否可见。
- 移动端：搜索按钮、清空按钮点击区域是否可用。

