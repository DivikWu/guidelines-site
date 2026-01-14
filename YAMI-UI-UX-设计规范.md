# YAMI UI/UX 设计规范 Design Guidelines

**版本**: v1.0.0 | **最后更新**: 2026-01-12

---

## 导航 Navigation

### 设计基础 Design Foundations
- [概述 Overview](#概述)
- [色彩 Color](#色彩)
- [文本 Typography](#文本)
- [间距 Spacing](#间距)
- [布局 Layout](#布局)
- [圆角 Radius](#圆角)
- [阴影与层级 Elevation](#阴影与层级)
- [图标 Iconography](#图标)

### 组件库 Components
- [按钮 Button](#按钮)
- [选项卡 Tabs](#选项卡)
- [徽章 Badge](#徽章)

---

## 概述 Overview

本文档是 YAMI 产品线的 UI/UX 设计规范，旨在为设计与开发提供统一的语言与协作标准。

### 设计原则 Design Principles

*   **一致性 Consistency**: 保持跨平台、跨设备的一致性体验。
*   **可用性 Usability**: 优先考虑用户的使用体验和可访问性。
*   **可扩展性 Scalability**: 系统化定义，支持业务的快速扩展。

---

## 更新日志 Release Notes

### 更新流程 Handoff Process

1. **识别 Change**: 识别需要更新或新增的设计 Token 或规范。
2. **评审 Review**: 提交设计方案供系统小组评审，确保不产生冗余。
3. **发布 Sync**: 更新 `tokens.json` 与文档，同步开发端代码库。

---

## 品牌 Brand

### Logo 使用规范 Logo Guidelines

#### 语言变体 Language Variants
- **中文版本**: 适用于中文市场。
- **英文版本**: 适用于英文市场。

#### 平台适配 Platform Adaptation
- **移动端 (Mobile)**: 针对手机与平板优化。
- **桌面端 (PC)**: 针对 Web 与桌面应用优化。

#### 样式变体 Style Variants
- **填充样式 (Fill)**: 适用于浅色背景。
- **线条样式 (Line)**: 适用于深色背景或复杂背景。

---

## 应用图标模版 App Icon Template

### 标准尺寸 Standard Sizes
- 遵循 iOS 与 Android 平台的官方图标规范。
- 详细尺寸请参考本文档附录或 Figma 模板。

---

## 色彩 Color

色彩是 YAMI 界面语言的核心。通过系统化的色彩定义，我们旨在建立跨平台的视觉一致性，并确保界面在复杂业务场景下的信息层级清晰、可读。

### 设计目标 Design Goals

*   **视觉一致性 Visual Consistency**: 跨 Web、iOS、Android 保持统一的品牌心智。
*   **语义化传达 Semantic Communication**: 通过颜色直观传达状态（如成功、报错），降低用户认知成本。
*   **可访问性 Accessibility**: 严格遵循 WCAG AA 对比度标准，保障阅读体验。
*   **动态扩展 Dynamic Scaling**: 支持深色模式切换及未来的主题定制需求。

### 色彩体系结构 Color System Structure

YAMI 的色彩体系由以下四个维度构成：

#### 1. 品牌色彩 Brand Colors
包含核心品牌色。采用「双锚点」策略，区分品牌传播场景（Logo/营销）与界面交互场景。
- 引用 Token: `color.brand.*`

#### 2. 界面色彩 UI Colors
用于界面背景、表面、分割线及次要装饰。
- 引用 Token: `color.background.*`, `color.surface.*`, `color.border.*`

#### 3. 中性色 Neutral Colors
用于文本、图标及界面底色，提供细腻的对比度调节。
- 引用 Token: `color.text.*`, `color.palette.neutral.*`

#### 4. 语义与反馈色 Semantic Colors
用于表达功能状态（成功、错误、警告、信息）的标准化色值。
- 引用 Token: `color.status.*`, `color.badge.*`

### 使用规范 Usage Rules

#### 使用原则 Principles
*   **中性色优先**: 界面 80% 区域应由中性色覆盖，仅在关键交互点使用品牌色。
*   **语义驱动**: 禁止直接使用 Hex 值，必须通过语义化 Token 引用颜色。
*   **对比度合规**: 正文与核心图标必须满足 WCAG AA 对比度要求。

#### 禁止用法 Prohibitions
*   **禁止硬编码**: 严禁在代码或设计稿中使用裸露的颜色数值。
*   **禁止语义滥用**: 不得将 `color.status.error` 用于非错误状态的修饰。
*   **禁止手动调整透明度**: 必须引用已定义的透明度色板（如 `color.black.*`）。

### Token & 开发交付 Dev Handoff

#### Token 命名逻辑 Naming Logic
采用 `[Category].[Type].[Item]` 结构：
- `color.text.primary`: 类别.角色.等级

#### 交付对齐 Alignment
*   **唯一真相源**: `tokens.json` 是唯一生效的色值定义文件。
*   **设计对齐**: Figma 库必须与 Token 名称严格一致。
*   **代码实现**: 开发直接引用生成的 CSS 变量（`--yami-color-*`）。

---

### 品牌色彩详情 Detailed Brand Colors

#### 核心策略：双锚点 Dual Anchor Strategy
- **Brand Anchor**: `color.brand.primary` - 品牌主色，仅用于 Logo、营销渲染。
- **UI Anchor**: `color.ui.primary` - 交互主色，满足 WCAG AA 对比度要求。

#### 界面色引用参考 UI Color Reference
- **背景**: `color.background.light` / `dark`
- **表面**: `color.surface.light` / `dark`
- **文本**: `color.text.primary` / `secondary` / `tertiary`
- **边框**: `color.border.light` / `dark`

---

## 文本 Typography

文本是界面中承载信息、传达语义、引导用户操作的最基本元素。YAMI 通过规范化的字体层级与排版规则，确保信息在不同平台与语言环境中的清晰传递。

### 设计目标 Design Goals

*   **保障可读性 Readability**: 建立合理的行高与对比度。
*   **建立视觉层级 Visual Hierarchy**: 通过明确的字号与字重区分重要程度。
*   **跨平台一致性 Cross-platform Consistency**: 确保 iOS、Android、Web 端的表现统一。

### 字体层级 Type Scale

- **展示层级 Display**: 用于特大标题 (`typography.display.*`)。
- **标题层级 Heading**: 用于页面、区块标题 (`typography.heading.*`)。
- **正文层级 Body**: 用于常规内容 (`typography.body.*`)。
- **辅助层级 Caption**: 用于辅助说明 (`typography.caption.*`)。
- **链接层级 Link**: 用于交互链接 (`typography.link.*`)。

### 使用规范 Usage Rules

#### 字体家族 Font Family
- **品牌字体**: `GT Walsheim` (拉丁、数字)。
- **系统字体**: CJK 环境使用系统默认（如 `PingFang SC`）。

#### 响应式映射 Responsive Mapping
- 遵循 `layout.breakpoint.*` 断点规则。
- 同一 Token 在不同端自动映射数值变体（`mobile` / `tablet` / `desktop`）。

---

## 间距 Spacing

间距用于定义界面元素之间的空间关系，通过建立有节奏的步进体系，确保布局的秩序感。

### Token 体系 Token System
- 基于 `8px` 基准单位缩放。
- 引用 Token: `spacing.*` (如 `spacing.100`, `spacing.200`)。

### 使用规范 Usage Rules
- **8点网格**: 所有间距必须引用 Token，禁止硬编码。
- **亲密性原则**: 逻辑相关的元素间距较小，模块间距较大。

---

## 布局 Layout

布局定义了内容在屏幕上的组织形式，采用自适应网格系统。

### 栅格系统 Grid System
- **最大宽度**: 桌面端约束为 `layout.container.maxWidth.desktop` (1920px)。
- **断点 Breakpoints**: 基于 `layout.breakpoint.*` 自动适配。
- **网格配置**: 每个断点对应特定的 `columns`, `gutter` 与 `margin`。

### 使用规范 Usage Rules
- **流式优先**: 内容随视口自动伸缩，直至达到 `maxWidth`。
- **侧栏比例**: 侧栏与主内容区通过列跨度 (Column Span) 划分。

---

## 圆角 Radius

圆角用于定义界面元素的形态语言，建立一致的视觉结构。

### 圆角等级 Radius Levels
- **None**: `borderRadius.none` (0px)。
- **Small**: `borderRadius.small` (4px)。
- **Medium**: `borderRadius.medium` (8px)。
- **Large**: `borderRadius.large` (12px)。
- **Full**: `borderRadius.full` (999px)。

---

## 阴影与层级 Elevation

通过 Z 轴方向的投影与 Z-Index 建立界面的空间层级。

- **投影**: `shadow.e1` 到 `shadow.e5`。
- **层级**: `elevation.base` / `elevated` / `modal`。

---

## 图标 Iconography

图标用于增强功能的识别性。

- **尺寸**: 必须使用 `icon.size.*` tokens 约束。
- **色彩**: 必须引用 `color.text.*` 或相关语义 Token。

---

## 按钮 Button

按钮是触发特定操作的核心组件。

### 按钮类型 Types
- **Primary**: 主操作，高优先级。
- **Secondary**: 次操作，中优先级。
- **Text**: 辅助操作，低优先级。

### 尺寸与状态 Size & States
- **尺寸**: `button.height.*`, `button.padding.*`。
- **状态**: 默认、悬停、激活、禁用、加载。

---

## 选项卡 Tabs

用于切换同级内容。

- **类型**: 主要选项卡、次要选项卡。
- **状态**: 选中、未选中、禁用。

---

## 徽章 Badge

用于显示状态指示或数量提醒。

- **类型**: 数字、文本、圆点。
- **颜色**: `color.badge.*` (Primary, Success, Warning, Error)。

---

## 设计规范维护 Maintenance

### 版本管理 Versioning
- 采用语义化版本 (Semantic Versioning)。
- 定期审查（每季度）与及时更新。

### 反馈渠道 Feedback
- 设计团队评审与产品端反馈。

---

## 附录 Appendix

- **Figma 文件**: [YAMI UI/UX Guidelines](https://www.figma.com/design/6oOAy72DBff4P6NzJYc2hi/)
- **真相源**: `tokens.json`
- **参考**: Material Design, Apple HIG, WCAG 2.1
