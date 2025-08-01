import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '127.0.0.1',   // listen on all network interfaces (LAN + localhost)
    port: 9090,        // explicitly specify port (default is 5173 anyway)
	allowedHosts: ['hrms.transev.site'],
    proxy: {
      '/admin': {
        target: 'https://backend.hrms.transev.site',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
