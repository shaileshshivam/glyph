import { createServerFn } from '@tanstack/react-start';
import { loadConfig, resolveConfigPath } from '../lib/config';

export interface EntryRow {
  path: string;
  slug: string;
  revision: string;
}

export const listEntries = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => {
    if (
      typeof data !== 'object' ||
      data === null ||
      !('collection' in data) ||
      typeof (data as { collection: unknown }).collection !== 'string'
    ) {
      throw new Error('Invalid input');
    }
    return { collection: (data as { collection: string }).collection };
  })
  .handler(async ({ data }): Promise<EntryRow[]> => {
    const config = await loadConfig(resolveConfigPath({ env: process.env, cwd: process.cwd() }));
    const schemas = config.schema !== undefined ? await config.schema.parse('') : [];
    const schema = schemas.find((s) => s.name === data.collection);
    const folder = schema?.folder ?? data.collection;

    const raw = await config.storage.list(folder);
    return raw
      .filter((e) => !e.isBinary)
      .map((e) => ({
        path: e.path,
        slug: deriveSlug(e.path),
        revision: e.revision,
      }));
  });

function deriveSlug(path: string): string {
  const base = path.split('/').pop() ?? path;
  return base.replace(/\.(mdx?|json|ya?ml)$/i, '');
}
