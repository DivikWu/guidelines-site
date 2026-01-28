import AppShell from '../../../components/AppShell';
import { docs } from '../../../data/docs';
import { SearchProvider } from '../../../components/SearchProvider';

export default function ColorPage() {
  const colorDoc = docs.find(doc => doc.id === 'color');
  const docsToShow = colorDoc ? [colorDoc] : docs;

  return (
    <SearchProvider>
      <AppShell docs={docsToShow} />
    </SearchProvider>
  );
}
