---
title: Layout Tokens
title_en: Layout Tokens
description: 布局系统 - 断点与栅格规范
category: Tokens
status: Draft
last_updated: 2026-02-05
---

# 📐 Layout Tokens

> [!TIP]
> 布局系统定义了响应式设计的断点与栅格规范,确保界面在不同设备上的一致性。

---

## 1. 断点系统 (Breakpoints)

| 断点 | 值 | 设备类型 |
|------|------|----------|
| `xs` | 0px | 小屏手机 |
| `sm` | 640px | 大屏手机 |
| `md` | 768px | 平板 |
| `lg` | 1024px | 小屏笔记本 |
| `xl` | 1280px | 桌面显示器 |
| `2xl` | 1536px | 大屏显示器 |

### 断点使用场景

| 断点范围 | 典型设备 | 推荐布局 |
|---------|---------|---------|
| **0 ~ 640px** | iPhone SE, iPhone 12/13 | 单列布局 |
| **640px ~ 768px** | iPhone 14 Pro Max, 小平板 | 单列或双列 |
| **768px ~ 1024px** | iPad, Android 平板 | 双列或三列 |
| **1024px ~ 1280px** | 13" 笔记本 | 三列或四列 |
| **1280px ~ 1536px** | 15" 笔记本, 24" 显示器 | 四列或更多 |
| **1536px+** | 27" 显示器, 4K 屏幕 | 多列布局 |

---

## 2. 栅格系统 (Grid System)

| 设备类型 | 外边距 (Margin) | 列数 (Columns) | 间距 (Gutter) |
|----------|----------------|----------------|---------------|
| **Mobile** | 16px | 4 | 16px |
| **Tablet** | 32px | 8 | 24px |
| **Desktop** | 80px | 12 | 24px |
| **Desktop L** | 80px | 12 | 32px |

### 栅格参数说明

- **外边距 (Margin)**: 页面内容与屏幕边缘的距离
- **列数 (Columns)**: 页面水平方向的栅格列数
- **间距 (Gutter)**: 栅格列之间的间隔

---

## 3. 容器宽度 (Container Width)

| 断点 | 最大容器宽度 | 说明 |
|------|-------------|------|
| `xs` | 100% | 全宽 |
| `sm` | 640px | 限制最大宽度 |
| `md` | 768px | 平板最大宽度 |
| `lg` | 1024px | 小屏笔记本 |
| `xl` | 1280px | 标准桌面 |
| `2xl` | 1536px | 大屏显示器 |

### 容器类型

**Full Width Container**: 内容占满整个视口宽度
```css
.container-full {
  width: 100%;
  padding: 0 var(--spacing-200);
}
```

**Fixed Width Container**: 内容限制在最大宽度内
```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--spacing-400);
}
```

---

## 4. 响应式布局模式

### 流式布局 (Fluid Layout)

适用于内容密集型页面,如文章、博客:

```css
.article {
  max-width: 768px; /* md 断点 */
  margin: 0 auto;
  padding: 0 var(--spacing-200);
}
```

### 栅格布局 (Grid Layout)

适用于卡片列表、产品展示:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-300);
}
```

### 侧边栏布局 (Sidebar Layout)

适用于后台管理、文档网站:

```css
.layout {
  display: grid;
  grid-template-columns: 240px 1fr; /* 固定侧边栏 + 自适应内容 */
  gap: var(--spacing-400);
}

@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr; /* 移动端单列 */
  }
}
```

---

## 5. 媒体查询示例

### Mobile First 方法

```css
/* 默认样式(Mobile) */
.component {
  padding: var(--spacing-200);
}

/* Tablet */
@media (min-width: 768px) {
  .component {
    padding: var(--spacing-300);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .component {
    padding: var(--spacing-400);
  }
}
```

### Desktop First 方法

```css
/* 默认样式(Desktop) */
.component {
  padding: var(--spacing-400);
}

/* Tablet */
@media (max-width: 1024px) {
  .component {
    padding: var(--spacing-300);
  }
}

/* Mobile */
@media (max-width: 768px) {
  .component {
    padding: var(--spacing-200);
  }
}
```

---

## 使用原则

### ✅ 推荐做法

- 优先使用 **Mobile First** 方法,从小屏向大屏扩展
- 使用 Token 定义的断点值,而非自定义断点
- 保持栅格间距与 Spacing Tokens 的一致性

### ❌ 避免做法

- 硬编码断点值(如 `@media (max-width: 800px)`)
- 在不同页面使用不同的栅格系统
- 忽略移动端优化

---

## 相关文档

- [📋 Token 概述](📋%20Token概述) - Token 概念与使用指南
- [📏 Spacing Tokens](📏%20Spacing%20Tokens.md) - 间距系统(与栅格配合使用)
- [📋 Token 概述](📋%20Token概述.md) - Token 概念与架构
