import { type KeyboardEvent, useMemo, useState } from 'react';
import { Input } from '@glyph/ui';
import type { WidgetProps } from './types';

export function ListWidget({ value, onChange, id, field }: WidgetProps<string[]>) {
  const items = useMemo(() => value ?? [], [value]);
  const [draft, setDraft] = useState('');

  function add() {
    const trimmed = draft.trim();
    if (trimmed === '') return;
    if (items.includes(trimmed)) {
      setDraft('');
      return;
    }
    onChange([...items, trimmed]);
    setDraft('');
  }

  function remove(item: string) {
    onChange(items.filter((i) => i !== item));
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add();
    } else if (e.key === 'Backspace' && draft === '' && items.length > 0) {
      const last = items[items.length - 1];
      if (last !== undefined) remove(last);
    }
  }

  return (
    <div className="glyph-widget__list">
      <div className="glyph-widget__chips">
        {items.map((item) => (
          <span key={item} className="glyph-widget__chip">
            {item}
            <button
              type="button"
              onClick={() => remove(item)}
              aria-label={`Remove ${item}`}
              className="glyph-widget__chip-remove"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <Input
        id={id}
        placeholder={field.hint ?? 'Type and press Enter'}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKey}
        onBlur={add}
      />
    </div>
  );
}
