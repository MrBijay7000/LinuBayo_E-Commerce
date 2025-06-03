import { useEffect, useState } from "react";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import ProductList from "../Components/ProductList";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { toast } from "react-toastify";

export default function SharedCategoryPage({ category, placeholder }) {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedProducts, setLoadedProducts] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false); // New state for deletion loading

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/products/${category}`
        );
        setLoadedProducts(responseData.products || responseData);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, [category, sendRequest]);

  async function productDeletedHandler(deletedProductId) {
    setIsDeleting(true); // Start page loading
    try {
      await sendRequest(
        `http://localhost:5001/api/products/${deletedProductId}`,
        "DELETE"
      );
      setLoadedProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== deletedProductId)
      );
      toast.success("Product deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false); // End page loading
    }
  }

  return (
    <>
      {/* <ErrorModal error={error} onClear={clearError} /> */}
      {(isLoading || isDeleting) && ( // Show spinner for both loading states
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading &&
        !isDeleting &&
        loadedProducts &&
        loadedProducts.length > 0 && (
          <ProductList
            items={loadedProducts}
            onDeleteProduct={productDeletedHandler}
            isDeleting={isDeleting}
          />
        )}
      {!isLoading &&
        !isDeleting &&
        loadedProducts &&
        loadedProducts.length === 0 && (
          <div className="center">
            <h2>{placeholder || "No products found in this category"}</h2>
          </div>
        )}
    </>
  );
}
