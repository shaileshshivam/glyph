import { describe, expect, test } from 'vitest';
import { definePlugin } from './define';

describe('definePlugin', () => {
  test('returns the passed definition with metadata preserved', () => {
    const plugin = definePlugin({
      name: 'test-plugin',
      version: '1.0.0',
      commands: [
        { id: 'test.hello', label: 'Hello', run: async () => 'hello' },
      ],
    });

    expect(plugin.name).toBe('test-plugin');
    expect(plugin.version).toBe('1.0.0');
    expect(plugin.commands).toHaveLength(1);
    expect(plugin.commands?.[0]?.id).toBe('test.hello');
  });

  test('supports empty plugins (metadata only)', () => {
    const plugin = definePlugin({ name: 'empty', version: '0.0.0' });
    expect(plugin.name).toBe('empty');
    expect(plugin.commands).toBeUndefined();
  });
});
