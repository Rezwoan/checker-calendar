import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// only enable SW in dev if you really want it
const enablePWADev = process.env.VITE_PWA_DEV === 'true'

export default defineConfig({
  base: './', // good for subfolders & subdomains on cPanel
  plugins: [
    tailwind(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: enablePWADev, navigateFallback: 'index.html' },
      includeAssets: [
        'favicon.svg',
        'robots.txt',
        'apple-touch-icon.png',
        'icons/icon-192.png',
        'icons/icon-512.png',
        'icons/maskable-192.png',
        'icons/maskable-512.png'
      ],
      manifest: {
        name: 'Checker Calendar',
        short_name: 'Checker',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        background_color: '#0a0a0a',
        theme_color: '#0a0a0a',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      }
    })
  ]
})
