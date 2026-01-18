# PR Review Checklist - SearchModal & Header UI 一致性

## 使用说明
本清单用于 PR reviewer 快速验证 UI 一致性修复是否达标，所有项目应在本地测试完成后勾选。

---

## ✅ 键盘可访问性（Keyboard Accessibility）

- [ ] **Tab 进入 SearchModal**  
  打开 SearchModal 后按 Tab，焦点进入输入框（非跳过或陷入）

- [ ] **Tab 顺序完整**  
  焦点顺序为：输入框 → 清空按钮（若有内容）→ 首条结果 → 后续结果，无跳跃

- [ ] **Shift+Tab 反向导航**  
  焦点可正确反向移动，不会跳出 SearchModal

- [ ] **Esc 关闭 & 焦点回退**  
  按 Esc 关闭 SearchModal，焦点回到触发按钮（Header 搜索按钮）

- [ ] **Enter 选择结果**  
  焦点在搜索结果上按 Enter，正确跳转且 SearchModal 关闭

---

## 🖱️ 鼠标交互（Mouse Interaction）

- [ ] **Backdrop 点击关闭**  
  点击遮罩层（搜索卡片外半透明区域）关闭 SearchModal

- [ ] **内容区域点击不关闭**  
  点击搜索卡片内空白区域，SearchModal 保持打开

- [ ] **Header 搜索按钮 Hover 态**  
  鼠标悬停在搜索按钮上，背景变为 `var(--state-hover)`（非透明）

- [ ] **Header 搜索按钮 Active 态**  
  鼠标按下搜索按钮时，背景变为 `var(--state-pressed)`（更深色）

---

## 👁️ 视觉一致性（Visual Consistency）

- [ ] **SearchModal focus-visible 可见**  
  Tab 聚焦输入框、清空按钮、搜索结果时，出现明显焦点描边（`outline: 2px solid`）

- [ ] **Header 搜索按钮 focus-visible**  
  Tab 聚焦搜索按钮时，出现焦点描边且 `outline-offset` 为 2px

- [ ] **IconNav active 字重正确**  
  点击 IconNav 分类后，激活项文本字重为 `var(--fw-medium)`（通常 500-600）

- [ ] **交互态 token 命中**  
  DevTools 检查 hover/active/focus 状态，背景色/outline 值来自设计 token（非硬编码颜色）

---

## 📱 移动端适配（Mobile Responsiveness）

- [ ] **搜索按钮触控区域 ≥40px**  
  移动端视口（<768px）下，Header 搜索按钮宽高至少 40×40px

- [ ] **清空按钮可点击**  
  移动端输入内容后，清空按钮响应点击且焦点回到输入框

- [ ] **触控不误触焦点描边**  
  手指点击搜索结果时，不应出现键盘焦点描边（仅键盘触发 `:focus-visible`）

---

## 🔍 代码审查（Code Review）

- [ ] **移除 tabIndex={-1}**  
  `SearchModal.tsx` 中搜索结果按钮无 `tabIndex={-1}` 属性

- [ ] **Backdrop 点击事件正确**  
  `.search-modal__backdrop` 绑定 `onClick={handleBackdropClick}`  
  `.search-modal__content` 含 `onClick={(e) => e.stopPropagation()}`

- [ ] **Header 主题按钮 aria-label**  
  主题切换按钮含 `aria-label="切换主题模式"`（中文）

- [ ] **globals.css 交互态样式存在**  
  确认以下规则存在且 specificity 足够：
  ```css
  .header__search-icon-button:hover { background: var(--state-hover) !important; }
  .header__search-icon-button:active { background: var(--state-pressed) !important; }
  .header__search-icon-button:focus-visible { outline: 2px solid var(--state-focus); }
  .search-modal__button:focus-visible { outline: 2px solid var(--state-focus); }
  .icon-nav__item.active .icon-nav__label { font-weight: var(--fw-medium); }
  ```

---

## 🧪 DevTools 验证（DevTools Checks）

- [ ] **focus-visible 未被覆盖**  
  全局搜索 `outline: none`，确认无反模式（如 `*:focus { outline: none; }`）

- [ ] **hover token 解析正确**  
  Computed 面板中 `background-color` 值为 `rgba(0, 0, 0, 0.04)` 或类似（非 `transparent`）

- [ ] **Accessibility 树完整**  
  DevTools > Accessibility 面板中，所有按钮有 `Name` 属性（来自 `aria-label` 或文本）

---

## 📐 回归风险确认（Regression Risks）

- [ ] **Tab 顺序变化无破坏性影响**  
  搜索结果可被 Tab 访问，不会干扰页面其他焦点顺序

- [ ] **Backdrop 点击逻辑收敛无副作用**  
  点击内容区域不关闭，符合用户预期（与常见 modal 行为一致）

- [ ] **IconNav 字重变化视觉可接受**  
  Active 项字重加粗后，与 TokenNav / NavDrawer 一致，无视觉突兀

---

## 🚫 常见失败点（Common Pitfalls）

- [ ] **未在移动端测试**  
  确认已切换到移动视口（<768px）测试触控交互

- [ ] **未测试暗色模式**  
  切换到 `[data-theme='dark']`，确认焦点颜色对比度足够

- [ ] **未测试 Shift+Tab**  
  仅测试正向 Tab 易遗漏反向导航陷阱

- [ ] **未检查 Accessibility 树**  
  依赖视觉测试易遗漏 `aria-label` / `role` 缺失

---

## 📝 Reviewer 签字

**测试环境**：
- [ ] Chrome 131+ / macOS
- [ ] Chrome 131+ / Windows
- [ ] Safari 15.4+ / macOS
- [ ] Mobile Safari / iOS 15+

**Reviewer**：@______  
**测试日期**：2026-01-__  
**结果**：✅ PASS / ⚠️ PASS WITH COMMENTS / ❌ FAIL

**备注**（若有问题请详细描述）：
```
（此处填写发现的问题或改进建议）
```

---

## 🔗 相关文档

- 详细 SOP：`docs/regression/search-modal-header-ui-consistency.md`
- 修复说明：`docs/reports/REPORT_UI_FIX.md`
- Web Interface Guidelines：https://github.com/vercel-labs/web-interface-guidelines
