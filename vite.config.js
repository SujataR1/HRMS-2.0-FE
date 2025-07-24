import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',   // listen on all network interfaces (LAN + localhost)
    port: 5173,        // explicitly specify port (default is 5173 anyway)
    proxy: {
      '/admin': {
        target: 'https://backend.hrms.transev.site',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
