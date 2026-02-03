# YAMI Design Guidelines (YDS) 项目分析报告

## 1. 项目概览
YAMI Design Guidelines (YDS) 是一个基于 **Next.js 14+/15+ (App Router)** 和 **React 19** 构建的专业设计规范文档系统。该项目旨在提供一个高度可定制、自动化程度高且具备全栈能力的文档展示平台，特别针对 UI/UX 设计资产的呈现优化。

## 2. 技术栈分析
| 分类 | 技术选型 | 备注 |
| :--- | :--- | :--- |
| **基础框架** | Next.js 15.1.x, React 19.x | 采用最新的 React 19 并深度利用 Server Components (RSC) |
| **编程语言** | TypeScript | 提供强类型的开发体验，特别是设计 Token 的类型化 |
| **内容管理** | Markdown / MDX + Obsidian | 原生支持 Obsidian 库同步，具备双链 ([[WikiLink]]) 渲染能力 |
| **样式系统** | Vanilla CSS + Design Tokens | 通过设计变量驱动，无 Tailwind 依赖，样式控制极度精密 |
| **自动化** | Python & MJS Scripts | 用于 Token 生成、内容同步、构建校验等 |
| **部署模式** | Static Export (SSG) | 专门为 GitHub Pages 优化的静态导出模式 |

## 3. 核心架构设计

### 3.1 目录结构
```text
/
├── app/                # Next.js App Router 核心路由
│   ├── docs/           # [[...slug]] 动态文档路由 (RSC 渲染)
│   ├── foundations/    # 基础规范聚合页（Color, Typography 等）
│   └── globals.css     # 全局样式与基础变量
├── components/         # 高度复用的 UI 组件
│   ├── AppShell.tsx    # 核心布局框架，控制侧边栏与导航状态
│   └── doc-preview/    # 专门用于设计规范演示的交互组件
├── content/            # 项目静态内容资产 (由 Obsidian 同步)
├── tokens/             # 设计系统 Single Source of Truth
│   └── tokens.json     # 全量设计变量定义
├── lib/                # 后端逻辑与工具库
│   └── content/        # Markdown 加载器、双链解析器、树状导航生成器
├── scripts/            # 自动化脚本工具套件
└── styles/             # 样式管理 (包括自动生成的 tokens.css)
```

### 3.2 核心机制
- **Single Source of Truth (SsoT)**: 所有的颜色、间距、圆角等设计变量定义在 `tokens.json`。通过 `scripts/generate-tokens.py` 自动生成 `tokens.css` 和 TypeScript 定义，确保设计与开发严格一致。
- **Obsidian 深度集成**: 项目支持将本地 Obsidian 库作为内容源。`sync-obsidian-content.mjs` 负责同步文档并维护路径映射，同时路由层支持 WikiLink 自动解析。
- **高性能渲染**: 文档内容采用 Server Components 加载。`AppShell` 使用了精细的 `IntersectionObserver` 和滚动同步技术，提供丝滑的阅读体验和侧边栏锚点高亮。
- **动态预览系统**: 文档内支持特定的 Directive 语法，可以直接在 Markdown 中插入实时渲染的 UI 组件预览块。

## 4. 关键特性
1. **多端适配**: 具备高度优化的响应式设计，桌面端侧边栏可收起，移动端提供侧滑抽屉导航。
2. **全局搜索**: 基于本地缓存和静态索引的快速搜索功能，支持全站文档检索。
3. **主题支持**: 完美匹配的深色模式，且在首帧渲染时通过 `beforeInteractive` 脚本防止闪烁。
4. **规范专用组件**: 提供 `ColorSwatch`, `RadiusScale`, `SpacingScale` 等用于展示设计规范的特化组件。
5. **构建校验**: `scripts/verify-out-css.mjs` 等脚本确保在构建阶段检查 CSS 的正确性，防止路径或样式丢失。

## 5. 项目优势
- **极致的性能**: 静态导出 (SSG) 保证了近乎瞬间的加载速度。
- **卓越的开发者体验 (DX)**: 自动化程度高，内容创作者只需在 Obsidian 写作，开发者通过生成的 TS 类型安全地引用 Token。
- **精密的设计表达**: 完全掌控的 CSS 变量系统，能极致还原设计师的意图。

---
> 本报告由 Antigravity 深度分析项目源码后生成。
