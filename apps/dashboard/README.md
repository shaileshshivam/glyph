# @glyph/dashboard

The Glyph CMS dashboard — a deployable TanStack Start app.

**Private package** — not published to npm. Fork and deploy as your own instance.

## Run locally

Set env vars (see `.env.example`):

```bash
GLYPH_PASSWORD="your-strong-password"
GLYPH_SESSION_SECRET="$(openssl rand -hex 32)"
GITHUB_TOKEN="ghp_..."
GLYPH_GITHUB_OWNER="your-gh-username"
GLYPH_GITHUB_REPO="your-content-repo"
GLYPH_GITHUB_BRANCH="main"
```

Create a `glyph.config.ts` at the monorepo root (see `glyph.config.ts.example`), then:

```bash
pnpm --filter @glyph/dashboard dev
```

Opens at `http://localhost:3000`.

## License

MIT
