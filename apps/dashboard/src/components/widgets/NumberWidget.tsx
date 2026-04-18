import { Input } from '@glyph/ui';
import type { WidgetProps } from './types';

export function NumberWidget({ value, onChange, invalid, id }: WidgetProps<number>) {
  return (
    <Input
      id={id}
      type="number"
      value={value !== undefined ? String(value) : ''}
      onChange={(e) => {
        const v = e.target.value;
        if (v === '') onChange(undefined);
        else {
          const n = Number(v);
          onChange(Number.isFinite(n) ? n : undefined);
        }
      }}
      {...(invalid ? { invalid: true } : {})}
    />
  );
}
