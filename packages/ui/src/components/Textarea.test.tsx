import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  test('renders', () => {
    render(<Textarea placeholder="Body" />);
    expect(screen.getByPlaceholderText('Body')).toBeInTheDocument();
  });

  test('invalid state', () => {
    render(<Textarea invalid data-testid="t" />);
    expect(screen.getByTestId('t')).toHaveAttribute('aria-invalid', 'true');
  });

  test('forwards ref', () => {
    const ref = { current: null as HTMLTextAreaElement | null };
    render(<Textarea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});
