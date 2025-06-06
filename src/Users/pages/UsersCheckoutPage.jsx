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
      city: {
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
      address: formState.inputs.address.value, // This should be set
      city: formState.inputs.city.value,
    };

    try {
      // Save order data to context or localStorage before redirecting
      cartCtx.setOrderDetails(orderData);

      // Redirect to payment page
      navigate("/payment");
    } catch (err) {
      console.error("Error preparing payment:", err);
      toast.error("Failed to proceed to payment");
      setIsSubmitting(false);
    }
  };

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

          <Input
            id="city"
            element="input"
            label="City"
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
          />

          {/* <Input
            id="postalCode"
            element="input"
            label="Postal Code"
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
          /> */}

          {/* <Input
            id="country"
            element="input"
            label="Country"
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
          /> */}

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
                id="khalti"
                name="paymentMethod"
                value="khalti"
                checked={formState.inputs.paymentMethod.value === "khalti"}
                onChange={() => inputHandler("paymentMethod", "khalti", true)}
              />
              <label htmlFor="khalti">
                <div className="payment-icon">
                  <i className="fab fa-paypal"></i>
                </div>
                <span>Khalti</span>
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
            {isSubmitting ? "Processing..." : "Proceed to Pay"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default UsersCheckoutPage;
