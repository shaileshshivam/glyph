# @glyph/schema-yaml

## 0.1.0

### Minor Changes

- **Plan 04 — Full editor**

  - `@glyph/schema-yaml` — new package: parses `glyph.collections.yml` into `CollectionSchema[]`. Implements `SchemaAdapter` from `@glyph/core`. Supports 9 field types (string, text, markdown, number, boolean, select, list, date, datetime).
  - `@glyph/dashboard` — editor delivered:
    - `/collections/:name/:slug` — two-pane editor with schema-driven frontmatter form + markdown body (CodeEditor)
    - `/collections/:name/new` — scaffolder with schema defaults
    - 8 widget types (string, text, number, boolean, select, list, date, markdown)
    - Save draft + Publish actions commit via the storage adapter
    - Delete action with type-to-confirm dialog
    - Dirty state + `beforeunload` guard
    - Keyboard: `⌘S` save draft, `⌘⇧P` publish
    - Toast notifications
