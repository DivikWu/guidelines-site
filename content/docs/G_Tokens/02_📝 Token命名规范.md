---
title: Token 命名规范
title_en: Token Naming
description: Design Token 的命名规则与最佳实践
category: Tokens
status: Draft
last_updated: 2026-02-05
---

# 📝 Token 命名规范

本文档定义 YAMI 设计系统中 Design Token 的命名规则,基于 Figma 官方推荐的最佳实践。

---

## Figma 命名最佳实践

### 1. 易于理解

使用语言中立的名称,便于跨团队和跨国家协作。

| 推荐 | 避免 |
|---------|---------|
| `surface/primary` | `背景/主要` |
| `text/secondary` | `文本/次要` |



### 2. 使用完整单词

避免缩写,减少歧义。

| 推荐 | 避免 |
|---------|---------|
| `background` | `bg` |
| `secondary` | `sec` |
| `disabled` | `dis` |



### 3. 一致的前缀

相同类别的 Token 使用相同的前缀。

| 推荐 | 避免 |
|---------|---------|
| `background-primary` | `primary-background` |
| `background-secondary` | `secondary-bg` |



### 4. 单复数一致

根据上下文选择单数或复数,保持一致。

| 推荐 | 避免 |
|---------|---------|
| `color/pink-400` | `colors/pink-400` |
| `space-200` | `spaces-200` |



### 5. 避免品牌名

使用通用名称,便于跨产品复用。

| 推荐 | 避免 |
|---------|---------|
| `surface/brand-contrast` | `surface/yami-red` |
| `text/primary` | `text/yami-black` |



### 6. 面向未来

考虑系统扩展,避免限制性命名。

| 推荐 | 避免 |
|---------|---------|
| `space-200` | `space-16px` |
| `radius-medium` | `radius-8px` |



## Token 命名格式

### Primitive Tokens (原始层)

**格式**: `{类别}/{色相}-{色阶}` 或 `{类别}-{倍数}`

**示例**:
- `pink-400` - 粉色 400 级
- `neutral-900` - 中性色 900 级
- `space-200` - 间距 200(16px)
- `radius-medium` - 中等圆角



### Semantic Tokens (语义层)

**格式**: `{用途}/{语义}`

**示例**:
- `surface/brand-contrast` - 品牌高对比度背景
- `text/primary` - 主要文本色
- `border/normal` - 常规边框色

**命名解析**: `surface/brand-contrast`
- `surface` - 用于背景
- `brand` - 品牌核心
- `contrast` - 高对比度



### Component Tokens (组件层)

**格式**: `{组件}-{类型}-{属性}-{状态}`

**示例**:
- `button-primary-background-default` - 主按钮默认背景
- `button-primary-background-hover` - 主按钮悬停背景
- `card-padding-default` - 卡片默认内边距



## 各类 Token 命名

### 颜色 Token

**Primitive**:
- `pink-{50|100|200|...|900}`
- `neutral-{0|50|100|...|950}`

**Semantic**:
- `surface/primary` - 主要背景
- `surface/brand-contrast` - 品牌高对比度背景
- `text/primary` - 主要文本
- `text/secondary` - 次要文本
- `border/normal` - 常规边框



### 间距 Token

**Primitive**:
- `space-{050|100|150|200|300|400|600}` - 基于 4px 倍数

**Semantic**:
- `spacing/component-gap` - 组件间距
- `spacing/section-gap` - 区块间距



### 圆角 Token

**Primitive**:
- `radius-{none|small|medium|large|full}`

**Semantic**:
- `border-radius/button` - 按钮圆角
- `border-radius/card` - 卡片圆角



### 阴影 Token

**Primitive**:
- `elevation-{100|200|300|400|500}`

**Semantic**:
- `shadow/card` - 卡片阴影
- `shadow/modal` - 弹窗阴影



## 状态后缀

对于有状态变化的 Token,使用以下后缀:

| 后缀 | 含义 |
|------|------|
| `default` 或无后缀 | 默认状态 |
| `hover` | 悬停状态 |
| `active` 或 `pressed` | 激活/按下状态 |
| `disabled` | 禁用状态 |
| `focus` | 聚焦状态 |



## 命名检查清单

- [ ] 名称易于理解,语言中立
- [ ] 使用完整单词,避免缩写
- [ ] 相同类别使用一致的前缀
- [ ] 单复数使用一致
- [ ] 避免使用品牌名
- [ ] 考虑未来扩展性
- [ ] Primitive Tokens 描述"是什么"
- [ ] Semantic Tokens 描述"如何使用"
- [ ] Component Tokens 描述"在哪里使用"



## 相关文档

- [Token 概述](01_📋%20Token概述) - Token 概念与使用
- [Token 文件结构](03_📁%20Token文件结构) - Token 文件组织
