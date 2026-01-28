import AppShell from '../../components/AppShell';
import { docs } from '../../data/docs';
import { SearchProvider } from '../../components/SearchProvider';

export default function OverviewPage() {
  return (
    <SearchProvider>
      <AppShell docs={docs} />
    </SearchProvider>
  );
}
