# @glyph/storage-github

## 0.1.0

### Minor Changes

- Initial alpha release — Plan 01 Foundations.

  - `@glyph/core` ships the four adapter interfaces (Storage, Auth, Media, Schema), plugin type system, `definePlugin`, `defineConfig`, and the plugin host runtime.
  - `@glyph/storage-github` ships a complete GitHub-backed StorageAdapter: read, list, write (create + update), delete, branch — all tested against a mocked GitHub API via MSW.
  - Full TypeScript strict mode, zero runtime deps in core, MIT licensed.

### Patch Changes

- Updated dependencies
  - @glyph/core@0.1.0
