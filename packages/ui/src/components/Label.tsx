import { forwardRef, type LabelHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export const Label = forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => (
  // biome-ignore lint/a11y/noLabelWithoutControl: Label is a primitive; consumers pass htmlFor or nest the control.
  <label ref={ref} className={cn('glyph-label', className)} {...props} />
));
Label.displayName = 'Label';
