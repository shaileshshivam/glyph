import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  test('renders with placeholder', () => {
    render(<Input placeholder="Your name" />);
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
  });

  test('forwards type', () => {
    render(<Input type="email" data-testid="i" />);
    expect(screen.getByTestId('i')).toHaveAttribute('type', 'email');
  });

  test('forwards ref', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  test('applies invalid state', () => {
    render(<Input invalid data-testid="i" />);
    expect(screen.getByTestId('i').className).toMatch(/glyph-input--invalid/);
    expect(screen.getByTestId('i')).toHaveAttribute('aria-invalid', 'true');
  });
});
