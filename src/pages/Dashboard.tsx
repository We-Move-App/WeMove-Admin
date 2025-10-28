import { useEffect, useState } from "react";
// import Layout from "@/components/layout/Layout";
import StatsCard from "@/components/ui/StatsCard";
import BookingChart from "@/components/dashboard/BookingChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import {
  Hotel,
  Bus,
  Car,
  Bike,
  CreditCard,
  Download,
  User,
} from "lucide-react";
import {
  bookingSummary,
  monthlyBookingData,
  weeklyBookingData,
  yearlyBookingData,
  revenueData,
} from "@/data/mockData";
import axiosInstance from "@/api/axiosInstance";
import axios from "axios";
import DashboardSkeleton from "@/components/ui/DashboardSkeleton";
import Loader from "@/components/ui/loader";

type BookingStats = {
  filter: string;
  bookings: number;
  trend: number;
  status: "increased" | "decreased";
};

type RevenueStats = {
  filter: string;
  amount: number;
  trend: number;
  status: "increased" | "decreased";
};

type BookingSummary = {
  totalBookings: BookingStats;
  hotelBookings: BookingStats;
  busBookings: BookingStats;
  taxiBookings: BookingStats;
  bikeBookings: BookingStats;
  completedBookings: BookingStats;
  cancelledBookings: BookingStats;
  revenue: RevenueStats;
};

interface Transaction {
  _id: string;
  transactionId: string;
  description: string;
  serviceType: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [bookingSummary, setBookingSummary] = useState<BookingSummary>({
    totalBookings: { filter: "", bookings: 0, trend: 0, status: "increased" },
    hotelBookings: { filter: "", bookings: 0, trend: 0, status: "increased" },
    busBookings: { filter: "", bookings: 0, trend: 0, status: "increased" },
    taxiBookings: { filter: "", bookings: 0, trend: 0, status: "increased" },
    bikeBookings: { filter: "", bookings: 0, trend: 0, status: "increased" },
    completedBookings: {
      filter: "",
      bookings: 0,
      trend: 0,
      status: "increased",
    },
    cancelledBookings: {
      filter: "",
      bookings: 0,
      trend: 0,
      status: "increased",
    },
    revenue: { filter: "", amount: 0, trend: 0, status: "increased" },
  });

  const role = localStorage.getItem("role");
  const permissions = JSON.parse(localStorage.getItem("permissions") || "{}");
  const [userSummary, setUserSummary] = useState({
    totalUsers: 0,
    busUsers: 0,
    hotelUsers: 0,
    bikeUsers: 0,
    taxiUsers: 0,
    normalUsers: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(
          `/dashboard/top-analytics?filter=monthly`
        );
        const data = response?.data?.data;

        // Get the last element of each array (latest month)
        const summary = {
          totalBookings: data?.totalBookings?.at(-1) ?? {
            filter: "",
            bookings: 0,
            trend: 0,
            status: "increased",
          },
          hotelBookings: data?.hotel?.at(-1) ?? {
            filter: "",
            bookings: 0,
            trend: 0,
            status: "increased",
          },
          busBookings: data?.bus?.at(-1) ?? {
            filter: "",
            bookings: 0,
            trend: 0,
            status: "increased",
          },
          taxiBookings: data?.taxi?.at(-1) ?? {
            filter: "",
            bookings: 0,
            trend: 0,
            status: "increased",
          },
          bikeBookings: data?.bike?.at(-1) ?? {
            filter: "",
            bookings: 0,
            trend: 0,
            status: "increased",
          },
          completedBookings: data?.completed?.at(-1) ?? {
            filter: "",
            bookings: 0,
            trend: 0,
            status: "increased",
          },
          cancelledBookings: data?.cancelled?.at(-1) ?? {
            filter: "",
            bookings: 0,
            trend: 0,
            status: "increased",
          },
          revenue: data?.revenue?.totalRevenue?.at(-1) ?? {
            filter: "",
            amount: 0,
            trend: 0,
            status: "increased",
          },
        };

        setBookingSummary(summary);

        // ✅ Log individual values
        // console.log("Total Bookings:", summary.totalBookings.bookings);
        // console.log("Hotel Bookings:", summary.hotelBookings.bookings);
        // console.log("Bus Bookings:", summary.busBookings.bookings);
        // console.log("Taxi Bookings:", summary.taxiBookings.bookings);
        // console.log("Bike Bookings:", summary.bikeBookings.bookings);
        // console.log("Completed Bookings:", summary.completedBookings.bookings);
        // console.log("Cancelled Bookings:", summary.cancelledBookings.bookings);
        // console.log("Revenue:", summary.revenue.amount);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await axiosInstance.get(
          "/wallet/transactions/admin?page=1",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setTransactions(response.data.data.transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchUserSummary = async () => {
      try {
        const res = await axiosInstance.get("/dashboard/user-summary");
        if (res.data?.data) {
          setUserSummary(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch user summary:", error);
      }
    };

    fetchUserSummary();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Welcome to your admin dashboard</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Bookings"
              value={
                bookingSummary.totalBookings?.bookings?.toLocaleString() ?? "0"
              }
              icon={<CreditCard size={20} />}
              change={bookingSummary.totalBookings?.trend ?? 0}
              status={bookingSummary.totalBookings?.status ?? "increased"}
              iconBgColor="bg-blue-500"
            />
            {/* Hotel Bookings → check API key + permission */}
            {permissions.hotelManagement && bookingSummary?.hotelBookings && (
              <StatsCard
                title="Hotel Bookings"
                value={
                  bookingSummary.hotelBookings?.bookings?.toLocaleString() ??
                  "0"
                }
                icon={<Hotel size={20} />}
                change={bookingSummary.hotelBookings?.trend ?? 0}
                status={bookingSummary.hotelBookings?.status ?? "increased"}
                iconBgColor="bg-purple-500"
              />
            )}

            {/* Bus Bookings → check API key + permission */}
            {permissions.busManagement && bookingSummary?.busBookings && (
              <StatsCard
                title="Bus Bookings"
                value={
                  bookingSummary.busBookings?.bookings?.toLocaleString() ?? "0"
                }
                icon={<Bus size={20} />}
                change={bookingSummary.busBookings?.trend ?? 0}
                status={bookingSummary.busBookings?.status ?? "increased"}
                iconBgColor="bg-yellow-500"
              />
            )}

            {/* Taxi Bookings → check API key + permission */}
            {permissions.taxiManagement && bookingSummary?.taxiBookings && (
              <StatsCard
                title="Taxi Bookings"
                value={
                  bookingSummary.taxiBookings?.bookings?.toLocaleString() ?? "0"
                }
                icon={<Car size={20} />}
                change={bookingSummary.taxiBookings?.trend ?? 0}
                status={bookingSummary.taxiBookings?.status ?? "increased"}
                iconBgColor="bg-yellow-500"
              />
            )}
            {/* Bike Bookings → check API key + permission */}
            {permissions.bikeManagement && bookingSummary?.bikeBookings && (
              <StatsCard
                title="Bike Bookings"
                value={
                  bookingSummary.bikeBookings?.bookings?.toLocaleString() ?? "0"
                }
                icon={<Bike size={20} />}
                change={bookingSummary.bikeBookings?.trend ?? 0}
                status={bookingSummary.bikeBookings?.status ?? "increased"}
                iconBgColor="bg-red-500"
              />
            )}

            {/* Completed Bookings */}
            {bookingSummary?.completedBookings && (
              <StatsCard
                title="Completed Bookings"
                value={
                  bookingSummary.completedBookings?.bookings?.toLocaleString() ??
                  "0"
                }
                icon={<CreditCard size={20} />}
                change={bookingSummary.completedBookings?.trend ?? 0}
                status={bookingSummary.completedBookings?.status ?? "increased"}
                iconBgColor="bg-emerald-500"
              />
            )}

            {/* Cancelled Bookings */}
            {bookingSummary?.cancelledBookings && (
              <StatsCard
                title="Cancelled Bookings"
                value={
                  bookingSummary.cancelledBookings?.bookings?.toLocaleString() ??
                  "0"
                }
                icon={<CreditCard size={20} />}
                change={bookingSummary.cancelledBookings?.trend ?? 0}
                status={bookingSummary.cancelledBookings?.status ?? "increased"}
                iconBgColor="bg-rose-500"
              />
            )}

            {/* Revenue → only SuperAdmin + API key present */}
            {role === "SuperAdmin" && bookingSummary?.revenue && (
              <StatsCard
                title="Revenue"
                value={`₹${
                  bookingSummary.revenue?.amount?.toLocaleString() ?? "0"
                }`}
                icon={<CreditCard size={20} />}
                change={bookingSummary.revenue?.trend ?? 0}
                status={bookingSummary.revenue?.status ?? "increased"}
                iconBgColor="bg-indigo-500"
              />
            )}

            {/* --- USER SUMMARY --- */}
            <StatsCard
              title="Total Users"
              value={userSummary.totalUsers?.toLocaleString() ?? "0"}
              icon={<CreditCard size={20} />}
              iconBgColor="bg-sky-500"
            />

            <StatsCard
              title="Bus Users"
              value={userSummary.busUsers?.toLocaleString() ?? "0"}
              icon={<Bus size={20} />}
              iconBgColor="bg-yellow-500"
            />

            <StatsCard
              title="Hotel Users"
              value={userSummary.hotelUsers?.toLocaleString() ?? "0"}
              icon={<Hotel size={20} />}
              iconBgColor="bg-purple-500"
            />

            <StatsCard
              title="Taxi Users"
              value={userSummary.taxiUsers?.toLocaleString() ?? "0"}
              icon={<Car size={20} />}
              iconBgColor="bg-orange-500"
            />

            <StatsCard
              title="Bike Users"
              value={userSummary.bikeUsers?.toLocaleString() ?? "0"}
              icon={<Bike size={20} />}
              iconBgColor="bg-red-500"
            />
          </div>

          {/* Charts */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Analytics Overview</h2>
              {/* <div className="relative">
            <button
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-900 transition-colors"
              onClick={() => setShowExportOptions(!showExportOptions)}
            >
              <Download size={18} className="mr-2" />
              Export Report
            </button>

            {showExportOptions && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1" role="menu">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Export as PDF
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Export as Excel
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Export as CSV
                  </a>
                </div>
              </div>
            )}
          </div> */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {loading ? (
                <Loader />
              ) : (
                <>
                  <BookingChart />
                  {role === "SuperAdmin" && <RevenueChart />}
                </>
              )}
            </div>
          </div>

          {/* Recent Transactions - only for SuperAdmin */}
          {role === "SuperAdmin" && (
            <div>
              <h2 className="text-xl font-medium mb-4">Recent Transactions</h2>

              {loading ? (
                <Loader />
              ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Scrollable container */}
                  <div className="max-h-96 overflow-y-auto">
                    <table className="admin-table w-full text-left">
                      <thead className="sticky top-0 bg-white z-10">
                        <tr>
                          <th className="px-4 py-2">ID</th>
                          <th className="px-4 py-2">Service</th>
                          <th className="px-4 py-2">Customer</th>
                          <th className="px-4 py-2">Date</th>
                          <th className="px-4 py-2">Amount</th>
                          <th className="px-4 py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((trx) => (
                          <tr key={trx._id} className="border-t">
                            <td className="px-4 py-2">{trx.transactionId}</td>
                            <td className="px-4 py-2">{trx.description}</td>
                            <td className="px-4 py-2">{trx.serviceType}</td>
                            <td className="px-4 py-2">
                              {formatDate(trx.createdAt)}
                            </td>
                            <td className="px-4 py-2">
                              {trx.currency} {trx.amount}
                            </td>
                            <td className="px-4 py-2">
                              <span
                                className={`${
                                  trx.status === "SUCCESS"
                                    ? "status-approved"
                                    : trx.status === "PENDING"
                                    ? "status-pending"
                                    : "status-rejected"
                                }`}
                              >
                                {trx.status}
                              </span>
                            </td>
                          </tr>
                        ))}

                        {transactions.length === 0 && (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-4 py-2 text-center text-gray-500"
                            >
                              No transactions found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Dashboard;
