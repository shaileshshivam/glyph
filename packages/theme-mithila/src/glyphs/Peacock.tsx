import { GLYPH_DEFAULT_SIZE, type GlyphProps } from './types';

export function Peacock({ size = GLYPH_DEFAULT_SIZE, ...rest }: GlyphProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" {...rest}>
      <ellipse cx="24" cy="24" rx="18" ry="22" stroke="currentColor" strokeWidth="1" opacity="0.55" />
      <ellipse cx="24" cy="24" rx="12" ry="16" stroke="currentColor" strokeWidth="0.7" opacity="0.65" />
      <ellipse cx="24" cy="24" rx="6" ry="10" stroke="currentColor" strokeWidth="0.6" opacity="0.75" />
      <ellipse cx="24" cy="24" rx="3" ry="5" fill="currentColor" opacity="0.4" />
      <circle cx="24" cy="24" r="1.5" fill="currentColor" opacity="0.9" />
    </svg>
  );
}
