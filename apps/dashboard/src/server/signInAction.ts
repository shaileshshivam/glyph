import { createServerFn } from '@tanstack/react-start';
import { setResponseHeader } from '@tanstack/react-start/server';
import { loadConfig, resolveConfigPath } from '../lib/config';

export type SignInResult =
  | { ok: true }
  | { ok: false; reason: 'auth_not_configured' | 'invalid_password' };

export const signInAction = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => {
    if (
      typeof data !== 'object' ||
      data === null ||
      !('password' in data) ||
      typeof (data as { password: unknown }).password !== 'string'
    ) {
      throw new Error('Invalid input');
    }
    return { password: (data as { password: string }).password };
  })
  .handler(async ({ data }): Promise<SignInResult> => {
    const config = await loadConfig(resolveConfigPath({ env: process.env, cwd: process.cwd() }));
    if (config.auth === undefined || !('signIn' in config.auth)) {
      return { ok: false, reason: 'auth_not_configured' };
    }

    const adapter = config.auth as typeof config.auth & {
      signIn: (input: { password: string }) => Promise<{ ok: boolean; cookie: string }>;
    };

    const result = await adapter.signIn({ password: data.password });
    if (!result.ok) {
      return { ok: false, reason: 'invalid_password' };
    }

    setResponseHeader('Set-Cookie', result.cookie);
    return { ok: true };
  });
