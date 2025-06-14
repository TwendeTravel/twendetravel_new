import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: { host: "::", port: 8080 },
  plugins: [
    react(),

    // ALWAYS register the PWA plugin (even in dev)
    VitePWA({
      strategies: "generateSW",
      registerType: "autoUpdate",
      devOptions: { enabled: true },       // ← enable virtual module in dev
      includeAssets: ["favicon.ico", "robots.txt", "placeholder.svg"],
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        // Cache Mapbox API and tile requests for offline usage
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.mapbox\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'mapbox-api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
          {
            urlPattern: /^https:\/\/[a-z0-9]+\.tiles\.mapbox\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'mapbox-tiles-cache',
              expiration: { maxEntries: 1000, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
        ],
      },
      manifest: {
        name: "Twende Travel",
        short_name: "TwendeTravel",
        start_url: ".",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [{ src: "placeholder.svg", sizes: "any", type: "image/svg+xml" }],
      },
    }),

    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // ← this will now work
    },
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