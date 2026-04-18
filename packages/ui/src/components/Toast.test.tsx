import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import { Button } from './Button';
import { ToastProvider, useToast } from './Toast';

function Trigger() {
  const { add } = useToast();
  return (
    <Button onClick={() => add({ title: 'Saved', description: 'Live in ~25s' })}>Trigger</Button>
  );
}

describe('Toast', () => {
  test('provider + useToast adds a toast to the region', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Trigger' }));
    expect(await screen.findByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Live in ~25s')).toBeInTheDocument();
  });
});
