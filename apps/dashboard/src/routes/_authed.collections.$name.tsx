import { Link, createFileRoute } from '@tanstack/react-router';
import { type EntryRow, listEntries } from '../server/listEntries';

export const Route = createFileRoute('/_authed/collections/$name')({
  loader: async ({
    params,
  }): Promise<{ entries: EntryRow[]; name: string }> => {
    const entries = await listEntries({ data: { collection: params.name } });
    return { entries, name: params.name };
  },
  component: CollectionPage,
});

function CollectionPage() {
  const { entries, name } = Route.useLoaderData() as {
    entries: EntryRow[];
    name: string;
  };
  return (
    <main className="glyph-dashboard">
      <header className="glyph-dashboard__header">
        <Link to="/" className="glyph-dashboard__breadcrumb">
          ← Workspace
        </Link>
        <h1 className="glyph-dashboard__title">{name}</h1>
      </header>
      <section className="glyph-dashboard__section">
        <h2 className="glyph-dashboard__section-title">Entries</h2>
        {entries.length === 0 ? (
          <div className="glyph-dashboard__empty">No entries yet.</div>
        ) : (
          <ul className="glyph-dashboard__list">
            {entries.map((e) => (
              <li key={e.path} className="glyph-dashboard__item">
                <div className="glyph-dashboard__entry">
                  <span className="glyph-dashboard__item-label">{e.slug}</span>
                  <span className="glyph-dashboard__item-count">
                    {e.revision.slice(0, 7)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
