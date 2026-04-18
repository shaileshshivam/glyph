import { readFileSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';
import type {
  CollectionSchema,
  SchemaAdapter,
  ValidationError,
  ValidationResult,
} from '@glyph/core';
import { parseCollections } from './parser';

export interface YamlSchemaOptions {
  /** Path to the glyph.collections.yml file. Relative paths resolve against cwd. */
  path: string;
}

export function yamlSchema(options: YamlSchemaOptions): SchemaAdapter {
  const resolvedPath = isAbsolute(options.path)
    ? options.path
    : resolve(process.cwd(), options.path);

  return {
    async parse(_source: string): Promise<CollectionSchema[]> {
      const body = readFileSync(resolvedPath, 'utf-8');
      return parseCollections(body);
    },

    validate(entry: unknown, schema: CollectionSchema): ValidationResult {
      const errors: ValidationError[] = [];
      if (typeof entry !== 'object' || entry === null) {
        errors.push({ path: '', message: 'Entry must be an object' });
        return { ok: false, errors };
      }
      const obj = entry as Record<string, unknown>;
      for (const field of schema.fields) {
        const value = obj[field.name];
        if (field.required === true && (value === undefined || value === null || value === '')) {
          errors.push({ path: field.name, message: 'Required' });
          continue;
        }
        if (value === undefined || value === null) continue;
        const typeError = validateFieldType(field.name, field.type, value);
        if (typeError !== null) errors.push(typeError);
      }
      return { ok: errors.length === 0, errors };
    },

    getDefaults(schema: CollectionSchema): Record<string, unknown> {
      const out: Record<string, unknown> = {};
      for (const field of schema.fields) {
        if (field.defaultValue !== undefined) {
          out[field.name] = field.defaultValue;
        }
      }
      return out;
    },
  };
}

function validateFieldType(name: string, type: string, value: unknown): ValidationError | null {
  switch (type) {
    case 'string':
    case 'text':
    case 'markdown':
      return typeof value === 'string' ? null : { path: name, message: 'Expected string' };
    case 'number':
      return typeof value === 'number' ? null : { path: name, message: 'Expected number' };
    case 'boolean':
      return typeof value === 'boolean' ? null : { path: name, message: 'Expected boolean' };
    case 'list':
      return Array.isArray(value) ? null : { path: name, message: 'Expected array' };
    case 'select':
      return typeof value === 'string' ? null : { path: name, message: 'Expected selected value' };
    case 'date':
    case 'datetime':
      return typeof value === 'string' || value instanceof Date
        ? null
        : { path: name, message: 'Expected date string' };
    default:
      return null;
  }
}
