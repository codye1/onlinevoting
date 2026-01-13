import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@public': fileURLToPath(new URL('./src/public', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@actions': fileURLToPath(new URL('./src/actions', import.meta.url)),
      '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url))
    },
  },
});
