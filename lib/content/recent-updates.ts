import { getDocTitleAndDescriptionAsync } from "./loaders";

export interface RecentUpdate {
  id: string;
  title: string;
  description: string | null;
  status: "Released" | "Not Started" | "Review" | "Draft";
  href: string;
}

/** 最近更新条目配置：id、状态、链接与内容路径，title/description 从文档 H1+首段解析 */
const recentUpdatesMeta: {
  id: string;
  status: RecentUpdate["status"];
  href: string;
  contentPath: string;
}[] = [
  { id: "brand", status: "Released", href: "/docs/B_品牌/品牌原则", contentPath: "docs/B_品牌/📋 品牌原则.md" },
  { id: "color", status: "Released", href: "/docs/C_基础规范/颜色系统", contentPath: "docs/C_基础规范/🎨 颜色系统.md" },
  { id: "typography", status: "Released", href: "/docs/C_基础规范/字体排版", contentPath: "docs/C_基础规范/🔤 字体排版.md" },
  { id: "spacing", status: "Released", href: "/docs/C_基础规范/间距", contentPath: "docs/C_基础规范/📏 间距.md" },
  { id: "layout", status: "Released", href: "/docs/C_基础规范/布局", contentPath: "docs/C_基础规范/📐 布局.md" },
  { id: "iconography", status: "Released", href: "/docs/C_基础规范/图标", contentPath: "docs/C_基础规范/🔣 图标.md" },
  { id: "radius", status: "Released", href: "/docs/C_基础规范/圆角", contentPath: "docs/C_基础规范/⭕ 圆角.md" },
  { id: "elevation", status: "Released", href: "/docs/C_基础规范/层级与阴影", contentPath: "docs/C_基础规范/🌓 层级与阴影.md" },
  { id: "motion", status: "Not Started", href: "/docs/C_基础规范/动效", contentPath: "docs/C_基础规范/✨ 动效.md" },
];

/** 从 content 文档解析最近更新列表：每条使用文档的一级标题与紧随其后的描述段落。并行读取各文档。 */
export async function getRecentUpdates(
  contentRoot?: string
): Promise<RecentUpdate[]> {
  const results = await Promise.all(
    recentUpdatesMeta.map(async (meta) => {
      const { title, description } = await getDocTitleAndDescriptionAsync(
        meta.contentPath,
        contentRoot
      );
      return {
        id: meta.id,
        title: title || meta.id,
        description: description ?? null,
        status: meta.status,
        href: meta.href,
      };
    })
  );
  return results;
}
