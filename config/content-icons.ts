/**
 * Section id (content folder name) → iconfont 类名，与首页 quickStartCards 一致。
 * 未配置的一级导航使用默认图标 ds-icon-folder-02（&#xe628;）。
 */
export const contentSectionIcons: Record<string, string> = {
  "A_快速开始": "ds-icon-asterisk",
  "B_品牌": "ds-icon-brandfetch",
  "C_基础规范": "ds-icon-paint-board",
  "D_组件": "ds-icon-web-design-01",
  "E_内容策略": "ds-icon-book-02",
  "F_资源": "ds-icon-test-tube-01",
};

const DEFAULT_SECTION_ICON = "ds-icon-folder-02";

export function getSectionIcon(sectionId: string): string {
  return contentSectionIcons[sectionId] ?? DEFAULT_SECTION_ICON;
}
