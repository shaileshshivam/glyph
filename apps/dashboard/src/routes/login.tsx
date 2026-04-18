import { Lotus } from '@glyph/theme-mithila';
import { Button, Field, Input } from '@glyph/ui';
import { createFileRoute, Link, useNavigate, useRouter } from '@tanstack/react-router';
import { type FormEvent, useState } from 'react';
import { signInAction } from '../server/signInAction';

export interface LoginSearch {
  next?: string;
}

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    const next = typeof search.next === 'string' ? search.next : undefined;
    return next !== undefined ? { next } : {};
  },
  component: LoginPage,
});

function LoginPage() {
  const { next } = Route.useSearch();
  const navigate = useNavigate();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await signInAction({ data: { password } });
      if (!result.ok) {
        setError(result.reason === 'invalid_password' ? 'Wrong password.' : 'Sign-in failed.');
        return;
      }
      await router.invalidate();
      navigate({ to: next ?? '/' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="glyph-login">
      <div className="glyph-login__card">
        <Lotus size={48} style={{ color: 'var(--glyph-accent)' }} />
        <h1 className="glyph-login__title">Glyph</h1>
        <p className="glyph-login__subtitle">Sign in to your workspace.</p>
        <form onSubmit={handleSubmit} className="glyph-login__form">
          <Field label="Password" htmlFor="glyph-password" error={error ?? undefined}>
            <Input
              id="glyph-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              autoComplete="current-password"
              required
            />
          </Field>
          <Button type="submit" disabled={loading || password.length === 0}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
        <p className="glyph-login__footnote">
          First time? See <Link to="/">/setup</Link> (coming soon).
        </p>
      </div>
    </main>
  );
}
