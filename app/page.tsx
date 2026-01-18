import AppShell from '../components/AppShell';
import { docs } from '../data/docs';
import { SearchProvider } from '../components/SearchProvider';

export default function Page() {
  return (
    <SearchProvider>
      <AppShell docs={docs} />
    </SearchProvider>
  );
}
