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
  description: string;
  status: 'Released' | 'Not Started' | 'Review' | 'Draft';
  href: string;
}

export const quickStartCards: QuickStartCard[] = [
  {
    id: 'getting-started',
    title: '入门指南',
    description: '快速了解设计系统的整体结构、使用原则与协作方式',
    href: '/getting-started/introduction',
    iconName: 'ds-icon-asterisk'
  },
  {
    id: 'brand',
    title: '品牌',
    description: '统一视觉语言，确保品牌在所有触点中的一致性与识别度。',
    href: '/foundations/brand',
    iconName: 'ds-icon-brandfetch'
  },
  {
    id: 'foundations',
    title: '基础规范',
    description: '系统化定义颜色、字体、间距、布局等基础规则',
    href: '/foundations',
    iconName: 'ds-icon-paint-board'
  },
  {
    id: 'components',
    title: '组件',
    description: '可复用的 UI 组件库，覆盖常见业务场景，并提供清晰的使用规范与状态定义。',
    href: '/components',
    iconName: 'ds-icon-web-design-01'
  },
  {
    id: 'content',
    title: '内容策略',
    description: '指导文案、信息层级与内容结构，帮助用户更高效地理解与完成任务。',
    href: '/content',
    iconName: 'ds-icon-book-02'
  },
  {
    id: 'resources',
    title: '资源',
    description: '设计与开发所需的工具、模板与外部资源集合。',
    href: '/resources',
    iconName: 'ds-icon-test-tube-01'
  }
];

export const recentUpdates: RecentUpdate[] = [
  {
    id: 'brand',
    title: '品牌 Brand',
    description: '品牌用于统一产品中的视觉表达，确保品牌体验的一致性与识别度。',
    status: 'Released',
    href: '/foundations/brand'
  },
  {
    id: 'color',
    title: '色彩 Color',
    description: '色彩用于凸显品牌特征，并建立跨页面与跨应用的一致视觉体验。',
    status: 'Released',
    href: '/foundations/color'
  },
  {
    id: 'typography',
    title: '文本 Typography',
    description: '文本用于组织内容的信息层级，确保在不同页面与设备中的一致呈现。',
    status: 'Released',
    href: '/foundations/typography'
  },
  {
    id: 'spacing',
    title: '间距 Spacing',
    description: '间距用于组织界面元素之间的关系，帮助建立有节奏的页面结构。',
    status: 'Released',
    href: '/foundations/spacing'
  },
  {
    id: 'layout',
    title: '布局 Layout',
    description: '布局用于定义页面结构与内容分布，确保不同设备下的稳定呈现。',
    status: 'Released',
    href: '/foundations/layout'
  },
  {
    id: 'iconography',
    title: '图标 Iconography',
    description: '图标用于辅助信息与操作的表达，提升界面的识别效率。',
    status: 'Released',
    href: '/foundations/iconography'
  },
  {
    id: 'radius',
    title: '圆角 Radius',
    description: '圆角用于统一界面元素的形态特征，形成一致的视觉风格。',
    status: 'Released',
    href: '/foundations/radius'
  },
  {
    id: 'elevation',
    title: '阴影与层级 Elevation',
    description: '层级用于表达界面元素之间的空间关系，帮助用户理解结构与重点。',
    status: 'Released',
    href: '/foundations/elevation'
  },
  {
    id: 'motion',
    title: '动效 Motion',
    description: '动效用于反馈状态变化与引导用户注意力，增强体验的连贯感。',
    status: 'Not Started',
    href: '/foundations/motion'
  }
];

export const version = 'V1.0';
