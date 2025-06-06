import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../shared/FormElements/Button";
import "./OrderDetailsPage.css";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import StatusBadge from "../admin/components/StatusBadge";

function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/orders/${orderId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch order");
        }

        const data = await response.json();

        // Validate required fields
        if (!data.items || !Array.isArray(data.items)) {
          throw new Error("Invalid order data: missing items array");
        }

        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (isLoading) {
    return <LoadingSpinner asOverlay />;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!order) {
    return <div className="error">Order not found</div>;
  }

  return (
    <div className="order-details-container">
      <h1>Order Details</h1>

      <div className="order-summary">
        <h2>Order #{order._id}</h2>
        <p>Placed on {new Date(order.orderDate).toLocaleDateString()}</p>
        <p>
          Status:{" "}
          {/* <span className={`status ${order.orderStatus}`}>
            {order.orderStatus}
          </span> */}
          <StatusBadge status={order.orderStatus} />
        </p>
      </div>

      <div className="order-items">
        <h3>Items</h3>
        {order.items?.map((item) => (
          <div key={item.productId} className="order-item">
            <div className="item-info">
              <span className="item-name">{item.name}</span>
              <span className="item-quantity">Quantity: {item.quantity}</span>
            </div>
            <span className="item-price">Rs {item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="order-totals">
        <div className="total-row">
          <span>Subtotal</span>
          <span>Rs {order.totalAmount}</span>
        </div>
        <div className="total-row">
          <span>Shipping</span>
          <span>Rs {order.shippingFee || 0}</span>
        </div>
        <div className="total-row grand-total">
          <span>Total</span>
          <span>Rs {order.totalAmount + (order.shippingFee || 0)}</span>
        </div>
      </div>

      <div className="action-buttons">
        <Button onClick={() => navigate("/orders")}>Back to Orders</Button>
        <Button inverse onClick={() => navigate("/products")}>
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}

export default OrderDetailsPage;
