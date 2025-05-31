import { useState, useEffect } from "react";
import ProductList from "../Components/ProductList";

export default function SharedCategoryPage({ category, placeholder }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/products/${category}`
        );

        if (!response.ok) {
          throw new Error("Something went wrong, could not fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProducts();
  }, []);

  return <ProductList items={products} />;
}
