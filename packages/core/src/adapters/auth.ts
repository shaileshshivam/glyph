/**
 * AuthAdapter — the interface every authentication backend implements.
 *
 * Glyph hands the adapter a request-context (headers, cookies) and
 * asks who is signed in. The adapter is responsible for all provider-
 * specific OAuth flows, session storage, and permission semantics.
 */
export interface AuthAdapter {
  /** Resolve the current session from a request context, or null if anonymous. */
  getSession(ctx: AuthAdapterContext): Promise<AuthSession | null>;

  /** Terminate the current session. */
  signOut(): Promise<void>;

  /**
   * Check whether the current session has a given permission.
   * Permissions are adapter-defined strings like "content:write".
   */
  verifyPermission(permission: string): Promise<boolean>;
}

export interface AuthSession {
  /** Opaque user identifier. Unique per adapter. */
  userId: string;
  /** Display name, if known. */
  name?: string;
  /** Primary email, if known. */
  email?: string;
  /** Avatar URL, if known. */
  avatarUrl?: string;
  /** Arbitrary adapter-specific claims. */
  claims?: Record<string, unknown>;
}

export interface AuthAdapterContext {
  /** Incoming request headers (including Cookie). */
  headers: Headers;
  /** Current request URL. */
  url: URL;
}

/** Thrown when an operation requires auth but the request is anonymous. */
export class AuthRequiredError extends Error {
  readonly code = 'AUTH_REQUIRED';
  constructor(message = 'Authentication required') {
    super(message);
    this.name = 'AuthRequiredError';
  }
}

/** Thrown when the session lacks a needed permission. */
export class AuthForbiddenError extends Error {
  readonly code = 'AUTH_FORBIDDEN';
  constructor(public readonly permission: string) {
    super(`Permission denied: ${permission}`);
    this.name = 'AuthForbiddenError';
  }
}
