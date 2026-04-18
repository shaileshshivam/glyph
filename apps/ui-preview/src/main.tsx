import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@glyph/ui/styles.css';
import '@glyph/theme-mithila/theme.css';
import { App } from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
