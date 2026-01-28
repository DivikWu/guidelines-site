// 统一的二级导航配置
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  group?: string; // 可选的分组
}

export interface SectionConfig {
  id: string;
  label: string;
  iconClass: string; // iconfont 类名
  items: NavItem[];
  defaultItem?: string; // 默认选中的第一个item
}

// 所有section的配置
export const navigationConfig: SectionConfig[] = [
  {
    id: 'home',
    label: 'Home',
    iconClass: 'ds-icon-home',
    items: [
      { id: 'home', label: '首页 Home', icon: '🏠' }
    ],
    defaultItem: 'home'
  },
  {
    id: 'getting-started',
    label: '入门指南',
    iconClass: 'ds-icon-asterisk',
    items: [
      { id: 'introduction', label: '介绍 Introduction', icon: '📋' }
    ],
    defaultItem: 'introduction'
  },
  {
    id: 'brand',
    label: '品牌',
    iconClass: 'ds-icon-brandfetch',
    items: [
      { id: 'logo', label: '标志 Logo', icon: '🖼️' },
      { id: 'brand-colors', label: '品牌色 Brand Colors', icon: '🎨' },
      { id: 'typeface', label: '品牌字体 Typeface', icon: '✍️' }
    ],
    defaultItem: 'logo'
  },
  {
    id: 'foundations',
    label: '基础规范',
    iconClass: 'ds-icon-paint-board',
    items: [
      { id: 'color', label: '色彩 Color', icon: '🎨' },
      { id: 'typography', label: '文本 Typography', icon: '✍️' },
      { id: 'spacing', label: '间距 Spacing', icon: '📏' },
      { id: 'layout', label: '布局 Layout', icon: '📐' },
      { id: 'radius', label: '圆角 Radius', icon: '⚪' },
      { id: 'elevation', label: '阴影与层级 Elevation', icon: '📊' },
      { id: 'iconography', label: '图标 Iconography', icon: '🎯' },
      { id: 'motion', label: '动效 Motion', icon: '🎬' }
    ],
    defaultItem: 'color'
  },
  {
    id: 'components',
    label: '组件',
    iconClass: 'ds-icon-web-design-01',
    items: [
      { id: 'button', label: '按钮 Button', icon: '🔘' },
      { id: 'tabs', label: '选项卡 Tabs', icon: '📑' },
      { id: 'filter', label: '筛选器 Filter', icon: '🔍' },
      { id: 'badge', label: '徽章 Badge', icon: '🏷️' },
      { id: 'heading', label: '标题 Heading', icon: '📝' },
      { id: 'navbar', label: '导航栏 Navbar', icon: '🧭' },
      { id: 'product-card', label: '商品卡片 Product Card', icon: '🛍️' },
      { id: 'forms', label: '表单输入 Forms', icon: '📋' }
    ],
    defaultItem: 'button'
  },
  {
    id: 'content',
    label: '内容策略',
    iconClass: 'ds-icon-book-02',
    items: [
      { id: 'content-overview', label: '概述 Overview', icon: '📋' }
    ],
    defaultItem: 'content-overview'
  },
  {
    id: 'resources',
    label: '资源',
    iconClass: 'ds-icon-test-tube-01',
    items: [
      { id: 'resources-overview', label: '概述 Overview', icon: '📋' }
    ],
    defaultItem: 'resources-overview'
  }
];

// 根据section id获取配置
export function getSectionConfig(sectionId: string): SectionConfig | undefined {
  return navigationConfig.find(section => section.id === sectionId);
}

// 获取所有section的id列表
export function getAllSectionIds(): string[] {
  return navigationConfig.map(section => section.id);
}

// 获取某个section的所有item ids
export function getSectionItemIds(sectionId: string): string[] {
  const config = getSectionConfig(sectionId);
  return config?.items.map(item => item.id) || [];
}

// 根据item id找到所属的section
export function findSectionByItemId(itemId: string): string | undefined {
  for (const section of navigationConfig) {
    if (section.items.some(item => item.id === itemId)) {
      return section.id;
    }
  }
  return undefined;
}
