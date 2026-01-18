# Commit Plan (Conventional Commits)

## 推荐方案：拆分为 2 个 commits

### Commit 1: Core Testing Documentation
```bash
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

Ref: docs/reports/REPORT_UI_FIX.md
"
```

---

### Commit 2: Future Automation Enhancement Guide
```bash
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
Deferred to follow-up issue for automation readiness.
"
```

---

## 备选方案：单 commit（如时间紧急）

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

Ref: docs/reports/REPORT_UI_FIX.md
"
```

---

## 为什么推荐拆分 2 个 commits

1. **逻辑独立性**：
   - Commit 1: 立即可用的手测文档（核心价值）
   - Commit 2: 未来自动化准备（可选实施）

2. **回滚粒度**：
   - 若决定不引入自动化测试，可单独 revert commit 2

3. **Code Review 效率**：
   - Reviewer 可先批准 commit 1（核心文档）
   - Commit 2 单独讨论（testid 策略决策）

4. **符合 Conventional Commits 规范**：
   - 每个 commit 有明确单一职责
   - 便于生成 CHANGELOG

---

## Commit Message 规范说明

**格式**：`<type>(scope): <subject>`

- **type**: `docs` — 纯文档变更
- **scope**: `regression` — 明确指向 `docs/regression/` 目录
- **subject**: 简短总结（≤50 字符）
- **body**: 详细说明（列表形式，说明包含的文件与覆盖范围）
- **footer**: 可选引用（如 `Ref: docs/reports/REPORT_UI_FIX.md`）

---

## 实施步骤

### 方案 1：拆分 2 commits（推荐）
```bash
# Commit 1: 核心测试文档
git add docs/regression/search-modal-header-ui-consistency.md \
        docs/regression/PR_REVIEW_CHECKLIST.md \
        docs/regression/README.md
git commit -F commit1.txt  # 复制上方 commit message 到 commit1.txt

# Commit 2: 自动化增强指南
git add docs/regression/TESTID_ENHANCEMENT.md
git commit -F commit2.txt  # 复制上方 commit message 到 commit2.txt
```

### 方案 2：单 commit（备选）
```bash
git add docs/regression/
git commit -F commit.txt  # 复制备选方案 commit message
```

---

## 后续 Issue 关联

提交后，在 GitHub 创建 issues 并在 commit message 中关联：

```bash
# 若已创建 issue #123（Playwright 引入）
git commit --amend
# 在 footer 添加：Closes #123（或 Ref #123）
```

---

## Commit 历史预览（拆分方案）

```
* abc1234 docs(regression): add optional testid enhancement plan for automation
* def5678 docs(regression): add SearchModal & Header UI consistency testing suite
* xyz9012 fix(a11y): improve SearchModal & Header keyboard accessibility
```

**优势**：清晰区分代码修复（fix）与测试文档（docs），符合团队协作最佳实践。
