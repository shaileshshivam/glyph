# Glyph

> The CMS that fits your stack. Beautifully.

Glyph is a headless CMS. Plugin-first, adapter-first, framework-agnostic — designed to be beautiful enough that developers want to use it on their own sites and trust it on client work.

**Status:** early alpha. Foundations shipping, v1.0 roadmap in progress.

## Packages

| Package | Description | Status |
|---------|-------------|--------|
| [`@glyph/core`](./packages/core) | Framework-agnostic core: adapter interfaces, plugin host, config helpers. | alpha |
| [`@glyph/storage-github`](./packages/storage-github) | `StorageAdapter` implementation for GitHub repos. | alpha |

More packages (UI, dashboard, additional adapters, themes) coming in subsequent releases.

## Philosophy

- **Backend-agnostic.** Swap storage, auth, media, schema via adapters. Git today, database tomorrow, anything via plugins.
- **Plugin-first.** Every extension point uses the same API. Fields, commands, routes, themes, adapters — all plugins.
- **Beautiful by default.** Craftsmanship is a feature. A tool you enjoy opening.
- **World-class OSS.** MIT licensed. Released with discipline.

## Development

```bash
pnpm install
pnpm build
pnpm test
```

## License

MIT © Shailesh Shivam
