---
title: Token 命名规范
description: Design Token 的命名规则与约定
category: 资源
status: published
last_updated: 01/27/2026
sort_order: 62
---

# 📝 Token 命名规范

本文档定义 YAMI 设计系统中 Design Token 的命名规则，确保设计与开发之间的一致性和可维护性。

---

## 命名原则

### 1. 语义化优先

Token 名称应描述**用途**而非**值本身**。

| ✅ 推荐 | ❌ 避免 |
|---------|---------|
| `text/primary` | `black-87` |
| `ui/primary` | `red-600` |
| `space-200` | `16px` |

### 2. 层级结构

使用 `/` 或 `-` 分隔层级，从大类到细分：

```
{类别}/{子类别}/{状态或变体}
```

**示例**：
- `text/primary`
- `text/secondary`
- `text/disabled`
- `background/primary`
- `surface/primary`

### 3. 一致的缩写

| 全称 | 缩写 | 用途 |
|------|------|------|
| primary | primary | 主要 |
| secondary | secondary | 次要 |
| disabled | disabled | 禁用 |
| elevation | elevation- | 层级阴影 |
| radius | radius/ | 圆角 |
| space | space- | 间距 |

---

## 各类 Token 命名规则

### 颜色 Token

**格式**：`{类别}/{语义}`

| 类别 | 示例 |
|------|------|
| 品牌色 | `brand/primary`, `ui/primary` |
| 文字色 | `text/primary`, `text/secondary`, `text/disabled` |
| 边框色 | `border/primary`, `divider/normal` |
| 背景色 | `background/primary`, `surface/primary` |
| 填充色 | `fill/default`, `fill/hover` |
| 功能色 | `success/default`, `warning/default`, `error/default`, `info/default` |
| 调色板 | `{色相}/{色阶}` 如 `blue/50`, `blue/100`, `red/500` |

### 字体 Token

**格式**：`{层级} {尺寸}`

| Token | 用途 |
|-------|------|
| Display L / M / S | 展示型标题 |
| Heading L / M / S | 内容标题 |
| Body L / M | 正文 |
| Caption M / S | 辅助文字 |
| Link M / S | 链接文字 |

### 间距 Token

**格式**：`space-{倍数}`

倍数基于 4px 基准单位的相对值：

| Token | 计算方式 | 实际值 |
|-------|----------|--------|
| space-0 | 0 × 4px | 0px |
| space-025 | 0.5 × 4px | 2px |
| space-050 | 1 × 4px | 4px |
| space-100 | 2 × 4px | 8px |
| space-200 | 4 × 4px | 16px |

### 圆角 Token

**格式**：`radius/{语义}`

| Token | 用途 |
|-------|------|
| radius/none | 直角 |
| radius/small | 小元素 |
| radius/medium | 标准组件 |
| radius/large | 容器/卡片 |
| radius/full | 圆形/药丸 |

### 阴影 Token

**格式**：`elevation-{层级}`

| Token | Z 轴高度 |
|-------|----------|
| elevation-100 | 最低（卡片基础态） |
| elevation-200 | 低（悬停态） |
| elevation-300 | 中（Tooltip） |
| elevation-400 | 高（菜单） |
| elevation-500 | 最高（Modal） |

---

## 状态后缀

对于有状态变化的 Token，使用以下后缀：

| 后缀 | 含义 |
|------|------|
| `/default` 或无后缀 | 默认状态 |
| `/hover` | 悬停状态 |
| `/active` 或 `/pressed` | 激活/按下状态 |
| `/disabled` | 禁用状态 |
| `/focus` | 聚焦状态 |

**示例**：
- `button/primary/default`
- `button/primary/hover`
- `button/primary/disabled`

---

## 主题后缀

当需要区分亮/暗模式时：

| 后缀 | 含义 |
|------|------|
| `-light` | 亮色模式 |
| `-dark` | 暗色模式 |

> [!tip] 建议
> 优先使用语义化 Token（如 `text/primary`），由主题系统自动映射到对应模式的值，而非直接使用带主题后缀的 Token。

---

## 命名检查清单

- [ ] 名称描述用途而非具体值
- [ ] 使用统一的分隔符（`/` 或 `-`）
- [ ] 层级从通用到具体
- [ ] 状态后缀一致
- [ ] 避免使用数字描述颜色（如 `gray-500`），除非是调色板

---
