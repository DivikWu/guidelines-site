# SearchModal 打开时 Header 高亮抑制 - 排查清单

## 1. Header 高亮元素排查

### 1.1 已识别的高亮元素

| 元素/区域 | 高亮类型 | CSS 类/选择器 | 样式特征 |
|----------|---------|--------------|---------|
| **操作按钮组** (`.header__actions button`) | Hover 态 | `.header__actions button:hover:not(:active)` | 背景：`var(--state-hover)` |
| **操作按钮组** | Pressed 态 | `.header__actions button:active` | 背景：`var(--state-pressed)` |
| **操作按钮组** | Focus 态 | `.header__actions button:focus-visible` | 描边：`2px solid var(--state-focus)` |
| **操作按钮图标** | Hover 态图标颜色 | `.header__actions button:hover .header__action-icon` | 颜色：`var(--icon-primary)`（从 secondary 提升） |
| **搜索输入框** | Focus 态 | `.header__search input:focus` | 边框：`rgba(0,0,0,0.12)`，背景：`var(--background-primary)` |
| **Header 整体** | 滚动阴影 | `.header--scrolled` | 目前为 `box-shadow: none`（无高亮，但可能有其他滚动态样式） |

### 1.2 高亮产生方式

- **Hover 态**：通过 `:hover` 伪类，鼠标悬停时触发
- **Active/Pressed 态**：通过 `:active` 伪类，点击时触发
- **Focus 态**：通过 `:focus-visible` 伪类，键盘导航时触发
- **Active class**：Header 内部没有使用 `.active` / `.selected` / `data-active` 等类名标记选中状态
- **Route active**：Header 不直接依赖路由状态，无路由相关的 active 标记

### 1.3 注意事项

- Header 本身不包含当前页面的 active 标记（这由 IconNav/TokenNav 负责）
- 高亮主要来自交互态（hover/focus/active），而非状态标记
- 搜索输入框的 focus 态也会产生视觉强调

## 2. SearchModal 全局标记检查

### 2.1 当前状态

- ❌ **不存在**：SearchModal 打开时没有在 `<html>` 或 `<body>` 上设置全局标记
- ✅ **需新增**：需要在 SearchModal 的 `useEffect` 中设置 `data-search-open="true"`

### 2.2 实现计划

- 打开时：`document.documentElement.dataset.searchOpen = 'true'`
- 关闭时：删除该 dataset 属性
- 与滚动锁定逻辑兼容（在同一 `useEffect` 中执行）

## 3. 实现方案

### 3.1 全局标记（步骤 2.1）

在 `components/SearchModal.tsx` 的 `useEffect` 中添加：

```typescript
if (open) {
  document.documentElement.dataset.searchOpen = 'true';
} else {
  delete document.documentElement.dataset.searchOpen;
}
```

### 3.2 Header 样式抑制（步骤 2.2）

在 `app/globals.css` 中添加 CSS 覆盖规则：

```css
/* SearchModal 打开时，抑制 Header 所有高亮态 */
html[data-search-open="true"] .header .header__actions button:hover:not(:active),
html[data-search-open="true"] .header .header__actions button:active,
html[data-search-open="true"] .header .header__actions button:focus-visible,
html[data-search-open="true"] .header .header__search input:focus {
  /* 抑制所有高亮样式 */
}
```

## 4. 验收标准

- [ ] SearchModal 打开时，Header 按钮 hover 不显示背景高亮
- [ ] SearchModal 打开时，Header 按钮 active 不显示背景高亮
- [ ] SearchModal 打开时，Header 按钮 focus-visible 不显示描边
- [ ] SearchModal 打开时，Header 搜索输入框 focus 不显示边框/背景变化
- [ ] SearchModal 打开时，鼠标移动到 Header 上不触发任何 hover 高亮
- [ ] SearchModal 关闭后，Header 恢复原有交互样式
- [ ] 不影响 SearchModal 自身交互和焦点管理
- [ ] 不改动 Header 的 active 判断逻辑（仅视觉抑制）
