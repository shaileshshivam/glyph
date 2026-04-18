import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Lotus } from './Lotus';

describe('Lotus', () => {
  test('renders an SVG with default size', () => {
    const { container } = render(<Lotus />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('width')).toBe('48');
    expect(svg?.getAttribute('height')).toBe('48');
  });

  test('custom size', () => {
    const { container } = render(<Lotus size={64} />);
    expect(container.querySelector('svg')?.getAttribute('width')).toBe('64');
  });

  test('custom color via style', () => {
    const { container } = render(<Lotus style={{ color: 'red' }} />);
    expect(container.querySelector('svg')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });
});
