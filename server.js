import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { render } from "./src/entry-server"; // import render function

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3000;
const app = express();

app.use("*", async (req, res) => {
  const url = req.originalUrl;

  // Simulate metadata (in real cases, you'd get this from DB or file)
  const metadata = {
    title: "My Page Title",
    description: "This is my page description.",
    ogTitle: "OG Title",
    ogDescription: "OG Description",
    ogImage: "https://example.com/og-image.png",
    ogUrl: `https://example.com${url}`,
    twitterCard: "summary_large_image",
  };

  const template = fs.readFileSync(
    path.resolve(__dirname, "dist/index.html"),
    "utf-8"
  );
  const appHtml = render(url, metadata);

  // Inject HTML + metadata into template
  const html = template.replace(`<!--app-html-->`, appHtml).replace(
    `<!--head-tags-->`,
    `
      <title>${metadata.title}</title>
      <meta name="description" content="${metadata.description}" />
      <meta property="og:title" content="${metadata.ogTitle}" />
      <meta property="og:description" content="${metadata.ogDescription}" />
      <meta property="og:image" content="${metadata.ogImage}" />
      <meta property="og:image:width" content="300" />
      <meta property="og:image:height" content="300" />
      <meta property="og:url" content="${metadata.ogUrl}" />
      <meta name="twitter:card" content="${metadata.twitterCard}" />
    `
  );

  res.status(200).set({ "Content-Type": "text/html" }).end(html);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
