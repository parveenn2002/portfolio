import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { placeholderCheckPlugin } from './build/placeholder-check-plugin.ts';
import { routeMetaPlugin } from './build/route-meta-plugin.ts';

export default defineConfig({
  plugins: [react(), tailwindcss(), routeMetaPlugin(), placeholderCheckPlugin()],
});
