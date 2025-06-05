// client/src/admin/components/OrderList.js
import { BsBoxSeam, BsCheckCircle, BsTruck, BsXCircle } from "react-icons/bs";
import { FaMoneyBillWave } from "react-icons/fa";
import "./OrderList.css";

const OrderList = ({ orders, onUpdateStatus }) => {
  const statusIcons = {
    processing: <BsBoxSeam className="processing" />,
    shipped: <BsTruck className="shipped" />,
    delivered: <BsCheckCircle className="delivered" />,
    cancelled: <BsXCircle className="cancelled" />,
    paid: <FaMoneyBillWave className="paid" />,
  };

  const statusOptions = [
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="order-list">
      {orders.length === 0 ? (
        <p className="no-orders">No orders found</p>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-id">Order #{order._id.slice(-6)}</div>
                <div className="order-date">
                  {new Date(order.orderDate).toLocaleDateString()}
                </div>
              </div>

              <div className="order-user">
                <div className="user-name">{order.name}</div>
                <div className="user-email">{order.email}</div>
                <div className="user-address">{order.address}</div>
              </div>

              <div className="order-status">
                <div className="status-icon">
                  {statusIcons[order.orderStatus]}
                </div>
                <select
                  value={order.orderStatus}
                  onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                  className="status-select"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="order-items">
                <h4>Items ({order.items.length})</h4>
                <ul>
                  {order.items.map((item) => (
                    // <li
                    //   key={item.productId?._id || item._id}
                    //   className="order-item"
                    // >
                    <li
                      key={item.productId?._id || item._id}
                      className="order-item"
                    >
                      {/* <li key={item.productId._id} className="order-item"> */}
                      <div className="item-image">
                        {/* <img
                          //   src={`http://localhost:5001/${
                          //     item.productId?.image || "No Image"
                          //   }`}
                          src={
                            item.productId?.image
                              ? `http://localhost:5001/uploads/images/${item.productId?.image}`
                              : "/images/no-image.png"
                          }
                          //   src={`http://localhost:5001/${item.productId.image}`}
                          alt={item.name}
                        /> */}
                      </div>
                      <div className="item-details">
                        <div className="item-name">{item.name}</div>
                        <div className="item-quantity">
                          Qty: {item.quantity}
                        </div>
                        <div className="item-price">Rs {item.price}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="order-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>Rs {order.totalAmount - order.shippingFee}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>Rs {order.shippingFee}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>Rs {order.totalAmount}</span>
                </div>
                <div className="payment-method">
                  <span>Payment:</span>
                  <span className="method">{order.paymentMethod}</span>
                  <span className={`payment-status ${order.paymentStatus}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;
