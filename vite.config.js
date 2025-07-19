import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        client: "index.html", // Client entry
        server: "src/entry-server.jsx", // SSR entry
      },
      output: {
        entryFileNames: "[name].js",
        format: "esm",
      },
    },
  },
  ssr: {
    // Specify SSR-specific dependencies if needed
    noExternal: true,
  },
});
