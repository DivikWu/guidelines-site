import AppShell from '../../../components/AppShell';
import { docs } from '../../../data/docs';
import { SearchProvider } from '../../../components/SearchProvider';

export default function ElevationPage() {
  const elevationDoc = docs.find(doc => doc.id === 'elevation');
  const docsToShow = elevationDoc ? [elevationDoc] : docs;

  return (
    <SearchProvider>
      <AppShell docs={docsToShow} />
    </SearchProvider>
  );
}
