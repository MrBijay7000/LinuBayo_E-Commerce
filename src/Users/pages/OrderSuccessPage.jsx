import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../shared/FormElements/Button";
import "./OrderSuccessPage.css";

function OrderSuccessPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/orders/${orderId}`
        );
        const data = await response.json();
        setOrder(data.order);
      } catch (err) {
        console.error("Failed to fetch order:", err);
      }
    };

    fetchOrder();
  }, [orderId]);

  return (
    <div className="order-success-container">
      <div className="order-success-content">
        <div className="success-icon">✓</div>
        <h2>Order #{order?._id} Placed Successfully!</h2>
        <p>Thank you for your purchase. Your order has been received.</p>
        {order && (
          <div className="order-details">
            <p>Total Paid: Rs {order.totalAmount + order.shippingFee}</p>
            <p>Payment Method: {order.paymentMethod}</p>
          </div>
        )}
        <div className="action-buttons">
          <Button onClick={() => navigate("/products")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessPage;
