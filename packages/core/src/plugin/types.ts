import type { StorageAdapter } from '../adapters/storage';
import type { AuthAdapter } from '../adapters/auth';
import type { MediaAdapter } from '../adapters/media';
import type { SchemaAdapter, FieldType } from '../adapters/schema';

/**
 * Plugin — the shape every Glyph extension takes.
 *
 * A plugin declares what it contributes: commands, fields, routes, slots,
 * themes, or adapter implementations. It can also register hooks that
 * run at specific lifecycle events.
 */
export interface Plugin {
  /** Unique identifier. Convention: package name or namespaced id. */
  name: string;
  /** Semver of the plugin itself. */
  version: string;

  /** Custom field widget types this plugin adds. */
  fields?: Record<string, FieldType>;

  /** Command palette entries. */
  commands?: PluginCommand[];

  /** Dashboard routes this plugin adds. */
  routes?: PluginRoute[];

  /** Named UI region overrides. */
  slots?: Record<string, unknown>;

  /** Themes this plugin ships. Keyed by theme id. */
  themes?: Record<string, PluginThemeDescriptor>;

  /** Adapter implementations this plugin provides. */
  adapters?: {
    storage?: StorageAdapter;
    auth?: AuthAdapter;
    media?: MediaAdapter;
    schema?: SchemaAdapter;
  };

  /** Lifecycle hooks. */
  hooks?: PluginHooks;

  /** Plugin's own settings definition and UI component. */
  settings?: PluginSettings;
}

export interface PluginCommand {
  /** Dot-namespaced id, e.g. "ai.tighten". */
  id: string;
  /** Human label for the palette. */
  label: string;
  /** Optional keyboard shortcut ("mod+shift+t"). */
  shortcut?: string;
  /** Runs when the command is invoked. Return value is surfaced to the UI. */
  run(ctx: PluginCommandContext): Promise<unknown>;
}

export interface PluginCommandContext {
  /** The plugin that registered the command. */
  pluginName: string;
  /** Opaque dashboard context for bridging UI/server. */
  dashboard: unknown;
}

export interface PluginRoute {
  /** URL path within the dashboard, e.g. "/audit". */
  path: string;
  /** Component identifier (string reference resolvable by UI layer). */
  component: string;
  /** Optional label for navigation. */
  label?: string;
}

export interface PluginThemeDescriptor {
  /** Theme display name. */
  name: string;
  /** URL or path to the theme's CSS file. */
  stylesheet: string;
  /** Optional manifest of fonts + logos. */
  assets?: Record<string, string>;
}

export interface PluginHooks {
  /** Runs before an entry is written. Return a modified entry or the same. */
  beforeSave?: (entry: PluginEntry, ctx: PluginHookContext) => Promise<PluginEntry>;
  /** Runs after an entry is successfully written. */
  afterSave?: (entry: PluginEntry, ctx: PluginHookContext) => Promise<void>;
  /** Runs before an entry is deleted. Return false to cancel. */
  beforeDelete?: (path: string, ctx: PluginHookContext) => Promise<boolean | void>;
  /** Runs after an entry is deleted. */
  afterDelete?: (path: string, ctx: PluginHookContext) => Promise<void>;
  /** Runs when a media file is about to be uploaded. */
  onMediaUpload?: (
    upload: PluginMediaUpload,
    ctx: PluginHookContext,
  ) => Promise<PluginMediaUpload>;
  /** Runs when the editor is initialized. */
  onEditorLoad?: (editorCtx: unknown) => Promise<void>;
}

export interface PluginHookContext {
  /** The plugin firing the hook. */
  pluginName: string;
  /** Session of the acting user, if any. */
  session: { userId: string; email?: string } | null;
  /** The collection the operation targets. */
  collection?: string;
}

export interface PluginEntry {
  path: string;
  frontmatter: Record<string, unknown>;
  body: string;
}

export interface PluginMediaUpload {
  filename: string;
  contentType: string;
  bytes: Uint8Array;
  alt?: string;
  directory?: string;
}

export interface PluginSettings {
  /** Zod-ish schema string or path to schema file (resolved by adapter). */
  schemaRef: string;
  /** Opaque reference to a React component that renders the settings form. */
  componentRef?: string;
}
