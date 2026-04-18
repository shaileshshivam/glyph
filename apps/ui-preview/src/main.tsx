import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@glyph/ui/styles.css';
import '@glyph/theme-mithila/theme.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
