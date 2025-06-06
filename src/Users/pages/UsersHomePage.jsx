import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../shared/Context/auth-context";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  IndianRupee,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import "./UsersHomePage.css";

export default function UsersHomePage() {
  const { userId, token, isLoggedIn, userName, login } =
    useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token || !userId) {
          // toast.error("Please login to view your dashboard");
          // navigate("/auth");
          return;
        }

        const response = await fetch(
          `http://localhost:5001/api/orders/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        const validOrders = Array.isArray(data.orders) ? data.orders : [];

        setOrders(validOrders);

        // Calculate stats
        const totalOrders = validOrders.length;
        const totalSpent = validOrders.reduce(
          (sum, order) => sum + (Number(order.totalAmount) || 0),
          0
        );
        const pendingOrders = validOrders.filter(
          (o) => o.status && o.status.toLowerCase() === "pending"
        ).length;

        setStats({
          totalOrders,
          totalSpent,
          pendingOrders,
        });
      } catch (err) {
        console.error("Failed to fetch orders", err);
        toast.error("Error loading your orders");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, token]);

  // Check auth status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedData = JSON.parse(localStorage.getItem("userData"));
      if (storedData && storedData.token && storedData.userId) {
        login(storedData.userId, storedData.token, storedData.name);
      }
    };
    checkAuth();
  }, [login]);

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    if (!status) return <Package size={16} className="text-gray-500" />;

    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "delivered":
        return <CheckCircle size={16} className="text-green-500" />;
      case "shipped":
        return <Truck size={16} className="text-blue-500" />;
      case "pending":
        return <Clock size={16} className="text-yellow-500" />;
      case "cancelled":
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return <Package size={16} className="text-gray-500" />;
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="dashboard-container"
    >
      <div className="dashboard-header">
        <h1>
          Welcome back,{" "}
          <span className="text-primary">{userName || "Customer"}</span> 👋
        </h1>
        <p className="subtitle">Here's your complete order history</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <motion.div
          whileHover={{ y: -5 }}
          className="stat-card bg-gradient-to-br from-blue-50 to-blue-100"
        >
          <div className="stat-icon bg-blue-100 text-blue-600">
            <ShoppingBag size={20} />
          </div>
          <div>
            <p className="stat-title">Total Orders</p>
            <p className="stat-value">{stats.totalOrders}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="stat-card bg-gradient-to-br from-green-50 to-green-100"
        >
          <div className="stat-icon bg-green-100 text-green-600">
            <IndianRupee size={20} />
          </div>
          <div>
            <p className="stat-title">Total Spent</p>
            <p className="stat-value">₹{stats.totalSpent.toLocaleString()}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="stat-card bg-gradient-to-br from-purple-50 to-purple-100"
        >
          <div className="stat-icon bg-purple-100 text-purple-600">
            <Package size={20} />
          </div>
          <div>
            <p className="stat-title">Pending Orders</p>
            <p className="stat-value">{stats.pendingOrders}</p>
          </div>
        </motion.div>
      </div>

      {/* All Orders */}
      <div className="recent-orders">
        <div className="section-header">
          <h2>Your Order History</h2>
        </div>

        {orders.length > 0 ? (
          <>
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((order) => {
                    const status = order.status
                      ? order.status.toLowerCase()
                      : "unknown";
                    return (
                      <motion.tr
                        key={order._id || Math.random()}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{
                          backgroundColor: "rgba(249, 250, 251, 0.8)",
                        }}
                      >
                        <td className="font-medium">
                          #{order._id ? order._id.substring(0, 8) : "N/A"}
                        </td>
                        <td>
                          {/* {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : "N/A"} */}
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : order.orderDate
                            ? new Date(order.orderDate).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td>
                          <div className={`status-badge status-${status}`}>
                            {getStatusIcon(status)}
                            {/* <span>{formatStatus(order.status)}</span> */}
                            <span>
                              {formatStatus(
                                order.status || order.orderStatus || "unknown"
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="font-medium">
                          ₹
                          {order.totalAmount
                            ? order.totalAmount.toFixed(2)
                            : "0.00"}
                        </td>
                        <td>
                          <button
                            onClick={() =>
                              order._id && navigate(`/orders/${order._id}`)
                            }
                            className="view-btn"
                            disabled={!order._id}
                          >
                            View
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  <ChevronLeft size={18} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`pagination-btn ${
                        currentPage === number ? "active" : ""
                      }`}
                    >
                      {number}
                    </button>
                  )
                )}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <Package size={48} className="text-gray-400" />
            <h3>No orders yet</h3>
            <p>You haven't placed any orders yet</p>
            <button
              onClick={() => navigate("/products")}
              className="primary-btn"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
