import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { CollectionSchema } from '@glyph/core';
import { describe, expect, test } from 'vitest';
import { yamlSchema } from './adapter';

const YAML_BODY = `
collections:
  posts:
    label: Writing
    folder: content/posts
    extension: mdx
    fields:
      - { name: title, type: string, required: true }
      - { name: status, type: select, options: [draft, published], defaultValue: draft }
      - { name: age, type: number }
      - { name: published, type: boolean, defaultValue: false }
`;

function writeYaml(body: string): string {
  const dir = mkdtempSync(join(tmpdir(), 'glyph-schema-yaml-'));
  const path = join(dir, 'glyph.collections.yml');
  writeFileSync(path, body, 'utf-8');
  return path;
}

function firstSchema(schemas: CollectionSchema[]): CollectionSchema {
  const schema = schemas[0];
  if (schema === undefined) throw new Error('expected at least one schema');
  return schema;
}

describe('yamlSchema adapter', () => {
  test('parse() reads the YAML file and returns collections', async () => {
    const path = writeYaml(YAML_BODY);
    const adapter = yamlSchema({ path });
    const schemas = await adapter.parse('');
    expect(schemas).toHaveLength(1);
    expect(schemas[0]?.name).toBe('posts');
  });

  test('validate() accepts a well-formed entry', async () => {
    const path = writeYaml(YAML_BODY);
    const adapter = yamlSchema({ path });
    const schema = firstSchema(await adapter.parse(''));
    const result = adapter.validate(
      { title: 'Hi', status: 'draft', age: 3, published: false },
      schema,
    );
    expect(result.ok).toBe(true);
  });

  test('validate() flags missing required field', async () => {
    const path = writeYaml(YAML_BODY);
    const adapter = yamlSchema({ path });
    const schema = firstSchema(await adapter.parse(''));
    const result = adapter.validate({ status: 'draft' }, schema);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.path === 'title')).toBe(true);
  });

  test('getDefaults() produces frontmatter pre-filled with defaults', async () => {
    const path = writeYaml(YAML_BODY);
    const adapter = yamlSchema({ path });
    const schema = firstSchema(await adapter.parse(''));
    const defaults = adapter.getDefaults(schema);
    expect(defaults.status).toBe('draft');
    expect(defaults.published).toBe(false);
    // Non-defaulted fields are omitted or undefined
    expect('title' in defaults).toBe(false);
  });
});
