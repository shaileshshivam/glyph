import type { CollectionSchema } from '@glyph/core';
import { createServerFn } from '@tanstack/react-start';
import matter from 'gray-matter';
import { loadConfig, resolveConfigPath } from '../lib/config';
import type { SerializableCollectionSchema } from './getCollectionSchema';

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export interface EntryDetail {
  collection: string;
  slug: string;
  path: string;
  revision: string;
  frontmatter: { [key: string]: JsonValue };
  body: string;
  schema: SerializableCollectionSchema | null;
}

export const getEntry = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => {
    if (
      typeof data !== 'object' ||
      data === null ||
      !('collection' in data) ||
      !('slug' in data) ||
      typeof (data as { collection: unknown }).collection !== 'string' ||
      typeof (data as { slug: unknown }).slug !== 'string'
    ) {
      throw new Error('Invalid input');
    }
    return {
      collection: (data as { collection: string }).collection,
      slug: (data as { slug: string }).slug,
    };
  })
  .handler(async ({ data }) => {
    const config = await loadConfig(resolveConfigPath({ env: process.env, cwd: process.cwd() }));
    const schemas: CollectionSchema[] =
      config.schema !== undefined ? await config.schema.parse('') : [];
    const schema = schemas.find((s) => s.name === data.collection) ?? null;
    const folder = schema?.folder ?? data.collection;
    const ext = schema?.extension ?? 'mdx';
    const path = `${folder}/${data.slug}.${ext}`;

    const entry = await config.storage.read(path);
    const parsed = matter(entry.content);

    // Strip non-serializable `unknown`-typed properties on the schema before
    // returning across the server-fn boundary (see getCollectionSchema.ts).
    const serializableSchema =
      schema === null ? null : (JSON.parse(JSON.stringify(schema)) as SerializableCollectionSchema);

    const detail: EntryDetail = {
      collection: data.collection,
      slug: data.slug,
      path: entry.path,
      revision: entry.revision,
      frontmatter: parsed.data as { [key: string]: JsonValue },
      body: parsed.content,
      schema: serializableSchema,
    };
    // `frontmatter: Record<string, unknown>` is also non-serializable per the
    // start validator; round-trip through JSON to satisfy the boundary.
    return JSON.parse(JSON.stringify(detail)) as EntryDetail;
  });
