import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
  ],
  define: {
    global: 'globalThis',
  },
  base: '/leximancer/',
  server: {
    port: 3000,
    host: '127.0.0.1',
  },
  optimizeDeps: {
    include: ['@dnd-kit/core', '@dnd-kit/utilities', '@dnd-kit/sortable', 'framer-motion'],
  },
})