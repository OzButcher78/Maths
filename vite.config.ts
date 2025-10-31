// vite.config.ts
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',                         // Vercel serves at site root
  server: { port: 3000, host: '0.0.0.0' }, // dev-only
  plugins: [react()],
  define: {
    // Vercel injects env at build; Vite replaces occurrences in your code
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
});
