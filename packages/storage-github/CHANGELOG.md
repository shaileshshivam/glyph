# @glyph/storage-github

## 0.1.1

### Patch Changes

- **Plan 02 — UI Library + Themes**

  - `@glyph/ui` — new React component library: Button, Input, Textarea, Label, Field, Select, Dialog, Toast, CodeEditor. Styled via ~80 CSS variables. Base UI primitives under the hood. CodeMirror 6 with rose-pine themes for the editor. Ships `styles.css` and `tokens.css`.
  - `@glyph/theme-mithila` — first theme: vermilion + saffron + Cormorant Garamond + Libre Baskerville + Josefin Sans. Self-hosted fonts. 5 glyph React components (Lotus, Peacock, Fish, Surya, Yantra).
  - `apps/ui-preview` — internal Vite app rendering every component with the Mithila theme.

- Updated dependencies
  - @glyph/core@0.1.1

## 0.1.0

### Minor Changes

- Initial alpha release — Plan 01 Foundations.

  - `@glyph/core` ships the four adapter interfaces (Storage, Auth, Media, Schema), plugin type system, `definePlugin`, `defineConfig`, and the plugin host runtime.
  - `@glyph/storage-github` ships a complete GitHub-backed StorageAdapter: read, list, write (create + update), delete, branch — all tested against a mocked GitHub API via MSW.
  - Full TypeScript strict mode, zero runtime deps in core, MIT licensed.

### Patch Changes

- Updated dependencies
  - @glyph/core@0.1.0
