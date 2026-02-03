---
title: Token 更新日志
title_en: Token Changelog
description: Design Token 的版本变更历史与迁移指南
category: 资源
status: Draft
last_updated: 2026-01-31
---

# 📜 Token 更新日志

本文档记录 YAMI 设计系统 Design Token 的版本变更历史。

---

## 版本格式

遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范：

- **主版本号 (MAJOR)**：不兼容的 API 变更
- **次版本号 (MINOR)**：向下兼容的功能新增
- **修订号 (PATCH)**：向下兼容的问题修复

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
| text/disabled | `rgba(0,0,0,0.29)` |
| border/primary | `rgba(0,0,0,0.08)` |
| divider/normal | `rgba(0,0,0,0.08)` |
| background/primary | `#FFFFFF` |
| surface/primary | `#FFFFFF` |
| fill/default | `#FFFFFF` |
| blue/50 | `#F0F3FA` |
| sky/50 | `#EEF6FE` |

#### 字体 Token

| Token | 字号 | 行高 | 字重 |
|-------|------|------|------|
| Display L | 32px | 40px | 400 |
| Display M | 28px | 36px | 400 |
| Display S | 24px | 32px | 400 |
| Heading L | 20px | 28px | 500 |
| Heading M | 18px | 24px | 500 |
| Heading S | 16px | 20px | 500 |
| Body L | 16px | 24px | 400 |
| Body M | 14px | 20px | 400 |
| Caption M | 12px | 16px | 400 |
| Caption S | 10px | 14px | 400 |
| Link M | 14px | 20px | 400 |
| Link S | 12px | 16px | 400 |

#### 间距 Token

| Token | 值 |
|-------|----|
| space-0 | 0px |
| space-025 | 2px |
| space-050 | 4px |
| space-100 | 8px |
| space-150 | 12px |
| space-200 | 16px |
| space-300 | 24px |
| space-400 | 32px |
| space-600 | 48px |

#### 圆角 Token

| Token | 值 |
|-------|----|
| radius/none | 0px |
| radius/small | 4px |
| radius/medium | 8px |
| radius/large | 12px |
| radius/full | 999px |

#### 阴影 Token

| Token | 值 |
|-------|-----|
| elevation-100 | `0 1px 2px -1px rgba(0,0,0,0.04)` |
| elevation-200 | `0 2px 4px -2px rgba(0,0,0,0.08)` |
| elevation-300 | `0 4px 8px -4px rgba(0,0,0,0.12)` |
| elevation-400 | `0 4px 12px -6px rgba(0,0,0,0.16)` |
| elevation-500 | `0 8px 16px -8px rgba(0,0,0,0.24)` |

#### 布局 Token

| 平台 | 栏数 | Gutter | Margin |
|------|------|--------|--------|
| PC | 12 | 16px | 48px |
| Mobile | 6 | 8px | 16px |

---

## 变更类型图例

| 标记 | 含义 |
|------|------|
| 🎉 | 新功能 / 首次发布 |
| ✨ | 新增 Token |
| 🔧 | 修改现有 Token |
| 🗑️ | 移除 Token（废弃） |
| 📝 | 文档更新 |
| 🐛 | 问题修复 |

---

## 迁移指南模板

当发生破坏性变更时，提供迁移指南：

```markdown
### 从 vX.X.X 迁移到 vY.Y.Y

#### 变更说明
- Token `old-name` 已重命名为 `new-name`

#### 迁移步骤
1. 全局搜索替换 `old-name` → `new-name`
2. 更新构建配置...

#### 自动化脚本
\`\`\`bash
# 提供迁移脚本（如有）
npx @yami/tokens migrate --from vX.X.X --to vY.Y.Y
\`\`\`
```

---

## 订阅更新

- 关注 Figma 设计源文件的版本历史
- 订阅 Token 仓库的 Release 通知
- 加入设计系统 Slack/飞书群组获取更新推送

---
