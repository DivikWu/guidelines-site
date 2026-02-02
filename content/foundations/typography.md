---
category: 基础规范
status: published
last_updated: 2026-01-27
---

# 字体排版2

字体排版是设计系统的基础，直接影响内容的可读性与品牌调性。YAMI 设计系统定义了统一的字体家族、层级与使用规范。

---

## 字体家族

### 英文 / 品牌字体

GT Walsheim 作为品牌字体，用于标题、品牌展示及英文内容。

- GT Walsheim Medium — 标题、强调
- GT Walsheim Regular — 正文
- GT Walsheim Bold — 重点强调
- GT Walsheim Light — 辅助展示

### 中文字体

| 平台 | 字体 |
|------|------|
| Android | Noto Sans SC |
| iOS | PingFang SC |

---

## 字体层级

设计系统定义了从 Display 到 Caption 的完整字体层级，覆盖各类场景。

### 完整 Token 速查表

| Token | 字号 | 行高 | 字重 | 用途 |
|-------|------|------|------|------|
| Display L | 32px | 40px | 400 | 大型展示标题 |
| Display M | 28px | 36px | 400 | 中型展示标题 |
| Display S | 24px | 32px | 400 | 小型展示标题 |
| Heading L | 20px | 28px | 500 | 一级标题 |
| Heading M | 18px | 24px | 500 | 二级标题 |
| Heading S | 16px | 20px | 500 | 三级标题 |
| Body L | 16px | 24px | 400 | 大号正文 |
| Body M | 14px | 20px | 400 | 标准正文 |
| Caption M | 12px | 16px | 400 | 标准辅助文字 |
| Caption S | 10px | 14px | 400 | 小号辅助文字 |
| Link M | 14px | 20px | 400 | 标准链接 |
| Link S | 12px | 16px | 400 | 小号链接 |

### Display（展示型）

用于页面主标题、Hero 区域、品牌展示等需要强视觉冲击的场景。

| Token | 字号 | 行高 | 字重 |
|-------|------|------|------|
| Display L | 32px | 40px | Regular (400) |
| Display M | 28px | 36px | Regular (400) |
| Display S | 24px | 32px | Regular (400) |

### Heading（标题）

用于内容区块标题、卡片标题、弹窗标题等。

| Token | 字号 | 行高 | 字重 |
|-------|------|------|------|
| Heading L | 20px | 28px | Medium (500) |
| Heading M | 18px | 24px | Medium (500) |
| Heading S | 16px | 20px | Medium (500) |

### Body（正文）

用于段落文字、列表项、表单标签等主要内容。

| Token | 字号 | 行高 | 字重 |
|-------|------|------|------|
| Body L | 16px | 24px | Regular (400) |
| Body M | 14px | 20px | Regular (400) |

### Caption（辅助）

用于注释、时间戳、辅助说明等次要信息。

| Token | 字号 | 行高 | 字重 |
|-------|------|------|------|
| Caption M | 12px | 16px | Regular (400) |
| Caption S | 10px | 14px | Regular (400) |

### Link（链接）

用于可点击的文字链接。

| Token | 字号 | 行高 | 字重 |
|-------|------|------|------|
| Link M | 14px | 20px | Regular (400) |
| Link S | 12px | 16px | Regular (400) |

---

## 行高与字重

- 行高遵循 1.3–1.6 的比例，确保良好的可读性
- 字重使用 Regular (400) / Medium (500) / Bold (700) 三档
- 正文默认使用 Regular，标题使用 Medium 或 Bold

---

## 使用原则

1. **层级清晰**：一个页面通常使用 2–3 级标题 + 正文，避免层级过多
2. **中英混排**：品牌字体与中文字体需保持视觉协调
3. **数字排版**：使用等宽数字（Tabular Figures）用于数据展示
4. **响应式**：不同屏幕尺寸下字体大小可适当调整，但层级关系保持不变

---

## 可访问性

- 最小正文字号建议 ≥ 14px
- 行高不低于 1.4 倍字号
- 避免使用纯装饰性字体用于正文内容

---

> [!note] Token 来源
> 本文档中的 Token 值基于 Figma 设计源文件提取。如需查阅 Emphasized 变体或其他扩展样式，请参阅 Figma 中的文字样式。

最后更新：01/27/2026
