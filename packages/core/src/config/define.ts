import type { GlyphConfig } from './types';

/**
 * defineConfig — identity function that preserves types for authors.
 */
export function defineConfig<const C extends GlyphConfig>(config: C): C & GlyphConfig {
  return config;
}
