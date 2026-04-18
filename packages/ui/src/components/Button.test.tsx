import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  test('renders children', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  test('applies variant class', () => {
    render(<Button variant="secondary">Cancel</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toMatch(/glyph-btn--secondary/);
  });

  test('applies size class', () => {
    render(<Button size="sm">X</Button>);
    expect(screen.getByRole('button').className).toMatch(/glyph-btn--sm/);
  });

  test('forwards ref', () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  test('disabled state', () => {
    render(<Button disabled>Off</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
