import AppShell from '../../../components/AppShell';
import { docs } from '../../../data/docs';
import { SearchProvider } from '../../../components/SearchProvider';

export default function SpacingPage() {
  const spacingDoc = docs.find(doc => doc.id === 'spacing');
  const docsToShow = spacingDoc ? [spacingDoc] : docs;

  return (
    <SearchProvider>
      <AppShell docs={docsToShow} />
    </SearchProvider>
  );
}
