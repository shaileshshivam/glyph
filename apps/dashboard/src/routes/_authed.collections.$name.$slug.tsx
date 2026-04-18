import { createFileRoute } from '@tanstack/react-router';
import { EntryEditor } from '../components/EntryEditor';
import type { EntryDetail } from '../server/getEntry';
import { getEntry } from '../server/getEntry';

export const Route = createFileRoute('/_authed/collections/$name/$slug')({
  loader: async ({ params }) => {
    const entry = await getEntry({
      data: { collection: params.name, slug: params.slug },
    });
    return { entry };
  },
  component: EntryPage,
});

function EntryPage() {
  const loaderData = Route.useLoaderData() as { entry: EntryDetail };
  return <EntryEditor entry={loaderData.entry} />;
}
