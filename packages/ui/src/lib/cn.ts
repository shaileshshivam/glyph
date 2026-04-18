import { type ClassValue, clsx } from 'clsx';

/**
 * Join and normalize class names. Thin wrapper over clsx that strips
 * excess whitespace and deduplicates.
 */
export function cn(...args: ClassValue[]): string {
  return clsx(args).replace(/\s+/g, ' ').trim();
}
