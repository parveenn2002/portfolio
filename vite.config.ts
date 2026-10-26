import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { placeholderCheckPlugin } from './build/placeholder-check-plugin.ts';
import { routeMetaPlugin } from './build/route-meta-plugin.ts';

export default defineConfig({
<<<<<<< HEAD
=======
  base: '/portfolio/',
>>>>>>> 3d6b2cde0708d3f2bf6afbad5e3605cec8bbebd4
  plugins: [react(), tailwindcss(), routeMetaPlugin(), placeholderCheckPlugin()],
});
