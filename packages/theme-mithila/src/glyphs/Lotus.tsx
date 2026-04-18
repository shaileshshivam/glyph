import { GLYPH_DEFAULT_SIZE, type GlyphProps } from './types';

export function Lotus({ size = GLYPH_DEFAULT_SIZE, ...rest }: GlyphProps) {
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
      {[-30, -15, 0, 15, 30].map((deg) => (
        <ellipse
          key={deg}
          cx="24"
          cy="20"
          rx="5"
          ry="14"
          stroke="currentColor"
          strokeWidth="0.8"
          transform={`rotate(${deg}, 24, 32)`}
          opacity="0.75"
        />
      ))}
      <circle cx="24" cy="32" r="3" fill="currentColor" opacity="0.9" />
      <ellipse
        cx="24"
        cy="40"
        rx="16"
        ry="3"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.45"
      />
    </svg>
  );
}
