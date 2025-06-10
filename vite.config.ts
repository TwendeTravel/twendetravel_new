import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),

    // only run PWA in production
    mode === "production" &&
      VitePWA({
        strategies: "generateSW",
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico", "robots.txt", "placeholder.svg"],
        workbox: {
          // bump the 2 MiB default up to 5 MiB
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
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

    // helpful hot-reload tags in dev
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    // only warning threshold (in kB)
    chunkSizeWarningLimit: 3000,

    // split out vendor code so your main chunk is lighter
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) return "vendor";
        },
      },
    },
  },
}));