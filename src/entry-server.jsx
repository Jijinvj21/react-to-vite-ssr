import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";

export function render(url, metadata) {
  const location = url.startsWith("http") ? new URL(url).pathname : url;
  const helmetContext = {};

  const appHtml = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={location}>
        <App metadata={metadata} />
      </StaticRouter>
    </HelmetProvider>
  );

  const { helmet } = helmetContext;

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
      </head>
      <body>
        <div id="root">${appHtml}</div>
      </body>
    </html>
  `;
}
