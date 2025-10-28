import React, { useState, useEffect } from "react";
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
import axiosInstance from "@/api/axiosInstance";
import { ChartData } from "@/types/admin";
import { Loader } from "lucide-react";
import DashboardSkeleton from "../ui/DashboardSkeleton";
import CustomerDetailsSkeleton from "../ui/loader-skeleton";

const pastelColors = ["#FCE9A0", "#A5C8FF", "#A8E6E1", "#B7E4C7"];

const BookingChart = () => {
  const [timeRange, setTimeRange] = useState<"weekly" | "monthly" | "yearly">(
    "monthly"
  );
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);

  // Whenever timeRange changes, fetch new data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/dashboard/top-analytics?filter=${timeRange}`
        );
        const data = response.data.data;

        let labels: string[] = [];
        const monthMap: { [key: string]: string } = {
          January: "Jan",
          February: "Feb",
          March: "Mar",
          April: "Apr",
          May: "May",
          June: "Jun",
          July: "Jul",
          August: "Aug",
          September: "Sep",
          October: "Oct",
          November: "Nov",
          December: "Dec",
        };

        // Set chart labels based on timeRange
        if (timeRange === "weekly") {
          labels = ["week1", "week2", "week3", "week4"];
        } else if (timeRange === "monthly") {
          labels = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
        } else if (timeRange === "yearly") {
          labels = Array.from(
            new Set(data.totalBookings.map((item: any) => item.filter))
          );
        }

        // Map data for each type
        const datasets = ["hotel", "bus", "taxi", "bike"].map((type, idx) => ({
          label: type.charAt(0).toUpperCase() + type.slice(1),
          data: labels.map((label) => {
            if (timeRange === "monthly") {
              // map full month names to 3-letter abbreviations
              const item = data[type].find(
                (d: any) => monthMap[d.filter] === label
              );
              return item ? item.bookings : 0;
            } else {
              // weekly and yearly: match directly
              const item = data[type].find((d: any) => d.filter === label);
              return item ? item.bookings : 0;
            }
          }),
          backgroundColor: pastelColors[idx],
          borderColor: pastelColors[idx],
          borderWidth: 1,
        }));

        setChartData({ labels, datasets });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const formattedData = chartData.labels.map((label, index) => {
    const point: { [key: string]: any } = { name: label };
    chartData.datasets.forEach((dataset) => {
      point[dataset.label] = dataset.data[index];
    });
    return point;
  });

  return (
    <>
      {loading ? (
        <CustomerDetailsSkeleton />
      ) : (
        <>
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
                <BarChart data={formattedData} barCategoryGap="20%" barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {chartData.datasets.map((dataset, index) => (
                    <Bar
                      key={dataset.label}
                      dataKey={dataset.label}
                      fill={dataset.backgroundColor}
                      radius={[4, 4, 0, 0]}
                      barSize={20}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default BookingChart;
