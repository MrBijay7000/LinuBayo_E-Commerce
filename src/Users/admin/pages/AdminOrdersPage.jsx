import { useContext, useEffect, useState } from "react";
import "./AdminOrdersPage.css";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import LoadingSpinner from "../../../shared/UIElements/LoadingSpinner";
import ErrorModal from "../../../shared/UIElements/ErrorModal";
import OrderList from "../components/OrderList";
import { AuthContext } from "../../../shared/Context/auth-context";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminOrdersPage = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [orders, setOrders] = useState([]);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!auth.token) return; // Wait for token to be ready

      try {
        const responseData = await sendRequest(
          "http://localhost:5001/api/orders/allOrder",
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setOrders(responseData?.orders || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, [sendRequest, auth.token]);

  //   const updateOrderStatusHandler = async (orderId, newStatus) => {
  //     try {
  //       await sendRequest(
  //         `http://localhost:5001/api/orders/${orderId}`,
  //         "PATCH",
  //         JSON.stringify({ status: newStatus }),
  //         {
  //           "Content-Type": "application/json",
  //           Authorization: "Bearer " + auth.token,
  //         }
  //       );

  //       setOrders((prevOrders) =>
  //         prevOrders.map((order) =>
  //           order._id === orderId ? { ...order, orderStatus: newStatus } : order
  //         )
  //       );
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   if (isLoading) {
  //     return (
  //       <div className="center">
  //         <LoadingSpinner asOverlay />
  //       </div>
  //     );
  //   }
  const updateOrderStatusHandler = async (orderId, newStatus) => {
    try {
      // Optimistic UI update - update local state immediately
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );

      // Send the update to the server
      const responseData = await sendRequest(
        `http://localhost:5001/api/orders/${orderId}`,
        "PATCH",
        JSON.stringify({ status: newStatus }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      // If needed, update again with server response
      if (responseData.order) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? responseData.order : order
          )
        );
      }

      // Show success notification
      toast.success(`Order status updated to ${newStatus}`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Failed to update order status:", err);

      // Revert optimistic update on error
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus: order.previousStatus }
            : order
        )
      );

      toast.error(`Failed to update order status: ${err.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <div className="admin-orders-container">
        {isLoading && <LoadingSpinner asOverlay />}
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back to Dasboard
        </button>
        <h1>Orders Management</h1>
        <p className="orders-count">{orders.length} orders found</p>
        <OrderList orders={orders} onUpdateStatus={updateOrderStatusHandler} />
      </div>
    </>
  );
};

export default AdminOrdersPage;
