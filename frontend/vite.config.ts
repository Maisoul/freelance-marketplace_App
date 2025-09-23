import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration with optional proxy for API requests
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8000', // Django backend URL
    },
  },
});