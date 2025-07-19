import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";

export function render(url, metadata) {
  return renderToString(
    <StaticRouter location={url}>
      <App metadata={metadata} />
    </StaticRouter>
  );
}
