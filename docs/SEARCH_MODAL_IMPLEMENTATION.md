# SearchModal 全屏搜索弹窗实现总结

## 实现概览

已成功实现全屏搜索弹窗（Search Modal / Command Palette）功能，严格遵循项目设计规范（tokens / 语义色 / 圆角 / 阴影 / 间距 / 字体层级等）。

## 交付清单

### ✅ 已完成功能

#### 1. SearchModal 组件 (`components/SearchModal.tsx`)
- ✅ 使用 `React.createPortal` 挂载到 `document.body`
- ✅ 全屏遮罩层 + 居中搜索卡片
- ✅ 支持快捷键：⌘K（Mac）/ Ctrl+K（Windows）打开，Esc 关闭
- ✅ 打开后自动聚焦输入框；关闭后焦点回到触发按钮
- ✅ 支持键盘操作：↑/↓ 切换高亮项，Enter 跳转并关闭
- ✅ 背景锁滚动（打开时 body 不可滚动）
- ✅ 点击遮罩空白可关闭
- ✅ Mock 数据实现：无输入显示"推荐/常用"（前 8 项），有输入实时过滤 title/description
- ✅ 兼容 Next.js/SSR：所有 window/document 访问仅在客户端执行

#### 2. Header 集成 (`components/Header.tsx`)
- ✅ 点击搜索框/搜索 icon => 打开 SearchModal
- ✅ 快捷键监听（⌘K/Ctrl+K）仅在客户端生效
- ✅ SearchModal 状态管理（open/onOpenChange）
- ✅ 将 `docs` 转换为 `SearchItem[]` 传递给 SearchModal
- ✅ 选择结果后调用 `onSearchSelect` 回调

#### 3. 样式实现 (`app/globals.css`)
- ✅ 所有样式基于 tokens（遮罩色使用 `--yami-color-overlay-light/dark`）
- ✅ 透明叠加策略：浅色模式使用 `rgba(0,0,0,0.04)`，深色模式使用 `rgba(255,255,255,0.04)`
- ✅ 完整的状态样式：Default / Hover / Focus / Active(Pressed) / Selected
- ✅ Focus ring 使用 `--state-focus` token
- ✅ 移动端适配（隐藏快捷键提示，调整 padding）

## 规范映射表（已实现）

| 用途 | Token/CSS 变量 | 状态 |
|------|---------------|------|
| 遮罩背景 | `--yami-color-overlay-light/dark` | ✅ |
| 卡片背景 | `--background-secondary` / `--yami-color-surface-*` | ✅ |
| 卡片边框 | `--border-subtle` / `--yami-color-border-subtle-*` | ✅ |
| 主要文本 | `--foreground-primary` / `--yami-color-text-primary-*` | ✅ |
| 次要文本 | `--foreground-secondary` / `--yami-color-text-secondary-*` | ✅ |
| Focus Ring | `--state-focus` / `--yami-color-state-focus-*` | ✅ |
| Hover 叠加 | `--state-hover` / `--yami-color-state-hover-*` | ✅ |
| Selected 叠加 | `--state-selected` / `--yami-color-state-selected-*` | ✅ |
| Pressed 叠加 | `--state-pressed` / `--yami-color-state-pressed-*` | ✅ |
| 卡片圆角 | `--radius-card` / `--yami-border-radius-medium` (8px) | ✅ |
| 卡片阴影 | `--yami-shadow-e4` | ✅ |
| 间距 | `--spacing-*` / `--space-*` | ✅ |
| Modal Z-Index | `--yami-z-index-modal` (1050) | ✅ |
| Backdrop Z-Index | `--yami-z-index-modal-backdrop` (1040) | ✅ |

## 关键实现点

### 1. Portal 挂载
- 使用 `React.createPortal(children, document.body)` 挂载 Modal
- 仅在客户端挂载（`mounted` state + `useEffect`）

### 2. 锁滚动
- 打开时：保存 `document.body.style.overflow`，设置 `overflow: 'hidden'`
- 关闭时：恢复原值
- 清理时确保恢复滚动状态

### 3. 快捷键监听
- 仅在客户端监听（`mounted` 检查）
- Mac: `e.metaKey && e.key === 'k'`
- Windows: `e.ctrlKey && e.key === 'k'`
- 阻止默认行为（`e.preventDefault()`）

### 4. 透明叠加策略
- 浅色模式：`--state-hover` = `rgba(0,0,0,0.04)`（透明黑）
- 深色模式：`--state-hover` = `rgba(255,255,255,0.04)`（透明白）
- 自动通过 `data-theme` 属性切换，无需手动判断

### 5. Focus 管理
- 打开时自动 focus 输入框（延迟确保 Portal 已渲染）
- 关闭时 focus 回到触发按钮（使用 `triggerRef`）

### 6. 键盘导航
- `↑/↓`: 切换 `selectedIndex`，自动滚动到选中项
- `Enter`: 选择并关闭
- `Esc`: 关闭
- `Tab`: 允许在弹窗内循环（不阻止默认行为）

## 文件结构

```
components/
  SearchModal.tsx          # 新增：SearchModal 组件
  Header.tsx               # 修改：集成 SearchModal 和快捷键
app/
  globals.css              # 修改：添加 SearchModal 样式（基于 tokens）
docs/
  SEARCH_MODAL_AUDIT.md    # 新增：审计清单与规范映射表
  SEARCH_MODAL_IMPLEMENTATION.md  # 新增：实现总结（本文档）
```

## 自测清单

待实际运行后验证：
- [ ] 浅色/深色模式显示正常
- [ ] hover/selected/pressed 使用透明叠加策略（light=透明黑 / dark=透明白）
- [ ] 点击 Header 搜索入口可打开 Modal
- [ ] ⌘K / Ctrl+K 可打开（不触发浏览器默认行为）
- [ ] Esc 关闭；点击遮罩空白关闭
- [ ] 打开后输入框自动 focus；关闭后 focus 回到触发按钮
- [ ] 打开时 body 不可滚动；关闭后恢复滚动
- [ ] ↑/↓ 可切换高亮；Enter 可跳转并关闭
- [ ] 无输入显示推荐；输入过滤正确；无结果显示空态
- [ ] 移动端显示不溢出，结果区可滚动
- [ ] SSR 不报错（无 window/document 访问错误）
- [ ] 全部样式来自 tokens（遮罩色也来自 overlay token），没有散落硬编码颜色

## 注意事项

1. **Mock 数据**: SearchModal 内置了 `DEFAULT_MOCK_ITEMS`，但 Header 会传递从 `docs` 转换而来的 `searchItems`，优先使用传入的数据。

2. **搜索逻辑**: 
   - 无输入时：显示推荐项（前 8 个）
   - 有输入时：实时过滤 `title` 和 `description`（大小写不敏感）

3. **类型分类**: 根据 `page.id` 判断类型：
   - `component`: button, tabs, badge, heading, filter, navbar, product-card, forms
   - `resource`: changelog, update-process
   - `page`: 其他

4. **样式一致性**: 所有样式变量都通过 tokens 引用，确保与设计规范一致，支持深色模式自动切换。
