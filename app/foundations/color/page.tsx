import { redirect } from 'next/navigation';
import { getContentTree } from '@/lib/content/tree';
import { DEFAULT_CONTENT_DIR } from '@/lib/content/constants';

export default function ColorPage() {
  const tree = getContentTree(DEFAULT_CONTENT_DIR);
  const section = tree.sections.find((s) => s.id === 'C_基础规范');
  const first = section?.items[0];
  if (first) redirect(`/docs/${encodeURIComponent('C_基础规范')}/${encodeURIComponent(first.id)}`);
  redirect('/');
}
