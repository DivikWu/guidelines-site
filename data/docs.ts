export type DocPage = { id: string; markdown: string };

const color = `
# 色彩 Color

色彩是 YAMI 界面语言的核心。通过系统化的色彩定义，我们旨在建立跨平台的视觉一致性，并确保界面在复杂业务场景下的信息层级清晰、可读。

## 设计目标 Design Goals

- **视觉一致性 Visual Consistency**: 跨 Web、iOS、Android 保持统一的品牌心智。
- **语义化传达 Semantic Communication**: 通过颜色直观传达状态（如成功、报错），降低用户认知成本。
- **可访问性 Accessibility**: 严格遵循 WCAG AA 对比度标准，保障阅读体验。
- **动态扩展 Dynamic Scaling**: 支持深色模式切换及未来的主题定制需求。

## 色彩体系结构 Color System Structure

YAMI 的色彩体系由以下四个维度构成：

### 1. 品牌色彩 Brand Colors

包含核心品牌色。采用「双锚点」策略，区分品牌传播场景（Logo/营销）与界面交互场景。

- 引用 Token: \`color.brand.*\`

#### 核心策略：双锚点 Dual Anchor Strategy

- **Brand Anchor**: \`color.brand.primary\` - 品牌主色，仅用于 Logo、营销渲染。
- **UI Anchor**: \`color.ui.primary\` - 交互主色，满足 WCAG AA 对比度要求。

### 2. 界面色彩 UI Colors

用于界面背景、表面、分割线及次要装饰。

- 引用 Token: \`color.background.*\`, \`color.surface.*\`, \`color.border.*\`

#### 界面色引用参考

- **背景**: \`color.background.light\` / \`dark\`
- **表面**: \`color.surface.light\` / \`dark\`
- **边框**: \`color.border.light\` / \`dark\`

### 3. 中性色 Neutral Colors

用于文本、图标及界面底色，提供细腻的对比度调节。

- 引用 Token: \`color.text.*\`, \`color.palette.neutral.*\`

#### 文本色引用参考

- **主要文本色**: \`color.text.primary.light\` / \`dark\`
- **次要文本色**: \`color.text.secondary.light\` / \`dark\`
- **辅助文本色**: \`color.text.tertiary.light\` / \`dark\`

### 4. 语义与反馈色 Semantic Colors

用于表达功能状态（成功、错误、警告、信息）的标准化色值。

- 引用 Token: \`color.badge.*\`

#### 徽章色引用参考

- **主要**: \`color.badge.primary\`
- **成功**: \`color.badge.success\`
- **警告**: \`color.badge.warning\`
- **错误**: \`color.badge.error\`

## 使用规范 Usage Rules

### 使用原则 Principles

- **中性色优先**: 界面 80% 区域应由中性色覆盖，仅在关键交互点使用品牌色。
- **语义驱动**: 禁止直接使用 Hex 值，必须通过语义化 Token 引用颜色。
- **对比度合规**: 正文与核心图标必须满足 WCAG AA 对比度要求。

### 禁止用法 Prohibitions

- **禁止硬编码**: 严禁在代码或设计稿中使用裸露的颜色数值。
- **禁止语义滥用**: 不得将 \`color.badge.error\` 用于非错误状态的修饰。
- **禁止手动调整透明度**: 必须引用已定义的透明度色板（如 \`color.palette.black.*\`）。

### 典型场景 Scenarios

- **Primary Action**: 仅使用 \`color.ui.primary\` 作为主按钮背景。
- **Interactive States**: 悬停与点击状态应遵循色板中的步进逻辑。

## Token & 开发交付 Dev Handoff

### Token 命名逻辑 Naming Logic

采用 \`[Category].[Type].[Item]\` 结构：

- \`color.text.primary\`: 类别.角色.等级

### 交付对齐 Alignment

- **唯一真相源**: \`tokens.json\` 是唯一生效的色值定义文件。
- **设计对齐**: Figma 库必须与 Token 名称严格一致。
- **代码实现**: 开发直接引用生成的 CSS 变量（\`--yami-color-*\`）。
`;

const typography = `
# 文本 Typography

文本是界面中承载信息、传达语义、引导用户操作的最基本元素。YAMI 通过规范化的字体层级与排版规则，确保信息在不同平台与语言环境中的清晰传递。

## 设计目标 Design Goals

- **保障可读性 Readability**: 建立合理的行高与对比度，确保在各种环境下的舒适阅读体验。
- **建立视觉层级 Visual Hierarchy**: 通过明确的字号与字重区分，帮助用户快速扫描与定位关键信息。
- **跨平台一致性 Cross-platform Consistency**: 确保 iOS、Android、Web 端的字体表现高度统一。
- **多语言兼容 Multi-language Support**: 为 CJK 语言与拉丁语系提供协同的字体排版方案。

## 字体层级 Type Scale

YAMI 的字体样式分为以下五个层级：

### 1. 展示层级 Display

用于强视觉展示的特大标题。

- 引用 Token: \`typography.display.*\`
- **Display L**: \`typography.display.large\` - 最高级视觉标题
- **Display M**: \`typography.display.medium\` - 页面级主视觉标题
- **Display S**: \`typography.display.small\` - 区块级视觉强调标题

### 2. 标题层级 Heading

用于页面、区块或模块的标题。

- 引用 Token: \`typography.heading.*\`
- **Heading L**: \`typography.heading.large\` - 页面主标题
- **Heading M**: \`typography.heading.medium\` - 区块/模块标题
- **Heading S**: \`typography.heading.small\` - 次级标题/分组标题

### 3. 正文层级 Body

用于界面最常见的文本信息。

- 引用 Token: \`typography.body.*\`
- **Body L**: \`typography.body.large\` - 默认正文（最常用）
- **Body M**: \`typography.body.medium\` - 次要正文/信息列表

### 4. 辅助层级 Caption

用于次要说明、提示信息或元数据。

- 引用 Token: \`typography.caption.*\`
- **Caption M**: \`typography.caption.medium\` - 标准辅助信息
- **Caption S**: \`typography.caption.small\` - 最小信息单元（谨慎使用）

### 5. 链接层级 Link

专门为交互链接定义的文本样式。

- 引用 Token: \`typography.link.*\`
- **Link L**: \`typography.link.large\` - 默认链接（最常用）
- **Link M**: \`typography.link.medium\` - 次要链接/信息列表

## 使用规范 Usage Rules

### 使用原则 Principles

- **语义化调用**: 禁止手动指定字号（如 16px），必须引用对应的 Typography Token。
- **控制层级数量**: 单一页面推荐不超过 4 种字体层级组合，避免视觉噪音。
- **数字对齐**: 全局数字优先使用品牌字体 GT Walsheim 以获得更好的排版美感。

### 字体家族 Font Family

- **品牌字体**: \`GT Walsheim\` (拉丁字符、数字、品牌标识)。
- **系统字体**: CJK 环境使用各平台系统默认字体（如 \`PingFang SC\`, \`Noto Sans\`）。
- **Fallback 策略**: 详细配置请参考 \`typography.fontFamily.platform.*\` tokens。

### 响应式映射 Responsive Mapping

- **端映射机制**: 同一 Token（如 \`typography.body.large\`）在移动端与桌面端会自动映射到不同的具体数值，以适应屏幕物理尺寸差异。
- **断点定义**: 遵循 \`layout.breakpoint.*\` 定义的响应式规则。

## Token & 开发交付 Dev Handoff

### Token 命名逻辑 Naming Logic

采用 \`[Category].[Group].[Item]\` 结构：

- \`typography.body.large\`: 类别.组别.等级

### 交付对齐 Alignment

- **唯一真相源**: \`tokens.json\` 是字号、行高与字重的终极定义。
- **设计对齐**: Figma 文本样式命名需与 Token 严格匹配。
- **样式继承**: 开发应使用生成的 CSS 变量或主题配置类，不得在组件内手动重写。
`;

const spacing = `
# 间距 Spacing

间距用于定义界面元素之间的空间关系，通过建立有节奏的步进体系，确保布局的秩序感与信息层级的清晰。

## 设计目标 Design Goals

- **建立空间节奏 Visual Rhythm**: 采用统一的 8点步进体系，形成可预测的布局逻辑。
- **组织信息层级 Grouping**: 通过间距大小表达元素间的亲疏远近关系（亲密性原则）。
- **提升呼吸感 Content Breathing**: 避免内容过于拥挤，确保用户视觉焦点能够轻松移动。

## Token 体系 Token System

YAMI 的间距系统基于 \`8px\` 为基准单位进行倍率缩放。

- 引用 Token: \`spacing.*\` (如 \`spacing.100\`, \`spacing.200\`)

### 间距 Token 列表

- **spacing.0**: \`spacing.0\` - 无间距
- **spacing.025**: \`spacing.025\` - 2px，极小间距
- **spacing.050**: \`spacing.050\` - 4px，极小间距
- **spacing.100**: \`spacing.100\` - 8px，基准单位
- **spacing.150**: \`spacing.150\` - 12px
- **spacing.200**: \`spacing.200\` - 16px，标准间距
- **spacing.250**: \`spacing.250\` - 20px
- **spacing.300**: \`spacing.300\` - 24px
- **spacing.400**: \`spacing.400\` - 32px，模块间距
- **spacing.500**: \`spacing.500\` - 40px
- **spacing.600**: \`spacing.600\` - 48px
- **spacing.800**: \`spacing.800\` - 64px，大间距
- **spacing.1000**: \`spacing.1000\` - 80px，最大间距

## 使用规范 Usage Rules

### 使用原则 Principles

- **8点网格系统**: 所有间距必须遵循已定义的 \`spacing.*\` tokens，禁止自定义 px 值。
- **亲密性原则**: 逻辑相关的元素间距应较小（如 \`spacing.100\`），不同模块间距应较大（如 \`spacing.400\`）。
- **步进逻辑**: 随着容器层级的提升，间距应呈比例增加。

### 禁止用法 Prohibitions

- **禁止奇数间距**: 严禁出现非 8点倍数的间距（特殊极小场景除外）。
- **禁止硬编码**: 严禁在 CSS 中写死 \`margin: 15px\`，必须使用变量。

### 典型场景 Scenarios

- **相关性极强的内容**: 使用较小步进（如 \`spacing.100\`）
- **内部元素分组**: 使用标准步进（如 \`spacing.200\`）
- **模块之间分隔**: 使用更大步进（如 \`spacing.300\` / \`spacing.400\`）
- **页面板块间隔**: 使用更大步进（如 \`spacing.600\` / \`spacing.800\` / \`spacing.1000\`）
`;

const layout = `
# 布局 Layout

布局定义了内容在屏幕上的组织形式。YAMI 采用自适应网格系统，确保内容在从超小屏幕到 1920px 宽屏设备上的一致性。

## 设计目标 Design Goals

- **多端适配 Flexibility**: 一套栅格规则同时支持 PC、平板与移动端。
- **容器化管理 Containment**: 通过 \`maxWidth\` 约束，确保在大屏上内容不被过度拉伸。
- **对齐秩序 Alignment**: 提供统一的列（Columns）、间距（Gutter）与边距（Margin）定义。

## 栅格系统 Grid System

YAMI 的布局由以下核心要素构成：

- **最大宽度 Max Width**: 桌面端内容容器最大宽度约束为 \`layout.container.maxWidth.desktop\` (1920px)。
- **断点 Breakpoints**: 基于 \`layout.breakpoint.*\` 定义响应式行为。
- **网格配置 Grid Config**: 每个断点对应不同的 \`columns\`, \`gutter\` 与 \`margin\`。

### 断点配置 Breakpoint Configuration

- **xxs**: \`layout.breakpoint.xxs.min\` - \`layout.breakpoint.xxs.max\`，列数 \`layout.grid.xxs.columns\`
- **xs**: \`layout.breakpoint.xs.min\` - \`layout.breakpoint.xs.max\`，列数 \`layout.grid.xs.columns\`
- **s**: \`layout.breakpoint.s.min\` - \`layout.breakpoint.s.max\`，列数 \`layout.grid.s.columns\`
- **m**: \`layout.breakpoint.m.min\` - \`layout.breakpoint.m.max\`，列数 \`layout.grid.m.columns\`
- **l**: \`layout.breakpoint.l.min\` - \`layout.breakpoint.l.max\`，列数 \`layout.grid.l.columns\`
- **xl**: \`layout.breakpoint.xl.min\` - \`layout.breakpoint.xl.max\`，列数 \`layout.grid.xl.columns\`

## 使用规范 Usage Rules

### 使用原则 Principles

- **流式优先 Fluid First**: 内容区域应根据视口宽度自动伸缩，直至达到 \`maxWidth\`。
- **栅格对齐**: 所有核心组件与模块应尽量对齐至栅格列的边缘。
- **8点垂直网格**: 垂直方向的布局间距应遵循 \`spacing.*\` tokens。

### 侧栏与主区域 Sidebar & Main

- **比例划分**: 侧栏与主内容区应通过「列跨度 (Column Span)」进行划分，而非固定像素。
- **统一边距**: 侧栏外部与主内容区外部应共享相同的页面边距 (Margin)。

## Token & 开发交付 Dev Handoff

### Token 引用 Reference

- 布局变量引用 \`layout.*\` tokens。
- 断点判断引用 \`layout.breakpoint.*.min\` / \`max\`。

### 交付对齐 Alignment

- **自适应开发**: 优先使用 CSS Grid 或 Flexbox 实现基于 Token 的栅格布局。
- **1920px 适配**: 在 1920px 分辨率下，内容容器保持居中，两侧留白。
`;

const radius = `
# 圆角 Radius

圆角用于定义界面元素的形态语言，柔化边缘视觉，并建立组件间的层级关联。

## 使用规范 Usage Rules

### 使用原则 Principles

- **等级化管理**: 严格遵循 \`borderRadius.none\` 到 \`full\` 的等级，禁止自定义数值。
- **层级相关性**: 外层容器的圆角通常应大于内层元素的圆角，保持嵌套和谐。
- **语义表达**: 圆角用于表达点击感或模块感，不应过度使用导致界面杂乱。

### 圆角等级 Radius Levels

- **None**: \`borderRadius.none\` (0px) - 用于基础分区，强调结构感与对齐关系。
- **Small**: \`borderRadius.small\` (4px) - 用于标签（Tag）、提示信息框，极小圆角。
- **Medium**: \`borderRadius.medium\` (8px) - 系统默认圆角等级，适用于大多数通用组件（按钮、卡片、弹层内容区、列表项）。
- **Large**: \`borderRadius.large\` (12px) - 用于主卡片、大面积模块、核心推荐区，中等偏大的圆角。
- **Full**: \`borderRadius.full\` (999px) - 用于头像、圆形图标、胶囊按钮、状态指示点，完全圆角。

### 禁止用法 Prohibitions

- **禁止自定义圆角数值**: 同一组件族仅使用一种圆角等级。
- **禁止装饰性使用**: 圆角用于表达层级与模块关系，不用于装饰。
`;

const elevation = `
# 阴影与层级 Elevation

通过 Z 轴方向的投影与 Z-Index 建立界面的空间层级，区分内容的叠放顺序。

## 阴影级别 Elevation Levels

- **E1**: \`shadow.e1\` - 轻微阴影，用于悬浮状态
- **E2**: \`shadow.e2\` - 标准阴影，用于卡片
- **E3**: \`shadow.e3\` - 较强阴影，用于模态框
- **E4**: \`shadow.e4\` - 强烈阴影，用于弹出层
- **E5**: \`shadow.e5\` - 最强阴影，用于最顶层元素

## 层级定义 Z-Index

- **Base**: \`elevation.base\` - 基础层级
- **Elevated**: \`elevation.elevated.min\` - \`elevation.elevated.max\` - 悬浮层级
- **Modal**: \`elevation.modal.min\` - \`elevation.modal.max\` - 模态层级

## 使用规范 Usage Rules

### 使用原则 Principles

- **适度使用**: 避免过度使用阴影，保持界面简洁。
- **一致性**: 相同层级的元素使用相同的阴影。
- **功能性**: 阴影应该有助于传达层级关系，而非装饰。

### 典型场景 Scenarios

- **卡片**: 使用 \`shadow.e2\`
- **悬浮按钮**: 使用 \`shadow.e1\`
- **模态框**: 使用 \`shadow.e3\` 或 \`shadow.e4\`
- **弹出层**: 使用 \`shadow.e4\` 或 \`shadow.e5\`
`;

const iconography = `
# 图标 Iconography

图标作为辅助视觉语言，用于增强功能的识别性与界面的美感。

## 使用规范 Usage Rules

### 尺寸对齐 Size Alignment

- **标准尺寸**: \`icon.size.standard\` (24px) - 标准图标尺寸
- **小号尺寸**: \`icon.size.small\` (20px) - 小号图标
- **迷你尺寸**: \`icon.size.mini\` (16px) - 迷你图标

### 色彩引用 Color Reference

- **默认颜色**: 必须引用 \`color.text.*\` tokens（如 \`color.text.primary\`, \`color.text.secondary\`）
- **语义颜色**: 如需表达状态，使用 \`color.badge.*\` 或相关语义 Token

### 使用原则 Principles

- **语义明确**: 图标应该清晰传达其含义。
- **风格统一**: 保持图标风格的统一性。
- **尺寸合适**: 根据使用场景选择合适的尺寸。
- **可访问性**: 提供文本标签或替代文本。

### 禁止用法 Prohibitions

- **禁止硬编码尺寸**: 严禁直接使用 px 值定义图标尺寸。
- **禁止硬编码颜色**: 严禁直接使用 Hex/RGB 定义图标颜色。
`;

const button = `
# 按钮 Button

按钮是触发特定操作的核心组件。

## 按钮类型 Types

- **Primary**: 主操作，高优先级。使用 \`color.ui.primary\` 作为背景色。
- **Secondary**: 次操作，中优先级。使用边框样式，背景为透明或浅色。
- **Text**: 辅助操作，低优先级。最小视觉干扰，仅文字样式。

## 尺寸与状态 Size & States

### 尺寸 Size

- **Large**: \`button.height.large\` (48px)，水平内边距 \`button.padding.horizontal.large\`
- **Medium**: \`button.height.medium\` (40px)，水平内边距 \`button.padding.horizontal.medium\`
- **Small**: \`button.height.small\` (32px)，水平内边距 \`button.padding.horizontal.small\`
- **Mini**: \`button.height.mini\` (24px)，水平内边距 \`button.padding.horizontal.mini\`

### 圆角 Radius

- **Large**: \`button.borderRadius.large\` (8px)
- **Medium**: \`button.borderRadius.medium\` (6px)
- **Small**: \`button.borderRadius.small\` (4px)
- **Mini**: \`button.borderRadius.mini\` (4px)

### 状态 States

- **默认 (Default)**: 正常状态
- **悬停 (Hover)**: 鼠标悬停状态，背景色或边框色加深
- **激活 (Active)**: 点击状态，视觉反馈更明显
- **禁用 (Disabled)**: 禁用状态，降低透明度或使用灰色
- **加载 (Loading)**: 加载状态，显示加载指示器

## 使用规范 Usage Rules

### 使用原则 Principles

- **明确性**: 按钮文字应该清晰表达操作意图。
- **优先级**: 通过视觉样式区分操作的优先级。
- **反馈**: 提供清晰的状态反馈。
- **一致性**: 相同操作使用相同的按钮样式。

### 禁止用法 Prohibitions

- **禁止自定义尺寸**: 必须使用已定义的 \`button.height.*\` tokens。
- **禁止自定义圆角**: 必须使用已定义的 \`button.borderRadius.*\` tokens。
`;

const tabs = `
# 选项卡 Tabs

用于切换同级内容。

## 选项卡类型 Types

- **主要选项卡 (Primary Tabs)**: 用于主要内容切换，使用下划线指示器。
- **次要选项卡 (Secondary Tabs)**: 用于次要内容切换，使用背景色区分。

## 选项卡状态 States

- **选中 (Selected)**: 当前激活的选项卡，使用 \`color.ui.primary\` 作为指示器颜色。
- **未选中 (Unselected)**: 未激活的选项卡，使用 \`color.text.secondary\` 作为文字颜色。
- **禁用 (Disabled)**: 禁用的选项卡，降低透明度。

## 使用规范 Usage Rules

### 使用原则 Principles

- **数量控制**: 避免过多选项卡（建议不超过 5 个）。
- **清晰标识**: 明确标识当前选中的选项卡。
- **内容相关**: 确保选项卡内容有明确的逻辑关系。

### 禁止用法 Prohibitions

- **禁止自定义指示器样式**: 必须使用设计规范中定义的样式。
- **禁止混用类型**: 同一页面不应混用主要和次要选项卡。
`;

const badge = `
# 徽章 Badge

用于显示状态指示或数量提醒。

## 徽章类型 Types

- **数字徽章 (Number Badge)**: 显示数字，用于通知数量、购物车商品数等。
- **文本徽章 (Text Badge)**: 显示文字，用于状态标签、分类标签等。
- **点徽章 (Dot Badge)**: 仅显示圆点，用于简单的状态指示。

## 徽章样式 Styles

- **主要徽章 (Primary Badge)**: 使用 \`color.badge.primary\`，用于重要信息。
- **成功徽章 (Success Badge)**: 使用 \`color.badge.success\`，用于成功状态。
- **警告徽章 (Warning Badge)**: 使用 \`color.badge.warning\`，用于警告信息。
- **错误徽章 (Error Badge)**: 使用 \`color.badge.error\`，用于错误状态。
- **次要徽章 (Secondary Badge)**: 使用 \`color.badge.secondary\`，用于一般信息。

## 尺寸 Size

- **标准**: 高度 \`badge.size.standard.height\` (20px)，水平内边距 \`badge.size.standard.padding.horizontal\` (8px)
- **小型**: 高度 \`badge.size.small.height\` (16px)，水平内边距 \`badge.size.small.padding.horizontal\` (6px)

## 圆角 Radius

- **标准圆角**: \`badge.borderRadius\` (10px)

## 使用规范 Usage Rules

### 使用原则 Principles

- **信息价值**: 确保徽章信息有价值。
- **视觉平衡**: 避免徽章过大影响主要内容。
- **语义清晰**: 使用颜色传达正确的语义。

### 禁止用法 Prohibitions

- **禁止自定义尺寸**: 必须使用已定义的 \`badge.size.*\` tokens。
- **禁止自定义颜色**: 必须使用已定义的 \`color.badge.*\` tokens。
`;

// 商品相关组件
const productCard = `# 商品卡片 Product Card

商品卡片组件规范内容正在完善中，敬请期待。
`;

const productImageGallery = `# 商品图册 Product Image Gallery

商品图册组件规范内容正在完善中，敬请期待。
`;

const pricePromotion = `# 价格促销 Price & Promotion

价格促销组件规范内容正在完善中，敬请期待。
`;

const ratingReviews = `# 评价评分 Rating & Reviews

评价评分组件规范内容正在完善中，敬请期待。
`;

const skuSelector = `# 规格选择 SKU Selector

规格选择组件规范内容正在完善中，敬请期待。
`;

const quantitySelector = `# 数量选择 Quantity Selector

数量选择组件规范内容正在完善中，敬请期待。
`;

// 导航与筛选组件
const categoryNavigation = `# 分类导航 Category Navigation

分类导航组件规范内容正在完善中，敬请期待。
`;

const filter = `# 筛选器 Filter

筛选器组件规范内容正在完善中，敬请期待。
`;

const sort = `# 排序 Sort

排序组件规范内容正在完善中，敬请期待。
`;

const breadcrumb = `# 面包屑 Breadcrumb

面包屑组件规范内容正在完善中，敬请期待。
`;

const pagination = `# 分页 Pagination

分页组件规范内容正在完善中，敬请期待。
`;

const loadMore = `# 加载更多 Load More

加载更多组件规范内容正在完善中，敬请期待。
`;

// 购物流程组件
const addToCart = `# 加入购物车 Add to Cart

加入购物车组件规范内容正在完善中，敬请期待。
`;

const cartItem = `# 购物车项 Cart Item

购物车项组件规范内容正在完善中，敬请期待。
`;

const cartSummary = `# 购物车汇总 Cart Summary

购物车汇总组件规范内容正在完善中，敬请期待。
`;

const checkoutSteps = `# 结算步骤 Checkout Steps

结算步骤组件规范内容正在完善中，敬请期待。
`;

const addressSelector = `# 地址选择 Address Selector

地址选择组件规范内容正在完善中，敬请期待。
`;

const paymentMethodSelector = `# 支付方式 Payment Method Selector

支付方式选择组件规范内容正在完善中，敬请期待。
`;

// 反馈与状态组件
const emptyState = `# 空状态 Empty State

空状态组件规范内容正在完善中，敬请期待。
`;

const loadingSkeleton = `# 加载骨架 Loading / Skeleton

加载骨架组件规范内容正在完善中，敬请期待。
`;

const errorState = `# 错误状态 Error State

错误状态组件规范内容正在完善中，敬请期待。
`;

const toastNotification = `# 提示通知 Toast / Notification

提示通知组件规范内容正在完善中，敬请期待。
`;

const modalDialog = `# 弹窗对话框 Modal / Dialog

弹窗对话框组件规范内容正在完善中，敬请期待。
`;

const heading = `# 标题 Heading

标题组件规范内容正在完善中，敬请期待。
`;

const navbar = `# 导航栏 Navbar

导航栏组件规范内容正在完善中，敬请期待。
`;

const forms = `# 表单输入 Forms

表单输入组件规范内容正在完善中，敬请期待。
`;

const overview = `
# OVERVIEW

OVERVIEW 页面作为设计系统与研发协作的统一入口，定义设计系统的整体结构、核心原则与使用边界。

## 基础规范 Foundations

定义界面设计最基础、最常用的规则，作为组件与页面设计的基础。

### 品牌 Brand

统一产品视觉表达，建立品牌识别。

**状态**: Released  
**链接**: [查看规范 →](#brand)

### 色彩 Color

通过颜色突出品牌特征，确保视觉体验的一致性。

**状态**: Released  
**链接**: [查看规范 →](#color)

### 文本 Typography

通过字体组织内容信息层级。

**状态**: Released  
**链接**: [查看规范 →](#typography)

### 间距 Spacing

处理界面元素之间的关系，创造有节奏的页面结构。

**状态**: Released  
**链接**: [查看规范 →](#spacing)

### 布局 Layout

定义页面结构与内容分布，确保在不同设备上的稳定呈现。

**状态**: Released  
**链接**: [查看规范 →](#layout)

### 圆角 Radius

统一界面元素的形状特征，形成一致的视觉风格。

**状态**: Released  
**链接**: [查看规范 →](#radius)

### 阴影与层级 Elevation

通过层级表达空间关系，帮助用户理解结构与焦点。

**状态**: Released  
**链接**: [查看规范 →](#elevation)

### 图标 Iconography

通过图标辅助信息与操作表达。

**状态**: Released  
**链接**: [查看规范 →](#iconography)

### 动效 Motion

通过动效提供反馈，引导用户注意力，提升体验流畅度。

**状态**: Not Started  
**链接**: [查看规范 →](#motion)

## 核心组件 Core components

描述产品主要交互与信息结构的基础组件，覆盖高频使用场景，确保一致性与效率。

### 按钮 Button

核心交互组件，用于用户操作与关键动作。

**状态**: Released  
**链接**: [查看规范 →](#button)

### 选项卡 Tabs

用于在同一界面内切换内容视图。

**状态**: Review  
**链接**: [查看规范 →](#tabs)

### 徽章 Badge

辅助组件，用于快速传达产品属性、状态或关键信息。

**状态**: Released  
**链接**: [查看规范 →](#badge)

### 标题 Heading

标题组件，用于标识页面内容模块，帮助理解页面结构。

**状态**: Review  
**链接**: [查看规范 →](#heading)

### 商品卡片 Product Card

基础组件，用于展示关键产品信息及相关操作。

**状态**: Draft  
**链接**: [查看规范 →](#product-card)

### 表单输入 Forms

基础组件，用于用户信息输入与提交。

**状态**: Not Started  
**链接**: [查看规范 →](#forms)

### 筛选条件 Filter

用于在结果集中选择或限制条件，缩小范围。

**状态**: Review  
**链接**: [查看规范 →](#filter)

### 导航栏 Navbar

全局组件，用于产品的主要导航结构。

**状态**: Draft  
**链接**: [查看规范 →](#navbar)
`;

const changelog = `
# CHANGELOG

更新日志用于记录设计系统的重要变更与版本演进。

## 更细日志

只要影响已发布内容的使用方式，就必须更新更新日志。

### 必须记录的情况：

- 新增/调整/废弃设计规范或组件
- Token 结构、命名、含义变化
- 不兼容或可能影响现有设计/开发的改动
- 已发布内容的错误修复

### 不需要记录的情况：

- 仅文案或排版优化，不影响理解和使用
- 草稿或未发布内容

## 更新记录

| Version | Date | Description | Contributors |
|---------|------|-------------|--------------|
| v1.0.0 | 2025-01-07 | [新增] 完成 Core Components 首批组件规范，包括 Button、Tabs、Filter、Badge 与 Heading，用于支持基础页面结构与核心交互能力 | [@Divik](mailto:divik@example.com) |
| v1.0.0 | 2025-12-30 | [新增] 完成 Design System 基础规范 (Foundations) 首个正式版本<br/>[新增] 明确定义 Color、Typography、Spacing、Layout、Radius 等核心基础规则<br/>[新增] 建立基础 Token 结构与命名规范，用于设计与开发对齐 | [@Divik](mailto:divik@example.com) |
`;

const updateProcess = `
# UPDATE PROCESS

更新流程用于规范设计系统的演进方式，确保变更有序发生。

## 更新流程

### Step 1: 需求提出 (Requirement Proposal)

#### 触发场景

- 现有组件无法满足新业务场景
- 多个页面出现相似但不一致的UI
- 发现组件设计/交互问题

#### 提出更新

- 说明为什么要改
- 标注影响的组件与场景
- 提供设计稿或示例

### Step 2: 组件评估 (Component Evaluation)

判断是否影响现有使用。

#### 确认是

- 视觉微调
- 行为调整
- 结构变更

决定是否需要版本升级。

### Step 3: 更新发布 (Update Release)

#### 操作内容

- 更新组件 (Figma / 文档)
- 记录变更内容 (Changelog)
- 同步团队使用方式
- 如影响现有使用，说明影响范围与建议处理方式 (可选)
`;

const logo = `
# 标志 Logo

标志使用规范内容正在完善中，敬请期待。
`;

const brandColors = `
# 品牌色 Brand Colors

品牌色彩规范内容正在完善中，敬请期待。
`;

const typeface = `
# 品牌字体 Typeface

品牌字体规范内容正在完善中，敬请期待。
`;

const patternsOverview = `
# Components Overview

Components 页面描述产品主要交互与信息结构的基础组件，覆盖高频使用场景，确保一致性与效率。

## 核心组件 Core Components

### 按钮 Button

核心交互组件，用于用户操作与关键动作。

**状态**: Released  
**链接**: [查看规范 →](#button)

### 选项卡 Tabs

用于在同一界面内切换内容视图。

**状态**: Review  
**链接**: [查看规范 →](#tabs)

### 徽章 Badge

辅助组件，用于快速传达产品属性、状态或关键信息。

**状态**: Released  
**链接**: [查看规范 →](#badge)
`;

const resourcesOverview = `
# Resources Overview

资源（Resources）页面提供设计系统的相关资源和工具。

## 概述

资源页面包含设计系统的下载资源、工具链接、参考文档等。

## 内容

此部分内容正在完善中，敬请期待。
`;

export const docs: DocPage[] = [
  { id: 'overview', markdown: overview },
  { id: 'changelog', markdown: changelog },
  { id: 'update-process', markdown: updateProcess },
  { id: 'logo', markdown: logo },
  { id: 'brand-colors', markdown: brandColors },
  { id: 'typeface', markdown: typeface },
  { id: 'color', markdown: color },
  { id: 'typography', markdown: typography },
  { id: 'spacing', markdown: spacing },
  { id: 'layout', markdown: layout },
  { id: 'radius', markdown: radius },
  { id: 'elevation', markdown: elevation },
  { id: 'iconography', markdown: iconography },
  // Components
  { id: 'button', markdown: button },
  { id: 'tabs', markdown: tabs },
  { id: 'filter', markdown: filter },
  { id: 'badge', markdown: badge },
  { id: 'heading', markdown: heading },
  { id: 'navbar', markdown: navbar },
  { id: 'product-card', markdown: productCard },
  { id: 'forms', markdown: forms },
  { id: 'patterns-overview', markdown: patternsOverview },
  { id: 'resources-overview', markdown: resourcesOverview }
];
