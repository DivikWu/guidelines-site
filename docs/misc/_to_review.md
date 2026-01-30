# 待审文档与建议（仅标记，不删除）

本文档用于记录可能重复、过期或命名不一致的文档，供维护者人工审阅。**未获确认前请勿删除任何文件。**

## 可能重复/可合并

| 路径 | 说明 |
|------|------|
| `docs/DARK_MODE_AUDIT.md`、`DARK_MODE_CHANGES.md`、`DARK_MODE_FIX_REPORT.md` | 暗色模式相关多份报告，建议确认是否可合并或归档其一。 |
| `docs/SEARCH_MODAL_*.md`（AUDIT / HEADER_DIM / OVERLAY_FIX / IMPLEMENTATION 等） | 搜索弹窗相关多份审计与实现文档，建议确认是否保留全部或归档旧版。 |
| `docs/PERFORMANCE_*.md`、`OPTIMIZATION_SUMMARY_REPORT.md`、`docs/perf/perf-fix-plan.md` | 性能相关多份报告与计划，建议确认是否仍有参考价值或可归档。 |

## 可能过期（一次性任务）

| 路径 | 说明 |
|------|------|
| `docs/regression/COMMIT_PLAN.md`、`DELIVERY_CHECKLIST.md`、`FINAL_DECISION.md`、`GITHUB_PR_FINAL.md`、`PR_MATERIALS.md`、`PR_REVIEW_CHECKLIST.md` | 回归/PR 一次性材料，若对应 PR 已合并，可考虑移至 `docs/_legacy/` 或归档。 |

## 命名不一致（仅建议，未重命名）

- 顶层大量使用全大写+下划线（如 `DEPLOYMENT.md`、`PROJECT_STRUCTURE.md`），子目录有使用小写+连字符（如 `perf-fix-plan.md`）。建议新文档统一为小写+连字符；现有文件重命名会破坏链接，需人工评估后再动。

---

*生成自零风险整理任务；请人工确认后再执行归档或重命名。*
