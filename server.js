import fs from "fs";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function start() {
  const isProd = process.env.NODE_ENV === "production";
  const resolve = (p) => path.resolve(__dirname, p);

  const app = express();

  let render;
  let indexHtml;

  if (isProd) {
    app.use(
      "/assets",
      express.static(resolve("dist/client/assets"), { index: false })
    );
    indexHtml = fs.readFileSync(resolve("dist/client/index.html"), "utf-8");
    render = (await import(resolve("dist/server/entry-server.js"))).render;
  } else {
    const vite = await (
      await import("vite")
    ).createServer({
      root: process.cwd(),
      server: { middlewareMode: "ssr" },
      appType: "custom",
    });

    app.use(vite.middlewares);

    app.use("*", async (req, res) => {
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(resolve("index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);

        const { render } = await vite.ssrLoadModule("/src/entry-server.jsx");
        const appHtml = render(url, {});

        const html = template.replace(`<!--app-html-->`, appHtml);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        console.error(e);
        res.status(500).end(e.message);
      }
    });

    // ✅ DO NOT use return here. Just exit the function.
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Dev server running at http://localhost:${port}`);
    });

    return;
  }

  // Production SSR handler
  app.use("*", async (req, res) => {
    try {
      const url = req.originalUrl;
      const appHtml = render(url, {});
      const html = indexHtml.replace(`<!--app-html-->`, appHtml);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      console.error(e);
      res.status(500).end(e.message);
    }
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Prod server running at http://localhost:${port}`);
  });
}

start(); // 👈 async main
