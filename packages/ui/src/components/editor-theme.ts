import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { tags as t } from '@lezer/highlight';

/** Rose-Pine Dawn palette (light mode). */
const dawn = {
  base: '#faf4ed',
  surface: '#fffaf3',
  overlay: '#f2e9e1',
  muted: '#9893a5',
  subtle: '#797593',
  text: '#575279',
  love: '#b4637a',
  gold: '#ea9d34',
  rose: '#d7827e',
  pine: '#286983',
  foam: '#56949f',
  iris: '#907aa9',
  highlightLow: '#f4ede8',
  highlightMed: '#dfdad9',
  highlightHigh: '#cecacd',
};

/** Rose-Pine Moon palette (dark mode). */
const moon = {
  base: '#232136',
  surface: '#2a273f',
  overlay: '#393552',
  muted: '#6e6a86',
  subtle: '#908caa',
  text: '#e0def4',
  love: '#eb6f92',
  gold: '#f6c177',
  rose: '#ea9a97',
  pine: '#3e8fb0',
  foam: '#9ccfd8',
  iris: '#c4a7e7',
  highlightLow: '#2a283e',
  highlightMed: '#44415a',
  highlightHigh: '#56526e',
};

type Palette = typeof dawn;

function makeTheme(p: Palette, dark: boolean) {
  return EditorView.theme(
    {
      '&': {
        color: p.text,
        backgroundColor: p.base,
      },
      '.cm-content': { caretColor: p.love },
      '&.cm-focused .cm-cursor': { borderLeftColor: p.love },
      '&.cm-focused .cm-selectionBackground, ::selection, .cm-selectionBackground': {
        backgroundColor: p.highlightMed,
      },
      '.cm-gutters': {
        backgroundColor: p.surface,
        color: p.muted,
        border: 'none',
      },
      '.cm-activeLineGutter': { backgroundColor: p.highlightLow, color: p.subtle },
      '.cm-activeLine': { backgroundColor: p.highlightLow },
      '.cm-lineNumbers': { color: p.muted },
    },
    { dark },
  );
}

function makeHighlight(p: Palette) {
  return HighlightStyle.define([
    { tag: t.heading, color: p.iris, fontWeight: '600' },
    { tag: [t.link, t.url], color: p.foam, textDecoration: 'underline' },
    { tag: [t.strong, t.emphasis], fontWeight: '600', color: p.pine },
    { tag: t.emphasis, fontStyle: 'italic' },
    { tag: t.strikethrough, textDecoration: 'line-through', color: p.muted },
    { tag: t.quote, color: p.subtle, fontStyle: 'italic' },
    { tag: [t.list, t.labelName], color: p.rose },
    { tag: t.monospace, color: p.love },
    { tag: [t.comment, t.meta], color: p.muted, fontStyle: 'italic' },
    { tag: [t.name, t.variableName], color: p.text },
    { tag: [t.keyword, t.modifier], color: p.pine },
    { tag: [t.string, t.character, t.special(t.string)], color: p.gold },
    { tag: [t.number, t.bool, t.null], color: p.rose },
    { tag: [t.operator, t.punctuation], color: p.subtle },
    { tag: t.atom, color: p.iris },
  ]);
}

export const rosePineDawnTheme = [makeTheme(dawn, false), syntaxHighlighting(makeHighlight(dawn))];
export const rosePineMoonTheme = [makeTheme(moon, true), syntaxHighlighting(makeHighlight(moon))];
