import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true, // Enable source maps for debugging
    minify: 'esbuild',
    target: 'es2015',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['react-icons'],
          motion: ['framer-motion'],
          quest: ['@questlabs/react-sdk']
        }
      }
    }
  },
  define: {
    // Ensure these values are available at build time
    'process.env': {},
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-icons/fi',
      'framer-motion',
      '@questlabs/react-sdk'
    ]
  }
})