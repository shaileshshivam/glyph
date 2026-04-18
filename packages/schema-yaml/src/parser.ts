import type { CollectionSchema, FieldSchema } from '@glyph/core';
import { load as yamlLoad } from 'js-yaml';
import { z } from 'zod';

const SUPPORTED_FIELD_TYPES = [
  'string',
  'text',
  'markdown',
  'number',
  'boolean',
  'select',
  'list',
  'date',
  'datetime',
] as const;

const SelectOptionSchema = z.union([
  z.string(),
  z.object({ label: z.string(), value: z.string() }),
]);

const FieldYamlSchema = z.object({
  name: z.string().min(1),
  type: z.enum(SUPPORTED_FIELD_TYPES),
  label: z.string().optional(),
  required: z.boolean().optional(),
  hint: z.string().optional(),
  defaultValue: z.unknown().optional(),
  options: z.array(SelectOptionSchema).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
});

const CollectionYamlSchema = z.object({
  label: z.string(),
  labelSingular: z.string().optional(),
  description: z.string().optional(),
  folder: z.string().min(1),
  extension: z.string().min(1),
  format: z.enum(['frontmatter', 'markdown', 'json', 'yaml', 'raw']).optional(),
  slugTemplate: z.string().optional(),
  fields: z.array(FieldYamlSchema),
});

const RootYamlSchema = z.object({
  collections: z.record(z.string(), CollectionYamlSchema),
});

/**
 * Parse a glyph.collections.yml body string into a list of CollectionSchemas,
 * preserving key order from the source.
 */
export function parseCollections(yamlSource: string): CollectionSchema[] {
  const raw = yamlLoad(yamlSource);
  const parsed = RootYamlSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Invalid glyph.collections.yml — ${msg}`);
  }

  const out: CollectionSchema[] = [];
  for (const [name, body] of Object.entries(parsed.data.collections)) {
    const fields: FieldSchema[] = body.fields.map((f) => {
      const field: FieldSchema = {
        name: f.name,
        label: f.label ?? humanize(f.name),
        type: f.type,
      };
      if (f.required === true) field.required = true;
      if (f.hint !== undefined) field.hint = f.hint;
      if (f.defaultValue !== undefined) field.defaultValue = f.defaultValue;
      if (f.options !== undefined || f.min !== undefined || f.max !== undefined) {
        const opts: Record<string, unknown> = {};
        if (f.options !== undefined) opts.values = f.options;
        if (f.min !== undefined) opts.min = f.min;
        if (f.max !== undefined) opts.max = f.max;
        field.options = opts;
      }
      return field;
    });

    const schema: CollectionSchema = {
      name,
      label: body.label,
      folder: body.folder,
      extension: body.extension,
      format: body.format ?? 'frontmatter',
      fields,
    };
    if (body.labelSingular !== undefined) schema.labelSingular = body.labelSingular;
    if (body.description !== undefined) schema.description = body.description;
    if (body.slugTemplate !== undefined) schema.slugTemplate = body.slugTemplate;
    out.push(schema);
  }

  return out;
}

function humanize(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1');
}
