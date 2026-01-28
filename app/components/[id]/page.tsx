import AppShell from '../../../components/AppShell';
import { docs } from '../../../data/docs';
import { SearchProvider } from '../../../components/SearchProvider';

interface ComponentPageProps {
  params: { id: string };
}

// 为静态导出生成所有组件页面的参数
export function generateStaticParams() {
  const componentIds = ['button', 'tabs', 'badge', 'heading', 'filter', 'navbar', 'product-card', 'forms', 'patterns-overview'];
  return componentIds.map((id) => ({
    id,
  }));
}

export default function ComponentPage({ params }: ComponentPageProps) {
  const componentDoc = docs.find((doc) => doc.id === params.id);
  const docsToShow = componentDoc ? [componentDoc] : docs;

  return (
    <SearchProvider>
      <AppShell docs={docsToShow} />
    </SearchProvider>
  );
}
