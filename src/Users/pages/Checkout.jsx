import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartContext from "../../shared/Context/CartContext";
import Button from "../../shared/FormElements/Button";
import "./UsersCheckoutPage.css";

function CheckOutPage() {
  const cartCtx = useContext(CartContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    paymentMethod: "credit-card",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Order submitted:", {
        ...formData,
        items: cartCtx.items,
        total: cartCtx.totalAmount + 100,
      });
      setIsSubmitting(false);
      setOrderSuccess(true);
      cartCtx.clearCart();
    }, 2000);
  };

  if (orderSuccess) {
    return (
      <div className="order-success">
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for your purchase. Your order has been received.</p>
        <Button onClick={() => navigate("/products")}>Continue Shopping</Button>
      </div>
    );
  }

  if (cartCtx.items.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <Button onClick={() => navigate("/products")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="checkout-form">
          <h2>Shipping Information</h2>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Shipping Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <h2>Payment Method</h2>
          <div className="form-group payment-methods">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="credit-card"
                checked={formData.paymentMethod === "credit-card"}
                onChange={handleChange}
              />
              Credit Card
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={formData.paymentMethod === "paypal"}
                onChange={handleChange}
              />
              PayPal
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="cash-on-delivery"
                checked={formData.paymentMethod === "cash-on-delivery"}
                onChange={handleChange}
              />
              Cash on Delivery
            </label>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Place Order"}
          </Button>
        </form>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="order-items">
            {cartCtx.items.map((item) => (
              <div key={item.id} className="order-item">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-quantity">x {item.quantity}</span>
                </div>
                <span className="item-price">
                  Rs {item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>Rs {cartCtx.totalAmount}</span>
            </div>
            <div className="total-row">
              <span>Shipping</span>
              <span>Rs 100</span>
            </div>
            <div className="total-row grand-total">
              <span>Total</span>
              <span>Rs {cartCtx.totalAmount + 100}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckOutPage;
