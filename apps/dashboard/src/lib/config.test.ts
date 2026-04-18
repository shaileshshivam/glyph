import { describe, expect, test } from 'vitest';
import { resolveConfigPath } from './config';

describe('resolveConfigPath', () => {
  test('defaults to GLYPH_CONFIG env when set', () => {
    const resolved = resolveConfigPath({
      env: { GLYPH_CONFIG: '/abs/path/to/glyph.config.ts' },
      cwd: '/home/user/project',
    });
    expect(resolved).toBe('/abs/path/to/glyph.config.ts');
  });

  test('falls back to glyph.config.ts in cwd', () => {
    const resolved = resolveConfigPath({
      env: {},
      cwd: '/home/user/project',
    });
    expect(resolved).toBe('/home/user/project/glyph.config.ts');
  });

  test('resolves relative GLYPH_CONFIG against cwd', () => {
    const resolved = resolveConfigPath({
      env: { GLYPH_CONFIG: './custom/glyph.config.ts' },
      cwd: '/home/user/project',
    });
    expect(resolved).toBe('/home/user/project/custom/glyph.config.ts');
  });
});
