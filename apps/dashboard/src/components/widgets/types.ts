import type { FieldSchema } from '@glyph/core';

export interface WidgetProps<T = unknown> {
  field: FieldSchema;
  value: T | undefined;
  onChange: (value: T | undefined) => void;
  invalid?: boolean;
  id?: string;
}
