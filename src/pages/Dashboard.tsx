import { useEffect, useState } from "react";
// import Layout from "@/components/layout/Layout";
import StatsCard from "@/components/ui/StatsCard";
import BookingChart from "@/components/dashboard/BookingChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import { Hotel, Bus, Car, Bike, CreditCard, Download } from "lucide-react";
import {
  bookingSummary,
  monthlyBookingData,
  weeklyBookingData,
  yearlyBookingData,
  revenueData,
} from "@/data/mockData";
import axiosInstance from "@/api/axiosInstance";
import axios from "axios";


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
    completedBookings: { filter: "", bookings: 0, trend: 0, status: "increased" },
    cancelledBookings: { filter: "", bookings: 0, trend: 0, status: "increased" },
    revenue: { filter: "", amount: 0, trend: 0, status: "increased" },
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(`/dashboard/top-analytics?filter=monthly`);
        const data = response?.data?.data;

        // Get the last element of each array (latest month)
        const summary = {
          totalBookings: data?.totalBookings?.at(-1) ?? { filter: "", bookings: 0, trend: 0, status: "increased" },
          hotelBookings: data?.hotel?.at(-1) ?? { filter: "", bookings: 0, trend: 0, status: "increased" },
          busBookings: data?.bus?.at(-1) ?? { filter: "", bookings: 0, trend: 0, status: "increased" },
          taxiBookings: data?.taxi?.at(-1) ?? { filter: "", bookings: 0, trend: 0, status: "increased" },
          bikeBookings: data?.bike?.at(-1) ?? { filter: "", bookings: 0, trend: 0, status: "increased" },
          completedBookings: data?.completed?.at(-1) ?? { filter: "", bookings: 0, trend: 0, status: "increased" },
          cancelledBookings: data?.cancelled?.at(-1) ?? { filter: "", bookings: 0, trend: 0, status: "increased" },
          revenue: data?.revenue?.totalRevenue?.at(-1) ?? { filter: "", amount: 0, trend: 0, status: "increased" },
        };

        setBookingSummary(summary);

        // ✅ Log individual values
        console.log("Total Bookings:", summary.totalBookings.bookings);
        console.log("Hotel Bookings:", summary.hotelBookings.bookings);
        console.log("Bus Bookings:", summary.busBookings.bookings);
        console.log("Taxi Bookings:", summary.taxiBookings.bookings);
        console.log("Bike Bookings:", summary.bikeBookings.bookings);
        console.log("Completed Bookings:", summary.completedBookings.bookings);
        console.log("Cancelled Bookings:", summary.cancelledBookings.bookings);
        console.log("Revenue:", summary.revenue.amount);

      } catch (error) {
        console.error("Error fetching dashboard data", error);
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Bookings"
          value={bookingSummary.totalBookings?.bookings?.toLocaleString() ?? "0"}
          icon={<CreditCard size={20} />}
          change={bookingSummary.totalBookings?.trend ?? 0}
          status={bookingSummary.totalBookings?.status ?? "increased"}
          iconBgColor="bg-blue-500"
        />
        <StatsCard
          title="Hotel Bookings"
          value={bookingSummary.hotelBookings?.bookings?.toLocaleString() ?? "0"}
          icon={<Hotel size={20} />}
          change={bookingSummary.hotelBookings?.trend ?? 0}
          status={bookingSummary.hotelBookings?.status ?? "increased"}
          iconBgColor="bg-purple-500"
        />
        <StatsCard
          title="Bus Bookings"
          value={bookingSummary.busBookings?.bookings?.toLocaleString() ?? "0"}
          icon={<Bus size={20} />}
          change={bookingSummary.busBookings?.trend ?? 0}
          status={bookingSummary.busBookings?.status ?? "increased"}
          iconBgColor="bg-yellow-500"
        />
        <StatsCard
          title="Taxi Bookings"
          value={bookingSummary.taxiBookings?.bookings?.toLocaleString() ?? "0"}
          icon={<Car size={20} />}
          change={bookingSummary.taxiBookings?.trend ?? 0}
          status={bookingSummary.taxiBookings?.status ?? "increased"}
          iconBgColor="bg-green-500"
        />
        <StatsCard
          title="Bike Bookings"
          value={bookingSummary.bikeBookings?.bookings?.toLocaleString() ?? "0"}
          icon={<Bike size={20} />}
          change={bookingSummary.bikeBookings?.trend ?? 0}
          status={bookingSummary.bikeBookings?.status ?? "increased"}
          iconBgColor="bg-red-500"
        />
        <StatsCard
          title="Revenue"
          value={`₹${bookingSummary.revenue?.amount?.toLocaleString() ?? "0"}`}
          icon={<CreditCard size={20} />}
          change={bookingSummary.revenue?.trend ?? 0}
          status={bookingSummary.revenue?.status ?? "increased"}
          iconBgColor="bg-indigo-500"
        />
        <StatsCard
          title="Completed Bookings"
          value={bookingSummary.completedBookings?.bookings?.toLocaleString() ?? "0"}
          icon={<CreditCard size={20} />}
          change={bookingSummary.completedBookings?.trend ?? 0}
          status={bookingSummary.completedBookings?.status ?? "increased"}
          iconBgColor="bg-emerald-500"
        />
        <StatsCard
          title="Cancelled Bookings"
          value={bookingSummary.cancelledBookings?.bookings?.toLocaleString() ?? "0"}
          icon={<CreditCard size={20} />}
          change={bookingSummary.cancelledBookings?.trend ?? 0}
          status={bookingSummary.cancelledBookings?.status ?? "increased"}
          iconBgColor="bg-rose-500"
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
          <BookingChart />
          <RevenueChart />
        </div>
      </div>

      {/* Financial Summary
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">Financial Summary</h2>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">
                Total Revenue
              </h3>
              <p className="text-2xl font-bold">
                ₹{bookingSummary.revenue.toLocaleString()}
              </p>
              <div className="mt-2 text-sm flex items-center text-green-600">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                18% since last month
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">
                Pending Payments
              </h3>
              <p className="text-2xl font-bold">
                ₹{(bookingSummary.revenue * 0.15).toLocaleString()}
              </p>
              <div className="mt-2 text-sm flex items-center text-yellow-600">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4"
                  />
                </svg>
                No change since last month
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">
                Refunds Processed
              </h3>
              <p className="text-2xl font-bold">
                ₹{(bookingSummary.revenue * 0.05).toLocaleString()}
              </p>
              <div className="mt-2 text-sm flex items-center text-red-600">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                5% since last month
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Recent Transactions */}
      {/* <div>
        <h2 className="text-xl font-medium mb-4">Recent Transactions</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Service</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>TRX-12345</td>
                <td>Hotel Booking</td>
                <td>Rahul Sharma</td>
                <td>15 May 2023</td>
                <td>₹4,500</td>
                <td>
                  <span className="status-approved">Completed</span>
                </td>
              </tr>
              <tr>
                <td>TRX-12346</td>
                <td>Bus Booking</td>
                <td>Priya Patel</td>
                <td>15 May 2023</td>
                <td>₹650</td>
                <td>
                  <span className="status-approved">Completed</span>
                </td>
              </tr>
              <tr>
                <td>TRX-12347</td>
                <td>Taxi Booking</td>
                <td>Amit Kumar</td>
                <td>16 May 2023</td>
                <td>₹350</td>
                <td>
                  <span className="status-pending">Pending</span>
                </td>
              </tr>
              <tr>
                <td>TRX-12348</td>
                <td>Bike Booking</td>
                <td>Sneha Reddy</td>
                <td>16 May 2023</td>
                <td>₹150</td>
                <td>
                  <span className="status-rejected">Cancelled</span>
                </td>
              </tr>
              <tr>
                <td>TRX-12349</td>
                <td>Hotel Booking</td>
                <td>Vikram Singh</td>
                <td>17 May 2023</td>
                <td>₹8,500</td>
                <td>
                  <span className="status-pending">Pending</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> */}
      <div>
        <h2 className="text-xl font-medium mb-4">Recent Transactions</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="admin-table w-full text-left">
              <thead>
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
                    <td className="px-4 py-2">{formatDate(trx.createdAt)}</td>
                    <td className="px-4 py-2">
                      {trx.currency} {trx.amount}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`${trx.status === "SUCCESS"
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
        )}
      </div>
    </>
  );
};

export default Dashboard;
