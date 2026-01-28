import AppShell from '../../../components/AppShell';
import { docs } from '../../../data/docs';
import { SearchProvider } from '../../../components/SearchProvider';

export default function LayoutPage() {
  const layoutDoc = docs.find(doc => doc.id === 'layout');
  const docsToShow = layoutDoc ? [layoutDoc] : docs;

  return (
    <SearchProvider>
      <AppShell docs={docsToShow} />
    </SearchProvider>
  );
}
