# @glyph/auth-env

## 0.1.0

### Minor Changes

- **Plan 03 — Dashboard shell + auth**

  - `@glyph/auth-env` — new package: single-user password adapter with HMAC-signed session cookies. Reads password + session secret from env vars. Implements `AuthAdapter` from `@glyph/core`.
  - `@glyph/dashboard` (private) — new deployable TanStack Start app:
    - `/login` — password sign-in using `@glyph/ui` components styled via `@glyph/theme-mithila`
    - `/` — dashboard home with configured collections
    - `/collections/:name` — read-only entry list
    - Session-gated routes via `_authed` layout
    - Config loaded from user-supplied `glyph.config.ts`
