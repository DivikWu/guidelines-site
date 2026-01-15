# 深色模式问题审计清单

## 1. Text 层级不足（Heading/Body/Secondary 接近，阅读疲劳）

**现象（用户感知）**：
- 深色模式下，标题、正文、辅助信息层级区分不明显
- text.tertiary 在深色模式下为 #999999，与背景 #1A1A1A 对比度约 4.5:1，勉强达到 WCAG AA，但视觉上"灰成一片"
- 长文阅读时缺乏清晰的视觉节奏

**根因**：
- `tokens.json` 中 `text.tertiary.dark` 值为 `#999999`，与浅色模式相同，未针对深色背景优化
- 缺少 text.primary 与 text.secondary 之间的中间层级

**修复策略**：
- 调整 `text.tertiary.dark` 为更亮的灰色（如 `#B3B3B3`），确保与背景对比度 ≥ 5:1
- 保持 text.secondary.dark 为 `#CCCCCC`，确保与 text.primary 有明显层级差

---

## 2. 左侧导航层级与选中态不稳（一级/二级区分不足；选中态过度依赖浅色大块）

**现象（用户感知）**：
- 一级导航和二级导航在视觉上区分不明显
- 选中态使用 `neutral-100` (#F5F5F5)，在深色模式下完全不适用
- 缺少 hover/pressed/focus 状态的清晰反馈
- 深色模式下选中项背景过亮，与整体风格不协调

**根因**：
- `globals.css` 中导航项使用硬编码 `--fill-secondary`（映射到 `neutral-100`）
- 缺少语义化的 state tokens（hover/selected/pressed/focus）
- 未使用"透明叠加"策略，而是直接使用固定颜色

**修复策略**：
- 新增 `state.hover`、`state.selected`、`state.pressed`、`state.focus` tokens
- 使用透明叠加策略：light = overlay.black + opacity，dark = overlay.white + opacity
- 一级导航通过字号/字重/间距形成层级，二级默认降低权重
- 选中态添加左侧 2px indicator（使用 token）

---

## 3. Inline code/token pill 过高饱和度（像 error，打断阅读）

**现象（用户感知）**：
- Inline code 使用 `color-ui-primary` (#E00000 红色)，在深色模式下过于刺眼
- 背景使用 `neutral-100` (#F5F5F5)，在深色模式下完全不适用
- 视觉上像错误提示，打断阅读流

**根因**：
- `globals.css` 中 `.token-inline` 硬编码使用 `--yami-color-palette-neutral-100` 和 `--color-ui-primary`
- 缺少专门的 `code.bg`、`code.text`、`code.border` tokens
- 未考虑深色模式下的可读性和视觉权重

**修复策略**：
- 新增 `code.bg`、`code.text`、`code.border` tokens
- 深色模式下使用 surface + 轻度 state.selected 的组合
- 文本颜色接近 text.primary 但略弱，避免纯白
- 移除高饱和品牌色，使用中性色系

---

## 4. Divider/Border 过亮（页面被切碎）

**现象（用户感知）**：
- 深色模式下，分割线和边框过于明显，将页面"切碎"
- `border-dark` 为 `#404040`，与背景 `#1A1A1A` 对比度过高
- 视觉噪音过多，影响内容聚焦

**根因**：
- `tokens.json` 中 `border.dark` 为 `#404040`，对比度约 3.2:1，过于明显
- 未区分装饰性边界（subtle）和结构性边界（strong）
- 未区分普通 border 和 section divider

**修复策略**：
- 新增 `border.subtle`、`border.strong`、`divider.section` tokens
- 深色模式下整体降低对比度：subtle 使用 `#2A2A2A`，strong 使用 `#333333`
- divider.section 使用更细的线条或更低对比度

---

## 5. Icon 权重过高（图标抢焦点，缺少 icon.* token）

**现象（用户感知）**：
- 图标直接使用 `text.primary`，在深色模式下过于突出
- 缺少 icon 的语义层级（primary/secondary/muted）
- 导航图标与文本权重相同，视觉混乱

**根因**：
- `tokens.json` 中只有 `icon.size`，没有 `icon.color` tokens
- 组件中直接使用 `--foreground-primary` 或 `--color-text-primary`
- 未建立 icon 的视觉层级体系

**修复策略**：
- 新增 `icon.primary`、`icon.secondary`、`icon.muted` tokens
- 默认使用 `icon.secondary`，选中态使用 `icon.primary`
- 禁止 icon 直接使用 text.primary 作为默认

---

## 修复优先级

1. **P0（必须修复）**：导航状态体系、inline code 样式、text.tertiary 对比度
2. **P1（重要优化）**：icon tokens、border/divider 弱化
3. **P2（体验提升）**：正文排版间距、长段落可读性
