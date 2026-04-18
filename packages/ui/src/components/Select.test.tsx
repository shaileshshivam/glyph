import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Select } from './Select';

describe('Select', () => {
  test('renders trigger with placeholder', () => {
    render(
      <Select placeholder="Pick one" options={[{ value: 'a', label: 'A' }]} />,
    );
    expect(screen.getByRole('combobox')).toHaveTextContent('Pick one');
  });

  test('opens menu and selects an option', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Select
        placeholder="Status"
        options={[
          { value: 'draft', label: 'Draft' },
          { value: 'published', label: 'Published' },
        ]}
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Published' }));
    expect(onValueChange).toHaveBeenCalledWith('published');
  });

  test('controlled value reflects in trigger', () => {
    render(
      <Select
        value="draft"
        options={[
          { value: 'draft', label: 'Draft' },
          { value: 'published', label: 'Published' },
        ]}
      />,
    );
    expect(screen.getByRole('combobox')).toHaveTextContent('Draft');
  });
});
