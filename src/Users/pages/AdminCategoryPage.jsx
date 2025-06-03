// Create a new file AdminCategoryPage.js
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import ProductList from "../../Products/Components/ProductList";

export default function AdminCategoryPage() {
  const { category } = useParams();
  const { isLoading, sendRequest } = useHttpClient();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await sendRequest(
          `http://localhost:5001/api/products/${category}`
        );
        setProducts(response.products || response);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, [category, sendRequest]);

  return (
    <div className="admin-category-page">
      {/* <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2> */}
      {isLoading ? <LoadingSpinner /> : <ProductList items={products} />}
    </div>
  );
}
