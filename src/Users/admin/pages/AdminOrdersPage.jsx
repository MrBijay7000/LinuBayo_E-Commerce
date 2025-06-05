import { useContext, useEffect, useState } from "react";
import "./AdminOrdersPage.css";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import LoadingSpinner from "../../../shared/UIElements/LoadingSpinner";
import ErrorModal from "../../../shared/UIElements/ErrorModal";
import OrderList from "../components/OrderList";
import { AuthContext } from "../../../shared/Context/auth-context";

const AdminOrdersPage = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [orders, setOrders] = useState([]);
  const auth = useContext(AuthContext);

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

  const updateOrderStatusHandler = async (orderId, newStatus) => {
    try {
      await sendRequest(
        `http://localhost:5001/api/orders/${orderId}`,
        "PATCH",
        JSON.stringify({ status: newStatus }),
        { "Content-Type": "application/json" }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  //   if (isLoading) {
  //     return (
  //       <div className="center">
  //         <LoadingSpinner asOverlay />
  //       </div>
  //     );
  //   }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <div className="admin-orders-container">
        {isLoading && <LoadingSpinner asOverlay />}
        <h1>Orders Management</h1>
        <p className="orders-count">{orders.length} orders found</p>
        <OrderList orders={orders} onUpdateStatus={updateOrderStatusHandler} />
      </div>
    </>
  );
};

export default AdminOrdersPage;
