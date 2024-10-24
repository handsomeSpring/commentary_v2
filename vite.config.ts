import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'url'
import vue from '@vitejs/plugin-vue'
import AutoImport from "unplugin-auto-import/vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),AutoImport({
    imports:['vue','vue-router'],
    defaultExportByFilename: true,
    dirs:['./src/api']
  })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server:{
    hmr:{
      overlay:false
    },
    port:8080
  }
})
