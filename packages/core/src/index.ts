export const version = '0.0.0';

export type {
  StorageAdapter,
  StorageEntry,
  StorageWriteOptions,
  StorageWriteResult,
  StorageDeleteOptions,
} from './adapters/storage';
export { StorageEntryNotFoundError } from './adapters/storage';

export type { AuthAdapter, AuthSession, AuthAdapterContext } from './adapters/auth';
export { AuthRequiredError, AuthForbiddenError } from './adapters/auth';

export type { MediaAdapter, MediaUpload, MediaAsset } from './adapters/media';

export type {
  SchemaAdapter,
  CollectionSchema,
  FieldSchema,
  FieldType,
  ValidationResult,
  ValidationError,
} from './adapters/schema';

export type {
  Plugin,
  PluginCommand,
  PluginCommandContext,
  PluginRoute,
  PluginThemeDescriptor,
  PluginHooks,
  PluginHookContext,
  PluginEntry,
  PluginMediaUpload,
  PluginSettings,
} from './plugin/types';
export { definePlugin } from './plugin/define';

export type {
  GlyphConfig,
  GlyphThemeConfig,
  GlyphBranding,
} from './config/types';
export { defineConfig } from './config/define';

export { createPluginHost } from './plugin/host';
export type { PluginHost } from './plugin/host';
