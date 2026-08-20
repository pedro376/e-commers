import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: ['.loca.lt'],
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/app-[name].js',
        assetFileNames: (assetInfo) => {
          // Mantiene el CSS con nombre fijo, pero deja imágenes con su nombre original
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/app.css';
          }
          return 'assets/[name][extname]';
        },
      },
    },
  },
});