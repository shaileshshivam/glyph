import { Dialog as BaseDialog } from '@base-ui-components/react/dialog';
import type { ReactElement, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface DialogProps {
  title: ReactNode;
  description?: ReactNode;
  /**
   * The element rendered as the dialog trigger. Must be a single `ReactElement`
   * because Base UI's `Dialog.Trigger` composes with its child via the `render`
   * prop (which expects a `ReactElement`, not a generic `ReactNode`).
   */
  trigger: ReactElement;
  children: ReactNode;
  footer?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, event?: Event) => void;
  className?: string;
}

export function Dialog({
  title,
  description,
  trigger,
  children,
  footer,
  open,
  defaultOpen,
  onOpenChange,
  className,
}: DialogProps): ReactElement {
  const handleOpenChange = onOpenChange
    ? (nextOpen: boolean, eventDetails: { event?: Event } | undefined) => {
        onOpenChange(nextOpen, eventDetails?.event);
      }
    : undefined;
  return (
    <BaseDialog.Root
      {...(open !== undefined ? { open } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(handleOpenChange !== undefined ? { onOpenChange: handleOpenChange } : {})}
    >
      {/*
        Base UI's `Dialog.Trigger.render` is typed as
        `ReactElement<Record<string, unknown>>`. Our public `trigger` prop uses the
        more general `ReactElement` (props default to `unknown`) so callers can
        pass any component. Narrow the cast to the exact shape Base UI expects —
        no `any`, no runtime change.
      */}
      <BaseDialog.Trigger render={trigger as ReactElement<Record<string, unknown>>} />
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="glyph-dialog__backdrop" />
        <BaseDialog.Popup className={cn('glyph-dialog__popup', className)}>
          <BaseDialog.Title className="glyph-dialog__title">{title}</BaseDialog.Title>
          {description !== undefined && (
            <BaseDialog.Description className="glyph-dialog__description">
              {description}
            </BaseDialog.Description>
          )}
          <div className="glyph-dialog__body">{children}</div>
          {footer !== undefined && <div className="glyph-dialog__footer">{footer}</div>}
          <BaseDialog.Close className="glyph-dialog__close" aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M3 3L11 11M11 3L3 11"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </BaseDialog.Close>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
