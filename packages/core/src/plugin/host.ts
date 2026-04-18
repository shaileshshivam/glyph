import type {
  Plugin,
  PluginCommand,
  PluginEntry,
  PluginHookContext,
  PluginMediaUpload,
} from './types';

/**
 * PluginHost — runtime registry of installed plugins.
 *
 * Plugins register themselves at boot (via GlyphConfig.plugins) and
 * the host provides ergonomic access to their contributions. Hook
 * runners are the only async entry points; everything else is
 * synchronous lookup.
 */
export interface PluginHost {
  getPlugins(): readonly Plugin[];
  getCommands(): readonly PluginCommand[];
  runBeforeSave(entry: PluginEntry, ctx: PluginHookContext): Promise<PluginEntry>;
  runAfterSave(entry: PluginEntry, ctx: PluginHookContext): Promise<void>;
  runBeforeDelete(path: string, ctx: PluginHookContext): Promise<boolean>;
  runAfterDelete(path: string, ctx: PluginHookContext): Promise<void>;
  runOnMediaUpload(upload: PluginMediaUpload, ctx: PluginHookContext): Promise<PluginMediaUpload>;
}

export function createPluginHost(plugins: readonly Plugin[]): PluginHost {
  const seen = new Set<string>();
  for (const p of plugins) {
    if (seen.has(p.name)) {
      throw new Error(`Plugin "${p.name}" already registered`);
    }
    seen.add(p.name);
  }

  const pluginList = [...plugins];

  return {
    getPlugins: () => pluginList,

    getCommands: () => pluginList.flatMap((p) => p.commands ?? []),

    async runBeforeSave(entry, ctx) {
      let current = entry;
      for (const plugin of pluginList) {
        const fn = plugin.hooks?.beforeSave;
        if (fn) {
          current = await fn(current, { ...ctx, pluginName: plugin.name });
        }
      }
      return current;
    },

    async runAfterSave(entry, ctx) {
      for (const plugin of pluginList) {
        const fn = plugin.hooks?.afterSave;
        if (fn) {
          await fn(entry, { ...ctx, pluginName: plugin.name });
        }
      }
    },

    async runBeforeDelete(path, ctx) {
      for (const plugin of pluginList) {
        const fn = plugin.hooks?.beforeDelete;
        if (fn) {
          const result = await fn(path, { ...ctx, pluginName: plugin.name });
          if (result === false) return false;
        }
      }
      return true;
    },

    async runAfterDelete(path, ctx) {
      for (const plugin of pluginList) {
        const fn = plugin.hooks?.afterDelete;
        if (fn) {
          await fn(path, { ...ctx, pluginName: plugin.name });
        }
      }
    },

    async runOnMediaUpload(upload, ctx) {
      let current = upload;
      for (const plugin of pluginList) {
        const fn = plugin.hooks?.onMediaUpload;
        if (fn) {
          current = await fn(current, { ...ctx, pluginName: plugin.name });
        }
      }
      return current;
    },
  };
}
