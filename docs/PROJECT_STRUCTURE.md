# 项目结构说明

本文档说明 YAMI Design Guidelines 项目的目录结构和文件组织规则。

## 目录结构

```
yds/
├── app/                    # Next.js App Router 页面与布局
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   ├── icon.png / icon.svg
│   ├── components/        # 路由级页面（/components、/components/[id]）
│   ├── content/           # /content 页面
│   ├── docs/[[...slug]]/  # 文档页（DocContent、layout、page）
│   ├── foundations/       # 基础规范页（brand、color、elevation 等）
│   ├── getting-started/   # 入门页
│   ├── overview/         # 概览页
│   └── resources/        # 资源页
│
├── components/            # 可复用组件（当前为扁平，无子目录）
│   # 布局：AppShell, Header, Sidebar, NavDrawer
│   # 文档：DocContent, OverviewContent, ColorSwatch, RadiusScale 等
│   # 首页/搜索：HomePage, HomeHero, SearchBar, SearchModal, SearchProvider 等
│
├── config/                # 站点配置
│   ├── content-icons.ts   # 内容区图标映射
│   └── navigation.ts      # 导航配置
│
├── content/               # 站点内容（Markdown，供文档页渲染）
│   └── docs/              # 按主题分类的 .md（A_快速开始、B_品牌、C_基础规范 等）
│
├── contexts/              # React 上下文
│   └── ContentTreeContext.tsx
│
├── data/                  # 静态数据与类型
│   ├── docs.ts
│   └── home.ts
│
├── hooks/                 # 自定义 Hooks
│   ├── useEventListener.ts
│   └── useIntersectionVisible.ts
│
├── lib/                   # 工具与数据处理
│   ├── content/           # 内容加载、树、导航索引、recent-updates
│   ├── search-recent-cache.ts
│   └── tokens/            # Tokens 工具与导出
│
├── styles/                # 全局样式
│   ├── tokens.css         # 设计令牌 CSS 变量（自动生成）
│   └── theme.css          # 主题变量
│
├── tokens/                # 设计令牌源与产物
│   ├── tokens.json       # 唯一真相源
│   ├── tokens.d.ts       # 类型定义（自动生成）
│   └── README.md
│
├── scripts/               # 构建与维护脚本
│   ├── check-doc-links.mjs   # 文档链接检查
│   ├── check-structure.mjs   # 结构检查
│   ├── content-mapping.json  # 内容路径映射
│   ├── fix-font-paths.js     # 构建后字体路径修复
│   ├── fix-port.sh           # 端口占用清理
│   ├── generate-tokens.py    # 生成 tokens.css / tokens.d.ts
│   └── sync-obsidian-content.mjs  # 内容同步
│
├── public/                # 静态资源
│   ├── fonts/icofont/     # 图标字体
│   └── images/            # 图片（如 logo-icon.png）
│
├── docs/                  # 项目文档（非站点内容）
│   ├── README.md          # 文档与目录规则
│   ├── PROJECT_STRUCTURE.md
│   ├── guides/ reference/ decisions/ misc/ reports/ regression/ specs/ _legacy/
│   └── 各类 .md 报告与说明
│
├── .github/               # CI 与 PR 模板
├── next.config.mjs
├── tsconfig.json
├── package.json
└── .gitignore
```

## 目录职责

### app/
Next.js App Router 的页面和布局目录。包含：
- `layout.tsx`、`page.tsx`、`globals.css`：根布局与首页
- `app/components/`：路由级页面（/components、/components/[id]），与根目录共享组件 `components/` 区分
- `app/docs/[[...slug]]/`：文档页（动态 slug）
- `app/foundations/`、`getting-started/`、`overview/`、`resources/`、`content/`：各功能页

**规则**: 只放页面和布局文件，可复用 UI 放在根目录 `components/` 下。

### components/
可复用组件目录。**当前为扁平结构，无 ui/layout/docs 子目录**。主要包含：
- 布局：AppShell、Header、Sidebar、NavDrawer
- 文档展示：DocContent、OverviewContent、ColorSwatch、RadiusScale、TypographyScale 等
- 首页与搜索：HomePage、HomeHero、SearchBar、SearchModal、SearchProvider、SearchResults 等
- 其他：BrandLogo、Icon、Tabs、Tooltip、TokenNav、TokenProvider 等

**规则**:
- 每个组件一个文件
- 组件样式使用全局 CSS 或内联；全局样式放在 `styles/`
- 若后续组件数量增多，可考虑按领域分子目录（如 layout/、doc/、home/、search/）

### config/
站点配置文件：`content-icons.ts`（内容区图标映射）、`navigation.ts`（导航配置）。

### content/ 与 docs/
- **content/**：站点展示用 Markdown 内容，由 `lib/content/` 加载并在文档页渲染；其下 `content/docs/` 按主题分类（A_快速开始、B_品牌、C_基础规范 等）。
- **docs/**：项目文档（开发/部署/报告/规范），与运行时代码无直接引用；含 guides/、reference/、decisions/、misc/、reports/、regression/、specs/、_legacy/ 等子目录。详见 `docs/README.md`。

### lib/
工具函数和数据处理逻辑。
- `lib/content/`: 内容加载、树结构、导航索引、recent-updates（constants、loaders、tree、nav-index 等）
- `lib/tokens/`: Tokens 相关工具与类型导出
- `lib/search-recent-cache.ts`: 搜索最近记录缓存

**规则**: 
- 只放可复用的工具函数与数据层逻辑
- 避免在 lib 中直接依赖 UI 组件

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
- `fonts/icofont/`: 图标字体（icofont.css、woff2/woff/ttf）
- `images/`: 图片资源（如 logo-icon.png）
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
- 当前：可复用组件放在根目录 `components/` 下（扁平，与现有文件同级）
- 若后续组件增多，可考虑在 `components/` 下建子目录（如 layout/、doc/、home/、search/）并同步更新 import 与 tsconfig

### 新增工具函数
- 可复用工具 → `lib/`
- 内容相关 → `lib/content/`
- Tokens 相关 → `lib/tokens/`

### 新增样式
- 全局样式 → `styles/`
- 组件样式 → 使用全局 CSS 或内联样式

### 新增静态资源
- 字体 → `public/fonts/`
- 图片 → `public/images/`

### 新增脚本
- 构建/生成脚本 → `scripts/`
- 在 `package.json` 中定义命令

## 路径别名

项目在 `tsconfig.json` 中配置了以下路径别名：
- `@/*` → 项目根目录（`@/hooks`、`@/data`、`@/contexts` 等均通过此解析）
- `@/components/*` → `components/`
- `@/lib/*` → `lib/`
- `@/styles/*` → `styles/`
- `@/tokens/*` → `tokens/`
- `@/config/*` → `config/`

使用示例：
```typescript
import { designTokens } from '@/lib/tokens';
import { navigation } from '@/config/navigation';
import { useEventListener } from '@/hooks/useEventListener';
```

## 注意事项

1. **禁止在根目录新增业务文件**（除配置文件、README 等）
2. **Tokens 文件只能出现在 `tokens/` 和 `styles/` 目录**
3. **每次重构后必须运行 `npm run build` 验证**
4. **所有路径引用必须使用相对路径或路径别名**
