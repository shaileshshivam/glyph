import type { CollectionSchema } from '@glyph/core';
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
    if (config.schema === undefined) return [];

    const schemas: CollectionSchema[] = await config.schema.parse('');
    const summaries: CollectionSummary[] = [];
    for (const s of schemas) {
      let entryCount: number | null = null;
      try {
        const entries = await config.storage.list(s.folder);
        entryCount = entries.length;
      } catch {
        entryCount = null;
      }
      summaries.push({ name: s.name, label: s.label, folder: s.folder, entryCount });
    }
    return summaries;
  },
);
