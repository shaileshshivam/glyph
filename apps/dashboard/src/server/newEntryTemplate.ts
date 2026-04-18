import type { CollectionSchema } from '@glyph/core';
import { createServerFn } from '@tanstack/react-start';
import { loadConfig, resolveConfigPath } from '../lib/config';
import type { SerializableCollectionSchema } from './getCollectionSchema';
import type { EntryDetail } from './getEntry';

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export const newEntryTemplate = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => {
    const d = data as { collection?: unknown };
    if (typeof d.collection !== 'string') throw new Error('Invalid input');
    return { collection: d.collection };
  })
  .handler(async ({ data }): Promise<EntryDetail> => {
    const config = await loadConfig(resolveConfigPath({ env: process.env, cwd: process.cwd() }));
    const schemas: CollectionSchema[] =
      config.schema !== undefined ? await config.schema.parse('') : [];
    const schema = schemas.find((s) => s.name === data.collection) ?? null;

    const defaults =
      schema !== null && config.schema !== undefined ? config.schema.getDefaults(schema) : {};

    // Strip non-serializable `unknown`-typed properties on the schema before
    // returning across the server-fn boundary (see getCollectionSchema.ts).
    const serializableSchema =
      schema === null ? null : (JSON.parse(JSON.stringify(schema)) as SerializableCollectionSchema);

    const detail: EntryDetail = {
      collection: data.collection,
      slug: makeSlug(),
      path: '',
      revision: '',
      frontmatter: defaults as { [key: string]: JsonValue },
      body: '',
      schema: serializableSchema,
    };
    // Round-trip through JSON to satisfy the server-fn serialization validator
    // (frontmatter values may include non-primitive unknowns from defaults).
    return JSON.parse(JSON.stringify(detail)) as EntryDetail;
  });

function makeSlug(): string {
  const now = new Date();
  const ymd = now.toISOString().slice(0, 10);
  const rand = Math.random().toString(36).slice(2, 7);
  return `${ymd}-untitled-${rand}`;
}
