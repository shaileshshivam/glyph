import { Select } from '@glyph/ui';
import type { WidgetProps } from './types';

interface RawOption {
  label: string;
  value: string;
}

export function SelectWidget({ field, value, onChange, id }: WidgetProps<string>) {
  const values =
    (field.options as { values?: Array<string | RawOption> } | undefined)?.values ?? [];
  const options = values.map((opt) => {
    if (typeof opt === 'string') return { label: opt, value: opt };
    return opt;
  });
  return (
    <Select
      {...(id !== undefined ? { id } : {})}
      {...(value !== undefined ? { value } : {})}
      onValueChange={(v) => onChange(v)}
      options={options}
      placeholder={field.hint ?? 'Select…'}
    />
  );
}
