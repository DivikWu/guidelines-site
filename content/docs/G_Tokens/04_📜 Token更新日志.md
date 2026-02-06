---
title: Token 更新日志
title_en: Token Changelog
description: Design Token 的版本变更历史与迁移指南
category: Tokens
status: Draft
last_updated: 2026-02-05
---

# 📜 Token 更新日志

本文档记录 YAMI 设计系统 Design Token 的版本变更历史。

---

## 版本格式

遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范:

- **主版本号 (MAJOR)**: 不兼容的 API 变更
- **次版本号 (MINOR)**: 向下兼容的功能新增
- **修订号 (PATCH)**: 向下兼容的问题修复

---

## v2.0.0 (2026-02-05)

### 🎉 重大更新 - 采用 Figma 最佳实践

基于 Figma 官方指南重构 Token 体系,采用 Primitive/Semantic/Component 三层结构。

#### 💡 核心变更

**1. Token 结构调整**

- ✨ 引入 **Primitive Tokens**(原始层) - 仅供引用
- ✨ 引入 **Semantic Tokens**(语义层) - 可直接使用
- ✨ 引入 **Component Tokens**(组件层) - 可选
- ✨ 支持 **Aliasing**(别名引用)

**2. Figma Variables Collections**

- ✨ 创建 `Primitives` Collection(隐藏发布)
- ✨ 创建 `Tokens` Collection(发布到团队库)
- ✨ 使用 Variables 替代大部分 Styles

**3. 命名规范更新**

采用 Figma 推荐的 6 条命名原则:
- 易于理解,语言中立
- 使用完整单词
- 一致的前缀
- 单复数一致
- 避免品牌名
- 面向未来

#### 🔧 Token 迁移

| 旧 Token | 新 Token | 类型 |
|---------|---------|------|
| `brand/primary` | `surface/brand-contrast` | Semantic |
| `ui/primary` | `surface/brand-contrast` | Semantic |
| `text/primary` | `text/primary` | Semantic |
| `Red/500` | `pink-400` | Primitive |

#### 📝 迁移指南

**步骤 1**: 更新 Figma Variables

1. 创建 `Primitives` Collection
2. 将所有原始值迁移到 Primitives
3. 隐藏 Primitives 避免直接使用
4. 创建 `Tokens` Collection
5. 使用 Aliasing 引用 Primitives

**步骤 2**: 更新代码

```bash
# 全局替换 Token 名称
sed -i 's/--brand-primary/--surface-brand-contrast/g' **/*.css
sed -i 's/--ui-primary/--surface-brand-contrast/g' **/*.css
```

**步骤 3**: 重新生成平台代码

```bash
npx style-dictionary build
```

---

## v1.0.0 (2026-01-27)

### 🎉 首次发布

YAMI 设计系统 Design Token 初始版本。

#### 颜色 Token

| Token | 值 |
|-------|-----|
| brand/primary | `#FF0000` |
| ui/primary | `#E00000` |
| text/primary | `rgba(0,0,0,0.87)` |
| text/secondary | `rgba(0,0,0,0.55)` |

#### 间距 Token

| Token | 值 |
|-------|-----|
| space-050 | 4px |
| space-100 | 8px |
| space-150 | 12px |
| space-200 | 16px |

#### 圆角 Token

| Token | 值 |
|-------|-----|
| radius-none | 0px |
| radius-small | 4px |
| radius-medium | 8px |
| radius-large | 12px |

---

## 变更类型图例

| 标记 | 含义 |
|------|------|
| 🎉 | 新功能 / 首次发布 |
| ✨ | 新增 Token |
| 🔧 | 修改现有 Token |
| 🗑️ | 移除 Token(废弃) |
| 📝 | 文档更新 |
| 🐛 | 问题修复 |
| 💡 | 重大更新 |

---

## 订阅更新

- 关注 Figma 设计源文件的版本历史
- 订阅 Token 仓库的 Release 通知
- 加入设计系统 Slack/飞书群组获取更新推送

---
