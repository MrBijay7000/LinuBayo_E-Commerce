import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#ff6b6b",
  "#feca57",
  "#54a0ff",
  "#1dd1a1",
  "#9c88ff",
  "#ff9ff3",
];

const RevenueByCategoryChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/orders/revenue-by-category"
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        console.log("API Response:", result);

        if (!result.success)
          throw new Error(result.error || "Failed to fetch data");

        // Filter out "Uncategorized" if you want to exclude it
        const filteredData = result.data.filter(
          (item) => item.categoryName && item.categoryName !== "Uncategorized"
        );

        const transformedData = filteredData.map((item) => ({
          name: item.categoryName,
          value: item.totalRevenue,
          count: item.count,
        }));

        console.log("Chart Data:", transformedData);
        setChartData(transformedData);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  if (loading) {
    return <div className="chart-loading">Loading category data...</div>;
  }

  if (error) {
    return <div className="chart-error">Error: {error}</div>;
  }

  if (!chartData || chartData.length === 0) {
    return <div className="chart-no-data">No revenue data available</div>;
  }

  return (
    <div className="chart-placeholder">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => [
              `$${value.toFixed(2)}`,
              `${props.payload.name} (${props.payload.count} items)`,
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueByCategoryChart;
