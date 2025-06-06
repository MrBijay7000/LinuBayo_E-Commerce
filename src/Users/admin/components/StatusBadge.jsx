import React from "react";
import "./StatusBadge.css"; // Optional styling

const getStatusDetails = (status) => {
  const statusMap = {
    pending: { class: "pending", text: "Pending", icon: "⏳" },
    processing: { class: "processing", text: "Processing", icon: "🔄" },
    shipped: { class: "shipped", text: "Shipped", icon: "🚚" },
    delivered: { class: "delivered", text: "Delivered", icon: "✅" },
    cancelled: { class: "cancelled", text: "Cancelled", icon: "❌" },
  };

  return (
    statusMap[status?.toLowerCase()] || {
      class: "unknown",
      text: status || "Unknown",
      icon: "❓",
    }
  );
};

const StatusBadge = ({ status }) => {
  const { class: statusClass, text, icon } = getStatusDetails(status);

  return (
    <span className={`status-badge ${statusClass}`} title={`Order is ${text}`}>
      {icon} {text}
    </span>
  );
};

export default StatusBadge;
