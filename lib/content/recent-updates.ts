import { getDocTitleAndDescriptionAsync } from "./loaders";

export interface RecentUpdate {
  id: string;
  title: string;
  description: string | null;
  status: "Released" | "Not Started" | "Review" | "Draft";
  href: string;
}

/** 最近更新条目配置：id、状态、链接与内容路径，title/description 从文档 H1+首段解析。路径需与 content/docs/ 结构一致。 */
const recentUpdatesMeta: {
  id: string;
  status: RecentUpdate["status"];
  href: string;
  contentPath: string;
}[] = [
  { id: "brand", status: "Released", href: "/docs/B_品牌/B01_Logo使用规范", contentPath: "docs/B_品牌/B01_🏷️ Logo使用规范.md" },
  { id: "color", status: "Released", href: "/docs/C_基础规范/C01_颜色", contentPath: "docs/C_基础规范/C01_🎨 颜色.md" },
  { id: "typography", status: "Released", href: "/docs/C_基础规范/C02_字体排版", contentPath: "docs/C_基础规范/C02_🔤 字体排版.md" },
  { id: "spacing", status: "Released", href: "/docs/C_基础规范/C03_间距", contentPath: "docs/C_基础规范/C03_📏 间距.md" },
  { id: "layout", status: "Released", href: "/docs/C_基础规范/C04_布局", contentPath: "docs/C_基础规范/C04_📐 布局.md" },
  { id: "iconography", status: "Released", href: "/docs/C_基础规范/C07_图标", contentPath: "docs/C_基础规范/C07_🔣 图标.md" },
  { id: "radius", status: "Released", href: "/docs/C_基础规范/C05_圆角", contentPath: "docs/C_基础规范/C05_⭕ 圆角.md" },
  { id: "elevation", status: "Released", href: "/docs/C_基础规范/C06_层级与阴影", contentPath: "docs/C_基础规范/C06_🌓 层级与阴影.md" },
  { id: "motion", status: "Not Started", href: "/docs/C_基础规范/C08_动效", contentPath: "docs/C_基础规范/C08_✨ 动效.md" },
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
