import { Input } from '@glyph/ui';
import type { WidgetProps } from './types';

export function StringWidget({ field, value, onChange, invalid, id }: WidgetProps<string>) {
  return (
    <Input
      id={id}
      type="text"
      placeholder={field.hint}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value === '' ? undefined : e.target.value)}
      {...(invalid ? { invalid: true } : {})}
    />
  );
}
