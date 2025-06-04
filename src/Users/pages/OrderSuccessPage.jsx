import { useParams, useNavigate } from "react-router-dom";
import Button from "../../shared/FormElements/Button";
import "./OrderSuccessPage.css";

function OrderSuccessPage() {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchOrder = async () => {
  //     try {
  //       const response = await fetch(
  //         `http://localhost:5000/api/orders/${orderId}`
  //       );
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch order details");
  //       }
  //       const data = await response.json();
  //       setOrder(data);
  //     } catch (err) {
  //       console.error("Failed to fetch order:", err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchOrder();
  // }, [orderId]);

  // if (isLoading) {
  //   return <div className="loading">Loading order details...</div>;
  // }

  return (
    <div className="order-success-container">
      <div className="order-success-content">
        <div className="success-icon">✓</div>
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for your purchase. Your order has been received.</p>
        {/* {order && (
          <div className="order-details">
            <p>Total Paid: Rs {order.totalAmount + order.shippingFee}</p>
            <p>Payment Method: {order.paymentMethod}</p>
            <p>Status: {order.orderStatus}</p>
          </div>
        )} */}
        <div className="action-buttons">
          <Button onClick={() => navigate("/products")}>
            Continue Shopping
          </Button>
          <Button inverse onClick={() => navigate("/orders")}>
            View My Orders
          </Button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessPage;
