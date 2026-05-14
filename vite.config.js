import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.svg', 'icon-512.svg', 'images/*.jpg'],
      manifest: {
        name: 'Åkagårdens Golfguide',
        short_name: 'Åkagården',
        description: 'Hål-för-hål spelguide för Åkagårdens Golfklubb',
        theme_color: '#0d1311',
        background_color: '#0d1311',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: 'icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Cacka alla statiska resurser
        globPatterns: ['**/*.{js,css,html,svg,jpg,png,ico,woff2}'],
        // Hålkartorna cackas separat med stale-while-revalidate
        runtimeCaching: [
          {
            urlPattern: /\/images\/.+\.jpg$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'halkartор',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 dagar
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 år
              }
            }
          }
        ]
      }
    })
  ],
  build: {
    outDir: 'dist'
  }
})
