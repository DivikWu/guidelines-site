import AppShell from '../../../components/AppShell';
import { docs } from '../../../data/docs';
import { SearchProvider } from '../../../components/SearchProvider';

export default function TypographyPage() {
  const typographyDoc = docs.find(doc => doc.id === 'typography');
  const docsToShow = typographyDoc ? [typographyDoc] : docs;

  return (
    <SearchProvider>
      <AppShell docs={docsToShow} />
    </SearchProvider>
  );
}
