import React from "react";
import "./LoadingSpinner.css";

const LoadingSpinner = ({ asOverlay, barCount = 3, className = "" }) => {
  return (
    <div
      className={`${asOverlay ? "loading-spinner__overlay" : ""} ${className}`}
    >
      <div className="lds-bars">
        {[...Array(barCount)].map((_, i) => (
          <div key={i} />
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;
