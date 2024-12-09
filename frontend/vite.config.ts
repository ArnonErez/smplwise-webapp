import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: '**/*.svg',
      svgrOptions: {
        icon: false,
        svgoConfig: {
          plugins: [
            {
              name: 'removeViewBox',
              active: false
            },
            {
              name: 'removeWidthAndHeight',
              active: true
            },
          ]
        }
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 5173
  }
});
