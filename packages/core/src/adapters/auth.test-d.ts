import { assertType, test } from 'vitest';
import type { AuthAdapter, AuthSession, AuthAdapterContext } from './auth';

test('AuthAdapter has the expected shape', () => {
  const adapter = {} as AuthAdapter;

  assertType<(ctx: AuthAdapterContext) => Promise<AuthSession | null>>(adapter.getSession);
  assertType<() => Promise<void>>(adapter.signOut);
  assertType<(permission: string) => Promise<boolean>>(adapter.verifyPermission);
});
