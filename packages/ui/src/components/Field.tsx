import type { ReactElement, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Label } from './Label';

export interface FieldProps {
  label?: ReactNode;
  htmlFor?: string;
  required?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  className,
  children,
}: FieldProps): ReactElement {
  const labelProps = htmlFor !== undefined ? { htmlFor } : {};
  return (
    <div className={cn('glyph-field', error && 'glyph-field--error', className)}>
      {label !== undefined && (
        <Label {...labelProps} className="glyph-field__label">
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </Label>
      )}
      <div className="glyph-field__control">{children}</div>
      {error !== undefined ? (
        <p className="glyph-field__error" role="alert">
          {error}
        </p>
      ) : hint !== undefined ? (
        <p className="glyph-field__hint">{hint}</p>
      ) : null}
    </div>
  );
}
