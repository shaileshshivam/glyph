# @glyph/auth-env

The simplest viable auth adapter for Glyph — a single password stored in an environment variable, plus HMAC-signed session cookies. Perfect for self-hosted single-user deployments.

## Install

```bash
pnpm add @glyph/auth-env @glyph/core
```

## Usage

```ts
// glyph.config.ts
import { defineConfig } from '@glyph/core';
import { envAuth } from '@glyph/auth-env';
import { githubStorage } from '@glyph/storage-github';

export default defineConfig({
  storage: githubStorage({ /* ... */ }),
  auth: envAuth({
    passwordEnvVar: 'GLYPH_PASSWORD',
    sessionSecretEnvVar: 'GLYPH_SESSION_SECRET',
    sessionCookieName: 'glyph_session',
    sessionTtlDays: 30,
  }),
});
```

Then set:

```bash
GLYPH_PASSWORD="your-strong-password"
GLYPH_SESSION_SECRET="a-random-32-byte-hex-string"
```

Generate a session secret: `openssl rand -hex 32`

## Security notes

- The password lives in an env var; never in source
- Sessions are HMAC-SHA256-signed, HTTPS-only, SameSite=Lax
- Supply a stable `sessionSecretEnvVar` or sessions reset on every deploy
- Rotate the session secret to invalidate all active sessions

## License

MIT
