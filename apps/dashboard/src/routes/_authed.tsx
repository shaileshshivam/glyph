import { Outlet, createFileRoute } from '@tanstack/react-router';
import { requireSession } from '../lib/auth-context';

export const Route = createFileRoute('/_authed')({
  beforeLoad: async ({ location }) => {
    return requireSession(location.href);
  },
  component: AuthedLayout,
});

function AuthedLayout() {
  return <Outlet />;
}
