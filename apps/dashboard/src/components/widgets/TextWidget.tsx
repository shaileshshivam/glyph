import { Textarea } from '@glyph/ui';
import type { WidgetProps } from './types';

export function TextWidget({ field, value, onChange, invalid, id }: WidgetProps<string>) {
  return (
    <Textarea
      id={id}
      rows={3}
      placeholder={field.hint}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value === '' ? undefined : e.target.value)}
      {...(invalid ? { invalid: true } : {})}
    />
  );
}
