import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";

export function render(url, metadata) {
  // Use a simple path if there are issues
  const location = url.startsWith("http") ? new URL(url).pathname : url;
  
  return renderToString(
    <StaticRouter location={location}>
      <App metadata={metadata} />
    </StaticRouter>
  );
}