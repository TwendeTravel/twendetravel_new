import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: { host: "::", port: 8080 },
  plugins: [
    react(),
    // only register PWA plugin in production
    mode === 'production' &&
      VitePWA({
        strategies: 'generateSW',
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'placeholder.svg'],
        workbox: {
          globDirectory: 'dist',
          globPatterns: ['**/*.{js,wasm,css,html}'],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        },
        manifest: {
          name: 'Twende Travel',
          short_name: 'TwendeTravel',
          start_url: '.',
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#ffffff',
          icons: [{ src: 'placeholder.svg', sizes: 'any', type: 'image/svg+xml' }],
        },
      }),

    // only run hot-reload tags in dev
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },

  build: {
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) return "vendor";
        },
      },
    },
  },
}));