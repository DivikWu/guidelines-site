import AppShell from '../../components/AppShell';

export default function ContentPage() {
  // 创建内容策略的占位文档
  const contentDoc = {
    id: 'content',
    markdown: `# 内容策略 Content Strategy

内容策略页面提供文案规范和内容创作指南。

## 概述

内容策略是设计系统的重要组成部分，确保所有文案和内容都遵循统一的规范和最佳实践。

## 内容正在完善中

此部分内容正在完善中，敬请期待。

## 相关资源

- [基础规范](/foundations)
- [组件库](/components)
- [资源](/resources)
`
  };

  return (
    <AppShell docs={[contentDoc]} />
  );
}
