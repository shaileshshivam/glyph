import { createFileRoute } from '@tanstack/react-router';
import { EntryEditor } from '../components/EntryEditor';
import type { EntryDetail } from '../server/getEntry';
import { newEntryTemplate } from '../server/newEntryTemplate';

export const Route = createFileRoute('/_authed/collections/$name/new')({
  loader: async ({ params }) => {
    const entry = await newEntryTemplate({ data: { collection: params.name } });
    return { entry };
  },
  component: NewPage,
});

function NewPage() {
  const { entry } = Route.useLoaderData() as { entry: EntryDetail };
  return <EntryEditor entry={entry} isNew />;
}
