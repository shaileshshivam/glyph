import { assertType, test } from 'vitest';
import type {
  SchemaAdapter,
  CollectionSchema,
  FieldSchema,
  ValidationResult,
} from './schema';

test('SchemaAdapter has the expected shape', () => {
  const adapter = {} as SchemaAdapter;

  assertType<(source: string) => Promise<CollectionSchema[]>>(adapter.parse);
  assertType<(entry: unknown, schema: CollectionSchema) => ValidationResult>(adapter.validate);
  assertType<(schema: CollectionSchema) => Record<string, unknown>>(adapter.getDefaults);
});
