'use client';

import { useContentTree } from '@/contexts/ContentTreeContext';
import AppShell from '@/components/AppShell';
import type { DocPage } from '@/data/docs';
import type { DocFrontmatter } from '@/lib/content/loaders';

export default function DocsPageView({
  doc,
  section,
  file,
  docMeta,
}: {
  doc: DocPage;
  section: string;
  file: string;
  docMeta?: DocFrontmatter;
}) {
  const tree = useContentTree();
  if (!tree) return null;
  return (
    <AppShell
      docs={[doc]}
      contentTree={tree}
      docsRouteSection={section}
      docsRouteFile={file}
      docMeta={docMeta}
    />
  );
}
