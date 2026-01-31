import { redirect } from 'next/navigation';
import { getContentTree } from '@/lib/content/tree';
import { DEFAULT_CONTENT_DIR } from '@/lib/content/constants';

export default function IntroductionPage() {
  const tree = getContentTree(DEFAULT_CONTENT_DIR);
  const section = tree.sections.find((s) => s.id === 'A_快速开始');
  const first = section?.items[0];
  if (first) redirect(`/docs/${encodeURIComponent('A_快速开始')}/${encodeURIComponent(first.id)}`);
  redirect('/');
}
