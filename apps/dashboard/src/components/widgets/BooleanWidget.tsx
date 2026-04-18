import type { WidgetProps } from './types';

export function BooleanWidget({ value, onChange, id, field }: WidgetProps<boolean>) {
  return (
    <label className="glyph-widget__checkbox">
      <input
        id={id}
        type="checkbox"
        checked={value === true}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{field.hint ?? 'Yes'}</span>
    </label>
  );
}
