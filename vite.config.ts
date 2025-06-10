import { defineConfig } from "vite";
import { VitePWA } from 'vite-plugin-pwa';
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'placeholder.svg'],
      workbox: {
        // raise the limit from 2 MiB to 5 MiB
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      manifest: {
        name: 'Twende Travel',
        short_name: 'TwendeTravel',
        start_url: '.',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
          { src: 'placeholder.svg', sizes: 'any', type: 'image/svg+xml' }
        ]
      }
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // top‐level build options
  build: {
    // bump chunk‐size warning to 3000 KiB
    chunkSizeWarningLimit: 3000
  }
}));