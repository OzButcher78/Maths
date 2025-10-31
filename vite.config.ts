import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => ({
  base: '/', // fine for Vercel root deploys
  server: { port: 3000, host: '0.0.0.0' }, // dev-only
  plugins: [react()],
  define: {
    // injects at build time from Vercel → Project → Settings → Environment Variables
    'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY),
    'process.env.API_KEY': JSON.stringify(process.env.GEMINI_API_KEY),
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') }
  }
}));
