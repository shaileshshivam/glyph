import type { EntryDetail } from '../server/getEntry';

export interface EntryEditorProps {
  entry: EntryDetail;
}

export function EntryEditor({ entry }: EntryEditorProps) {
  return (
    <main style={{ padding: 24 }}>
      <h1>{entry.slug}</h1>
      <p>Schema: {entry.schema?.name ?? 'none'}</p>
      <pre>{JSON.stringify(entry.frontmatter, null, 2)}</pre>
      <p>Body preview:</p>
      <pre style={{ maxHeight: 300, overflow: 'auto' }}>{entry.body.slice(0, 500)}</pre>
    </main>
  );
}
