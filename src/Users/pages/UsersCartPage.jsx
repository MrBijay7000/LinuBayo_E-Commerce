import { useContext } from "react";
import { Link } from "react-router-dom";
import CartContext from "../../shared/Context/CartContext";
import Button from "../../shared/FormElements/Button";
import "./UsersCartPage.css";

function UsersCartPage() {
  const cartCtx = useContext(CartContext);

  const removeItemHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const addItemHandler = (item) => {
    cartCtx.addItem({ ...item, quantity: 1 });
  };

  return (
    <div className="cart-container">
      <h1>Your Shopping Cart</h1>
      {cartCtx.items.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/products">
            <Button className="btn">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartCtx.items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img
                    src={`http://localhost:5001/${item.image}`}
                    alt={item.name}
                  />
                </div>
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>
                    Price:{" "}
                    <span className="price-highlight">
                      Rs {item.price.toLocaleString()}
                    </span>
                  </p>
                  <div className="cart-item-actions">
                    <button onClick={() => removeItemHandler(item.id)}>
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => addItemHandler(item)}>+</button>
                  </div>
                  <p>
                    Subtotal:{" "}
                    <span className="subtotal-highlight">
                      Rs {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal ({cartCtx.items.length} items)</span>
              <span>Rs {cartCtx.totalAmount.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Rs {cartCtx.items.length > 0 ? 100 : 0}</span>
            </div>
            <div className="summary-row">
              <span>Tax (5%)</span>
              <span>
                Rs{" "}
                {cartCtx.items.length > 0
                  ? Math.round(cartCtx.totalAmount * 0.05)
                  : 0}
              </span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>
                Rs{" "}
                {cartCtx.items.length > 0
                  ? (
                      cartCtx.totalAmount +
                      100 +
                      Math.round(cartCtx.totalAmount * 0.05)
                    ).toLocaleString()
                  : 0}
              </span>
            </div>
            <Link to="/checkout">
              <button className="btn-checkout">Proceed to Checkout</button>
            </Link>
            <Link to="/products" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersCartPage;
