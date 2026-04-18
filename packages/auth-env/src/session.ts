import { createHmac, timingSafeEqual } from 'node:crypto';

export interface SessionPayload {
  userId: string;
  iat: number;
  exp: number;
}

export interface VerifyOptions {
  /** Override the "current time" in seconds — useful for testing. Defaults to `Date.now() / 1000`. */
  now?: number;
}

function base64urlEncode(input: string): string {
  return Buffer.from(input, 'utf-8')
    .toString('base64')
    .replace(/=+$/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64urlDecode(input: string): string | null {
  try {
    const padded = input.replace(/-/g, '+').replace(/_/g, '/');
    const padding = (4 - (padded.length % 4)) % 4;
    return Buffer.from(padded + '='.repeat(padding), 'base64').toString('utf-8');
  } catch {
    return null;
  }
}

function hmacSignature(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

/**
 * Sign a session payload. Returns `payload.signature` where payload is
 * a base64url-encoded JSON string and signature is an HMAC-SHA256 base64url digest.
 */
export function signSession(payload: SessionPayload, secret: string): string {
  const encoded = base64urlEncode(JSON.stringify(payload));
  const sig = hmacSignature(encoded, secret);
  return `${encoded}.${sig}`;
}

/**
 * Verify a signed session cookie. Returns the payload if the signature is valid
 * and the session has not expired, otherwise null.
 */
export function verifySession(
  signed: string,
  secret: string,
  options: VerifyOptions = {},
): SessionPayload | null {
  const parts = signed.split('.');
  if (parts.length !== 2) return null;
  const [encoded, sig] = parts;
  if (encoded === undefined || sig === undefined || encoded === '' || sig === '') return null;

  const expected = hmacSignature(encoded, secret);
  if (!timingSafeEqualHex(expected, sig)) return null;

  const decoded = base64urlDecode(encoded);
  if (decoded === null) return null;
  let payload: SessionPayload;
  try {
    payload = JSON.parse(decoded) as SessionPayload;
  } catch {
    return null;
  }

  if (
    typeof payload.userId !== 'string' ||
    typeof payload.iat !== 'number' ||
    typeof payload.exp !== 'number'
  ) {
    return null;
  }

  const now = options.now ?? Math.floor(Date.now() / 1000);
  if (payload.exp < now) return null;

  return payload;
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return timingSafeEqual(ab, bb);
}
