import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CartContext from "../../shared/Context/CartContext";
import Button from "../../shared/FormElements/Button";
import Input from "../../shared/FormElements/Input";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
} from "../../util/validators";
import { toast } from "react-toastify";
import "./UsersPaymentPage.css";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/Context/auth-context";

function UsersPaymentPage() {
  const { isLoggedIn, token, userId, logout } = useContext(AuthContext);
  const cartCtx = useContext(CartContext);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Initialize form hook for credit card fields
  const [formState, inputHandler] = useForm(
    {
      cardNumber: {
        value: "",
        isValid: false,
      },
      expiry: {
        value: "",
        isValid: false,
      },
      cvv: {
        value: "",
        isValid: false,
      },
      cardName: {
        value: "",
        isValid: false,
      },
      khaltinumber: {
        value: "",
        isValid: false,
      },
      khaltipassword: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Please login to complete your payment");
      navigate("/auth");
      return;
    }
    if (!cartCtx.orderDetails) {
      navigate("/checkout");
    }
  }, [isLoggedIn, cartCtx.orderDetails, navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error("Please login to complete your payment");
      navigate("/auth");
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        ...cartCtx.orderDetails,
        user: userId, // Add user ID from auth context
        totalAmount: cartCtx.totalAmount,
        paymentStatus: "completed",
        // ... rest of your order data
      };

      const response = await fetch("http://localhost:5001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to place order");
      }

      setPaymentSuccess(true);
      toast.success("Payment successful! Order placed.");

      setTimeout(() => {
        cartCtx.clearCart();
        navigate("/order-success");
        cartCtx.clearCart();
      }, 1500);
    } catch (err) {
      console.error("Payment failed:", err);
      toast.error(err.message || "Payment failed. Please try again.");
      setIsProcessing(false);

      if (err.message.includes("401") || err.message.includes("unauthorized")) {
        logout();
        navigate("/auth");
      }
    }
  };

  if (paymentSuccess) {
    return (
      <div className="payment-success">
        <h2>Payment Successful!</h2>
        <p>
          Your order is being processed. Redirecting to order confirmation...
        </p>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <h1>Complete Your Payment</h1>
      <div className="payment-content">
        <div className="payment-summary">
          <h2>Order Summary</h2>
          <div className="order-items">
            {cartCtx.orderDetails?.items.map((item) => (
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
            <div className="total-row grand-total">
              <span>Amount to Pay</span>
              <span>Rs {cartCtx.orderDetails?.total || 0}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handlePayment} className="payment-form">
          <h2>Payment Details</h2>

          {cartCtx.orderDetails?.paymentMethod === "credit-card" && (
            <>
              <Input
                id="cardNumber"
                element="input"
                type="text"
                label="Card Number"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter valid card number"
                placeholder="1234 5678 9012 3456"
                onInput={inputHandler}
              />
              <div className="card-details">
                <Input
                  id="expiry"
                  element="input"
                  type="text"
                  label="Expiry Date"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter valid expiry date"
                  placeholder="MM/YY"
                  onInput={inputHandler}
                />
                <Input
                  id="cvv"
                  element="input"
                  type="text"
                  label="CVV"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter valid CVV"
                  placeholder="123"
                  onInput={inputHandler}
                />
              </div>
              <Input
                id="cardName"
                element="input"
                type="text"
                label="Name on Card"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter name on card"
                onInput={inputHandler}
              />
            </>
          )}

          {cartCtx.orderDetails?.paymentMethod === "khalti" && (
            <div className="paypal-login">
              <Input
                id="khaltinumber"
                element="input"
                type="number"
                label="Mobile Number"
                validators={[
                  VALIDATOR_REQUIRE(),
                  VALIDATOR_MINLENGTH(10),
                  VALIDATOR_MAXLENGTH(10),
                ]}
                errorText="Please enter valid 10-digit phone number"
                onInput={inputHandler}
              />
              <Input
                id="khaltipassword"
                element="input"
                type="password"
                label="Khalti MPIN"
                validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(4)]}
                errorText="Please enter your 4-digit MPIN"
                onInput={inputHandler}
              />
            </div>
          )}

          {cartCtx.orderDetails?.paymentMethod === "cash-on-delivery" && (
            <div className="cod-message">
              <p>You will pay in cash when your order is delivered.</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={
              isProcessing ||
              (cartCtx.orderDetails?.paymentMethod === "credit-card" &&
                !formState.isValid) ||
              (cartCtx.orderDetails?.paymentMethod === "khalti" &&
                (!formState.inputs.khaltinumber.isValid ||
                  !formState.inputs.khaltipassword.isValid))
            }
          >
            {isProcessing ? "Processing Payment..." : "Confirm Payment"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default UsersPaymentPage;
