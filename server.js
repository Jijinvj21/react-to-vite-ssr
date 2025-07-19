// import express from "express";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// const isProd = process.env.NODE_ENV === "production";

// const app = express();

// let vite;
// if (!isProd) {
//   try {
//     const { createServer } = await import("vite");
//     vite = await createServer({
//       server: { middlewareMode: true },
//       appType: "custom",
//     });
//     app.use(vite.middlewares);
//   } catch (e) {
//     console.error("Vite dev server failed to start:", e);
//   }
// } else {
//   app.use(express.static("dist/client"));
// }

// // Fix: Use a proper route handler
// app.get("*", async (req, res, next) => {
//   try {
//     const url = req.originalUrl;

//     const templatePath = isProd
//       ? path.resolve("dist/client/index.html")
//       : path.resolve(__dirname, "index.html");

//     let template = fs.readFileSync(templatePath, "utf-8");

//     let render;
//     if (!isProd) {
//       template = await vite.transformIndexHtml(url, template);
//       render = (await vite.ssrLoadModule("/src/entry-server.jsx")).render;
//     } else {
//       render = (await import("./dist/server/entry-server.js")).render;
//     }

//     const metadata = {
//       title: "My Product Page",
//       description: "This is a product page",
//       ogTitle: "OG Product Title",
//       ogDescription: "OG Product Description",
//       ogImage: "https://example.com/image.jpg",
//       ogUrl: `http://localhost:5173${url}`,
//       twitterCard: "summary_large_image",
//     };

//     const { html, head } = await render(url, metadata);

//     const finalHtml = template
//       .replace(`<!--ssr-outlet-->`, html)
//       .replace(`<title>React SSR</title>`, head);

//     res.status(200).set({ "Content-Type": "text/html" }).end(finalHtml);
//   } catch (e) {
//     if (vite) {
//       vite.ssrFixStacktrace(e);
//     }
//     console.error("Error during SSR:", e);
//     next(e);
//   }
// });

// app.listen(5173, () => {
//   console.log("Server running at http://localhost:5173");
// });
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createServer as createViteServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
  const app = express();

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares);

  // Dynamic OG image endpoint
  app.get("/og-image/:id", (req, res) => {
    const { id } = req.params;
    const width = 1200;
    const height = 630;

    res.type("image/svg+xml");
    res.send(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect width="${width}" height="${height}" fill="#1a202c"/>
        <text x="50%" y="50%" font-family="Arial" font-size="48" fill="#fff" text-anchor="middle" dominant-baseline="middle">
          Product ${id}
        </text>
      </svg>
    `);
  });

  // Handle all SSR routes (FIXED: removed invalid "*")
  app.use(async (req, res, next) => {
    const url = req.originalUrl;
    // const baseUrl = `${req.protocol}://${req.get("host")}`;
    const baseUrl = `https://77vh87ql-5173.inc1.devtunnels.ms`;

    // Default metadata
    let metadata = {
      title: "Vite + React App",
      description: "Default application description",
      ogTitle: "Vite + React",
      ogDescription: "A React application built with Vite",
      // ogImage: `${baseUrl}/https://images.unsplash.com/photo-1682685797742-42c9987a2c34?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,

      ogImage: `https://images.unsplash.com/photo-1682685797742-42c9987a2c34?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
      ogUrl: `${baseUrl}${url}`,
      twitterCard: "summary_large_image",
    };

    // Route-specific metadata
    if (url.includes("/product/")) {
      const productId = url.split("/").pop();
      metadata = {
        title: `Product ${productId} | My Store`,
        description: `Amazing product ${productId} - best in category`,
        ogTitle: `Special Offer: Product ${productId}`,
        ogDescription: `Limited time discount on product ${productId}`,
        ogImage: `https://images.unsplash.com/photo-1682685797742-42c9987a2c34?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
        ogUrl: `${baseUrl}${url}`,
        twitterCard: "summary_large_image",
      };
    } else if (url.includes("/blog/")) {
      const slug = url.split("/").pop();
      metadata = {
        title: `Blog: ${slug.replace(/-/g, " ")}`,
        description: `Read our latest blog post about ${slug}`,
        ogTitle: `New Blog: ${slug.replace(/-/g, " ")}`,
        ogDescription: `Check out our insights on ${slug}`,
        ogImage: `https://images.unsplash.com/photo-1682685797742-42c9987a2c34?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
        ogUrl: `${baseUrl}${url}`,
        twitterCard: "summary",
      };
    }

    try {
      let template = fs.readFileSync(
        path.resolve(__dirname, "index.html"),
        "utf-8"
      );

      template = await vite.transformIndexHtml(url, template);
      const { render } = await vite.ssrLoadModule("/src/entry-server.jsx");
      const appHtml = await render(url, metadata);

      const html = template
        .replace(`<!--ssr-outlet-->`, appHtml)
        .replace(/__TITLE__/g, metadata.title)
        .replace(/__DESCRIPTION__/g, metadata.description)
        .replace(/__OG_TITLE__/g, metadata.ogTitle)
        .replace(/__OG_DESCRIPTION__/g, metadata.ogDescription)
        .replace(/__OG_IMAGE__/g, metadata.ogImage)
        .replace(/__OG_URL__/g, metadata.ogUrl)
        .replace(/__TWITTER_CARD__/g, metadata.twitterCard)
        .replace(/__OG_IMAGE_WIDTH__/g, "300")
        .replace(/__OG_IMAGE_HEIGHT__/g, "300");
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      res.status(500).end(e.stack);
    }
  });

  app.listen(5173, () => {
    console.log("SSR server running on http://localhost:5173");
  });
}

createServer();
