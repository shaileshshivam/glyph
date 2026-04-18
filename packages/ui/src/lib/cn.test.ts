import { describe, expect, test } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  test('joins strings', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  test('filters falsy values', () => {
    expect(cn('a', undefined, null, false, '', 'b')).toBe('a b');
  });

  test('flattens arrays', () => {
    expect(cn('a', ['b', 'c'], 'd')).toBe('a b c d');
  });

  test('dedupes whitespace', () => {
    expect(cn('  a  ', '  b')).toBe('a b');
  });
});
