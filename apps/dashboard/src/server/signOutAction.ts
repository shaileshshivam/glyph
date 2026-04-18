import { createServerFn } from '@tanstack/react-start';
import { setResponseHeader } from '@tanstack/react-start/server';
import { loadConfig, resolveConfigPath } from '../lib/config';

export const signOutAction = createServerFn({ method: 'POST' }).handler(
  async (): Promise<{ ok: boolean }> => {
    const config = await loadConfig(
      resolveConfigPath({ env: process.env, cwd: process.cwd() }),
    );
    if (config.auth === undefined || !('signOut' in config.auth)) {
      return { ok: false };
    }
    const adapter = config.auth as unknown as {
      signOut: () => Promise<{ cookie: string }>;
    };
    const result = await adapter.signOut();
    setResponseHeader('Set-Cookie', result.cookie);
    return { ok: true };
  },
);
