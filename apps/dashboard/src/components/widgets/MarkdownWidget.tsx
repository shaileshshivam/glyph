import { CodeEditor } from '@glyph/ui';
import type { WidgetProps } from './types';

export function MarkdownWidget({ value, onChange, id }: WidgetProps<string>) {
  return (
    <div id={id} className="glyph-widget__markdown">
      <CodeEditor
        value={value ?? ''}
        onChange={(next) => onChange(next === '' ? undefined : next)}
      />
    </div>
  );
}
