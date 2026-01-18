# SearchModal 打开时 Header 高亮抑制 - 实现总结

## 实现概览

已成功实现 SearchModal 打开时抑制 Header 所有高亮态，使 Header 作为被遮罩压暗的背景层存在，不抢占搜索弹窗的视觉焦点。

## 排查清单结论

### Header 中的高亮元素

1. **操作按钮组** (`.header__actions button`)
   - Hover 态：背景 `var(--state-hover)`
   - Active/Pressed 态：背景 `var(--state-pressed)`
   - Focus-visible 态：描边 `2px solid var(--state-focus)`
   - Hover 时图标颜色提升：从 `icon-secondary` 变为 `icon-primary`

2. **搜索输入框** (`.header__search input`)
   - Focus 态：边框 `rgba(0,0,0,0.12)`，背景 `var(--background-primary)`

### 高亮产生方式

- 通过 CSS 伪类（`:hover`, `:active`, `:focus-visible`）产生
- 不依赖 class/attribute 标记（如 `.active`, `data-active`）
- 纯视觉交互反馈，无状态逻辑

### 全局标记状态

- ✅ **已新增**：SearchModal 打开时在 `<html>` 上设置 `data-search-open="true"`
- ✅ **已清理**：关闭时自动移除该 dataset

## 实现方案

### 1. 全局标记（`components/SearchModal.tsx`）

在 SearchModal 的 `useEffect` 中添加了全局标记管理：

```typescript
if (open) {
  document.documentElement.dataset.searchOpen = 'true';
  // ... 其他逻辑
} else {
  delete document.documentElement.dataset.searchOpen;
  // ... 其他逻辑
}
```

**特点：**
- 与滚动锁定逻辑在同一 `useEffect` 中，确保同步
- 清理函数中也会移除标记，确保异常情况下也能恢复
- 仅在客户端执行（已有 `mounted` 检查）

### 2. Header 样式抑制（`app/globals.css`）

新增 CSS 覆盖规则，使用 `html[data-search-open="true"]` 选择器抑制所有高亮：

```css
/* 抑制操作按钮 hover 态 */
html[data-search-open="true"] .header .header__actions button:hover:not(:active) {
  background: transparent !important;
}

/* 抑制操作按钮 active/pressed 态 */
html[data-search-open="true"] .header .header__actions button:active {
  background: transparent !important;
}

/* 抑制操作按钮 focus-visible 态 */
html[data-search-open="true"] .header .header__actions button:focus-visible {
  outline: none !important;
}

/* 抑制操作按钮 hover 时图标颜色变化 */
html[data-search-open="true"] .header .header__actions button:hover .header__action-icon {
  color: var(--icon-secondary, ...) !important;
}

/* 抑制搜索输入框 focus 态 */
html[data-search-open="true"] .header .header__search input:focus {
  background: var(--state-hover) !important;
  border-color: transparent !important;
  box-shadow: none !important;
}
```

**特点：**
- 使用 `!important` 确保覆盖原有样式
- 选择器精确到 Header 区域，不影响其他组件
- 支持深色模式（已有 `[data-theme='dark']` 覆盖）

## 文件改动

1. **`components/SearchModal.tsx`**
   - 添加全局标记设置/清理逻辑（`data-search-open`）

2. **`app/globals.css`**
   - 新增 5 条 CSS 覆盖规则，抑制 Header 所有高亮态

3. **`docs/SEARCH_MODAL_HEADER_DIM_AUDIT.md`**
   - 排查清单文档

4. **`docs/SEARCH_MODAL_HEADER_DIM_IMPLEMENTATION.md`**
   - 实现总结文档（本文档）

## 验收标准（自测清单）

待实际运行后验证：

- [ ] SearchModal 打开时，Header 操作按钮 hover 不显示背景高亮
- [ ] SearchModal 打开时，Header 操作按钮 active 不显示背景高亮
- [ ] SearchModal 打开时，Header 操作按钮 focus-visible 不显示描边
- [ ] SearchModal 打开时，Header 搜索输入框 focus 不显示边框/背景变化
- [ ] SearchModal 打开时，鼠标移动到 Header 上不触发任何 hover 高亮
- [ ] SearchModal 打开时，Tab 不会把焦点带到 Header（焦点停留在弹窗内）
- [ ] SearchModal 关闭后，Header 恢复原有交互样式（hover/focus/active 正常）
- [ ] 不影响 SearchModal 自身交互（键盘导航、焦点管理、滚动锁定）
- [ ] 改动仅限视觉抑制，不影响路由/状态逻辑

## 实现要点

1. **最小侵入**：只添加 CSS 覆盖，不修改 Header 组件逻辑
2. **精确范围**：选择器只作用于 Header，不影响其他区域
3. **完整覆盖**：覆盖所有交互态（hover/active/focus），确保无遗漏
4. **自动恢复**：关闭 Modal 时自动移除标记，Header 恢复原样
5. **兼容性**：与现有滚动锁定逻辑兼容，不产生副作用

## 注意事项

- 使用 `!important` 是为了确保覆盖优先级，因为原有样式也有 `!important`
- 搜索输入框的 focus 态背景保持为 `var(--state-hover)`，因为搜索框本身应该可见（只是不强调边框）
- 焦点管理：SearchModal 打开时焦点锁定在弹窗内，Header 按钮理论上不可被 tab 到（通过 focus trap 实现）
