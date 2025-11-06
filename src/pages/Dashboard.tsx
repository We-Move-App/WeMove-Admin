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
import { Pagination } from "@/components/ui/pagination";
import PaginationComponent from "@/components/pagination/PaginationComponent";
import { useTranslation } from "react-i18next";

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
  date?: string;
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  const role = localStorage.getItem("role");
  const permissions = JSON.parse(localStorage.getItem("permissions") || "{}");
  const [userSummary, setUserSummary] = useState({
    users: 0,
    busOperators: 0,
    hotelManagers: 0,
    drivers: 0,
  });
  const { i18n, t } = useTranslation();
  // const [totalCounts, setTotalCounts] = useState();

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

  // useEffect(() => {
  //   const fetchTransactions = async () => {
  //     setLoading(true);
  //     try {
  //       const accessToken = localStorage.getItem("accessToken");

  //       const response = await axiosInstance.get(
  //         `/wallet/transactions/admin?page=${currentPage}&limit=${pageSize}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${accessToken}`,
  //           },
  //         }
  //       );

  //       const { transactions, totalCount } = response.data.data;
  //       setTransactions(transactions);
  //       setTotalItems(totalCount);
  //     } catch (error) {
  //       console.error("Error fetching transactions:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchTransactions();
  // }, [currentPage]);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await axiosInstance.get(
          `/wallet/transactions/admin?page=${currentPage}&limit=${pageSize}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const { data, totalRecords } = response.data;
        setTransactions(data);
        setTotalItems(totalRecords);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage]);

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

  useEffect(() => {
    const fetchTotalCounts = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("dashboard/total-counts");
        if (res.data?.data) {
          setUserSummary(res.data.data);
          console.log(setUserSummary);
        }
      } catch (error) {
        console.error("Error fetching the data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTotalCounts();
  }, []);

  return (
    <>
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{t("dashboard.title")}</h1>
            <p className="text-gray-600">{t("dashboard.welcome")}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title={t("dashboard.stats.totalBookings")}
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
                title={t("dashboard.stats.hotelBookings")}
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
                title={t("dashboard.stats.busBookings")}
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
                title={t("dashboard.stats.taxiBookings")}
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
                title={t("dashboard.stats.bikeBookings")}
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
                title={t("dashboard.stats.completedBookings")}
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
                title={t("dashboard.stats.cancelledBookings")}
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
                title={t("dashboard.stats.revenue")}
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
              title={t("dashboard.stats.totalUsers")}
              value={userSummary.users?.toLocaleString() ?? "0"}
              icon={<CreditCard size={20} />}
              iconBgColor="bg-sky-500"
            />

            <StatsCard
              title={t("dashboard.stats.busUsers")}
              value={userSummary.busOperators?.toLocaleString() ?? "0"}
              icon={<Bus size={20} />}
              iconBgColor="bg-yellow-500"
            />

            <StatsCard
              title={t("dashboard.stats.hotelUsers")}
              value={userSummary.hotelManagers?.toLocaleString() ?? "0"}
              icon={<Hotel size={20} />}
              iconBgColor="bg-purple-500"
            />

            <StatsCard
              title={t("dashboard.stats.rideUsers")}
              value={userSummary.drivers?.toLocaleString() ?? "0"}
              icon={<Car size={20} />}
              iconBgColor="bg-orange-500"
            />
          </div>

          {/* Charts */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">
                {t("dashboard.charts.analyticsOverview")}
              </h2>
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
              <h2 className="text-xl font-medium mb-4">
                {t("dashboard.transactions.recentTransactions")}
              </h2>

              {loading ? (
                <Loader />
              ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Scrollable container */}
                  <div className="max-h-96 overflow-y-auto">
                    <table className="admin-table w-full text-left">
                      <thead className="sticky top-0 bg-white z-10">
                        <tr>
                          <th className="px-4 py-2">
                            {t("dashboard.transactions.table.id")}
                          </th>
                          <th className="px-4 py-2">
                            {t("dashboard.transactions.table.service")}
                          </th>
                          <th className="px-4 py-2">
                            {t("dashboard.transactions.table.date")}
                          </th>
                          <th className="px-4 py-2">
                            {t("dashboard.transactions.table.amount")}
                          </th>
                          <th className="px-4 py-2">
                            {t("dashboard.transactions.table.status")}
                          </th>
                          <th className="px-4 py-2">
                            {t("dashboard.transactions.table.description")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions && transactions.length > 0 ? (
                          transactions.map((trx) => (
                            <tr key={trx.transactionId} className="border-t">
                              <td className="px-4 py-2">{trx.transactionId}</td>
                              <td className="px-4 py-2">{trx.serviceType}</td>
                              <td className="px-4 py-2">
                                {new Date(trx.date).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  }
                                )}
                              </td>

                              <td className="px-4 py-2">{trx.amount}</td>
                              <td className="px-4 py-2">
                                <span
                                  className={
                                    trx.status === "SUCCESS"
                                      ? "status-approved"
                                      : trx.status === "PENDING"
                                      ? "status-pending"
                                      : "status-rejected"
                                  }
                                >
                                  {trx.status}
                                </span>
                              </td>
                              <td className="px-4 py-2">{trx.description}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={6}
                              className="text-center py-4 text-gray-500"
                            >
                              {t("dashboard.transactions.noTransactions")}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    <div className="mt-4 mb-6 flex justify-center">
                      <PaginationComponent
                        currentPage={currentPage}
                        totalItems={totalItems}
                        pageSize={pageSize}
                        onPageChange={(page) => setCurrentPage(page)}
                      />
                    </div>
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
