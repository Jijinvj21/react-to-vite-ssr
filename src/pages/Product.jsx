import { useParams } from 'react-router-dom';

export default function ProductPage() {
  const { id } = useParams();
  
  return (
    <div className="product-page">
      <h1>Product {id}</h1>
      <p>This is the detail page for product {id}</p>
    </div>
  );
}