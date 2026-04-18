import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, rows = 4, ...props }, ref) => {
    const ariaInvalid = invalid ? { 'aria-invalid': true as const } : {};
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn('glyph-textarea', invalid && 'glyph-input--invalid', className)}
        {...ariaInvalid}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';
