import { createServerFn } from '@tanstack/react-start';
import { loadConfig, resolveConfigPath } from '../lib/config';

export const deleteEntry = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => {
    const d = data as { collection?: unknown; slug?: unknown };
    if (typeof d.collection !== 'string' || typeof d.slug !== 'string') {
      throw new Error('Invalid input');
    }
    return { collection: d.collection, slug: d.slug };
  })
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    const config = await loadConfig(resolveConfigPath({ env: process.env, cwd: process.cwd() }));
    const schemas = config.schema !== undefined ? await config.schema.parse('') : [];
    const schema = schemas.find((s) => s.name === data.collection);
    const folder = schema?.folder ?? data.collection;
    const ext = schema?.extension ?? 'mdx';
    const path = `${folder}/${data.slug}.${ext}`;

    await config.storage.delete(path, { message: `delete: ${data.slug}` });
    return { ok: true };
  });
