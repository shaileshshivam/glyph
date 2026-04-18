export const version = '0.0.0';

export type { AuthAdapter, AuthAdapterContext, AuthSession } from './adapters/auth';
export { AuthForbiddenError, AuthRequiredError } from './adapters/auth';
export type { MediaAdapter, MediaAsset, MediaUpload } from './adapters/media';
export type {
  CollectionSchema,
  FieldSchema,
  FieldType,
  SchemaAdapter,
  ValidationError,
  ValidationResult,
} from './adapters/schema';
export type {
  StorageAdapter,
  StorageDeleteOptions,
  StorageEntry,
  StorageWriteOptions,
  StorageWriteResult,
} from './adapters/storage';
export { StorageEntryNotFoundError } from './adapters/storage';
export { defineConfig } from './config/define';
export type {
  GlyphBranding,
  GlyphConfig,
  GlyphThemeConfig,
} from './config/types';
export { definePlugin } from './plugin/define';
export type { PluginHost } from './plugin/host';

export { createPluginHost } from './plugin/host';
export type {
  Plugin,
  PluginCommand,
  PluginCommandContext,
  PluginEntry,
  PluginHookContext,
  PluginHooks,
  PluginMediaUpload,
  PluginRoute,
  PluginSettings,
  PluginThemeDescriptor,
} from './plugin/types';
