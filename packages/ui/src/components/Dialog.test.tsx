import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { Button } from './Button';
import { Dialog } from './Dialog';

describe('Dialog', () => {
  test('opens when trigger clicked, closes via close button', async () => {
    const user = userEvent.setup();
    render(
      <Dialog title="Confirm" description="Are you sure?" trigger={<Button>Open</Button>}>
        <p>Body</p>
      </Dialog>,
    );
    expect(screen.queryByText('Body')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(await screen.findByText('Body')).toBeInTheDocument();
    await user.click(screen.getByLabelText('Close'));
    await waitFor(() => expect(screen.queryByText('Body')).not.toBeInTheDocument());
  });

  test('onOpenChange fires', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Dialog title="X" trigger={<Button>Open</Button>} onOpenChange={onOpenChange}>
        hi
      </Dialog>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
  });
});
