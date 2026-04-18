import { Button } from '@glyph/ui';
import { createFileRoute, Outlet, useNavigate, useRouter } from '@tanstack/react-router';
import { requireSession } from '../lib/auth-context';
import { signOutAction } from '../server/signOutAction';

export const Route = createFileRoute('/_authed')({
  beforeLoad: async ({ location }) => {
    return requireSession(location.href);
  },
  component: AuthedLayout,
});

function AuthedLayout() {
  const router = useRouter();
  const navigate = useNavigate();
  async function handleSignOut() {
    await signOutAction();
    await router.invalidate();
    navigate({ to: '/login' });
  }
  return (
    <div>
      <nav className="glyph-topbar">
        <span className="glyph-topbar__brand">Glyph</span>
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          Sign out
        </Button>
      </nav>
      <Outlet />
    </div>
  );
}
