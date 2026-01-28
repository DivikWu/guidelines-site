import AppShell from '../../../components/AppShell';
import { docs } from '../../../data/docs';
import { SearchProvider } from '../../../components/SearchProvider';

export default function IconographyPage() {
  const iconographyDoc = docs.find(doc => doc.id === 'iconography');
  const docsToShow = iconographyDoc ? [iconographyDoc] : docs;

  return (
    <SearchProvider>
      <AppShell docs={docsToShow} />
    </SearchProvider>
  );
}
