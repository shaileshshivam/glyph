import { describe, expect, test } from 'vitest';
import { signSession, verifySession, type SessionPayload } from './session';

const SECRET = 'a'.repeat(64); // 32 bytes as hex

describe('session signing', () => {
  test('signs a payload and verifies it back', () => {
    const payload: SessionPayload = {
      userId: 'shaileshshivam',
      iat: 1_000_000_000,
      exp: 1_000_000_000 + 3600,
    };
    const signed = signSession(payload, SECRET);
    const verified = verifySession(signed, SECRET, { now: 1_000_000_000 });
    expect(verified).toEqual(payload);
  });

  test('rejects tampered payload', () => {
    const payload: SessionPayload = { userId: 'a', iat: 1, exp: 1000 };
    const signed = signSession(payload, SECRET);
    // Mutate payload portion after signing
    const [p, s] = signed.split('.');
    const tampered = `${p}X.${s}`;
    expect(verifySession(tampered, SECRET)).toBeNull();
  });

  test('rejects different secret', () => {
    const payload: SessionPayload = { userId: 'a', iat: 1, exp: 1000 };
    const signed = signSession(payload, SECRET);
    expect(verifySession(signed, 'b'.repeat(64))).toBeNull();
  });

  test('rejects malformed cookie', () => {
    expect(verifySession('not-a-cookie', SECRET)).toBeNull();
    expect(verifySession('', SECRET)).toBeNull();
    expect(verifySession('a.b.c', SECRET)).toBeNull();
  });

  test('rejects expired session', () => {
    const payload: SessionPayload = { userId: 'a', iat: 1, exp: 100 };
    const signed = signSession(payload, SECRET);
    // verify with now > exp
    expect(verifySession(signed, SECRET, { now: 200 })).toBeNull();
    expect(verifySession(signed, SECRET, { now: 50 })).toEqual(payload);
  });
});
