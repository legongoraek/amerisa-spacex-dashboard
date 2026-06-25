import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
  },
  server: {
    proxy: {
      "/spacex-api": {
        target: "https://api.spacexdata.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/spacex-api/, ""),
      },
    },
  },
})
