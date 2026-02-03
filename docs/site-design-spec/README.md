# 规范网站设计规范

本目录存放 **YDS 规范网站自身** 的设计规范说明，与 `content/docs/` 中的产品设计规范分离。

## 与产品设计规范的区别

| 目录 | 用途 |
|------|------|
| `content/docs/` | 产品设计规范（对外展示），面向 YAMI 产品的颜色、按钮、图标等指南 |
| `docs/site-design-spec/` | 规范网站设计规范（内部维护），面向 YDS 文档站点的排版、布局、组件样式等 |

## 所含文档

- [typography-styles.md](./typography-styles.md) — 文档内容类型与字体样式清单，用于修改 `app/globals.css` 与 `components/DocContent.tsx` 时对照

## 修改指引

- 调整文档页样式（标题、正文、引用块、表格等）→ 查阅 `typography-styles.md` 与 `app/globals.css`
- 调整 Markdown 渲染映射 → 修改 `components/DocContent.tsx`
