import AppShell from '../../components/AppShell';
import { docs } from '../../data/docs';

export default function ResourcesPage() {
  // 过滤出 Resources 相关的文档
  const resourcesDocs = docs.filter(doc => 
    doc.id === 'resources-overview'
  );

  // 如果没有找到，创建一个占位文档
  if (resourcesDocs.length === 0) {
    const placeholderDoc = {
      id: 'resources',
      markdown: `# 资源 Resources

资源页面提供设计系统的相关资源和工具。

## 概述

资源页面包含设计系统的下载资源、工具链接、参考文档等。

## 内容

此部分内容正在完善中，敬请期待。

## 相关链接

- [基础规范](/foundations)
- [组件库](/components)
- [内容策略](/content)
`
    };
    return (
      <AppShell docs={[placeholderDoc]} />
    );
  }

  return (
    <AppShell docs={resourcesDocs} />
  );
}
