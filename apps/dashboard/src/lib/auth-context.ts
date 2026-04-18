import { redirect } from '@tanstack/react-router';
import { getSession, type SerializableSession } from '../server/getSession';

/**
 * Use inside a route's `beforeLoad` to require authentication.
 * Redirects to `/login?next=<current-path>` if no session.
 */
export async function requireSession(
  currentPath: string,
): Promise<{ session: SerializableSession }> {
  const session = await getSession();
  if (session === null) {
    throw redirect({
      to: '/login',
      search: { next: currentPath },
    });
  }
  return { session };
}
