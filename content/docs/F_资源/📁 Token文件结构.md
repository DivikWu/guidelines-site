---
title: Token 文件结构
description: Design Token 的文件组织与层级结构
category: 资源
status: Draft
last_updated: 2026-01-31
---

# 📁 Token 文件结构

本文档说明 YAMI 设计系统 Design Token 的文件组织结构，便于开发团队管理和维护。

---

## 目录结构

```
tokens/
├── base/                    # 基础 Token（原始值）
│   ├── colors.json          # 调色板
│   ├── typography.json      # 字体定义
│   ├── spacing.json         # 间距值
│   ├── radius.json          # 圆角值
│   └── shadows.json         # 阴影值
│
├── semantic/                # 语义化 Token（引用基础 Token）
│   ├── colors.json          # 语义色（text, background, border...）
│   ├── typography.json      # 字体层级
│   └── components.json      # 组件级 Token
│
├── themes/                  # 主题层
│   ├── light.json           # 亮色主题
│   └── dark.json            # 暗色主题
│
└── platforms/               # 平台导出
    ├── web/
    │   ├── variables.css    # CSS 变量
    │   └── tokens.scss      # SCSS 变量
    ├── ios/
    │   └── tokens.swift     # Swift 常量
    └── android/
        └── tokens.xml       # Android 资源
```

---

## 文件层级说明

### 1. 基础层 (Base)

存储原始设计值，不引用其他 Token。

```json
// base/colors.json
{
  "red": {
    "500": { "value": "#FF0000" },
    "600": { "value": "#E00000" }
  },
  "black": {
    "87": { "value": "rgba(0,0,0,0.87)" },
    "55": { "value": "rgba(0,0,0,0.55)" }
  }
}
```

### 2. 语义层 (Semantic)

通过引用基础 Token 建立语义映射。

```json
// semantic/colors.json
{
  "brand": {
    "primary": { "value": "{red.500}" }
  },
  "ui": {
    "primary": { "value": "{red.600}" }
  },
  "text": {
    "primary": { "value": "{black.87}" },
    "secondary": { "value": "{black.55}" }
  }
}
```

### 3. 主题层 (Themes)

定义不同主题下语义 Token 的具体映射。

```json
// themes/light.json
{
  "text": {
    "primary": { "value": "{black.87}" }
  },
  "background": {
    "primary": { "value": "#FFFFFF" }
  }
}

// themes/dark.json
{
  "text": {
    "primary": { "value": "rgba(255,255,255,0.87)" }
  },
  "background": {
    "primary": { "value": "#121212" }
  }
}
```

### 4. 平台层 (Platforms)

由构建工具自动生成，供各平台消费。

---

## 各类 Token 文件内容

### colors.json（基础层）

```json
{
  "red": {
    "500": { "value": "#FF0000", "type": "color" },
    "600": { "value": "#E00000", "type": "color" }
  },
  "blue": {
    "50": { "value": "#F0F3FA", "type": "color" }
  },
  "sky": {
    "50": { "value": "#EEF6FE", "type": "color" }
  }
}
```

### typography.json（语义层）

```json
{
  "display": {
    "l": {
      "fontSize": { "value": "32px" },
      "lineHeight": { "value": "40px" },
      "fontWeight": { "value": "400" }
    },
    "m": {
      "fontSize": { "value": "28px" },
      "lineHeight": { "value": "36px" },
      "fontWeight": { "value": "400" }
    }
  },
  "heading": {
    "l": {
      "fontSize": { "value": "20px" },
      "lineHeight": { "value": "28px" },
      "fontWeight": { "value": "500" }
    }
  }
}
```

### spacing.json

```json
{
  "space": {
    "0": { "value": "0px", "type": "spacing" },
    "025": { "value": "2px", "type": "spacing" },
    "050": { "value": "4px", "type": "spacing" },
    "100": { "value": "8px", "type": "spacing" },
    "150": { "value": "12px", "type": "spacing" },
    "200": { "value": "16px", "type": "spacing" },
    "300": { "value": "24px", "type": "spacing" },
    "400": { "value": "32px", "type": "spacing" },
    "600": { "value": "48px", "type": "spacing" }
  }
}
```

### radius.json

```json
{
  "radius": {
    "none": { "value": "0px", "type": "borderRadius" },
    "small": { "value": "4px", "type": "borderRadius" },
    "medium": { "value": "8px", "type": "borderRadius" },
    "large": { "value": "12px", "type": "borderRadius" },
    "full": { "value": "999px", "type": "borderRadius" }
  }
}
```

### shadows.json

```json
{
  "elevation": {
    "100": {
      "value": "0px 1px 2px -1px rgba(0,0,0,0.04)",
      "type": "boxShadow"
    },
    "200": {
      "value": "0px 2px 4px -2px rgba(0,0,0,0.08)",
      "type": "boxShadow"
    },
    "300": {
      "value": "0px 4px 8px -4px rgba(0,0,0,0.12)",
      "type": "boxShadow"
    },
    "400": {
      "value": "0px 4px 12px -6px rgba(0,0,0,0.16)",
      "type": "boxShadow"
    },
    "500": {
      "value": "0px 8px 16px -8px rgba(0,0,0,0.24)",
      "type": "boxShadow"
    }
  }
}
```

---

## 构建工具

推荐使用 [Style Dictionary](https://amzn.github.io/style-dictionary/) 或 [Tokens Studio](https://tokens.studio/) 进行 Token 管理与多平台导出。

### 构建流程

```
Figma Variables
      ↓
  tokens/*.json（源文件）
      ↓
  Style Dictionary（构建）
      ↓
  ├── CSS Variables
  ├── SCSS Variables
  ├── Swift Constants
  └── Android Resources
```

---
