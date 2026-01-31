import { redirect } from 'next/navigation';
import { getContentTree } from '@/lib/content/tree';
import { DEFAULT_CONTENT_DIR } from '@/lib/content/constants';

export default function BrandPage() {
  const tree = getContentTree(DEFAULT_CONTENT_DIR);
  const section = tree.sections.find((s) => s.id === 'B_品牌');
  const first = section?.items[0];
  if (first) redirect(`/docs/${encodeURIComponent('B_品牌')}/${encodeURIComponent(first.id)}`);
  redirect('/');
}
