---
title: Typography Tokens
title_en: Typography Tokens
description: 字体排版系统 - 字体家族与响应式字阶
category: Tokens
status: Draft
last_updated: 2026-02-05
---

# 🔤 Typography Primitives

> [!TIP]
> 字体排版系统定义了跨设备的文本样式规范,确保内容的可读性与视觉层级。

---

## 1. 字体家族 (Font Family)

| Token | 值 | 用途 |
|-------|------|------|
| `font-family-base` | `-apple-system, BlinkMacSystemFont, "Segoe UI", ...` | 界面文本 |
| `font-family-mono` | `"SF Mono", "Menlo", "Monaco", ...` | 代码、数据 |

### 字体栈说明

**`font-family-base`** 采用系统字体栈,确保在不同平台上使用原生字体:
- **macOS/iOS**: San Francisco
- **Windows**: Segoe UI
- **Android**: Roboto
- **备用**: Helvetica Neue, Arial, sans-serif

**`font-family-mono`** 用于代码块、终端输出、数据表格等等宽场景。

---

## 2. 响应式字阶 (Type Scale)

| 样式 (Style) | Mobile (字号/行高) | Desktop L (字号/行高) | 字重 (Weight) | Token |
| :--- | :--- | :--- | :--- | :--- |
| **Display L** | 40px / 48px | 56px / 68px | Bold (700) | `display-l` |
| **Display M** | 32px / 40px | 48px / 56px | Bold (700) | `display-m` |
| **Heading L** | 28px / 32px | 40px / 48px | SemiBold (600) | `heading-l` |
| **Heading M** | 24px / 28px | 32px / 36px | SemiBold (600) | `heading-m` |
| **Heading S** | 20px / 24px | 24px / 28px | SemiBold (600) | `heading-s` |
| **Body L** | 16px / 24px | 18px / 28px | Regular (400) | `body-l` |
| **Body M** | 14px / 20px | 16px / 24px | Regular (400) | `body-m` |
| **Body S** | 12px / 16px | 14px / 20px | Regular (400) | `body-s` |
| **Caption** | 11px / 14px | 12px / 16px | Regular (400) | `caption` |

> [!NOTE]
> 字号格式为 `字号 / 行高`,所有数值均为像素(px)。

---



## 3. 字重规范 (Font Weight)

| 字重 | 数值 | 用途 |
|------|------|------|
| **Regular** | 400 | 正文、描述 |
| **Medium** | 500 | 强调文本 |
| **SemiBold** | 600 | 标题、按钮 |
| **Bold** | 700 | 超大标题、强调 |

> [!IMPORTANT]
> 避免使用过多字重变化,保持 2-3 种字重即可建立清晰层级。

---

