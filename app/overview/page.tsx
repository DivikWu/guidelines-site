import AppShell from '../../components/AppShell';
import OverviewContent from '../../components/OverviewContent';
import DocContent from '../../components/DocContent';
import { docs } from '../../data/docs';

export default function OverviewPage() {
  const docsById = new Map(docs.map((d) => [d.id, d]));
  const overviewPage = docsById.get('overview')!;
  const changelogPage = docsById.get('changelog')!;
  const updateProcessPage = docsById.get('update-process')!;
  return (
    <AppShell docs={docs}>
      <OverviewContent>
        <DocContent page={overviewPage} hidden={false} />
        <DocContent page={changelogPage} hidden={false} />
        <DocContent page={updateProcessPage} hidden={false} />
      </OverviewContent>
    </AppShell>
  );
}
