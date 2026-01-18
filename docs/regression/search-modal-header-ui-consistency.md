# SearchModal & Header UI 一致性回归验证 SOP

## Scope / 变更范围

本次修复聚焦 **键盘可访问性** 与 **交互态一致性**，涉及以下文件：
- `components/Header.tsx`
- `components/SearchModal.tsx`
- `components/IconNav.tsx`
- `app/globals.css`

### 修复点清单
1. SearchModal：移除 `tabIndex=-1`，Tab 可自然聚焦搜索结果
2. SearchModal：仅 backdrop 点击关闭；content 阻止冒泡
3. Header：主题按钮补 `aria-label`（读屏可达）
4. Header：搜索按钮恢复 hover/active/focus-visible 交互态
5. SearchModal：补齐 focus-visible 样式（输入框、清空按钮、结果按钮）
6. IconNav：active 字重对齐（`var(--fw-medium)`）

---

## Preconditions / 测试前置条件

1. **环境**：本地开发服务器 (`npm run dev`)
2. **浏览器**：Chrome/Edge/Safari 最新版本（含 DevTools）
3. **测试数据**：至少 5 条搜索结果可见（使用默认 mock 数据即可）
4. **屏幕尺寸**：桌面 (≥768px) 与移动端 (<768px) 各一套
5. **主题状态**：Light / Dark 各测一轮（部分步骤可合并）

---

## 🔹 Keyboard / 键盘导航

### K1. SearchModal 打开 & Tab 焦点进入

**操作步骤**
1. 点击 Header 右侧搜索图标（定位：`button[aria-label="搜索"]`）或中间输入框
2. 观察 SearchModal 是否打开（定位：`[role="dialog"][aria-modal="true"]`）
3. 按 **Tab** 键一次

**预期结果**
- 焦点进入搜索输入框（定位：`.search-modal__input`，类型 `input[type="text"]`）
- 输入框出现可见焦点指示（浏览器默认 outline 或自定义 `focus-visible` 样式）

**失败判定**
- 焦点未进入输入框，或跳到其他元素
- 输入框无可见焦点描边（DevTools `Computed > outline-width` 为 0）

---

### K2. Tab 顺序：输入框 → 清空按钮 → 首条结果

**操作步骤**
1. 在 K1 基础上，输入框已聚焦
2. 在输入框输入任意文字（如 "按钮"）
3. 按 **Tab** 键，观察焦点移动到清空按钮（定位：`.search-modal__clear-button`，可见当输入内容存在）
4. 再按 **Tab** 键，观察焦点移动到首条搜索结果按钮（定位：`.search-modal__button:first-of-type`）

**预期结果**
- 焦点依次为：输入框 → 清空按钮（若有内容）→ 首条结果 → 第二条结果 → ...
- 每个元素聚焦时可见焦点描边（`outline: 2px solid var(--state-focus)` 或类似）

**失败判定**
- 焦点跳过清空按钮或跳过结果列表
- 焦点陷入循环（无法跳出 SearchModal）

---

### K3. Shift+Tab 反向导航

**操作步骤**
1. 在 K2 基础上，焦点位于首条结果
2. 按 **Shift+Tab**，观察焦点是否回到清空按钮
3. 再按 **Shift+Tab**，观察是否回到输入框

**预期结果**
- 焦点反向移动顺序正确，无跳跃
- 不会聚焦到 backdrop 或其他不可交互元素

**失败判定**
- 焦点跳出 SearchModal
- 焦点回到不可见或不可交互元素

---

### K4. Esc 关闭 & 焦点回退

**操作步骤**
1. 打开 SearchModal（定位：点击 `button[aria-label="搜索"]`）
2. 按 **Esc** 键

**预期结果**
- SearchModal 立即关闭（DOM 移除或 `display: none`）
- 焦点回到打开按钮（Header 搜索按钮，定位：`button[aria-label="搜索"]`）

**失败判定**
- Esc 无反应
- 焦点丢失或回到 `<body>`

---

### K5. Enter 选择结果

**操作步骤**
1. 打开 SearchModal，输入 "按钮"
2. 按 **ArrowDown** 选中某条结果（观察 `.search-modal__button--selected` 类名）
3. 按 **Enter**

**预期结果**
- SearchModal 关闭
- 页面跳转到对应文档（根据 `href` 或回调逻辑）

**失败判定**
- Enter 无反应
- 跳转到错误页面

---

## 🔹 Mouse / 鼠标交互

### M1. 点击 backdrop 关闭

**操作步骤**
1. 打开 SearchModal
2. 点击遮罩层（定位：`.search-modal__backdrop`，即搜索卡片外的半透明区域）

**预期结果**
- SearchModal 关闭
- 焦点回到触发按钮

**失败判定**
- 点击无反应
- 点击内容区域也关闭（见 M2 失败判定）

**DevTools 验证**
- 在 `.search-modal__backdrop` 上设置断点：`onClick` 应调用 `onOpenChange(false)`
- 在 `.search-modal__content` 上确认 `onClick` 含 `e.stopPropagation()`

---

### M2. 点击内容区域不关闭

**操作步骤**
1. 打开 SearchModal
2. 点击搜索卡片内空白区域（定位：`.search-modal__content`，避免点击输入框或按钮）

**预期结果**
- SearchModal 保持打开状态

**失败判定**
- 点击内容区域关闭 SearchModal

**排查方式**
- 检查 `.search-modal__content` 是否含 `onClick={(e) => e.stopPropagation()}`
- 检查 `.search-modal__container` 是否意外绑定了关闭事件

---

### M3. Header 搜索按钮 hover/active/focus

**操作步骤**
1. 定位 Header 搜索按钮（`.header__search-icon-button`，可见文本 "搜索" 或图标）
2. **Hover**：鼠标悬停
3. **Active**：鼠标按下（不松开）
4. **Focus-visible**：Tab 聚焦（键盘导航）

**预期结果**
- **Hover**：背景变为 `var(--state-hover)`（半透明叠加，非纯透明）
- **Active**：背景变为 `var(--state-pressed)`（更深色叠加）
- **Focus-visible**：出现 `outline: 2px solid var(--state-focus)`，`outline-offset: 2px`

**失败判定**
- Hover 无反应（背景仍透明）
- Active 无反应
- Focus-visible 无 outline（检查是否被 `outline: none` 覆盖）

**DevTools 验证**
```css
/* Computed 中确认值（hover 状态） */
.header__search-icon-button:hover {
  background: rgba(0, 0, 0, 0.04); /* 或 var(--state-hover) 解析值 */
}
```

---

### M4. Header 主题按钮可读性（读屏）

**操作步骤**
1. 定位主题按钮（`.header__actions button[aria-label="切换主题模式"]`）
2. 使用读屏工具（macOS VoiceOver / Windows Narrator）或检查器

**预期结果**
- `aria-label` 值为 "切换主题模式"（中文）
- 读屏工具朗读 "切换主题模式，按钮"

**失败判定**
- 无 `aria-label`，读屏仅读 "按钮"
- `aria-label` 为空或英文（如 "Theme"）

**DevTools 验证**
- Elements > Accessibility 树中看到 "Name: 切换主题模式"

---

## 🔹 Visual / 视觉一致性

### V1. SearchModal focus-visible 样式可见

**操作步骤**
1. 打开 SearchModal
2. 用 **Tab** 依次聚焦：输入框、清空按钮、搜索结果按钮
3. 每次聚焦时观察焦点描边

**预期结果**
- 所有可聚焦元素有统一焦点样式：
  - `outline: 2px solid var(--state-focus)`
  - `outline-offset: 2px`
- 颜色为品牌主色（通常蓝色系）

**失败判定**
- 某些元素无焦点指示
- 焦点样式不一致（如有的是 border，有的是 outline）

**DevTools 验证**
```css
/* 在 Styles 中勾选 :focus-visible */
.search-modal__button:focus-visible {
  outline: 2px solid var(--state-focus);
  outline-offset: 2px;
}
```

---

### V2. Header 搜索按钮 token 命中

**操作步骤**
1. 定位 `.header__search-icon-button`
2. DevTools > Elements > Styles，勾选 `:hover` / `:active` / `:focus-visible`
3. 观察 `background` / `outline` 值

**预期结果**
- Hover：`background: var(--state-hover) !important`
- Active：`background: var(--state-pressed) !important`
- Focus-visible：`outline: 2px solid var(--state-focus)` + `outline-offset: 2px`

**失败判定**
- 值为 `transparent` 或被其他规则覆盖
- `!important` 未生效（检查 specificity）

**排查方式**
- 在 Computed 中搜索 `background-color`，看来源规则
- 确认 `app/globals.css` 中 `.header__actions .header__search-icon-button:hover` 规则存在

---

### V3. IconNav active 字重对齐

**操作步骤**
1. 桌面端（≥768px），打开页面
2. 点击左侧 IconNav 任意分类（如 "基础"）
3. 观察激活项文本字重

**预期结果**
- Active 项 `.icon-nav__label` 字重为 `var(--fw-medium)`（通常 500 或 600）
- 与 TokenNav / NavDrawer 激活项字重一致

**失败判定**
- Active 项字重仍为 `var(--fw-regular)`（400）
- 与其他导航组件不一致

**DevTools 验证**
```css
.icon-nav__item.active .icon-nav__label {
  font-weight: var(--fw-medium); /* 解析为 500 或 600 */
}
```

---

## 🔹 Mobile / 移动端适配

### MO1. 搜索按钮点击区域

**操作步骤**
1. 移动端视口（<768px，DevTools 切换到手机模拟）
2. 点击 Header 右侧搜索图标（`.header__search-icon-button`）

**预期结果**
- 按钮响应点击，打开 SearchModal
- 点击区域至少 40×40px（符合 WCAG 2.1 最小触控目标）

**失败判定**
- 点击无反应
- 点击区域过小（<40px），需频繁重试

**DevTools 验证**
- Computed > width/height 至少 40px
- `padding` 合理（建议至少 8px）

---

### MO2. SearchModal 清空按钮可点击

**操作步骤**
1. 移动端打开 SearchModal
2. 输入文字后，点击清空按钮（`.search-modal__clear-button`）

**预期结果**
- 输入内容清空
- 焦点回到输入框

**失败判定**
- 点击无反应
- 清空后焦点丢失

---

### MO3. 触控状态不误触 focus-visible

**操作步骤**
1. 移动端用手指点击搜索结果按钮
2. 观察是否出现键盘焦点描边

**预期结果**
- **不应出现** `focus-visible` 样式（触控不触发 `:focus-visible`）
- 仅点击/触控高亮（如背景变化）

**失败判定**
- 触控后出现焦点描边（说明误用了 `:focus` 而非 `:focus-visible`）

---

## 🔧 DevTools 验证步骤

### DT1. focus-visible 样式存在性检查

**步骤**
1. Elements > 选中 `.search-modal__button`
2. Styles 面板右侧勾选 `:focus-visible`
3. 检查是否有以下规则：
   ```css
   .search-modal__button:focus-visible {
     outline: 2px solid var(--state-focus);
     outline-offset: 2px;
   }
   ```
4. 确认 `outline-style` 非 `none`，`outline-width` > 0

**失败判定**
- 无 `:focus-visible` 规则
- 被更高优先级的 `outline: none` 覆盖（搜索 Styles 面板中是否有 crossed-out 规则）

---

### DT2. hover/active token 命中验证

**步骤**
1. 选中 `.header__search-icon-button`
2. 勾选 `:hov` > `:hover`
3. Computed 面板搜索 `background-color`，查看来源规则
4. 确认值为 `var(--state-hover)` 或其解析值（如 `rgba(0, 0, 0, 0.04)`）

**常见问题**
- 若来源为 `transparent`，检查 CSS 中是否有 `!important` 缺失
- 若被覆盖，检查 selector specificity（如 `html[data-search-open="true"]` 覆盖）

---

### DT3. outline 未被覆盖检查

**步骤**
1. 全局搜索 CSS（DevTools > Sources > `app/globals.css`）
2. 搜索 `outline: none`
3. 确认无以下反模式：
   ```css
   /* ❌ 错误：全局禁用 outline */
   *:focus { outline: none; }
   button:focus { outline: none; }
   ```

**正确实现**
```css
/* ✅ 正确：仅在 focus-visible 时显示 */
button:focus-visible {
  outline: 2px solid var(--state-focus);
  outline-offset: 2px;
}
```

---

## ⚠️ 常见失败案例与排查

### 案例 1：Tab 无法进入 SearchModal 结果列表

**症状**
- 按 Tab 从输入框直接跳到页面其他元素，跳过搜索结果

**排查**
1. 检查搜索结果按钮是否含 `tabIndex={-1}`（已移除）
2. 确认按钮为真实 `<button>` 元素（非 `<div onclick>`）
3. DevTools > Elements > Accessibility 树中确认 `focusable: true`

**解决方案**
- 移除 `tabIndex={-1}`（已完成）
- 若为 `<div>`，改为 `<button>` 或补 `tabIndex={0}` + `role="button"`

---

### 案例 2：点击内容区域意外关闭 SearchModal

**症状**
- 点击搜索卡片内（非 backdrop）也关闭弹窗

**排查**
1. 检查 `.search-modal__container` 是否绑定了 `onClick={handleBackdropClick}`
2. 确认 `.search-modal__content` 含 `onClick={(e) => e.stopPropagation()}`

**解决方案**
- 仅在 `.search-modal__backdrop` 绑定关闭事件
- 在 `.search-modal__content` 阻止冒泡

---

### 案例 3：focus-visible 不可见

**症状**
- Tab 聚焦时无任何视觉反馈

**排查**
1. DevTools > Computed > outline-width 为 0
2. Styles 中搜索 `outline: none`，看是否被全局 reset 覆盖
3. 确认 `:focus-visible` 规则存在且 specificity 足够

**解决方案**
```css
/* 确保 focus-visible 规则优先级高于 reset */
.search-modal__button:focus-visible {
  outline: 2px solid var(--state-focus) !important;
  outline-offset: 2px;
}
```

---

### 案例 4：移动端触控误触发焦点描边

**症状**
- 手指点击后出现蓝色焦点圈

**排查**
- 检查是否误用 `:focus` 而非 `:focus-visible`
- 确认浏览器支持 `:focus-visible`（Chrome 86+, Safari 15.4+）

**解决方案**
- 将 `:focus` 改为 `:focus-visible`
- 对不支持的浏览器可用 polyfill（如 `focus-visible.js`）

---

## 📋 快速回归检查表（10 min 通关）

适用于每次代码变更后快速验证，按优先级排序：

**P0 - 键盘可达性（必查）**
- [ ] K1: Tab 进入 SearchModal 输入框
- [ ] K2: Tab 顺序正确（输入框 → 清空 → 结果）
- [ ] K4: Esc 关闭 & 焦点回退

**P1 - 鼠标交互（必查）**
- [ ] M1: 点击 backdrop 关闭
- [ ] M2: 点击内容区域不关闭
- [ ] M3: Header 搜索按钮 hover/active 可见

**P2 - 视觉一致性（重点查）**
- [ ] V1: SearchModal focus-visible 可见
- [ ] V2: Header 搜索按钮 token 命中
- [ ] V3: IconNav active 字重对齐

**P3 - 移动端（条件查）**
- [ ] MO1: 搜索按钮点击区域 ≥40px
- [ ] MO3: 触控不误触 focus-visible

---

## 🔗 相关文档

- [Web Interface Guidelines - Focus States](https://github.com/vercel-labs/web-interface-guidelines)
- [WCAG 2.1 - Focus Visible (2.4.7)](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html)
- [WCAG 2.1 - Target Size (2.5.5)](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
- 项目内部：`docs/reports/REPORT_UI_FIX.md`（本次修复详细说明）

---

## 📝 测试记录模板

```markdown
### 测试日期：2026-01-XX
**测试人员**：XXX
**环境**：Chrome 131 / macOS Sonoma 15.2
**分支/Commit**：main / abc123

| 检查项 | 结果 | 备注 |
|--------|------|------|
| K1 Tab 进入输入框 | ✅ PASS | - |
| K2 Tab 顺序 | ✅ PASS | - |
| K4 Esc 关闭 | ✅ PASS | 焦点正确回退 |
| M1 Backdrop 关闭 | ✅ PASS | - |
| M3 Header 按钮 hover | ✅ PASS | 背景色正确 |
| V1 focus-visible | ⚠️ WARN | 清空按钮 outline 颜色偏浅 |
| V3 IconNav 字重 | ✅ PASS | - |
| MO1 触控区域 | ✅ PASS | 40×40px |

**发现问题**：
1. 清空按钮 focus-visible 颜色在暗色模式下对比度不足（需调整 `--state-focus` token）

**后续行动**：
- [ ] 提 issue 跟进暗色模式焦点颜色优化
```

---

## 定位增强建议（可选）

当前实现已基本可通过语义定位（`role`/`aria-label`），但以下元素建议补充 `data-testid` 以提升稳定性：

### 推荐补充（优先级从高到低）

1. **SearchModal backdrop**
   - 文件：`components/SearchModal.tsx`
   - 位置：`.search-modal__backdrop`
   - 建议：`data-testid="search-modal-backdrop"`
   - 原因：当前仅通过 className 定位，易受样式重构影响

2. **SearchModal 输入框**
   - 文件：`components/SearchModal.tsx`
   - 位置：`.search-modal__input`
   - 建议：`data-testid="search-modal-input"`
   - 原因：若未来改为 `contenteditable` 或其他输入方式，保持定位稳定

3. **SearchModal 清空按钮**
   - 文件：`components/SearchModal.tsx`
   - 位置：`.search-modal__clear-button`
   - 建议：`data-testid="search-modal-clear-button"`
   - 原因：已有 `aria-label="清空搜索内容"`，但补充 testid 便于自动化测试

4. **Header 搜索按钮**
   - 文件：`components/Header.tsx`
   - 位置：`.header__search-icon-button`
   - 建议：`data-testid="header-search-button"`
   - 原因：当前通过 `aria-label="搜索"` 可定位，但若多语言切换会影响选择器

**实施原则**：
- 仅在"稳定定位不足"时补充 `data-testid`
- 优先使用语义属性（`role`/`aria-label`）
- 不在此次回归中强制要求，可作为未来优化项

---

**文档维护**：  
- 初始版本：2026-01-19
- 维护者：UI/UX QA Team
- 更新频率：每次 UI 一致性修复后同步
