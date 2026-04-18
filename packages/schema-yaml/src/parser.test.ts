import { describe, expect, test } from 'vitest';
import { parseCollections } from './parser';

describe('parseCollections', () => {
  test('parses a minimal single collection', () => {
    const yaml = `
collections:
  posts:
    label: Writing
    folder: src/content/posts
    extension: mdx
    fields:
      - { name: title, type: string, required: true }
      - { name: body, type: markdown, required: true }
`;
    const schemas = parseCollections(yaml);
    expect(schemas).toHaveLength(1);
    expect(schemas[0]?.name).toBe('posts');
    expect(schemas[0]?.label).toBe('Writing');
    expect(schemas[0]?.folder).toBe('src/content/posts');
    expect(schemas[0]?.extension).toBe('mdx');
    expect(schemas[0]?.fields).toHaveLength(2);
  });

  test('parses multiple collections preserving order', () => {
    const yaml = `
collections:
  posts:
    label: Writing
    folder: content/posts
    extension: mdx
    fields: []
  garden:
    label: Garden
    folder: content/garden
    extension: mdx
    fields: []
`;
    const schemas = parseCollections(yaml);
    expect(schemas.map((s) => s.name)).toEqual(['posts', 'garden']);
  });

  test('defaults format to frontmatter', () => {
    const yaml = `
collections:
  x:
    label: X
    folder: x
    extension: mdx
    fields: []
`;
    expect(parseCollections(yaml)[0]?.format).toBe('frontmatter');
  });

  test('supports select options', () => {
    const yaml = `
collections:
  x:
    label: X
    folder: x
    extension: mdx
    fields:
      - { name: status, type: select, options: [draft, published] }
`;
    const field = parseCollections(yaml)[0]?.fields[0];
    expect(field?.type).toBe('select');
    expect(field?.options?.values).toEqual(['draft', 'published']);
  });

  test('supports select with label/value object form', () => {
    const yaml = `
collections:
  x:
    label: X
    folder: x
    extension: mdx
    fields:
      - name: status
        type: select
        options:
          - { label: "Draft", value: "draft" }
          - { label: "Published", value: "published" }
`;
    const field = parseCollections(yaml)[0]?.fields[0];
    expect(field?.options?.values).toEqual([
      { label: 'Draft', value: 'draft' },
      { label: 'Published', value: 'published' },
    ]);
  });

  test('supports defaultValue', () => {
    const yaml = `
collections:
  x:
    label: X
    folder: x
    extension: mdx
    fields:
      - { name: status, type: string, defaultValue: draft }
`;
    expect(parseCollections(yaml)[0]?.fields[0]?.defaultValue).toBe('draft');
  });

  test('throws on invalid top-level shape', () => {
    expect(() => parseCollections('foo: bar')).toThrow(/collections/);
  });

  test('throws on unknown field type', () => {
    const yaml = `
collections:
  x:
    label: X
    folder: x
    extension: mdx
    fields:
      - { name: f, type: unknownType }
`;
    expect(() => parseCollections(yaml)).toThrow(/unknownType/);
  });

  test('throws on missing required field name', () => {
    const yaml = `
collections:
  x:
    label: X
    folder: x
    extension: mdx
    fields:
      - { type: string }
`;
    expect(() => parseCollections(yaml)).toThrow();
  });
});
