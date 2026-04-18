import type { CollectionSchema } from '@glyph/core';
import { createServerFn } from '@tanstack/react-start';
import { loadConfig, resolveConfigPath } from '../lib/config';

/**
 * JSON-serializable value type. TanStack Start's server-fn serialization
 * validator rejects `unknown` anywhere in the return type under
 * `exactOptionalPropertyTypes`, so we declare a concrete JSON-value union
 * for `defaultValue` and the `options` bag.
 */
type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

/**
 * Serializable projection of CollectionSchema, used as the wire-format
 * return type for `getCollectionSchema`. The core `CollectionSchema` type
 * declares `defaultValue?: unknown` and `options?: Record<string, unknown>`,
 * which do not survive the server-fn serialization check.
 */
export type SerializableCollectionSchema = Omit<CollectionSchema, 'fields'> & {
  fields: Array<
    Omit<CollectionSchema['fields'][number], 'defaultValue' | 'options'> & {
      defaultValue?: JsonValue;
      options?: { [key: string]: JsonValue };
    }
  >;
};

export const getCollectionSchema = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => {
    if (
      typeof data !== 'object' ||
      data === null ||
      !('name' in data) ||
      typeof (data as { name: unknown }).name !== 'string'
    ) {
      throw new Error('Invalid input');
    }
    return { name: (data as { name: string }).name };
  })
  .handler(async ({ data }): Promise<SerializableCollectionSchema | null> => {
    const config = await loadConfig(resolveConfigPath({ env: process.env, cwd: process.cwd() }));
    if (config.schema === undefined) return null;
    const schemas = await config.schema.parse('');
    const match = schemas.find((s) => s.name === data.name) ?? null;
    if (match === null) return null;
    // Round-trip through JSON to strip any non-serializable values from
    // `defaultValue: unknown` / `options: Record<string, unknown>` before
    // returning across the server-fn boundary.
    return JSON.parse(JSON.stringify(match)) as SerializableCollectionSchema;
  });
