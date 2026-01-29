# Logo 动画触发原因详细分析

## 问题现象

切换 IconNav tab（category 变化）时，logo 动画依旧会触发。

## 根本原因

### 1. Header 组件不必要的重新渲染

当 `category` 变化时，`AppShell` 重新渲染，导致传递给 `Header` 的某些 props 引用变化：

**不稳定的 props：**
- `onToggleSidebar={() => setMobileOpen(v => !v)}` - 内联箭头函数，每次渲染都创建新引用
- `handleSearchSelect` - 普通函数，每次渲染都创建新引用
- `docs` - 可能稳定，取决于父组件

即使 `onToggleDesktopSidebar` 已经通过 `useMemo` 稳定，但其他 props 的变化会导致 Header 重新渲染。

### 2. CSS 过渡在重新渲染时被重新触发

**问题机制：**

1. Header 重新渲染时，React 会重新计算 className：
   ```tsx
   className={`header__sidebar-button-wrapper ${showButton ? 'header__sidebar-button-wrapper--visible' : ''}`}
   ```

2. 即使 `showButton` 没变，React 会重新应用这个 className 到 DOM 元素

3. 浏览器检测到 className 的重新应用，会重新计算样式

4. CSS 过渡 `transition: width 0.4s` 和 `transition: transform 0.4s` 是**始终启用**的

5. 即使样式值相同，浏览器可能会重新开始过渡动画

**CSS 定义：**
```css
.header__sidebar-button-wrapper {
  transition: min-width 0.4s, width 0.4s; /* 始终启用 */
}

.header__brand {
  transition: transform 0.4s; /* 始终启用 */
}
```

### 3. 动画触发路径

```
category 变化
  ↓
AppShell 重新渲染
  ↓
不稳定的 props 创建新引用（onToggleSidebar, handleSearchSelect）
  ↓
Header 重新渲染（即使 onToggleDesktopSidebar 稳定）
  ↓
className 字符串重新计算和应用
  ↓
浏览器重新计算样式
  ↓
CSS 过渡被重新触发（即使值没变）
  ↓
Logo 动画显示
```

## 解决方案

### 方案 1：使用 React.memo 防止不必要的重新渲染（推荐）

使用 `React.memo` 包装 Header 组件，只在 props 真正变化时重新渲染。

### 方案 2：稳定所有 props 引用

- 使用 `useCallback` 稳定 `onToggleSidebar`
- 使用 `useCallback` 稳定 `handleSearchSelect`

### 方案 3：使用 CSS 变量控制过渡

通过 CSS 变量动态控制过渡属性，默认禁用过渡，只在需要动画时启用。

### 推荐实施方案

**结合方案 1、2、3：**

1. 使用 `React.memo` 包装 Header
2. 使用 `useCallback` 稳定所有函数 props
3. 使用 CSS 变量控制过渡，默认禁用

## 修改文件

- `components/AppShell.tsx` - 使用 useCallback 稳定函数 props
- `components/Header.tsx` - 使用 React.memo 包装，添加过渡控制
- `app/globals.css` - 使用 CSS 变量控制过渡属性
