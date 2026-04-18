import { beforeEach, describe, expect, test } from 'vitest';
import { envAuth } from './adapter';

const PASSWORD_VAR = 'TEST_GLYPH_PASSWORD';
const SECRET_VAR = 'TEST_GLYPH_SESSION_SECRET';

function resetEnv() {
  process.env[PASSWORD_VAR] = 'correct-horse-battery-staple';
  process.env[SECRET_VAR] = 'f'.repeat(64);
}

describe('envAuth adapter', () => {
  beforeEach(() => {
    resetEnv();
  });

  test('getSession returns null when no cookie present', async () => {
    const adapter = envAuth({ passwordEnvVar: PASSWORD_VAR, sessionSecretEnvVar: SECRET_VAR });
    const session = await adapter.getSession({
      headers: new Headers(),
      url: new URL('http://localhost/'),
    });
    expect(session).toBeNull();
  });

  test('signIn with correct password returns a cookie header', async () => {
    const adapter = envAuth({ passwordEnvVar: PASSWORD_VAR, sessionSecretEnvVar: SECRET_VAR });
    const result = await adapter.signIn({ password: 'correct-horse-battery-staple' });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error();
    expect(result.cookie).toMatch(/^glyph_session=[^;]+/);
    expect(result.cookie).toContain('HttpOnly');
    expect(result.cookie).toContain('SameSite=Lax');
    expect(result.cookie).toContain('Path=/');
  });

  test('signIn with wrong password returns failure', async () => {
    const adapter = envAuth({ passwordEnvVar: PASSWORD_VAR, sessionSecretEnvVar: SECRET_VAR });
    const result = await adapter.signIn({ password: 'nope' });
    expect(result.ok).toBe(false);
  });

  test('round trip — signIn then getSession with the cookie', async () => {
    const adapter = envAuth({ passwordEnvVar: PASSWORD_VAR, sessionSecretEnvVar: SECRET_VAR });
    const signed = await adapter.signIn({ password: 'correct-horse-battery-staple' });
    if (!signed.ok) throw new Error();

    const cookieValue = signed.cookie.split(';')[0];
    const headers = new Headers({ Cookie: cookieValue ?? '' });
    const session = await adapter.getSession({ headers, url: new URL('http://localhost/') });

    expect(session).not.toBeNull();
    expect(session?.userId).toBe('glyph_user');
  });

  test('signOut returns a clearing cookie', async () => {
    const adapter = envAuth({ passwordEnvVar: PASSWORD_VAR, sessionSecretEnvVar: SECRET_VAR });
    const result = await adapter.signOut();
    expect(result.cookie).toMatch(/^glyph_session=;/);
    expect(result.cookie).toMatch(/Max-Age=0/);
  });

  test('throws if password env var is not set', async () => {
    delete process.env[PASSWORD_VAR];
    const adapter = envAuth({ passwordEnvVar: PASSWORD_VAR, sessionSecretEnvVar: SECRET_VAR });
    await expect(adapter.signIn({ password: 'x' })).rejects.toThrow(/TEST_GLYPH_PASSWORD/);
  });

  test('verifyPermission always true when session exists (single-user model)', async () => {
    const adapter = envAuth({ passwordEnvVar: PASSWORD_VAR, sessionSecretEnvVar: SECRET_VAR });
    expect(await adapter.verifyPermission('content:write')).toBe(true);
  });
});
