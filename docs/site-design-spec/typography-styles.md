# 设计规范文档内容类型与字体样式清单

设计文档由 `components/DocContent.tsx` 通过 ReactMarkdown 渲染，每种 Markdown 元素映射到对应的 typography 类或 doc 专用类。

## 一、内容类型总览

| 内容类型 | Markdown 语法 | 渲染类名 | 说明 |
|----------|---------------|----------|------|
| 一级标题 | `#` | typo-h1 | 文档主标题 |
| 二级标题 | `##` | typo-h2 | 章节标题 |
| 三级标题 | `###` | typo-h3 | 小节标题 |
| 四级标题 | `####` | typo-h4 | 子小节标题 |
| 正文段落 | 普通段落 | typo-p | 正文 |
| 无序列表 | `-` 或 `*` | typo-ul / typo-li | 项目符号列表 |
| 有序列表 | `1.` | typo-ol / typo-li | 数字列表 |
| 引用块（普通） | `>` | doc-quote | 左侧竖线样式引用 |
| 应用块（Callout） | `> [!type] Title` | doc-callout | Obsidian 风格信息块，7 种子类型 |
| 表格 | GFM table | doc-table | 表头/表体/单元格 |
| 分割线 | `---` | doc-hr | 水平线 |
| 行内代码 | `` `code` `` | token-inline | 内联代码 |
| 代码块 | ` ``` ` | token-block | 独立代码块 |
| 链接 | `[text](url)` | 无专用类 | 内链用 Link，外链用 a |
| 文档状态 | 元数据 | doc-status | 文末状态徽章与更新时间 |

## 二、各内容类型详细字体样式

### 2.1 标题（typo-h1 / typo-h2 / typo-h3 / typo-h4）

| 属性 | typo-h1 | typo-h2 | typo-h3 | typo-h4 |
|------|---------|---------|---------|---------|
| font-size | 24px | 20px | 16px | 14px |
| line-height | 28px | 24px | 20px | 20px |
| font-weight | 500 (--fw-medium) | 500 | 500 | 500 |
| padding | 2px 0 | 2px 0 | 2px 0 | 2px 0 |
| margin | 32px 0 0 | 24px 0 0 | 16px 0 0 | 12px 0 0 |
| text-align | left | left | left | left |
| Token 映射 | — | — | — | — |

Token 来源（tokens.json / styles/tokens.css）：
- h1: yami-typography-display-medium (28px)，globals.css 采用 28px
- h2: yami-typography-heading-large (20px) 被覆盖为 24px
- h3: yami-typography-heading-medium (18px) 被覆盖为 16px
- h4: 14px，与正文字号一致、字重为 medium 以区分层级

### 2.2 正文段落（typo-p）

| 属性 | 值 |
|------|-----|
| font-size | 16px |
| line-height | 24px |
| padding | 2px 0 |
| margin | 0 |
| color | var(--color-text-primary) |
| text-align | left |

### 2.3 列表（typo-ul / typo-ol / typo-li）

**列表容器（typo-ul, typo-ol）**
- margin: 0 0 var(--spacing-200) 0
- padding-left: 16px (ul) / 20px (ol)
- margin-top: 8px; margin-bottom: 0
- text-align: left

**列表项（typo-li）**
- font-size: var(--fs-body) = 14px
- line-height: var(--lh-body) = 24px
- margin: 0 0 2px
- text-align: left

### 2.4 普通引用块（doc-quote）

| 属性 | 值 |
|------|-----|
| margin | var(--spacing-100) 0 0 0 (8px 顶部) |
| padding-left | 8px |
| border-left | 4px solid var(--border-subtle) |
| color | var(--foreground-secondary) |

**内部 typo-p 覆盖**：
- margin-top: 0
- margin-bottom: 0

### 2.5 应用块（doc-callout）

支持 7 种子类型：`info`、`note`、`tip`、`warning`、`danger`、`example`、`quote`（语法：`> [!type] Title`）

**容器（doc-callout）**
- margin: var(--spacing-100) 0
- padding: 8px var(--spacing-150)
- border-radius: var(--radius-md) = 8px
- background: var(--fill-secondary)
- min-height: 40px

**标题（doc-callout__title）**
- font-weight: 500 (--fw-medium)
- font-size: var(--fs-body) = 14px
- color: var(--foreground-primary)

**正文（doc-callout__body）**
- font-size: var(--fs-body) = 14px
- line-height: 20px
- color: var(--foreground-secondary)

**正文内 typo-p**
- line-height: 20px
- margin-bottom: var(--spacing-100) = 8px
- 最后一个子元素: margin-bottom: 0

### 2.6 表格（doc-table）

| 元素 | font-size | line-height | font-weight | 其他 |
|------|-----------|-------------|-------------|------|
| 表头单元格 | 14px | — | 400 | letter-spacing: 0.02em, text-transform: uppercase, color: foreground-secondary |
| 表体单元格 | var(--fs-body) | var(--lh-body) | 400 (首列) | padding: 8px 12px, color: foreground-primary |

### 2.7 分割线（doc-hr）

- height: 1px
- margin-top: var(--spacing-300) = 24px
- margin-bottom: 8px
- background: var(--divider-section)

### 2.8 行内代码（token-inline）

| 属性 | 值 |
|------|-----|
| font-family | 'Menlo', 'Monaco', monospace |
| font-size | 0.9em |
| padding | 2px 4px |
| min-height | 24px |
| border-radius | var(--radius-sm) = 4px |
| background | var(--code-bg) |
| color | var(--code-text) |
| border | 1px solid var(--code-border) |

### 2.9 代码块（token-block）

| 属性 | 值 |
|------|-----|
| font-family | 'Menlo', 'Monaco', monospace |
| padding | 8px 12px |
| background | var(--code-bg) |
| color | var(--code-text) |
| border | 1px solid var(--code-border) |
| border-radius | var(--radius-md) = 8px |
| display | block |
| overflow-x | auto |

### 2.10 文档状态（doc-status）

**容器**
- font-size: var(--fs-body)
- line-height: var(--lh-body)
- margin-top: var(--spacing-500)
- padding-top: var(--spacing-200)
- border-top: 1px solid var(--divider-section)

**状态/日期徽章（doc-status__value / doc-status__date）**
- font-size: 12px
- height: 32px
- padding: var(--spacing-050) var(--spacing-150)
- border-radius: 9999px

## 三、字体与颜色 Token 参考

**字体族**（theme.css / tokens.json）：
- 品牌/标题: `GT Walsheim`, -apple-system, BlinkMacSystemFont, SF Pro Display, Helvetica Neue, Arial
- 中文: `PingFang SC`, Microsoft YaHei, Noto Sans SC
- 代码: `Menlo`, `Monaco`, monospace

**字号与行高映射**（globals.css）：
- --fs-body = 14px (body-medium)
- --lh-body = 24px (body-large-line-height)
- --fw-medium = 500
- --fw-regular = 400

**颜色**（浅/深色随主题切换）：
- 主文字: --foreground-primary / --color-text-primary
- 次要文字: --foreground-secondary / --color-text-secondary
- 代码背景/文字/边框: --code-bg, --code-text, --code-border
