import { cp } from 'node:fs/promises';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'es2022',
  treeshake: true,
  external: ['react', 'react-dom'],
  async onSuccess() {
    // Copy styles to dist so consumers can import '@glyph/ui/styles.css'
    await cp('src/styles/index.css', 'dist/styles.css');
    await cp('src/styles/tokens.css', 'dist/tokens.css');
    await cp('src/styles/components.css', 'dist/components.css');
  },
});
