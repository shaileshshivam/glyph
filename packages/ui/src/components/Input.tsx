import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => {
    const ariaInvalid = invalid ? { 'aria-invalid': true as const } : {};
    return (
      <input
        ref={ref}
        className={cn('glyph-input', invalid && 'glyph-input--invalid', className)}
        {...ariaInvalid}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';
