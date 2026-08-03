// vite.config.js
// -----------------------------------------------------------------------------
// Vite is our build tool and development server. It is what runs when you type
// `npm run dev`. This configuration file tells Vite which plugins to use.
//
// The only plugin we need for a basic React app is `@vitejs/plugin-react`,
// which enables:
//   - JSX  (the HTML-like syntax we write inside .jsx files)
//   - Fast Refresh (the page updates instantly when you save a file)
// -----------------------------------------------------------------------------

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `defineConfig` is a small helper that gives us nice auto-complete/type hints.
export default defineConfig({
  plugins: [react()],
});
