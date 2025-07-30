// ============ CLIENT/VITE.CONFIG.JS (FIXED PORT) ============
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5001', // ← CHANGED FROM 5000 TO 5001
        changeOrigin: true,
        secure: false,
      }
    }
  }
})