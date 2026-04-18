import { defineConfig } from 'tsup';
import { cp } from 'node:fs/promises';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'es2022',
  treeshake: true,
  external: ['react'],
  async onSuccess() {
    await cp('src/theme.css', 'dist/theme.css');
    await cp('src/fonts', 'dist/fonts', { recursive: true });
  },
});
