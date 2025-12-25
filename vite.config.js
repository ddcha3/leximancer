import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills' // Import the plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(), // Add this line
  ],
  // You might also need to define 'global' for some Node packages
  define: {
    global: 'globalThis',
  },
  base: '/leximancer/',
})