import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const base = '/' // because we’re on checker-calendar.rezwoan.me

export default defineConfig({
  base,
  plugins: [
    tailwind(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'Checker Calendar',
        short_name: 'Checker',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#0a0a0a',
        theme_color: '#0a0a0a',
        icons: [{ src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml' }]
      }
    })
  ]
})
