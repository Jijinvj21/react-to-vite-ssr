import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createServer as createViteServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5173;
const isProduction = process.env.NODE_ENV === "production";

async function createServer() {
  const app = express();

  let vite;
  if (!isProduction) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist/client
    app.use(
      express.static(path.resolve(__dirname, "dist/client"), {
        index: false, // Don't serve index.html
      })
    );
  }

  // OG Image endpoint
  app.get("/og-image/:id", (req, res) => {
    // ... existing OG image code ...
  });

  // SSR handler
  app.use(async (req, res) => {
    try {
      const baseUrl = isProduction
        ? `https://${req.headers.host}`
        : `http://localhost:${PORT}`;

      // ... your metadata logic ...

      let template;
      if (!isProduction) {
        template = fs.readFileSync(
          path.resolve(__dirname, "index.html"),
          "utf-8"
        );
        template = await vite.transformIndexHtml(req.originalUrl, template);
      } else {
        template = fs.readFileSync(
          path.resolve(__dirname, "dist/client/index.html"),
          "utf-8"
        );
      }

      let render;
      if (!isProduction) {
        render = (await vite.ssrLoadModule("/src/entry-server.jsx")).render;
      } else {
        // Vercel uses different directory structure
        render = (await import("./dist/server/entry-server.jsx")).render;
      }

      const appHtml = await render(req.originalUrl, metadata);
      const html = template.replace(`<!--ssr-outlet-->`, appHtml);
      // ... your metadata replacements ...

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      if (!isProduction) {
        vite.ssrFixStacktrace(e);
      }
      console.error(e.stack);
      res.status(500).end(e.stack);
    }
  });

  return app;
}

// Vercel expects a serverless function
export default createServer().then((app) => app);
