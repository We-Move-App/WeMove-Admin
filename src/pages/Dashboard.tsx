import { useState } from "react";
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

const Dashboard = () => {
  const [showExportOptions, setShowExportOptions] = useState(false);

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
          value={bookingSummary.totalBookings.toLocaleString()}
          icon={<CreditCard size={20} />}
          change={12}
          iconBgColor="bg-blue-500"
        />
        <StatsCard
          title="Hotel Bookings"
          value={(bookingSummary.totalBookings * 0.4).toLocaleString()}
          icon={<Hotel size={20} />}
          change={8}
          iconBgColor="bg-purple-500"
        />
        <StatsCard
          title="Bus Bookings"
          value={(bookingSummary.totalBookings * 0.3).toLocaleString()}
          icon={<Bus size={20} />}
          change={-5}
          iconBgColor="bg-yellow-500"
        />
        <StatsCard
          title="Taxi Bookings"
          value={(bookingSummary.totalBookings * 0.2).toLocaleString()}
          icon={<Car size={20} />}
          change={15}
          iconBgColor="bg-green-500"
        />
        <StatsCard
          title="Bike Bookings"
          value={(bookingSummary.totalBookings * 0.1).toLocaleString()}
          icon={<Bike size={20} />}
          change={20}
          iconBgColor="bg-red-500"
        />
        <StatsCard
          title="Revenue"
          value={`₹${bookingSummary.revenue.toLocaleString()}`}
          icon={<CreditCard size={20} />}
          change={18}
          iconBgColor="bg-indigo-500"
        />
        <StatsCard
          title="Completed Bookings"
          value={bookingSummary.completedBookings.toLocaleString()}
          icon={<CreditCard size={20} />}
          change={10}
          iconBgColor="bg-emerald-500"
        />
        <StatsCard
          title="Cancelled Bookings"
          value={bookingSummary.cancelledBookings.toLocaleString()}
          icon={<CreditCard size={20} />}
          change={-12}
          iconBgColor="bg-rose-500"
        />
      </div>

      {/* Charts */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Analytics Overview</h2>
          <div className="relative">
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
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BookingChart
            monthlyData={monthlyBookingData}
            weeklyData={weeklyBookingData}
            yearlyData={yearlyBookingData}
          />
          <RevenueChart data={revenueData} />
        </div>
      </div>

      {/* Financial Summary */}
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
      </div>

      {/* Recent Transactions */}
      <div>
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
      </div>
    </>
  );
};

export default Dashboard;
