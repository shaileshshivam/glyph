import { GLYPH_DEFAULT_SIZE, type GlyphProps } from './types';

export function Yantra({ size = GLYPH_DEFAULT_SIZE, ...rest }: GlyphProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      {...rest}
    >
      <rect
        x="24"
        y="6"
        width="24"
        height="24"
        transform="rotate(45 24 24)"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.7"
      />
      <rect
        x="24"
        y="14"
        width="16"
        height="16"
        transform="rotate(45 24 24)"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.55"
      />
      <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.9" />
    </svg>
  );
}
