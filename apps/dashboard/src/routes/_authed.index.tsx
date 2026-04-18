import { createFileRoute, Link } from '@tanstack/react-router';
import { type CollectionSummary, listCollections } from '../server/listCollections';

export const Route = createFileRoute('/_authed/')({
  loader: async (): Promise<{ collections: CollectionSummary[] }> => {
    const collections = await listCollections();
    return { collections };
  },
  component: DashboardHome,
});

function DashboardHome() {
  const { collections } = Route.useLoaderData() as { collections: CollectionSummary[] };
  return (
    <main className="glyph-dashboard">
      <header className="glyph-dashboard__header">
        <h1 className="glyph-dashboard__title">Workspace</h1>
      </header>

      <section className="glyph-dashboard__section">
        <h2 className="glyph-dashboard__section-title">Collections</h2>
        {collections.length === 0 ? (
          <div className="glyph-dashboard__empty">
            <p>No collections configured yet.</p>
            <p className="glyph-dashboard__hint">
              Set <code>GLYPH_COLLECTIONS</code> to a comma-separated list of folder names (e.g.{' '}
              <code>posts,garden,projects</code>) or wait for the Plan 04 schema loader.
            </p>
          </div>
        ) : (
          <ul className="glyph-dashboard__list">
            {collections.map((c) => (
              <li key={c.name} className="glyph-dashboard__item">
                <Link
                  to="/collections/$name"
                  params={{ name: c.name }}
                  className="glyph-dashboard__link"
                >
                  <span className="glyph-dashboard__item-label">{c.label}</span>
                  <span className="glyph-dashboard__item-count">
                    {c.entryCount === null ? '—' : `${c.entryCount} entries`}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
