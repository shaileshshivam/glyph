import type { AuthAdapter } from '../adapters/auth';
import type { MediaAdapter } from '../adapters/media';
import type { SchemaAdapter } from '../adapters/schema';
import type { StorageAdapter } from '../adapters/storage';
import type { Plugin } from '../plugin/types';

/**
 * GlyphConfig — the top-level object adopters assemble to wire up an
 * Glyph instance. Exactly one storage adapter is required; auth/media/
 * schema adapters have sensible defaults when omitted.
 */
export interface GlyphConfig {
  /** Where content lives. Required. */
  storage: StorageAdapter;

  /** Who can sign in. Defaults to "no-op anonymous" if omitted. */
  auth?: AuthAdapter;

  /** Where media goes. Defaults to same as storage ("media-git"). */
  media?: MediaAdapter;

  /** How to read collection definitions. Defaults to "schema-typescript". */
  schema?: SchemaAdapter;

  /** Plugins to load. Order determines registration order. */
  plugins?: Plugin[];

  /** Theme configuration. */
  theme?: GlyphThemeConfig;

  /** Branding / workspace metadata. */
  branding?: GlyphBranding;

  /** Single-workspace addressing. */
  workspace?: { name: string; description?: string };
}

export interface GlyphThemeConfig {
  /**
   * A theme module, a built-in theme name, or an object describing
   * an ad-hoc theme (stylesheet path + optional slots).
   */
  preset?: string | { stylesheet: string };
  /** Override a few variables without creating a full theme package. */
  overrideStylesheet?: string;
  /** Layout density. */
  layout?: 'spacious' | 'comfortable' | 'dense' | 'zen';
}

export interface GlyphBranding {
  name?: string;
  shortName?: string;
  logo?: string;
  favicon?: string;
  login?: { tagline?: string; cta?: string };
}
