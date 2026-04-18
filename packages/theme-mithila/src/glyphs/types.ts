import type { SVGAttributes } from 'react';

export interface GlyphProps extends Omit<SVGAttributes<SVGSVGElement>, 'xmlns'> {
  size?: number | string;
}

export const GLYPH_DEFAULT_SIZE = 48;
