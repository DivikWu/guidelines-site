import AppShell from '../../../components/AppShell';
import { docs } from '../../../data/docs';
import { SearchProvider } from '../../../components/SearchProvider';

export default function BrandPage() {
  // 过滤出 Brand 相关的文档
  const brandDocs = docs.filter(doc => 
    ['logo', 'brand-colors', 'typeface'].includes(doc.id)
  );

  return (
    <SearchProvider>
      <AppShell docs={brandDocs} />
    </SearchProvider>
  );
}
