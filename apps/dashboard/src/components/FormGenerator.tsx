import type { FieldSchema } from '@glyph/core';
import { Field } from '@glyph/ui';
import type { SerializableCollectionSchema } from '../server/getCollectionSchema';
import { getWidget } from './widgets/registry';

export interface FormGeneratorProps {
  schema: SerializableCollectionSchema;
  values: Record<string, unknown>;
  errors: Record<string, string | undefined>;
  onChange: (name: string, value: unknown) => void;
  /** Fields to render in this pane. Defaults to all non-markdown fields. */
  filter?: (field: FieldSchema) => boolean;
}

export function FormGenerator({ schema, values, errors, onChange, filter }: FormGeneratorProps) {
  const fields =
    filter === undefined
      ? schema.fields.filter((f) => f.type !== 'markdown')
      : schema.fields.filter(filter);
  return (
    <div className="glyph-form">
      {fields.map((field) => {
        const Widget = getWidget(field.type);
        const id = `field-${field.name}`;
        const error = errors[field.name];
        const fieldProps = {
          label: field.label,
          htmlFor: id,
          ...(field.required === true ? { required: true } : {}),
          ...(field.hint !== undefined ? { hint: field.hint } : {}),
          ...(error !== undefined ? { error } : {}),
        };
        return (
          <Field key={field.name} {...fieldProps}>
            {Widget !== null ? (
              <Widget
                id={id}
                field={field}
                value={values[field.name]}
                onChange={(v) => onChange(field.name, v)}
                invalid={error !== undefined}
              />
            ) : (
              <p style={{ color: 'var(--glyph-danger)' }}>Unknown widget type: {field.type}</p>
            )}
          </Field>
        );
      })}
    </div>
  );
}
