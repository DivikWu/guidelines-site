# ✅ PR 合并准备 - 最终交付清单

## 📦 产出文件清单（全部完成）

### 核心文档（docs/regression/）
1. ✅ `search-modal-header-ui-consistency.md` — 完整手测 SOP（~600 行）
2. ✅ `PR_REVIEW_CHECKLIST.md` — PR 快速勾选清单（~150 行）
3. ✅ `TESTID_ENHANCEMENT.md` — 可选 testid 方案（~250 行）
4. ✅ `README.md` — 目录汇总与导航（~180 行）

### PR 准备材料（docs/regression/）
5. ✅ `GITHUB_PR_FINAL.md` — **可直接复制到 GitHub 的 PR 描述**
6. ✅ `COMMIT_PLAN.md` — Conventional Commits 方案（2 个 commits）
7. ✅ `FINAL_DECISION.md` — testid 决策 + 4 个后续 issues

---

## 🎯 关键决策总结

### 1. testid 补充：**不包含在本 PR**
- **理由**：保持纯文档变更，零风险；testid 需等 Playwright 引入时机
- **后续**：Issue #2（P2 优先级）
- **实施指南**：已在 `TESTID_ENHANCEMENT.md` 完整提供

### 2. Commit 策略：**拆分为 2 个 commits**
- Commit 1: 核心测试文档（立即可用）
- Commit 2: 自动化增强指南（可选实施）
- **优势**：逻辑独立、便于回滚、符合 Conventional Commits

### 3. PR Review 流程：**快速通道（10 min）**
- P0 必测项：5 条（Tab 进入、Tab 顺序、Esc 关闭、Backdrop 点击、Hover 状态）
- P1 可选项：3 条（DOM 选择器、内链验证、DevTools 抽检）
- **Reviewer 耗时**：15-20 min（含阅读 + 执行）

---

## 📋 执行步骤（按顺序）

### Step 1: 复制 PR 内容到 GitHub
1. 打开 `docs/regression/GITHUB_PR_FINAL.md`
2. 复制 **PR Title** 到 GitHub PR title 栏：
   ```
   docs: add regression testing suite for SearchModal & Header UI consistency
   ```
3. 复制 **PR Description** 完整内容到 GitHub PR description
4. 确认预览渲染正确（所有链接可点击、表格对齐）

---

### Step 2: 创建 Commits
**推荐方案**（拆分 2 commits）：

```bash
# Commit 1: 核心测试文档
git add docs/regression/search-modal-header-ui-consistency.md \
        docs/regression/PR_REVIEW_CHECKLIST.md \
        docs/regression/README.md

git commit -m "docs(regression): add SearchModal & Header UI consistency testing suite

Add comprehensive regression testing artifacts for keyboard accessibility,
mouse interactions, visual consistency, and mobile responsiveness.

Artifacts:
- search-modal-header-ui-consistency.md: Full manual testing SOP (~600 lines)
  - Keyboard navigation (Tab/Shift+Tab/Esc/Enter)
  - Mouse interactions (backdrop click, hover/active states)
  - Visual checks (focus-visible, token alignment, font weights)
  - Mobile responsiveness (touch targets, false focus-visible prevention)
  - DevTools verification steps
  - Common failure cases & troubleshooting

- PR_REVIEW_CHECKLIST.md: Fast 5-10 min checklist for code reviewers
  - 15 critical checkpoints (P0/P1 prioritized)
  - Reviewer sign-off section
  - Common pitfall warnings

- README.md: Directory index and quick navigation
  - Coverage matrix (manual/PR/automation)
  - Document relationships
  - Quick start guide

Covers 6 UI fixes:
1. SearchModal Tab accessibility (removed tabIndex=-1)
2. SearchModal backdrop-only close logic
3. Header theme button aria-label
4. Header search button interaction states
5. SearchModal focus-visible styles
6. IconNav active font-weight alignment

Ref: ../reports/REPORT_UI_FIX.md"

# Commit 2: 自动化增强指南
git add docs/regression/TESTID_ENHANCEMENT.md

git commit -m "docs(regression): add optional testid enhancement plan for automation

Add guidance for supplementing 4 key elements with data-testid attributes
to improve test stability when introducing Playwright/Cypress automation.

Includes:
- Precise diffs for SearchModal.tsx (3 testids) and Header.tsx (1 testid)
- Impact assessment (pros/cons/decision criteria)
- Automation examples (Playwright selector comparison)
- Implementation steps & FAQs

Status: P1 optional (not required for this PR)
Deferred to follow-up issue for automation readiness."
```

**备选方案**（单 commit，如时间紧急）：
```bash
git add docs/regression/
git commit -m "docs(regression): add comprehensive UI consistency testing suite

Add 4 regression testing artifacts for SearchModal & Header UI fixes:
- Full manual SOP (search-modal-header-ui-consistency.md)
- PR review checklist (PR_REVIEW_CHECKLIST.md)
- Optional testid plan (TESTID_ENHANCEMENT.md)
- Directory README with coverage matrix

Covers keyboard accessibility, mouse interactions, visual consistency,
and mobile responsiveness across 6 UI improvements.

Ref: ../reports/REPORT_UI_FIX.md"
```

---

### Step 3: Reviewer 执行检查
**时间**：15-20 min

1. **阅读阶段**（5 min）
   - 打开 `docs/regression/README.md` — 理解结构
   - 浏览 `search-modal-header-ui-consistency.md` — 确认覆盖完整

2. **执行阶段**（10 min）
   - 打开 `docs/regression/PR_REVIEW_CHECKLIST.md`
   - 执行 **P0 必测项**（5 条）：
     - [ ] K1: Tab 进入 SearchModal 输入框
     - [ ] K2: Tab 顺序（输入框 → 清空 → 结果）
     - [ ] K4: Esc 关闭且焦点回退
     - [ ] M1: Backdrop 点击关闭
     - [ ] M3: Header 搜索按钮 hover 可见
   - 在 checklist 中签字（Reviewer + Date + Result）

3. **审批**
   - 若 P0 全通过：GitHub 批准 PR
   - 若有问题：在 PR 中评论具体失败项 + 截图

---

### Step 4: 合并 PR
**前置条件**：
- ✅ 至少 1 位 reviewer 完成 P0 检查并签字
- ✅ 所有内链验证通过（点击 GitHub 预览中的链接）
- ✅ 无 merge conflicts
- ✅ CI 检查通过（如 linting、build）

**操作**：
1. GitHub PR 页面点击 "Merge pull request"
2. 选择 merge 策略：
   - **推荐**：Squash and merge（如使用单 commit 方案）
   - **或**：Rebase and merge（如使用拆分 2 commits 方案）
3. 合并后删除 feature branch（如有）

---

## 🐛 创建后续 Issues（合并后立即执行）

### Issue 1: Introduce Playwright E2E tests for SearchModal [P1]
**模板**（复制到 GitHub Issues）：

```markdown
## Goal
Add Playwright E2E tests to automate regression checks for SearchModal keyboard accessibility and modal interactions.

## Scope
- Tab navigation (input → clear → results)
- Esc close & focus return
- Backdrop click-to-close
- Enter to select result

## Prerequisites
- [ ] Decide on testid adoption (see `docs/regression/TESTID_ENHANCEMENT.md`)
- [ ] Set up Playwright in project (`npm install -D @playwright/test`)
- [ ] Add `tests/e2e/` directory structure

## Implementation Guide
Reference `docs/regression/search-modal-header-ui-consistency.md` for:
- Test scenarios (K1-K5, M1-M2)
- Expected behaviors
- Failure criteria

## Acceptance Criteria
- [ ] All P0 checks from `PR_REVIEW_CHECKLIST.md` automated
- [ ] Tests pass on desktop (≥768px) and mobile (<768px) viewports
- [ ] CI/CD integration (GitHub Actions workflow)

## Out of Scope
- Visual regression testing (colors, font weights) — remain manual
- DevTools verification automation (require human judgment)

**Labels**: `testing`, `automation`, `p1`  
**Assignee**: Test Engineering Lead  
**Effort**: 2-3 days
```

---

### Issue 2: Apply data-testid to 4 key elements (optional) [P2]
**模板**：

```markdown
## Goal
Enhance test stability by adding `data-testid` attributes to 4 critical elements, enabling automation and i18n resilience.

## Scope
Per `docs/regression/TESTID_ENHANCEMENT.md`:
1. SearchModal backdrop: `data-testid="search-modal-backdrop"`
2. SearchModal input: `data-testid="search-modal-input"`
3. SearchModal clear button: `data-testid="search-modal-clear-button"`
4. Header search button: `data-testid="header-search-button"`

## Implementation
- Copy diffs from `docs/regression/TESTID_ENHANCEMENT.md` (L50-130)
- Add attributes to `SearchModal.tsx` (3 elements) and `Header.tsx` (1 element)
- Run `npm run dev` and verify attributes in DevTools

## Acceptance Criteria
- [ ] All 4 testids present in DOM (verified via Elements panel)
- [ ] No visual or functional regressions (execute 10-min quick check from SOP)
- [ ] Testid naming follows convention: `component-name-element-function`

## Decision Point
- Block until Playwright introduction confirmed (Issue #[from Step 1])
- If i18n localization happens first, prioritize this issue

## Out of Scope
- Adding testids to other components (TokenNav, IconNav, etc.)

**Labels**: `testing`, `enhancement`, `p2`  
**Assignee**: Frontend Developer  
**Effort**: 1-2 hours
```

---

### Issue 3: Establish docs maintenance workflow [P2]
**模板**：

```markdown
## Goal
Ensure `docs/regression/` stays in sync with UI changes by establishing a maintenance workflow.

## Proposed Workflow
1. **Trigger**: Any PR modifying SearchModal, Header, or IconNav
2. **Action**: Developer updates relevant sections in:
   - `search-modal-header-ui-consistency.md` (SOP)
   - `PR_REVIEW_CHECKLIST.md` (if new checks needed)
   - `README.md` (coverage matrix)
3. **Verification**: QA reviews doc changes alongside code review

## Implementation
- [ ] Add section to `.github/PULL_REQUEST_TEMPLATE.md`
- [ ] Document process in `docs/regression/README.md` (new "Maintenance" section)
- [ ] Create Slack reminder bot (optional): Ping QA on UI component changes

## Acceptance Criteria
- [ ] PR template updated with regression docs checklist
- [ ] At least 1 example PR completed with doc update
- [ ] Team trained on workflow (Slack announcement + wiki page)

**Labels**: `process`, `documentation`, `p2`  
**Assignee**: QA Lead  
**Effort**: 1 day
```

---

### Issue 4: Integrate PR checklist into CI/CD [P3]
**模板**（可选，低优先级）：

```markdown
## Goal
Require `PR_REVIEW_CHECKLIST.md` sign-off before merge, enforced via CI/CD.

## Implementation (GitHub Actions)
Add workflow that checks for "Reviewer: @username" + "Result: ✅ PASS" in checklist.

See: `docs/regression/FINAL_DECISION.md` for full workflow example.

## Acceptance Criteria
- [ ] CI check passes when checklist signed off
- [ ] CI check fails (blocks merge) when checklist incomplete
- [ ] No false positives on non-UI PRs

**Labels**: `ci-cd`, `automation`, `p3`  
**Assignee**: DevOps / Platform Team  
**Effort**: 2-4 hours
```

---

## 📊 最终状态检查

合并后确认以下状态：

### GitHub
- [ ] PR 已合并到 main 分支
- [ ] 4 个后续 issues 已创建并打上标签（P1/P2/P3）
- [ ] Issues 按优先级分配给对应负责人

### 文档
- [ ] `docs/regression/` 目录在 main 分支可访问
- [ ] 所有内链在 GitHub 预览中可点击
- [ ] README.md 在目录中可见（作为入口）

### 团队通知
- [ ] Slack 通知 QA 团队：回归文档已上线
- [ ] 团队会议宣布：UI 修复后续需更新回归文档

---

## 🎉 交付完成标志

当以下所有项完成时，本次 PR 合并准备工作结束：

1. ✅ PR 描述复制到 GitHub（包含完整 What/Why/Scope/Artifacts）
2. ✅ 2 个 commits 创建并 push（或 1 个 squash commit）
3. ✅ Reviewer 完成 P0 检查并签字
4. ✅ PR 合并到 main
5. ✅ 4 个后续 issues 创建（Playwright/testid/docs workflow/CI-CD）
6. ✅ 团队通知发出

---

## 📝 后续维护提醒

**每次修改 SearchModal/Header/IconNav 时**：
1. 更新 `docs/regression/search-modal-header-ui-consistency.md` 对应章节
2. 验证 `PR_REVIEW_CHECKLIST.md` 是否需新增检查项
3. 更新 `README.md` 覆盖矩阵（如新增测试点）
4. 在 PR 中注明"已同步回归文档"

**定期检查**（每季度）：
- 检查 SOP 中 DOM 选择器是否与代码一致
- 验证 DevTools 步骤是否适配最新浏览器版本
- 评估自动化测试覆盖率，决定是否补充手测项

---

**文档版本**：v1.0 (2026-01-19)  
**维护者**：UI/UX QA Team + Frontend Team  
**下次更新**：Playwright 引入后（预计 Sprint +1）
