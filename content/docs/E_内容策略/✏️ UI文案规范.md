---
title: UI 文案规范
description: 界面文案的书写规则、大小写与标点规范
category: 内容策略
status: published
last_updated: 01/27/2026
sort_order: 53
---

# ✏️ UI 文案规范

本规范定义 YAMI 产品界面中文案的书写规则，确保用户在使用过程中获得一致、清晰的阅读体验。

---

## 标题大小写

标题大小写（Capitalization）是英文界面设计中的核心规范之一。不同的大小写风格传递不同的视觉感受，需根据使用场景统一规则。

### 两种主要风格

| 风格    | 英文名称          | 示例                 | 视觉特点  |
| ----- | ------------- | ------------------ | ----- |
| 标题式大写 | Title Case    | Create New Project | 正式、强调 |
| 句首大写  | Sentence case | Create new project | 自然、友好 |

### YAMI 的大小写规则

> [!note] 核心原则
> YAMI 产品采用 **混合方案**：标题与按钮使用 Title Case，其他元素使用 Sentence case

这种策略的优势：
- 标题与按钮更具视觉权重，便于用户快速定位关键操作
- 辅助信息使用 Sentence case，保持阅读的自然流畅
- 在正式感与友好度之间取得平衡

### 各场景应用规则

#### Title Case 场景

| UI 元素 | 示例 |
|--------|------|
| 页面标题 | Account Settings |
| 对话框标题 | Delete This Item? |
| 按钮文案 | Save Changes |
| 主操作按钮 | Create New Project |
| 标签页 | General, Security, Notifications |
| 导航菜单 | Export as PDF |

#### Sentence case 场景

| UI 元素 | 示例 |
|--------|------|
| 表单标签 | Email address |
| 占位符文本 | Enter your email |
| 提示信息 | Your changes have been saved |
| 错误信息 | Please enter a valid email |
| 工具提示 | Click to copy link |
| 表格表头 | Last modified |
| 描述文案 | This action cannot be undone |

### Title Case 书写规则

在 Title Case 中，需遵循以下大小写规则：

**需要大写的词汇：**
- 句首词汇
- 名词、动词、形容词、副词
- 超过 4 个字母的介词

**保持小写的词汇（除非在句首）：**

| 类型 | 词汇示例 |
|------|---------|
| 冠词 | a, an, the |
| 连词 | and, but, or, nor, for, yet, so |
| 短介词（≤4 字母） | in, on, at, to, by, of, for, with, as |

### 始终大写的词汇

无论使用何种风格，以下类型的词汇始终保持大写：

- **专有名词**：YAMI、iOS、macOS、Android、Google
- **缩写词**：URL、API、PDF、CSV、HTML
- **产品功能名**：根据品牌定义（如 Quick Actions）

### 常见错误示例

> [!danger] 避免以下写法

| ❌ 错误 | ✅ 正确 | 问题 |
|--------|--------|------|
| save changes | Save Changes | 按钮需使用 Title Case |
| Create new project | Create New Project | 按钮需使用 Title Case |
| Account settings | Account Settings | 页面标题需使用 Title Case |
| Export As Pdf | Export as PDF | 短介词小写，缩写大写 |
| CREATE NEW PROJECT | Create New Project | 全大写显得过于强势 |
| Your Changes Have Been Saved | Your changes have been saved | 提示信息应使用 Sentence case |

---

## 快速检查清单

在交付设计稿前，请确认：

- [ ] 页面标题、按钮使用 Title Case
- [ ] 提示信息、表单标签使用 Sentence case
- [ ] Title Case 中短介词、冠词保持小写
- [ ] 专有名词和缩写词大写正确
- [ ] 无全大写文案（除非有特殊用途）
- [ ] 中英文混排时保持一致性

---

## 相关链接

- [[内容原则|内容原则]]
- [[语气与风格|语气与风格]]
- [[本地化与翻译|本地化与翻译]]

---
