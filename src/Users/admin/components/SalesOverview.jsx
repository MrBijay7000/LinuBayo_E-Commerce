import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SalesOverviewChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ["#ff6b6b", "#feca57", "#54a0ff", "#1dd1a1"];

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/orders/sales-overview"
        );
        const data = await response.json(); // Correct parsing

        // Now transform the response
        const transformedData = data.salesData.map((item) => ({
          name: item.timePeriod,
          value: item.totalSales,
        }));

        setSalesData(transformedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  if (loading) {
    return <div className="chart-loading">Loading sales data...</div>;
  }

  if (error) {
    return <div className="chart-error">Error: {error}</div>;
  }

  return (
    <div className="chart-placeholder">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={salesData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {salesData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`$${value}`, "Total Sales"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesOverviewChart;
