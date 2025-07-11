import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
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
      },
      external: [],
      onwarn: (warning, warn) => {
        // Suppress specific warnings that don't affect functionality
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return
        if (warning.code === 'SOURCEMAP_ERROR') return
        warn(warning)
      }
    }
  },
  server: {
    port: 3000,
    host: true,
    hmr: {
      port: 3001
    }
  },
  preview: {
    port: 4173,
    host: true
  },
  esbuild: {
    target: 'es2015',
    logOverride: {'this-is-undefined-in-esm': 'silent'}
  },
  define: {
    global: 'globalThis',
    'process.env': {}
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-icons/fi',
      'framer-motion',
      '@questlabs/react-sdk'
    ],
    exclude: ['@supabase/supabase-js']
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})