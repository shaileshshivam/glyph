import type { ReactElement } from 'react';
import { Select as BaseSelect } from '@base-ui-components/react/select';
import { cn } from '../lib/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
}

export function Select({
  value,
  defaultValue,
  onValueChange,
  options,
  placeholder = 'Select…',
  disabled,
  id,
  name,
  className,
}: SelectProps): ReactElement {
  const handleValueChange = onValueChange
    ? (next: string) => {
        onValueChange(next);
      }
    : undefined;
  return (
    <BaseSelect.Root
      {...(value !== undefined ? { value } : {})}
      {...(defaultValue !== undefined ? { defaultValue } : {})}
      {...(handleValueChange !== undefined ? { onValueChange: handleValueChange } : {})}
      {...(disabled !== undefined ? { disabled } : {})}
    >
      <BaseSelect.Trigger
        {...(id !== undefined ? { id } : {})}
        {...(name !== undefined ? { name } : {})}
        className={cn('glyph-select__trigger', className)}
      >
        <BaseSelect.Value>
          {(current: unknown) => {
            const match = options.find((o) => o.value === current);
            if (match) return match.label;
            return placeholder;
          }}
        </BaseSelect.Value>
        <BaseSelect.Icon className="glyph-select__icon" aria-hidden="true">
          <ChevronIcon />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner sideOffset={4} alignItemWithTrigger={false}>
          <BaseSelect.Popup className="glyph-select__popup">
            {options.map((opt) => (
              <BaseSelect.Item
                key={opt.value}
                value={opt.value}
                {...(opt.disabled !== undefined ? { disabled: opt.disabled } : {})}
                className="glyph-select__item"
              >
                <BaseSelect.ItemIndicator className="glyph-select__indicator">
                  •
                </BaseSelect.ItemIndicator>
                <BaseSelect.ItemText>{opt.label}</BaseSelect.ItemText>
              </BaseSelect.Item>
            ))}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}

function ChevronIcon(): ReactElement {
  return (
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
      <path
        d="M1 1l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
