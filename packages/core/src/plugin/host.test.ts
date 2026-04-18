import { describe, expect, test, vi } from 'vitest';
import { definePlugin } from './define';
import { createPluginHost } from './host';
import type { PluginEntry, PluginHookContext } from './types';

describe('createPluginHost', () => {
  test('registers plugins and returns them in order', () => {
    const a = definePlugin({ name: 'a', version: '1.0.0' });
    const b = definePlugin({ name: 'b', version: '1.0.0' });

    const host = createPluginHost([a, b]);

    expect(host.getPlugins().map((p) => p.name)).toEqual(['a', 'b']);
  });

  test('rejects duplicate plugin names at registration time', () => {
    const first = definePlugin({ name: 'dupe', version: '1.0.0' });
    const second = definePlugin({ name: 'dupe', version: '2.0.0' });

    expect(() => createPluginHost([first, second])).toThrow(/already registered/);
  });

  test('runBeforeSave chains all plugin hooks in order', async () => {
    const a = definePlugin({
      name: 'a',
      version: '1.0.0',
      hooks: {
        beforeSave: async (entry) => ({
          ...entry,
          frontmatter: { ...entry.frontmatter, a: true },
        }),
      },
    });
    const b = definePlugin({
      name: 'b',
      version: '1.0.0',
      hooks: {
        beforeSave: async (entry) => ({
          ...entry,
          frontmatter: { ...entry.frontmatter, b: true },
        }),
      },
    });

    const host = createPluginHost([a, b]);
    const ctx: PluginHookContext = { pluginName: 'test', session: null };
    const entry: PluginEntry = { path: 'a.mdx', frontmatter: {}, body: '' };

    const result = await host.runBeforeSave(entry, ctx);

    expect(result.frontmatter).toEqual({ a: true, b: true });
  });

  test('runAfterSave invokes every plugin (fire-and-forget semantics)', async () => {
    const aHook = vi.fn(async () => {});
    const bHook = vi.fn(async () => {});
    const a = definePlugin({ name: 'a', version: '1.0.0', hooks: { afterSave: aHook } });
    const b = definePlugin({ name: 'b', version: '1.0.0', hooks: { afterSave: bHook } });

    const host = createPluginHost([a, b]);
    const ctx: PluginHookContext = { pluginName: 'test', session: null };

    await host.runAfterSave({ path: 'x', frontmatter: {}, body: '' }, ctx);

    expect(aHook).toHaveBeenCalledOnce();
    expect(bHook).toHaveBeenCalledOnce();
  });

  test('runBeforeDelete stops and returns false if any plugin vetoes', async () => {
    const a = definePlugin({
      name: 'a',
      version: '1.0.0',
      hooks: { beforeDelete: async () => true },
    });
    const veto = definePlugin({
      name: 'veto',
      version: '1.0.0',
      hooks: { beforeDelete: async () => false },
    });

    const host = createPluginHost([a, veto]);
    const ctx: PluginHookContext = { pluginName: 'test', session: null };

    expect(await host.runBeforeDelete('x', ctx)).toBe(false);
  });

  test('getCommands flattens commands across plugins', () => {
    const a = definePlugin({
      name: 'a',
      version: '1.0.0',
      commands: [{ id: 'a.one', label: 'A One', run: async () => {} }],
    });
    const b = definePlugin({
      name: 'b',
      version: '1.0.0',
      commands: [{ id: 'b.one', label: 'B One', run: async () => {} }],
    });

    const host = createPluginHost([a, b]);
    const commands = host.getCommands();

    expect(commands.map((c) => c.id)).toEqual(['a.one', 'b.one']);
  });
});
