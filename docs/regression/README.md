# 回归测试文档汇总

本目录包含 UI 一致性修复的回归验证文档，用于手动测试、代码审查与自动化测试参考。

---

## 📋 文档清单

### 1. [search-modal-header-ui-consistency.md](./search-modal-header-ui-consistency.md)
**用途**：手测 SOP（标准操作流程）  
**适用人员**：QA、开发者、Reviewer  
**核心内容**：
- 键盘/鼠标/视觉/移动端逐步验证步骤
- DevTools 验证方法（focus-visible、hover/active token）
- 常见失败案例与排查
- 快速回归检查表（10 min 通关）

**推荐场景**：
- 每次 UI 一致性修复后执行完整测试
- 发现回归 bug 时定位根因

---

### 2. [PR_REVIEW_CHECKLIST.md](./PR_REVIEW_CHECKLIST.md)
**用途**：PR Review 快速勾选清单  
**适用人员**：Code Reviewer  
**核心内容**：
- 15 项关键检查点（可在 5-10 min 内完成）
- 按功能分组：键盘/鼠标/视觉/移动端/代码审查/DevTools
- Reviewer 签字区域（测试环境 + 结果）

**推荐场景**：
- PR approval 前最后验证
- CI/CD 流水线手动卡点

---

### 3. [TESTID_ENHANCEMENT.md](./TESTID_ENHANCEMENT.md)
**用途**：最小定位增强方案（可选实施）  
**适用人员**：开发者、自动化测试工程师  
**核心内容**：
- 4 个关键元素的 `data-testid` 补充建议
- 精确 diff（按文件分组，可直接复制粘贴）
- 影响评估与自动化测试示例

**推荐场景**：
- 引入 Playwright / Cypress 自动化测试前
- 多语言国际化项目（减少 aria-label 依赖）
- 代码重构前提升选择器稳定性

---

## 🎯 快速导航

| 场景 | 推荐文档 | 预计耗时 |
|------|----------|----------|
| **手测验证 UI 修复** | `search-modal-header-ui-consistency.md` | 30-60 min（完整测试） |
| **PR Review 快速验证** | `PR_REVIEW_CHECKLIST.md` | 5-10 min |
| **补充自动化测试定位** | `TESTID_ENHANCEMENT.md` | 10 min（代码修改） |
| **排查回归 bug** | `search-modal-header-ui-consistency.md` > 常见失败案例 | 视情况 |

---

## 🔄 文档关联关系

```
修复实施
   ↓
[search-modal-header-ui-consistency.md]
   ↓ (完整手测)
[PR_REVIEW_CHECKLIST.md]
   ↓ (Review 通过)
[可选] TESTID_ENHANCEMENT.md
   ↓ (引入自动化测试)
   ✅ 上线
```

---

## 📦 本次修复范围（2026-01-19）

- `components/Header.tsx`
- `components/SearchModal.tsx`
- `components/IconNav.tsx`
- `app/globals.css`

### 修复点清单
1. SearchModal：移除 `tabIndex=-1`，Tab 可自然聚焦
2. SearchModal：仅 backdrop 点击关闭；content stopPropagation
3. Header：主题按钮补 `aria-label`
4. Header：搜索按钮恢复 hover/active/focus-visible 交互态
5. SearchModal：补齐 focus-visible 样式
6. IconNav：active 字重对齐（`var(--fw-medium)`）

---

## 🧪 测试覆盖率

| 类别 | 手测 SOP | PR Checklist | 自动化测试（可选） |
|------|----------|--------------|-------------------|
| 键盘可访问性 | ✅ 5 项 | ✅ 5 项 | 🟡 建议补充 testid |
| 鼠标交互 | ✅ 4 项 | ✅ 4 项 | 🟡 建议补充 testid |
| 视觉一致性 | ✅ 3 项 | ✅ 4 项 | ⚪ 需人工确认 |
| 移动端适配 | ✅ 3 项 | ✅ 3 项 | 🟡 建议补充 testid |
| DevTools 验证 | ✅ 3 项 | ✅ 3 项 | ⚪ 手动确认 |

**图例**：✅ 已覆盖 | 🟡 部分覆盖 | ⚪ 暂未覆盖

---

## 📚 相关项目文档

- **修复说明**：`/docs/reports/REPORT_UI_FIX.md`
- **项目结构**：`/docs/PROJECT_STRUCTURE.md`
- **设计规范**：`/docs/specs/YAMI-UI-UX-设计规范.md`
- **Web Interface Guidelines**：https://github.com/vercel-labs/web-interface-guidelines

---

## 🔄 文档维护

### 更新频率
- **每次 UI 一致性修复后**：同步更新 SOP 与 Checklist
- **新增功能时**：评估是否需补充测试点
- **发现回归 bug 时**：补充失败案例与排查方法

### 维护者
- UI/UX QA Team
- Frontend Team

### 版本历史
- **v1.0** (2026-01-19)：初始版本，覆盖 SearchModal & Header 修复

---

## ❓ 常见问题

### Q1: 是否必须执行所有测试步骤？
**A**：
- **首次修复**：建议执行完整 SOP（`search-modal-header-ui-consistency.md`）
- **后续小改动**：可仅执行 PR Checklist（快速验证）
- **高风险修改**：务必执行完整 SOP + 移动端测试

### Q2: testid 补充是否必需？
**A**：非必需，当前通过 `aria-label` 已可完成手测。推荐在以下场景补充：
- 引入自动化测试（Playwright / Cypress）
- 多语言国际化项目
- 代码重构频繁的组件

### Q3: DevTools 验证步骤如何自动化？
**A**：部分可用 Playwright 的 `locator.evaluate()` 实现（如检查 `outline-width`），但视觉一致性（如颜色对比度）仍建议人工确认。

### Q4: 如何反馈文档问题？
**A**：在项目 issue 区提出，标签：`documentation` + `testing`。

---

## 📝 快速开始

1. **阅读修复说明**：`/docs/reports/REPORT_UI_FIX.md`（了解变更背景）
2. **执行手测 SOP**：`search-modal-header-ui-consistency.md`（30 min）
3. **填写 PR Checklist**：`PR_REVIEW_CHECKLIST.md`（5 min）
4. **（可选）补充 testid**：`TESTID_ENHANCEMENT.md`（10 min）

---

**文档目录更新时间**：2026-01-19  
**文档状态**：🟢 Active
