import AppShell from '../../../components/AppShell';
import { docs } from '../../../data/docs';
import { SearchProvider } from '../../../components/SearchProvider';

export default function MotionPage() {
  // Motion 文档可能不存在，创建一个占位文档
  const motionDoc = docs.find(doc => doc.id === 'motion');
  const docsToShow = motionDoc ? [motionDoc] : [{
    id: 'motion',
    markdown: `# 动效 Motion

通过动效提供反馈，引导用户注意力，提升体验流畅度。

## 概述

动效是设计系统的重要组成部分，用于增强用户体验和界面交互。

## 状态

**状态**: Not Started

此部分内容正在完善中，敬请期待。
`
  }];

  return (
    <SearchProvider>
      <AppShell docs={docsToShow} />
    </SearchProvider>
  );
}
