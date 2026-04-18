import { Input } from '@glyph/ui';
import type { WidgetProps } from './types';

export function DateWidget({ field, value, onChange, invalid, id }: WidgetProps<string>) {
  // field.type is 'date' or 'datetime'; use the native input accordingly.
  const inputType = field.type === 'datetime' ? 'datetime-local' : 'date';
  return (
    <Input
      id={id}
      type={inputType}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value === '' ? undefined : e.target.value)}
      {...(invalid ? { invalid: true } : {})}
    />
  );
}
