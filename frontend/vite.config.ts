import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  envDir: '../',    // to get env variables which is in global monorepo
  build: {
    outDir: 'frontend/dist',
  },
  plugins: [react()],
})
