import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host ? { protocol: 'ws', host, port: 1421 } : undefined,
    watch: { ignored: ['**/src-tauri/**'] },
  },
  build: {
    // Target the Chromium/WebKit versions Tauri ships with — no need to
    // transpile down to old browsers, which keeps the bundle lean.
    target: 'es2021',
    // Sourcemaps add weight and expose source; a desktop app doesn't ship them.
    sourcemap: false,
    // esbuild minification (default) is fast and effective.
    minify: 'esbuild',
    // Warn later: our largest chunk is the vendor split below, which is fine.
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // Split rarely-changing vendor code into its own cacheable chunks, so a
        // frontend change doesn't invalidate the whole bundle. Asset hashing is
        // on by default, so these names get content hashes automatically.
        manualChunks: {
          react: ['react', 'react-dom'],
          motion: ['framer-motion'],
          vendor: ['zustand', 'clsx', 'tailwind-merge', 'class-variance-authority'],
        },
      },
    },
  },
});
