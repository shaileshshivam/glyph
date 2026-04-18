# @glyph/core

Framework-agnostic core for Glyph CMS — adapter interfaces, plugin host, and config helpers.

## Install

```bash
pnpm add @glyph/core
```

## Purpose

This package defines the shapes that Glyph expects for storage, auth, media, and schema handling. It does **not** implement any of them — those live in sibling packages like `@glyph/storage-github`.

Use this package when:

- Building a new adapter (storage, auth, media, schema)
- Building a new Glyph plugin
- Building a new Glyph UI / dashboard alternative

See [the monorepo README](https://github.com/shaileshshivam/glyph#readme) for the full picture.

## License

MIT
