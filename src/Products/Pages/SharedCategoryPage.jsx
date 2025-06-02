import { useEffect, useState } from "react";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import ProductList from "../Components/ProductList";
import { useHttpClient } from "../../shared/hooks/http-hook";

export default function SharedCategoryPage({ category, placeholder }) {
  const { isLoading, error, sendRequest, clearError } = useHttpClient(); // Missing parentheses here

  const [loadedProducts, setLoadedProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/products/${category}`
        );
        console.log("Fetching products for category:", category);
        setLoadedProducts(responseData.products || responseData); // Handle both response formats
      } catch (err) {
        // Error is already handled by the http-hook
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, [category, sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedProducts && loadedProducts.length > 0 && (
        <ProductList items={loadedProducts} />
      )}
      {!isLoading && loadedProducts && loadedProducts.length === 0 && (
        <div className="center">
          <h2>{"No products found in this category"}</h2>
        </div>
      )}
    </>
  );
}
