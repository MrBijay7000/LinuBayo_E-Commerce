import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../shared/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import Input from "../../shared/FormElements/Input";

import "./UsersCheckoutPage.css";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../util/validators";
import CartContext from "../../shared/Context/CartContext";
import { toast } from "react-toastify";

function UsersCheckoutPage() {
  const cartCtx = useContext(CartContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [formState, inputHandler] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      email: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      paymentMethod: {
        value: "credit-card",
        isValid: true,
      },
    },
    false
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare order data
    const orderData = {
      name: formState.inputs.name.value,
      email: formState.inputs.email.value,
      address: formState.inputs.address.value,
      paymentMethod: formState.inputs.paymentMethod.value,
      items: cartCtx.items,
      total: cartCtx.totalAmount + 100,
    };

    try {
      // In a real app, you would send this to your backend
      // const response = await fetch('http://your-backend-api.com/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderData)
      // });
      // const data = await response.json();

      console.log("Order submitted:", orderData);
      setIsSubmitting(false);
      setOrderSuccess(true);
      toast.success("Order placed successfully!");

      cartCtx.clearCart();
    } catch (err) {
      console.error("Order submission failed:", err);
      setIsSubmitting(false);
      toast.error("Failed to placed order right now!");
    }
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

          <Input
            id="name"
            element="input"
            type="text"
            label="Full Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter your name"
            onInput={inputHandler}
          />

          <Input
            id="email"
            element="input"
            type="email"
            label="Email"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email"
            onInput={inputHandler}
          />

          <Input
            id="address"
            element="textarea"
            label="Shipping Address"
            validators={[VALIDATOR_MINLENGTH(10)]}
            errorText="Please enter a valid address (at least 10 characters)"
            onInput={inputHandler}
          />

          <h2>Payment Method</h2>
          <div className="payment-options">
            <div className="payment-option">
              <input
                type="radio"
                id="credit-card"
                name="paymentMethod"
                value="credit-card"
                checked={formState.inputs.paymentMethod.value === "credit-card"}
                onChange={() =>
                  inputHandler("paymentMethod", "credit-card", true)
                }
              />
              <label htmlFor="credit-card">
                <div className="payment-icon">
                  <i className="fas fa-credit-card"></i>
                </div>
                <span>Credit Card</span>
              </label>
            </div>

            <div className="payment-option">
              <input
                type="radio"
                id="paypal"
                name="paymentMethod"
                value="paypal"
                checked={formState.inputs.paymentMethod.value === "paypal"}
                onChange={() => inputHandler("paymentMethod", "paypal", true)}
              />
              <label htmlFor="paypal">
                <div className="payment-icon">
                  <i className="fab fa-paypal"></i>
                </div>
                <span>PayPal</span>
              </label>
            </div>

            <div className="payment-option">
              <input
                type="radio"
                id="cash-on-delivery"
                name="paymentMethod"
                value="cash-on-delivery"
                checked={
                  formState.inputs.paymentMethod.value === "cash-on-delivery"
                }
                onChange={() =>
                  inputHandler("paymentMethod", "cash-on-delivery", true)
                }
              />
              <label htmlFor="cash-on-delivery">
                <div className="payment-icon">
                  <i className="fas fa-money-bill-wave"></i>
                </div>
                <span>Cash on Delivery</span>
              </label>
            </div>
          </div>

          <Button type="submit" disabled={!formState.isValid || isSubmitting}>
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

export default UsersCheckoutPage;
