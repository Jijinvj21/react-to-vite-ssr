import fs from "fs";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === "production";

const app = express();

let template;
let render;

if (isProd) {
  // In production, load pre-built files
  template = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8");
  render = (await import("./dist/server/entry-server.js")).render;
  app.use(express.static(path.resolve(__dirname, "dist/client")));
} else {
  // In development, use Vite middleware
  const { createServer } = await import("vite");
  const vite = await createServer({
    server: { middlewareMode: "ssr" },
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res) => {
    const url = req.originalUrl;
    const html = fs.readFileSync(
      path.resolve(__dirname, "index.html"),
      "utf-8"
    );
    const transformedTemplate = await vite.transformIndexHtml(url, html);
    const { render } = await vite.ssrLoadModule("/src/entry-server.jsx");
    const appHtml = render(url);
    res
      .status(200)
      .set({ "Content-Type": "text/html" })
      .end(transformedTemplate.replace(`<!--app-->`, appHtml));
    return;
  });
}

if (isProd) {
  app.use("*", async (req, res) => {
    const url = req.originalUrl;
    const appHtml = render(url);
    const html = template.replace(`<!--app-->`, appHtml);
    res.status(200).set({ "Content-Type": "text/html" }).end(html);
    return;
  });
}

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
