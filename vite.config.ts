import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// Use dynamic import for ESM-only plugins to avoid require() issues in some environments
export default defineConfig(async () => {
  const reactPlugin = (await import('@vitejs/plugin-react')).default;
  
  return {
    plugins: [
      reactPlugin(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'offline.html'],
        
        manifest: {
          name: 'El Corte — Barbería',
          short_name: 'El Corte',
          description: 'Barbería de precisión — Cortes modernos y afeitados clásicos',
          theme_color: '#0a0a0a',
          background_color: '#fcfcfb',
          display: 'standalone',
          orientation: 'portrait-primary',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: '/favicon.svg',
              sizes: '192x192',
              type: 'image/svg+xml',
              purpose: 'any maskable'
            },
            {
              src: '/favicon.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any maskable'
            }
          ]
        },

        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,woff,woff2}'],
          
          // Cache Google Fonts
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /\/api\/.*/i,
              handler: 'NetworkOnly'
            }
          ],
          
          // Offline fallback - serve offline.html when navigation fails
          navigateFallback: '/offline.html',
          navigateFallbackDenylist: [/^\/api/],
        },

        devOptions: {
          enabled: false
        }
      })
    ],
    
    build: {
      target: 'es2018',
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules')) return 'vendor';
          }
        }
      }
    },
    
    server: { port: 3000 }
  };
});
