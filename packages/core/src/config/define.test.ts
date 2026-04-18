import { describe, expect, test } from 'vitest';
import type { StorageAdapter } from '../adapters/storage';
import { definePlugin } from '../plugin/define';
import { defineConfig } from './define';

describe('defineConfig', () => {
  test('returns the passed config unchanged', () => {
    const storage: StorageAdapter = {
      read: async () => ({ path: '', content: '', isBinary: false, revision: '' }),
      list: async () => [],
      write: async () => ({ path: '', revision: '' }),
      delete: async () => {},
      branch: async () => ({ name: 'main', head: 'abc' }),
    };

    const config = defineConfig({
      storage,
      plugins: [definePlugin({ name: 'test', version: '1.0.0' })],
    });

    expect(config.storage).toBe(storage);
    expect(config.plugins).toHaveLength(1);
    expect(config.plugins?.[0]?.name).toBe('test');
  });

  test('works with minimal config', () => {
    const storage: StorageAdapter = {
      read: async () => ({ path: '', content: '', isBinary: false, revision: '' }),
      list: async () => [],
      write: async () => ({ path: '', revision: '' }),
      delete: async () => {},
      branch: async () => ({ name: 'main', head: 'abc' }),
    };
    const config = defineConfig({ storage });
    expect(config.plugins).toBeUndefined();
  });
});
