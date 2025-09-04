import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "@/api/axiosInstance";

const pastelBlue = "#3b82f6";

const RevenueChart = () => {
  const [formattedData, setFormattedData] = useState<any[]>([]);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await axiosInstance.get("/dashboard/top-analytics?filter=monthly");
        const revenue = response.data.data.revenue.totalRevenue;

        // All months
        const allMonths = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];

        // Map API data to short month names
        const monthMap: { [key: string]: number } = {};
        revenue.forEach((item: any) => {
          monthMap[item.filter.slice(0, 3)] = item.amount;
        });

        // Prepare chart data for all months up to the current month
        const currentMonthIndex = new Date().getMonth();
        const data = allMonths
          .slice(0, currentMonthIndex + 1)
          .map((month) => ({
            name: month,
            revenue: monthMap[month] ?? 0, // fill 0 if no data from API
          }));

        setFormattedData(data);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    fetchRevenue();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Revenue Trends</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
            <span className="text-xs text-gray-500">Revenue</span>
          </div>
        </div>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke={pastelBlue}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
