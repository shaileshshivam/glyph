import { assertType, test } from 'vitest';
import type { StorageAdapter, StorageEntry, StorageWriteResult } from './storage';

test('StorageAdapter has the expected shape', () => {
  const adapter = {} as StorageAdapter;

  assertType<(path: string) => Promise<StorageEntry>>(adapter.read);
  assertType<(path: string) => Promise<StorageEntry[]>>(adapter.list);
  assertType<
    (path: string, content: string, options?: { message?: string }) => Promise<StorageWriteResult>
  >(adapter.write);
  assertType<(path: string, options?: { message?: string }) => Promise<void>>(adapter.delete);
  assertType<() => Promise<{ name: string; head: string }>>(adapter.branch);
});
