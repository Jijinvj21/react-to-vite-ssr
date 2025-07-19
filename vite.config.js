import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],

  // Base public path when served in production
  base: mode === "production" ? "/" : "/",

  // Development server configuration
  server: {
    port: 5173,
    host: true, // Listen on all network interfaces
    allowedHosts: [
      "react-to-vite-ssr.onrender.com", // Your production host
      "localhost", // Local development
    ],
    strictPort: true, // Exit if port is in use
  },

  // Preview server configuration (for production build preview)
  preview: {
    port: 5173,
    host: true,
    strictPort: true,
  },

  // Build configuration
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        client: "index.html",
        server: "src/entry-server.jsx",
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
        format: "esm",
      },
    },
  },

  // SSR-specific configuration
  ssr: {
    noExternal: mode === "production" ? true : [],
    target: "node",
    format: "esm",
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom"],
    exclude: mode === "production" ? [] : ["src/entry-server.jsx"],
  },
}));
