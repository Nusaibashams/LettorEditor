import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://lettereditorbackend-8c5b.onrender.com',  // Replace with your backend URL
        changeOrigin: true,
        secure: false,  // Set to true if your backend uses HTTPS
        rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
    cors: true, // Enable CORS support
  },
});
