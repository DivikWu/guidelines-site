import AppShell from '../../components/AppShell';
import { docs } from '../../data/docs';
import { SearchProvider } from '../../components/SearchProvider';

export default function ComponentsPage() {
  // 过滤出 Components 相关的文档
  const componentDocs = docs.filter(doc => 
    ['button', 'tabs', 'badge', 'heading', 'filter', 'navbar', 'product-card', 'forms', 'patterns-overview'].includes(doc.id)
  );

  return (
    <SearchProvider>
      <AppShell docs={componentDocs} />
    </SearchProvider>
  );
}
