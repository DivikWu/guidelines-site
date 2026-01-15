# YAMI Design Tokens 使用说明

本文档说明如何使用 YAMI 设计令牌文件。

## 文件说明

### 1. `tokens.json`
JSON 格式的设计令牌文件，包含所有设计决策的原子值。适用于：
- 设计工具导入（Figma、Sketch 等）
- 设计令牌转换工具（Style Dictionary、Theo 等）
- 跨平台设计系统同步

### 2. `tokens.d.ts`
TypeScript 类型定义文件，提供完整的类型支持。适用于：
- TypeScript/JavaScript 项目
- 代码自动补全和类型检查
- IDE 智能提示
  
说明：该文件由 `tokens.json` 自动生成，请勿手工编辑。

### 3. `tokens.css`
CSS 变量文件，可直接在 CSS 中使用。适用于：
- Web 项目（React、Vue、Angular 等）
- 原生 CSS 项目
- 样式预处理器（Sass、Less 等）
  
说明：该文件由 `tokens.json` 自动生成，请勿手工编辑。

## 生成与更新（推荐）

当你更新 `tokens.json` 后，请运行以下命令同步生成 `tokens.css` 与 `tokens.d.ts`：

```bash
python3 generate-tokens.py
```

## 使用方法

### JSON 格式使用

```javascript
import tokens from './tokens.json';

// 使用颜色
const primaryColor = tokens.color.ui.primary.value;

// 使用间距
const spacing = tokens.spacing["200"].value;

// 使用字体大小
const fontSize = tokens.typography.heading.large.fontSize.desktop.value;
```

### TypeScript 使用

```typescript
import type { DesignTokens } from './tokens.d.ts';
import tokens from './tokens.json';

const designTokens: DesignTokens = tokens;

// 类型安全的访问
const buttonHeight = designTokens.button.height.large.value;
```

### CSS 变量使用

```css
/* 引入 tokens.css */
@import './tokens.css';

/* 使用变量 */
.button {
  background-color: var(--yami-color-ui-primary);
  padding: var(--yami-spacing-200);
  border-radius: var(--yami-button-border-radius-medium);
  height: var(--yami-button-height-medium);
}

.card {
  background-color: var(--yami-color-surface-light);
  border-radius: var(--yami-border-radius-medium);
  box-shadow: var(--yami-shadow-e2);
}
```

### React 中使用

```tsx
import './tokens.css';

function Button() {
  return (
    <button
      style={{
        backgroundColor: 'var(--yami-color-ui-primary)',
        height: 'var(--yami-button-height-medium)',
        padding: `0 var(--yami-button-padding-horizontal-medium)`,
        borderRadius: 'var(--yami-button-border-radius-medium)',
      }}
    >
      按钮
    </button>
  );
}
```

### 主题切换

```css
/* 浅色主题（默认） */
:root {
  --yami-color-background: var(--yami-color-background-light);
  --yami-color-text-primary: var(--yami-color-text-primary-light);
}

/* 深色主题 */
[data-theme="dark"] {
  --yami-color-background: var(--yami-color-background-dark);
  --yami-color-text-primary: var(--yami-color-text-primary-dark);
}
```

```javascript
// 切换主题
document.documentElement.setAttribute('data-theme', 'dark');
```

## 令牌结构

### 色彩 (Color)
- `brand.primary`: 品牌主色
- `ui.primary`: UI 主色
- `background`: 背景色（支持浅色/深色主题）
- `surface`: 表面色（支持浅色/深色主题）
- `text`: 文本色（主要/次要/辅助，支持主题）
- `border`: 边框色（支持主题）
- `badge`: 徽章色（主要/次要/成功/警告/错误）
- `overlay`: 遮罩色（支持主题）
- `campaign`: 营销色

### 字体 (Typography)
- `fontFamily`: 字体族（品牌/多语言/平台字体栈）
- `display` / `heading` / `body` / `caption` / `link`: 字体层级
  - 每个层级包含：`fontSize`（mobile/tablet/desktop）、`lineHeight`（mobile/tablet/desktop）、`fontWeight`

### 间距 (Spacing)
间距以 `spacing.100` 作为基准单位，每个 token 的命名表达其相对于基础单位的倍数关系。

- `0`, `025`, `050`, `100`, `150`, `200`, `250`, `300`, `400`, `500`, `600`, `800`, `1000`

### 布局 (Layout)
- `container.maxWidth`: 容器最大宽度
- `grid`: 网格系统，包含各断点的列数、间距和边距配置
  - 断点：`xxs`, `xs`, `s`, `m`, `l`, `xl`
  - 每个断点包含：`columns`（列数）、`gutter`（列间距）、`margin`（页面边距）
- `breakpoint`: 响应式断点定义，包含各断点的最小值和最大值

### 圆角 (Border Radius)
- `none`: 无圆角，强调结构感与对齐关系
- `small`: 极小圆角，对边缘进行轻微柔化
- `medium`: 系统默认圆角等级，适用于大多数通用组件
- `large`: 中等偏大的圆角，强化模块感与视觉聚焦
- `full`: 完全圆角，用于形成圆形或胶囊形态

### 阴影 (Shadow)
- `e1`: 轻微阴影
- `e2`: 标准阴影
- `e3`: 较强阴影
- `e4`: 强烈阴影
- `e5`: 最强阴影

### 按钮 (Button)
- `height`: 高度（大/标准/小/迷你）
- `padding.horizontal`: 水平内边距
- `borderRadius`: 圆角

### 图标 (Icon)
- `size`: 尺寸（标准/小/迷你）

### 徽章 (Badge)
- `size`: 尺寸（标准/小）
- `borderRadius`: 圆角

### 层级 (Z-Index)
- `base`: 0
- `dropdown`: 1000
- `sticky`: 1020
- `fixed`: 1030
- `modalBackdrop`: 1040
- `modal`: 1050
- `popover`: 1060
- `tooltip`: 1070

### 动画 (Animation)
- `duration`: 时长（快速/标准/慢速）
- `easing`: 缓动函数（缓入/缓出/缓入缓出）

## 更新说明

当设计规范更新时，请同步更新所有令牌文件以保持一致性。

## 版本

当前版本: v1.0.0

## 参考

- [YAMI UI/UX 设计规范](./YAMI-UI-UX-设计规范.md)
- [Figma 设计文件](https://www.figma.com/design/6oOAy72DBff4P6NzJYc2hi/)
