import { createServerFn } from '@tanstack/react-start';
import matter from 'gray-matter';
import { loadConfig, resolveConfigPath } from '../lib/config';

export interface SaveEntryInput {
  collection: string;
  slug: string;
  frontmatter: Record<string, unknown>;
  body: string;
  publish: boolean;
  isNew: boolean;
}

export interface SaveEntryResult {
  ok: boolean;
  path: string;
  revision: string;
}

export const saveEntry = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => {
    const d = data as Partial<SaveEntryInput>;
    if (
      typeof d.collection !== 'string' ||
      typeof d.slug !== 'string' ||
      typeof d.frontmatter !== 'object' ||
      d.frontmatter === null ||
      typeof d.body !== 'string' ||
      typeof d.publish !== 'boolean' ||
      typeof d.isNew !== 'boolean'
    ) {
      throw new Error('Invalid input');
    }
    return d as SaveEntryInput;
  })
  .handler(async ({ data }): Promise<SaveEntryResult> => {
    const config = await loadConfig(resolveConfigPath({ env: process.env, cwd: process.cwd() }));
    const schemas = config.schema !== undefined ? await config.schema.parse('') : [];
    const schema = schemas.find((s) => s.name === data.collection);
    const folder = schema?.folder ?? data.collection;
    const ext = schema?.extension ?? 'mdx';
    const path = `${folder}/${data.slug}.${ext}`;

    // If there's a 'status' field in the schema, set it based on publish flag.
    const frontmatter: Record<string, unknown> = { ...data.frontmatter };
    const hasStatus = schema?.fields.some((f) => f.name === 'status') ?? false;
    if (hasStatus) {
      frontmatter.status = data.publish ? 'published' : 'draft';
    }

    const serialized = matter.stringify(data.body, frontmatter);
    const message = data.isNew
      ? `create: ${schema?.labelSingular ?? schema?.label ?? data.collection}/${data.slug}`
      : `${data.publish ? 'publish' : 'draft'}: ${data.slug}`;

    const result = await config.storage.write(path, serialized, { message });
    return { ok: true, path: result.path, revision: result.revision };
  });
