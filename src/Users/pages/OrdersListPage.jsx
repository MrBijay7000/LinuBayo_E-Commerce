import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/hooks/auth-hook";
import Button from "../../shared/FormElements/Button";
import "./OrdersListPage.css";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";

function OrdersListPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId, token } = useAuth(); // Added token
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId || !token) return;
    const fetchOrders = async () => {
      try {
        // More specific authentication check
        if (!userId || !token) {
          throw new Error("Please login to view your orders");
        }

        const response = await fetch(
          `http://localhost:5001/api/orders/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add authorization header
            },
          }
        );

        // More detailed error handling
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              `Failed to fetch orders (Status: ${response.status})`
          );
        }

        const data = await response.json();
        if (!data.orders) {
          throw new Error("Invalid response format from server");
        }

        setOrders(data.orders);
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message);

        // Redirect to login if unauthorized
        if (
          err.message.includes("401") ||
          err.message.includes("unauthorized")
        ) {
          navigate("/auth");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [userId, token, navigate]);

  // Loading and error states
  if (isLoading || !userId || !token) {
    return <LoadingSpinner asOverlay />;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
        <Button inverse onClick={() => navigate("/products")}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="no-orders">
        <h2>No Orders Found</h2>
        <p>You haven't placed any orders yet.</p>
        <Button onClick={() => navigate("/products")}>Start Shopping</Button>
      </div>
    );
  }

  return (
    <div className="orders-list-container">
      <h1>Your Order History</h1>

      <div className="orders-grid">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
              <span className={`status ${order.orderStatus.toLowerCase()}`}>
                {order.orderStatus}
              </span>
            </div>

            <div className="order-details">
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.orderDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Items:</strong>{" "}
                {order.items.reduce((total, item) => total + item.quantity, 0)}
              </p>
              <p>
                <strong>Total:</strong> Rs{" "}
                {order.totalAmount + (order.shippingFee || 0)}
              </p>
            </div>

            <div className="order-actions">
              <Button inverse onClick={() => navigate(`/orders/${order._id}`)}>
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrdersListPage;
