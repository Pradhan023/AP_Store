import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  envDir: '../',    // to get env variables which is in global monorepo
  build: {
    outDir: 'dist', // Set the output directory
    chunkSizeWarningLimit: 1000, // Set higher threshold (in KB)
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Create separate chunks for heavy dependencies
          if (id.includes('node_modules')) {
            if (id.includes('react-dom')) {
              return 'vendor-react-dom';
            }
            if (id.includes('react')) {
              return 'vendor-react';
            }
            if (id.includes('lodash') || id.includes('moment')) {
              return 'vendor-utils';
            }
            return 'vendor'; // All other node_modules
          }
        }
      }
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
})
