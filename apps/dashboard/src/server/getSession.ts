import type { AuthSession } from '@glyph/core';
import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { loadConfig, resolveConfigPath } from '../lib/config';

/**
 * A serializable projection of {@link AuthSession} suitable for shipping from
 * a server function to the client. We drop the open-ended `claims` map
 * because TanStack Start's serializer rejects `Record<string, unknown>`.
 */
export interface SerializableSession {
  userId: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
}

function toSerializable(session: AuthSession): SerializableSession {
  return {
    userId: session.userId,
    ...(session.name !== undefined ? { name: session.name } : {}),
    ...(session.email !== undefined ? { email: session.email } : {}),
    ...(session.avatarUrl !== undefined ? { avatarUrl: session.avatarUrl } : {}),
  };
}

export const getSession = createServerFn({ method: 'GET' }).handler(
  async (): Promise<SerializableSession | null> => {
    const request = getRequest();

    const config = await loadConfig(resolveConfigPath({ env: process.env, cwd: process.cwd() }));
    if (config.auth === undefined) return null;

    const session: AuthSession | null = await config.auth.getSession({
      headers: request.headers,
      url: new URL(request.url),
    });
    if (session === null) return null;
    return toSerializable(session);
  },
);
