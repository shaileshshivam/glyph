import type { AuthAdapter, AuthAdapterContext, AuthSession } from '@glyph/core';
import { signSession, verifySession, type SessionPayload } from './session';

export interface EnvAuthOptions {
  /** Name of the env var holding the password. Default: `GLYPH_PASSWORD`. */
  passwordEnvVar?: string;
  /** Name of the env var holding the HMAC session secret. Default: `GLYPH_SESSION_SECRET`. */
  sessionSecretEnvVar?: string;
  /** Cookie name. Default: `glyph_session`. */
  sessionCookieName?: string;
  /** Session lifetime in days. Default: 30. */
  sessionTtlDays?: number;
  /** User identifier stamped into session payload. Default: `'glyph_user'`. */
  userId?: string;
}

export interface SignInInput {
  password: string;
}

export interface SignInResult {
  ok: boolean;
  cookie: string;
}

export interface SignOutResult {
  cookie: string;
}

export interface EnvAuthAdapter extends Omit<AuthAdapter, 'signOut'> {
  signIn(input: SignInInput): Promise<SignInResult>;
  signOut(): Promise<SignOutResult>;
  /** Expose cookie name for dashboard middleware to reuse. */
  readonly cookieName: string;
}

/**
 * envAuth — a single-user password adapter.
 *
 * Reads the expected password from an env var at request time (so rotating
 * the env invalidates future logins without requiring a redeploy). Issues
 * HMAC-signed session cookies.
 */
export function envAuth(options: EnvAuthOptions = {}): EnvAuthAdapter {
  const passwordEnvVar = options.passwordEnvVar ?? 'GLYPH_PASSWORD';
  const sessionSecretEnvVar = options.sessionSecretEnvVar ?? 'GLYPH_SESSION_SECRET';
  const cookieName = options.sessionCookieName ?? 'glyph_session';
  const ttlSeconds = (options.sessionTtlDays ?? 30) * 24 * 60 * 60;
  const userId = options.userId ?? 'glyph_user';

  function readPassword(): string {
    const value = process.env[passwordEnvVar];
    if (value === undefined || value === '') {
      throw new Error(`envAuth: ${passwordEnvVar} is not set`);
    }
    return value;
  }

  function readSecret(): string {
    const value = process.env[sessionSecretEnvVar];
    if (value === undefined || value === '') {
      throw new Error(`envAuth: ${sessionSecretEnvVar} is not set`);
    }
    return value;
  }

  return {
    cookieName,

    async getSession(ctx: AuthAdapterContext): Promise<AuthSession | null> {
      const cookieHeader = ctx.headers.get('cookie');
      if (cookieHeader === null || cookieHeader === '') return null;
      const parsed = parseCookie(cookieHeader, cookieName);
      if (parsed === null) return null;
      const secret = process.env[sessionSecretEnvVar];
      if (secret === undefined || secret === '') return null;
      const payload = verifySession(parsed, secret);
      if (payload === null) return null;
      return { userId: payload.userId };
    },

    async signIn(input: SignInInput): Promise<SignInResult> {
      const expected = readPassword();
      if (input.password !== expected) {
        return { ok: false, cookie: '' };
      }
      const secret = readSecret();
      const now = Math.floor(Date.now() / 1000);
      const payload: SessionPayload = {
        userId,
        iat: now,
        exp: now + ttlSeconds,
      };
      const signed = signSession(payload, secret);
      const cookie = [
        `${cookieName}=${signed}`,
        'Path=/',
        'HttpOnly',
        'SameSite=Lax',
        'Secure',
        `Max-Age=${ttlSeconds}`,
      ].join('; ');
      return { ok: true, cookie };
    },

    async signOut(): Promise<SignOutResult> {
      const cookie = `${cookieName}=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`;
      return { cookie };
    },

    async verifyPermission(_permission: string): Promise<boolean> {
      // Single-user model: any authenticated request has all permissions.
      return true;
    },
  };
}

function parseCookie(header: string, name: string): string | null {
  const pairs = header.split(';');
  for (const pair of pairs) {
    const [rawKey, ...rest] = pair.split('=');
    if (rawKey === undefined) continue;
    if (rawKey.trim() === name) {
      return rest.join('=').trim();
    }
  }
  return null;
}
