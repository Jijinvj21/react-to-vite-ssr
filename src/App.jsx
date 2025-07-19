import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductPage from "./pages/Product";


function App({ metadata }) {
  return (
    <>
      {/* Metadata in head */}
      <head>
        <title>{metadata?.title }</title>
        <meta name="description" content={metadata?.description} />
        <meta property="og:title" content={metadata?.ogTitle} />
        <meta property="og:description" content={metadata?.ogDescription} />
        <meta property="og:image" content={metadata?.ogImage} />
        <meta property="og:image:width" content="300" />
<meta property="og:image:height" content="300" />

        <meta property="og:url" content={metadata?.ogUrl} />
        <meta name="twitter:card" content={metadata?.twitterCard} />
      </head>
      
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </>
  );
}

export default App;