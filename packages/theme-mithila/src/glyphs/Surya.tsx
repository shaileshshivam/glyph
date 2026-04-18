import { GLYPH_DEFAULT_SIZE, type GlyphProps } from './types';

export function Surya({ size = GLYPH_DEFAULT_SIZE, ...rest }: GlyphProps) {
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
      <circle cx="24" cy="24" r="8" fill="currentColor" opacity="0.3" />
      <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="0.7" opacity="0.7" />
      <circle cx="24" cy="24" r="4" fill="currentColor" opacity="0.9" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
        const a = (deg * Math.PI) / 180;
        const x1 = 24 + Math.cos(a) * 14;
        const y1 = 24 + Math.sin(a) * 14;
        const x2 = 24 + Math.cos(a) * 20;
        const y2 = 24 + Math.sin(a) * 20;
        return (
          <line
            key={deg}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.7"
          />
        );
      })}
    </svg>
  );
}
