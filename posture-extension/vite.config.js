import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, cpSync, existsSync } from 'fs'

function copyExtensionAssets() {
  return {
    name: 'copy-extension-assets',
    closeBundle() {
      copyFileSync(
        resolve(__dirname, 'manifest.json'),
        resolve(__dirname, 'dist/manifest.json')
      )

      const iconsDir = resolve(__dirname, 'icons')
      if (existsSync(iconsDir)) {
        cpSync(iconsDir, resolve(__dirname, 'dist/icons'), { recursive: true })
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), copyExtensionAssets()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        background: resolve(__dirname, 'background.js'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
})
