export interface QuickStartCard {
  id: string;
  title: string;
  description: string;
  href: string;
  iconName: string;
}

export interface RecentUpdate {
  id: string;
  title: string;
  description: string | null;
  status: 'Released' | 'Not Started' | 'Review' | 'Draft';
  href: string;
}

export const quickStartCards: QuickStartCard[] = [
  {
    id: 'getting-started',
    title: '入门指南',
    description: '快速了解设计系统的整体结构、使用原则与协作方式',
    href: '/docs/A_快速开始/A01_介绍',
    iconName: 'ds-icon-asterisk'
  },
  {
    id: 'brand',
    title: '品牌',
    description: '统一视觉语言，确保品牌在所有触点中的一致性与识别度。',
    href: '/docs/B_品牌/品牌原则',
    iconName: 'ds-icon-brandfetch'
  },
  {
    id: 'foundations',
    title: '基础规范',
    description: '系统化定义颜色、字体、间距、布局等基础规则',
    href: '/docs/C_基础规范/颜色系统',
    iconName: 'ds-icon-paint-board'
  },
  {
    id: 'components',
    title: '组件',
    description: '可复用的 UI 组件库，覆盖常见业务场景，并提供清晰的使用规范与状态定义。',
    href: '/docs/D_组件/按钮',
    iconName: 'ds-icon-web-design-01'
  },
  {
    id: 'content',
    title: '内容策略',
    description: '指导文案、信息层级与内容结构，帮助用户更高效地理解与完成任务。',
    href: '/docs/E_内容策略/内容原则',
    iconName: 'ds-icon-book-02'
  },
  {
    id: 'resources',
    title: '资源',
    description: '设计与开发所需的工具、模板与外部资源集合。',
    href: '/docs/F_资源/Token概述',
    iconName: 'ds-icon-test-tube-01'
  }
];

export const version = 'V1.0';
