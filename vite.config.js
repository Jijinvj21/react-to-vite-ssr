import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    ssr: true,
    rollupOptions: {
      input: "src/entry-server.jsx",
      output: {
        format: "esm",
      },
    },
  },
  ssr: {
    format: "esm",
  },
});
