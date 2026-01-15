# 项目结构说明

本文档说明 YAMI Design Guidelines 项目的目录结构和文件组织规则。

## 目录结构

```
yds/
├── app/                    # Next.js App Router 页面与布局
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局组件
│   └── page.tsx           # 首页
│
├── components/            # 可复用组件
│   ├── ui/               # UI 基础组件（按钮、输入框等）
│   ├── layout/            # 布局组件（Header、Sidebar、Nav 等）
│   └── docs/             # 文档相关组件（DocContent、OverviewContent 等）
│
├── config/               # 站点配置
│   └── navigation.ts     # 导航配置
│
├── lib/                  # 工具函数与数据处理
│   └── tokens/           # Tokens 相关工具
│       └── index.ts      # Tokens 统一导出入口
│
├── styles/               # 全局样式文件
│   ├── tokens.css        # 设计令牌 CSS 变量（自动生成）
│   └── theme.css         # 主题变量（基于 tokens 生成）
│
├── tokens/               # Tokens 相关源文件/产物/说明
│   ├── tokens.json       # 设计令牌源文件（唯一真相源）
│   ├── tokens.d.ts       # TypeScript 类型定义（自动生成）
│   └── README.md         # Tokens 使用说明
│
├── scripts/              # 脚本文件
│   ├── generate-tokens.py  # 生成 tokens.css 和 tokens.d.ts
│   └── fix-font-paths.js   # 修复字体路径脚本
│
├── public/               # 静态资源
│   ├── fonts/            # 字体文件
│   │   └── icofont/      # 图标字体
│   ├── icons/            # 图标文件（SVG、PNG 等）
│   └── images/          # 图片资源
│
├── data/                 # 数据文件
│   └── docs.ts           # 文档内容数据
│
├── docs/                 # 项目文档
│   └── PROJECT_STRUCTURE.md  # 本文件
│
├── .cursor/              # Cursor IDE 配置
│   └── rules/            # 项目规则
│       └── project-structure.md  # 项目结构规则
│
├── next.config.mjs       # Next.js 配置
├── tsconfig.json         # TypeScript 配置
├── package.json          # 项目依赖
└── .gitignore           # Git 忽略规则
```

## 目录职责

### app/
Next.js App Router 的页面和布局目录。包含：
- `layout.tsx`: 根布局，引入全局样式和提供者
- `page.tsx`: 首页组件
- `globals.css`: 全局样式定义

**规则**: 只放页面和布局文件，业务逻辑组件应放在 `components/` 下。

### components/
可复用组件目录。建议按功能分类：
- `ui/`: 基础 UI 组件（按钮、输入框、卡片等）
- `layout/`: 布局相关组件（Header、Sidebar、NavDrawer 等）
- `docs/`: 文档展示组件（DocContent、OverviewContent、ColorSwatch 等）

**规则**: 
- 每个组件一个文件
- 组件样式尽量使用 CSS Modules 或内联样式
- 全局样式放在 `styles/` 目录

### config/
站点配置文件，如导航配置、国际化配置等。

### lib/
工具函数和数据处理逻辑。
- `lib/tokens/`: Tokens 相关的工具函数和类型导出

**规则**: 
- 只放可复用的工具函数
- 避免业务逻辑，保持纯函数特性

### styles/
全局样式文件。
- `tokens.css`: 由 `tokens.json` 自动生成的 CSS 变量
- `theme.css`: 基于 tokens 的主题变量

**规则**:
- 只放全局 CSS 文件
- 组件样式尽量就近（CSS Modules 或内联）
- 不要在此目录创建组件特定样式

### tokens/
设计令牌相关文件。
- `tokens.json`: **唯一真相源**，所有设计值的定义
- `tokens.d.ts`: TypeScript 类型定义（自动生成）
- `tokens.css`: CSS 变量（自动生成，实际在 `styles/` 目录）

**规则**:
- 只修改 `tokens.json`
- 运行 `python3 scripts/generate-tokens.py` 生成其他文件
- 不要手动编辑自动生成的文件

### scripts/
脚本文件，用于构建、生成、修复等任务。

**规则**:
- 所有生成任务应在 `package.json` 的 `scripts` 中定义
- 脚本应可独立运行，不依赖特定环境

### public/
静态资源目录，Next.js 会直接提供这些文件。

**规则**:
- `fonts/`: 字体文件
- `icons/`: 图标文件（SVG、PNG 等）
- `images/`: 图片资源
- 禁止在此目录放置 TypeScript/TSX/Markdown 等业务文件

## Tokens 更新流程

1. **编辑源文件**: 修改 `tokens/tokens.json`
2. **生成产物**: 运行 `python3 scripts/generate-tokens.py`
3. **产物位置**:
   - `styles/tokens.css` - CSS 变量
   - `tokens/tokens.d.ts` - TypeScript 类型
4. **使用方式**:
   - CSS: `@import '../styles/tokens.css'` 或直接使用 CSS 变量
   - TypeScript: `import { designTokens } from '@/lib/tokens'` 或 `import tokens from '@/tokens/tokens.json'`

## 新增文件规则

### 新增组件
- UI 基础组件 → `components/ui/`
- 布局组件 → `components/layout/`
- 文档组件 → `components/docs/`

### 新增工具函数
- 可复用工具 → `lib/`
- Tokens 相关 → `lib/tokens/`

### 新增样式
- 全局样式 → `styles/`
- 组件样式 → 使用 CSS Modules 或内联样式

### 新增静态资源
- 字体 → `public/fonts/`
- 图标 → `public/icons/`
- 图片 → `public/images/`

### 新增脚本
- 构建/生成脚本 → `scripts/`
- 在 `package.json` 中定义命令

## 路径别名

项目配置了以下路径别名（在 `tsconfig.json` 中）：
- `@/*` → 项目根目录
- `@/components/*` → `components/`
- `@/lib/*` → `lib/`
- `@/styles/*` → `styles/`
- `@/tokens/*` → `tokens/`
- `@/config/*` → `config/`

使用示例：
```typescript
import { designTokens } from '@/lib/tokens';
import { navigation } from '@/config/navigation';
```

## 注意事项

1. **禁止在根目录新增业务文件**（除配置文件、README 等）
2. **Tokens 文件只能出现在 `tokens/` 和 `styles/` 目录**
3. **每次重构后必须运行 `npm run build` 验证**
4. **所有路径引用必须使用相对路径或路径别名**
