import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// If you deploy to GitHub Pages later, you can set:
// export default defineConfig({ base: '/<repo-name>/', ... })
export default defineConfig({
  plugins: [
    tailwind(), // MUST be first so it handles @import "tailwindcss"
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
        description: 'Multi-tab checkmark calendar with reports & history.',
        icons: [
          { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml' }
        ]
      }
    })
  ]
})
