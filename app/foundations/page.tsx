import AppShell from '../../components/AppShell';
import { docs } from '../../data/docs';
import { SearchProvider } from '../../components/SearchProvider';

export default function FoundationsPage() {
  // 过滤出 Foundations 相关的文档
  const foundationsDocs = docs.filter(doc => 
    ['color', 'typography', 'spacing', 'layout', 'radius', 'elevation', 'iconography', 'motion'].includes(doc.id)
  );

  return (
    <SearchProvider>
      <AppShell docs={foundationsDocs} />
    </SearchProvider>
  );
}
