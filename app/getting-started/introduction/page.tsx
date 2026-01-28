import AppShell from '../../../components/AppShell';
import { docs } from '../../../data/docs';
import { SearchProvider } from '../../../components/SearchProvider';

export default function IntroductionPage() {
  // 创建一个临时的 introduction 文档
  const introductionDoc = {
    id: 'introduction',
    markdown: `# 入门指南 Introduction

欢迎使用 YAMI 设计系统。本指南将帮助你快速了解设计系统的基本概念和使用方法。

## 什么是设计系统？

设计系统是一套完整的设计和开发标准，包含：

- **基础规范 Foundations**: 色彩、字体、间距等核心设计元素
- **组件 Components**: 可复用的 UI 组件库
- **内容策略 Content**: 文案规范和内容创作指南
- **资源 Resources**: 设计资源、工具和下载链接

## 快速开始

### 1. 了解基础规范

从 [基础规范](/foundations) 开始，了解设计系统的核心元素。

### 2. 探索组件库

查看 [组件库](/components)，了解可用的 UI 组件。

### 3. 查看示例

浏览各个组件的使用示例和最佳实践。

## 设计原则

### 一致性 Consistency

确保所有界面元素遵循统一的设计标准。

### 可访问性 Accessibility

所有组件都遵循 WCAG AA 标准，确保良好的可访问性。

### 响应式设计 Responsive

支持从移动端到桌面端的各种屏幕尺寸。

## 下一步

- 查看 [品牌指南](/foundations/brand)
- 了解 [基础规范](/foundations)
- 探索 [组件库](/components)
`
  };

  const allDocs = [introductionDoc, ...docs];

  return (
    <SearchProvider>
      <AppShell docs={allDocs} />
    </SearchProvider>
  );
}
