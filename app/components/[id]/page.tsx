import AppShell from '../../../components/AppShell';
import { docs } from '../../../data/docs';

interface ComponentPageProps {
  params: Promise<{ id: string }>;
}

// 为静态导出生成所有组件页面的参数
export function generateStaticParams() {
  const componentIds = ['button', 'tabs', 'badge', 'heading', 'filter', 'navbar', 'product-card', 'forms', 'patterns-overview'];
  return componentIds.map((id) => ({
    id,
  }));
}

export default async function ComponentPage({ params }: ComponentPageProps) {
  const { id } = await params;
  const componentDoc = docs.find((doc) => doc.id === id);
  const docsToShow = componentDoc ? [componentDoc] : docs;

  return (
    <AppShell docs={docsToShow} />
  );
}
