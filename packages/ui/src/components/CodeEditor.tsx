import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import type { ReactElement } from 'react';
import { useEffect, useRef } from 'react';
import { cn } from '../lib/cn';
import { rosePineDawnTheme, rosePineMoonTheme } from './editor-theme';

export interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  mode?: 'light' | 'dark';
  className?: string;
  onReady?: (view: EditorView) => void;
}

export function CodeEditor({
  value,
  onChange,
  disabled,
  mode = 'light',
  className,
  onReady,
}: CodeEditorProps): ReactElement {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  // Mirror latest callbacks so the one-time mount effect always sees fresh values.
  const onChangeRef = useRef(onChange);
  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  // Intentionally excludes `value` — state is built once on mount; external
  // value changes are synced via the follow-up effect below.
  // biome-ignore lint/correctness/useExhaustiveDependencies: initial value only; follow-up effect syncs changes
  useEffect(() => {
    if (hostRef.current === null) return;
    const state = EditorState.create({
      doc: value,
      extensions: [
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        markdown(),
        ...(mode === 'dark' ? rosePineMoonTheme : rosePineDawnTheme),
        EditorView.lineWrapping,
        EditorView.editable.of(!disabled),
        EditorView.updateListener.of((update) => {
          if (update.docChanged && onChangeRef.current) {
            onChangeRef.current(update.state.doc.toString());
          }
        }),
      ],
    });
    const view = new EditorView({ state, parent: hostRef.current });
    viewRef.current = view;
    onReadyRef.current?.(view);
    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // Intentionally excluding deps — state is rebuilt on mount only; values synced via follow-up effect
  }, [disabled, mode]);

  // Sync external value changes
  useEffect(() => {
    const view = viewRef.current;
    if (view === null) return;
    const current = view.state.doc.toString();
    if (current !== value) {
      view.dispatch({ changes: { from: 0, to: current.length, insert: value } });
    }
  }, [value]);

  return <div ref={hostRef} className={cn('glyph-editor', className)} />;
}
