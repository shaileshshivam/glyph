import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <main style={{ padding: 48 }}>
      <h1 style={{ fontFamily: 'var(--glyph-font-display)', fontSize: 36 }}>
        Glyph dashboard
      </h1>
      <p>Scaffolding in place. Login + collection routes coming next.</p>
    </main>
  );
}
