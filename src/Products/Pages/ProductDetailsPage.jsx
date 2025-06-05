import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCartPlus, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import "./ProductDetailsPage.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/Context/auth-context";
import CartContext from "../../shared/Context/CartContext";

const ProductDetailsPage = () => {
  const { pid } = useParams();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const cartCtx = useContext(CartContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/products/getProduct/${pid}`
        );
        setProduct(responseData);
        setMainImage(responseData.image);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [pid, sendRequest]);

  const addToCartHandler = () => {
    if (!auth.isLoggedIn) {
      navigate("/auth");
      return;
    }

    const selectedItem = {
      id: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: quantity,
    };

    cartCtx.addItem(selectedItem);
    toast.success(`${product.name} added to cart!`, {
      style: {
        backgroundColor: "#0d1823",
        color: "#fff",
        fontWeight: "bold",
        borderRadius: "10px",
      },
    });
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!product && !error) {
    return (
      <div className="center">
        <h2>Product not found!</h2>
      </div>
    );
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {product && (
        <div className="product-details-container">
          <button className="back-button" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back to Products
          </button>

          <div className="product-details">
            <div className="product-gallery">
              <div className="main-image">
                <img
                  src={`http://localhost:5001/${mainImage}`}
                  alt={product.name}
                />
              </div>
            </div>

            <div className="product-info">
              <h1 className="product-title">{product.name}</h1>

              <div className="product-meta">
                <div className="product-rating">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < 4 ? "star-filled" : "star-empty"}
                    />
                  ))}
                  <span>(24 reviews)</span>
                </div>

                <div className="product-stock">
                  {product.quantity > 0 ? (
                    <span className="in-stock">
                      In Stock ({product.quantity} available)
                    </span>
                  ) : (
                    <span className="out-of-stock">Out of Stock</span>
                  )}
                </div>
              </div>

              <div className="product-pricing">
                {product.originalPrice && (
                  <div className="original-price">
                    Original Price: <span>Rs {product.originalPrice}</span>
                  </div>
                )}
                <div className="current-price">
                  Price: <span>Rs {product.price}</span>
                </div>
                {/* {product.discount > 0 && (
                  <div className="discount-badge">Save {product.discount}%</div>
                )} */}
              </div>

              <div className="product-description">
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>

              <div className="product-category">
                <span>Category:</span> {product.category}
              </div>

              <div className="product-actions">
                <div className="quantity-selector">
                  <button onClick={decrementQuantity}>-</button>
                  <span>{quantity}</span>
                  <button onClick={incrementQuantity}>+</button>
                </div>

                <button
                  className="add-to-cart-btn"
                  onClick={addToCartHandler}
                  disabled={product.quantity <= 0}
                >
                  <FaCartPlus /> Add to Cart
                </button>
              </div>
            </div>
          </div>

          <div className="product-features">
            <h3>Features</h3>
            <ul>
              <li>High-quality materials</li>
              <li>Eco-friendly packaging</li>
              <li>1-year manufacturer warranty</li>
              <li>Free shipping on orders over Rs 1000</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetailsPage;
