import React from "react";
import {
  FiShoppingBag,
  FiUsers,
  FiDollarSign,
  FiPieChart,
  FiSettings,
} from "react-icons/fi";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BsGraphUp, BsBoxSeam } from "react-icons/bs";
import { MdOutlineInventory, MdLocalOffer } from "react-icons/md";
import "./AdminHomePage.css";
import { NavLink } from "react-router-dom";

const AdminDashboard = () => {
  // Sample data - replace with your actual data
  const stats = [
    {
      title: "Total Sales",
      value: "$24,580",
      change: "+12%",
      icon: <FiDollarSign size={24} />,
    },
    {
      title: "Orders",
      value: "1,248",
      change: "+5%",
      icon: <FiShoppingBag size={24} />,
    },
    {
      title: "Customers",
      value: "892",
      change: "+8%",
      icon: <FiUsers size={24} />,
    },
    {
      title: "Inventory",
      value: "1,845",
      change: "-3%",
      icon: <MdOutlineInventory size={24} />,
    },
  ];

  const recentOrders = [
    {
      id: "#ORD-001",
      customer: "Alex Johnson",
      date: "Today, 10:30 AM",
      amount: "$89.99",
      status: "Shipped",
    },
    {
      id: "#ORD-002",
      customer: "Maria Garcia",
      date: "Today, 09:15 AM",
      amount: "$124.50",
      status: "Processing",
    },
    {
      id: "#ORD-003",
      customer: "James Wilson",
      date: "Yesterday",
      amount: "$65.25",
      status: "Delivered",
    },
    {
      id: "#ORD-004",
      customer: "Sarah Lee",
      date: "Yesterday",
      amount: "$210.00",
      status: "Shipped",
    },
  ];

  const topProducts = [
    { name: "Classic White Tee", sales: 142, revenue: "$1,704" },
    { name: "Slim Fit Jeans", sales: 98, revenue: "$2,450" },
    { name: "Oversized Hoodie", sales: 76, revenue: "$1,824" },
    { name: "Summer Dress", sales: 65, revenue: "$1,430" },
  ];

  const data = [
    { name: "Shirts", value: 400 },
    { name: "Pants", value: 300 },
    { name: "Shoes", value: 300 },
    { name: "Accessories", value: 200 },
  ];

  const COLORS = ["#ff6b6b", "#feca57", "#54a0ff", "#1dd1a1"];

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>ClothCraft Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <a href="#" className="active">
            <FiPieChart /> Dashboard
          </a>
          <a href="#">
            <FiShoppingBag /> Products
          </a>
          <a href="#">
            <BsBoxSeam /> Orders
          </a>
          <NavLink to={"/admin/customersDetails"}>
            <FiUsers /> Customers
          </NavLink>
          <a href="#">
            <MdLocalOffer /> Promotions
          </a>
          <a href="#">
            <BsGraphUp /> Analytics
          </a>
          <a href="#">
            <FiSettings /> Settings
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div className="header-search">
            <input type="text" placeholder="Search..." />
          </div>
          <div className="header-actions">
            <button className="notification-btn">3</button>
            <div className="user-profile">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="Admin"
              />
              <span>Admin User</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          <h1>Dashboard Overview</h1>

          {/* Stats Cards */}
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div className="stat-card" key={index}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-info">
                  <h3>{stat.title}</h3>
                  <p className="stat-value">{stat.value}</p>
                  <p
                    className={`stat-change ${
                      stat.change.startsWith("+") ? "positive" : "negative"
                    }`}
                  >
                    {stat.change}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="charts-row">
            <div className="chart-container">
              <h3>Sales Overview</h3>
              {/* <div className="chart-placeholder">
                {/* Replace with your actual chart component *
                <div className="mock-chart"></div>
              </div> */}
              <div className="chart-placeholder">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="chart-container">
              <h3>Revenue by Category</h3>
              {/* <div className="chart-placeholder">
                {/* Replace with your actual chart component *
                <div className="mock-chart pie"></div>
              </div> */}

              <div className="chart-placeholder">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Tables Row */}
          <div className="tables-row">
            <div className="table-container">
              <h3>Recent Orders</h3>
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr key={index}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.date}</td>
                      <td>{order.amount}</td>
                      <td>
                        <span
                          className={`status-badge ${order.status.toLowerCase()}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="table-container">
              <h3>Top Selling Products</h3>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Sales</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, index) => (
                    <tr key={index}>
                      <td>{product.name}</td>
                      <td>{product.sales}</td>
                      <td>{product.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
