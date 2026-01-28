import AppShell from '../../../components/AppShell';
import { docs } from '../../../data/docs';
import { SearchProvider } from '../../../components/SearchProvider';

export default function RadiusPage() {
  const radiusDoc = docs.find(doc => doc.id === 'radius');
  const docsToShow = radiusDoc ? [radiusDoc] : docs;

  return (
    <SearchProvider>
      <AppShell docs={docsToShow} />
    </SearchProvider>
  );
}
