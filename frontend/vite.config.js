import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 3000, // Use Render's PORT
    proxy: {
      '/api': {
        target: 'https://lettereditorbackend-8c5b.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    cors: true,
  },
  preview: {
    port: process.env.PORT || 3000, // Ensure it works in production
  },
});
