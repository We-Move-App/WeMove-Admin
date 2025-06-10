import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartData } from "@/types/admin";

interface BookingChartProps {
  monthlyData: ChartData;
  weeklyData: ChartData;
  yearlyData: ChartData;
}

const BookingChart = ({
  monthlyData,
  weeklyData,
  yearlyData,
}: BookingChartProps) => {
  const [timeRange, setTimeRange] = useState<"weekly" | "monthly" | "yearly">(
    "monthly"
  );

  const getCurrentData = () => {
    switch (timeRange) {
      case "weekly":
        return weeklyData;
      case "yearly":
        return yearlyData;
      case "monthly":
      default:
        return monthlyData;
    }
  };

  const currentData = getCurrentData();

  const chartData = currentData.labels.map((label, index) => {
    const dataPoint: { [key: string]: any } = { name: label };
    currentData.datasets.forEach((dataset) => {
      dataPoint[dataset.label] = dataset.data[index];
    });
    return dataPoint;
  });

  // const pastelColors = ["#A5D8FF", "#B2F2BB", "#D0BFFF", "#FFF3BF"];
  const pastelColors = [
    "#FCE9A0", // Soft Yellow
    "#A5C8FF", // Gentle Blue
    "#A8E6E1", // Calm Teal
    "#B7E4C7", // Fresh Pastel Green
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Booking Statistics</h3>
        <div className="flex space-x-2">
          {["weekly", "monthly", "yearly"].map((range) => (
            <button
              key={range}
              onClick={() =>
                setTimeRange(range as "weekly" | "monthly" | "yearly")
              }
              className={`px-3 py-1 text-xs rounded-md ${
                timeRange === range
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            barCategoryGap="20%" // Adjust this for category spacing
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {currentData.datasets.map((dataset, index) => (
              <Bar
                key={dataset.label}
                dataKey={dataset.label}
                fill={pastelColors[index % pastelColors.length]}
                radius={[4, 4, 0, 0]}
                barSize={timeRange === "yearly" ? 20 : 20}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BookingChart;
