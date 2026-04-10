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
import CustomerDetailsSkeleton from "../ui/loader-skeleton";
import { useTranslation } from "react-i18next";

const pastelBlue = "#3b82f6";

const RevenueChart = () => {
  const [formattedData, setFormattedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation()

  // useEffect(() => {
  //   const fetchRevenue = async () => {
  //     try {
  //       const response = await axiosInstance.get(
  //         "/dashboard/top-analytics?filter=monthly"
  //       );
  //       const revenue = response.data.data.revenue.totalRevenue;
  //       const allMonths = [
  //         "Jan",
  //         "Feb",
  //         "Mar",
  //         "Apr",
  //         "May",
  //         "Jun",
  //         "Jul",
  //         "Aug",
  //         "Sep",
  //         "Oct",
  //         "Nov",
  //         "Dec",
  //       ];
  //       const monthMap: { [key: string]: number } = {};
  //       revenue.forEach((item: any) => {
  //         monthMap[item.filter.slice(0, 3)] = item.amount;
  //       });
  //       const currentMonthIndex = new Date().getMonth();
  //       const data = allMonths.slice(0, currentMonthIndex + 1).map((month) => ({
  //         name: month,
  //         revenue: monthMap[month] ?? 0,
  //       }));

  //       setFormattedData(data);
  //     } catch (error) {
  //       console.error("Error fetching revenue data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchRevenue();
  // }, []);
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await axiosInstance.get(
          "/dashboard/top-analytics?filter=monthly"
        );

        const revenue = response.data.data.revenue.totalRevenue;

        // ✅ Step 1: map API months → index (0–11)
        const monthMap: { [key: number]: number } = {};

        revenue.forEach((item: any) => {
          const monthIndex = new Date(`${item.filter} 1, 2024`).getMonth();
          monthMap[monthIndex] = item.amount;
        });

        // ✅ Step 2: translation keys in order
        const monthKeys = [
          "months.jan",
          "months.feb",
          "months.mar",
          "months.apr",
          "months.may",
          "months.jun",
          "months.jul",
          "months.aug",
          "months.sep",
          "months.oct",
          "months.nov",
          "months.dec",
        ];

        const currentMonthIndex = new Date().getMonth();

        // ✅ Step 3: build localized data
        const data = monthKeys
          .slice(0, currentMonthIndex + 1)
          .map((key, index) => ({
            name: t(key), // ✅ translated month
            revenue: monthMap[index] ?? 0,
          }));

        setFormattedData(data);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [i18n.language]);
  return (
    <>
      {loading ? (
        <CustomerDetailsSkeleton />
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">{t("dashboard.revenueTrends.title")}</h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                  <span className="text-xs text-gray-500">{t("dashboard.revenueTrends.revenue")}</span>
                </div>
              </div>
            </div>

            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, t("dashboard.revenueTrends.revenue")]} />
                  <Legend formatter={() => t("dashboard.revenueTrends.revenue")} />
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
        </>
      )}
    </>
  );
};

export default RevenueChart;
