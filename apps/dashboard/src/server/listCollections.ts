import { createServerFn } from '@tanstack/react-start';
import { loadConfig, resolveConfigPath } from '../lib/config';

export interface CollectionSummary {
  name: string;
  label: string;
  folder: string;
  entryCount: number | null;
}

export const listCollections = createServerFn({ method: 'GET' }).handler(
  async (): Promise<CollectionSummary[]> => {
    const config = await loadConfig(resolveConfigPath({ env: process.env, cwd: process.cwd() }));

    // Phase 1: collections are read from config.workspace or hardcoded for the
    // v1 single-workspace model. Real schema loading happens in Plan 04.
    // For now we infer collections from the storage root: list directories
    // under contentRoot (if set), else return an empty array.
    const collections: CollectionSummary[] = [];

    // If the user sets `GLYPH_COLLECTIONS` as a comma list, respect it as the
    // order + names to show. This is a temporary shim until Plan 04 wires
    // schema parsing.
    const configured = process.env.GLYPH_COLLECTIONS ?? '';
    if (configured !== '') {
      for (const name of configured.split(',').map((s) => s.trim())) {
        if (name === '') continue;
        try {
          const entries = await config.storage.list(name);
          collections.push({
            name,
            label: name,
            folder: name,
            entryCount: entries.length,
          });
        } catch {
          collections.push({ name, label: name, folder: name, entryCount: null });
        }
      }
    }

    return collections;
  },
);
