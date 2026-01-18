# 文档与目录规则

## Structure Contract（硬规则）
1. 目录职责：`app/`=应用页面；`components/`=组件；`docs/`=文档；`tokens/`=设计 Token 源；`styles/`=样式产物；`scripts/`=脚本。
2. 根目录禁止：禁止新增业务文档与静态页面文件；根目录只允许 `README.md`/`CHANGELOG.md` 作为说明。
3. 新增文档必须归档：报告/审查产出进 `docs/reports/`，设计规范进 `docs/specs/`，回归测试进 `docs/regression/`。
4. 历史遗留内容：不再使用的静态页面与旧文档统一放 `docs/_legacy/`。
5. 链接要求：文档内链接使用相对路径并确保路径可追踪、可校验。
6. 违反规则的提交应在 PR 阶段修正，否则拒绝合并。

本文件用于说明项目目录用途与文档放置规则，尽量减少根目录杂物并保持长期可维护性。

## 目录用途
- `app/`：Next.js App Router 页面与布局。
- `components/`：可复用 UI 组件。
- `docs/`：项目文档与规范说明的统一入口。
- `tokens/`：设计 Token 源文件与 README。
- `styles/`：主题、Token 生成后的 CSS 样式。
- `scripts/`：构建与维护脚本（如 token 生成、路径修复）。

## 文档放置规则
- `docs/reports/`：报告/审查产出（如修复报告、审查记录）。
- `docs/specs/`：设计规范与规格说明（设计指南、交互规范）。
- `docs/regression/`：回归测试文档（SOP、PR Checklist、测试策略）。
- `docs/_legacy/`：历史遗留文档与非当前生产使用的静态文件。

## 维护建议
- 新文档优先放入 `docs/` 子目录，避免根目录新增散落文档。
- 如需对外引用文档，请使用稳定路径（例如 `docs/reports/...`）。

