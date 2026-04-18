import { GLYPH_DEFAULT_SIZE, type GlyphProps } from './types';

export function Fish({ size = GLYPH_DEFAULT_SIZE, ...rest }: GlyphProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 48 32" fill="none" aria-hidden="true" {...rest}>
      <ellipse cx="18" cy="16" rx="14" ry="7" stroke="currentColor" strokeWidth="0.8" opacity="0.75" />
      <path d="M32 16 L44 8 L44 24 Z" fill="currentColor" opacity="0.25" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="10" cy="14" r="1.8" fill="currentColor" opacity="0.9" />
      <path d="M14 12 Q18 8 22 12" stroke="currentColor" strokeWidth="0.4" fill="none" opacity="0.55" />
      <path d="M14 20 Q18 24 22 20" stroke="currentColor" strokeWidth="0.4" fill="none" opacity="0.55" />
    </svg>
  );
}
