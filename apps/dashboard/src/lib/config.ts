import { isAbsolute, resolve } from 'node:path';
import type { GlyphConfig } from '@glyph/core';

export interface ResolveConfigPathInput {
  env: Record<string, string | undefined>;
  cwd: string;
}

/**
 * Resolve the absolute path to the user's glyph.config.ts file.
 * Order of precedence:
 *   1. GLYPH_CONFIG env var (absolute or relative to cwd)
 *   2. `<cwd>/glyph.config.ts`
 */
export function resolveConfigPath({ env, cwd }: ResolveConfigPathInput): string {
  const override = env.GLYPH_CONFIG;
  if (override !== undefined && override !== '') {
    return isAbsolute(override) ? override : resolve(cwd, override);
  }
  return resolve(cwd, 'glyph.config.ts');
}

/**
 * Dynamically import the user's config. Called once at app startup by
 * the server. Caches the resolved config per process (hot reload on
 * change is handled by Vite's module graph).
 */
let cachedConfig: GlyphConfig | null = null;

export async function loadConfig(path: string): Promise<GlyphConfig> {
  if (cachedConfig !== null) return cachedConfig;
  const mod = (await import(/* @vite-ignore */ path)) as { default?: GlyphConfig };
  if (mod.default === undefined) {
    throw new Error(`glyph.config.ts at ${path} must export a default config`);
  }
  cachedConfig = mod.default;
  return cachedConfig;
}

/** Reset cached config — useful in tests. */
export function resetConfigCache(): void {
  cachedConfig = null;
}
