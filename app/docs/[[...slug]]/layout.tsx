import { getContentTree } from '@/lib/content/tree';
import { DEFAULT_CONTENT_DIR } from '@/lib/content/constants';
import { ContentTreeProvider } from '@/contexts/ContentTreeContext';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 与 generateStaticParams 一致，使用项目 content/，侧栏链接与可访问路径一致
  const tree = getContentTree(DEFAULT_CONTENT_DIR);
  return (
    <ContentTreeProvider tree={tree}>
      {children}
    </ContentTreeProvider>
  );
}
