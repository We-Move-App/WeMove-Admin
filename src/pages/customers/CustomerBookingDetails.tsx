import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { StatusDropdown } from "@/components/ui/StatusDropdown";
import PaginationComponent from "@/components/pagination/PaginationComponent";
import axiosInstance from "@/api/axiosInstance";
import CustomerDetailsSkeleton from "@/components/ui/loader-skeleton";
import { useTranslation } from "react-i18next";

// Mock Customer Data
interface AllBooking {
  id: string;
  bookingId: string;
  type: string;
  createdAt: string;
  amount: number;
  status: string;
}

interface BusBooking {
  id: string;
  bookingId: string;
  from: string;
  to: string;
  journeyDate: string;
  amount: number;
  status: string;
}

interface HotelBooking {
  id: string;
  bookingId: string;
  checkInDate: string;
  checkOutDate: string;
  rooms: number;
  amount: number;
  status: string;
}

interface RideBooking {
  id: string;
  bookingId: string;
  vehicleType: string;
  pickup: string;
  drop: string;
  fare: number;
  rideStatus: string;
  paymentStatus: string;
}


interface NormalizedBooking {
  id: string;
  type: string;
  date: string;
  amount: number;
  status: string;
}

interface HotelBookings {
  bookingId: string;
}

interface RideTransaction {
  bookingId: string;
}

interface PaymentTransaction {
  userId: string;
  createdAt: string;
  date: string;
  amount: number;
  method: "Credit Card" | "UPI" | "Net Banking" | "Wallet";
  status: "Completed" | "Pending" | "Failed";
}
interface CustomerData {
  id: string;
  name: string;
  email: string;
  mobile: string;
  status: string;
  allBookings: NormalizedBooking[];
  busBookings: NormalizedBooking[];
  hotelBookings: HotelBookings[];
  rideBookings: RideTransaction[];
  paymentTransactions: PaymentTransaction[];
}
const CustomerBookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState<CustomerData>({
    id: "",
    name: "",
    email: "",
    mobile: "",
    status: "",
    allBookings: [],
    busBookings: [],
    hotelBookings: [],
    rideBookings: [],
    paymentTransactions: [],
  });

  const [bookingSummary, setBookingSummary] = useState({
    bus: "",
    hotel: "",
    ride: "",
  });

  const [searchAll, setSearchAll] = useState("");
  const [searchBus, setSearchBus] = useState("");
  const [searchHotel, setSearchHotel] = useState("");
  const [searchRide, setSearchRide] = useState("");
  const [searchPayment, setSearchPayment] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userBalance, setUserBalance] = useState({
    balance: "",
    cardNumber: "",
  });
  const { i18n, t } = useTranslation();

  const filterData = <T extends Record<string, any>>(
    data: T[],
    search: string
  ): T[] => {
    if (!search) return data;

    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );
  };


  const getActiveSearch = () => {
    switch (activeTab) {
      case "all":
        return searchAll?.trim() || "";
      case "transactions":
        return searchPayment?.trim() || "";
      // bus / hotel / ride currently share the same search input in your UI
      case "bus":
      case "hotel":
      case "ride":
        return searchRide?.trim() || "";
      default:
        return "";
    }
  };

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      setLoading(true);
      try {
        const search = getActiveSearch();

        const response = await axiosInstance.get(
          `/user-management/bookings/${id}`,
          {
            params: {
              filter: activeTab,
              ...(search ? { search } : {}),
            },
          }
        );

        const bookingsRaw = response.data?.data?.bookings ?? [];
        const allBookings = bookingsRaw.map((b: any) => ({
          id: b._id,
          bookingId: b.bookingId,
          type: b.source ?? b.vehicleType ?? "-",
          createdAt: b.createdAt,
          amount: b.finalAmount ?? b.price ?? b.fare ?? 0,
          status: b.paymentStatus ?? b.status ?? "-",
        }));

        const busBookings = bookingsRaw.map((b: any) => ({
          id: b._id,
          bookingId: b.bookingId,
          from: b.from,
          to: b.to,
          journeyDate: b.journeyDate,
          amount: b.price,
          status: b.paymentStatus ?? b.status,
        }));

        const hotelBookings = bookingsRaw.map((b: any) => ({
          id: b._id,
          bookingId: b.bookingId,
          checkInDate: b.checkInDate,
          checkOutDate: b.checkOutDate,
          rooms: b.noOfRoom,
          amount: b.finalAmount,
          status: b.paymentStatus ?? b.status,
        }));

        const rideBookings = bookingsRaw.map((b: any) => ({
          id: b._id,
          bookingId: b.bookingId,
          vehicleType: b.vehicleType,
          pickup: b.pickupLocation?.address ?? "-",
          drop: b.dropLocation?.address ?? "-",
          fare: b.fare ?? 0,
          rideStatus: b.rideStatus ?? "-",
          paymentStatus: b.paymentStatus ?? "-",
        }));

        const paymentTransactions = bookingsRaw.map((t: any) => {
          const isWalletTopUp =
            t.type === "CREDIT" &&
            t.description?.toLowerCase().includes("wallet");

          return {
            id: t._id,
            transactionId: t.transactionId,
            date: t.createdAt,
            amount: t.amount,
            type: t.type,
            label: isWalletTopUp
              ? "Wallet Top-up"
              : t.transactionType ?? "-",

            from: t.meta?.from?.name ?? "-",
            to: t.meta?.to?.name ?? "-",
            status: t.status,
          };
        });
        const user =
          Array.isArray(bookingsRaw?.[0]?.user)
            ? bookingsRaw[0].user[0]
            : bookingsRaw?.[0]?.user ?? {};

        setCustomerData({
          id: user?._id || "",
          name: user?.name || "",
          email: user?.email || "",
          mobile: user?.phoneNumber || user?.phone || "",
          status: "Active",

          allBookings: activeTab === "all" ? allBookings : [],
          busBookings: activeTab === "bus" ? busBookings : [],
          hotelBookings: activeTab === "hotel" ? hotelBookings : [],
          rideBookings: activeTab === "ride" ? rideBookings : [],
          paymentTransactions:
            activeTab === "transactions" ? paymentTransactions : [],

        });
      } catch (err) {
        console.error(err);
        setError("Failed to fetch customer data");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCustomerDetails();
  }, [id, activeTab, searchAll]);

  useEffect(() => {
    const userBalance = async () => {
      try {
        const res = await axiosInstance.get(`/user-management/wallet/${id}`);
        setUserBalance(res.data?.data);
        console.log("User Balance: ", res.data.data);
      } catch (error) {
        console.error("Error fetching the data", error);
      }
    };
    userBalance();
  }, []);

  useEffect(() => {
    const bookingSummary = async () => {
      try {
        const res = await axiosInstance.get(
          `/user-management/bookings/${id}?filter=count`
        );
        setBookingSummary(res.data?.data?.countsByType);
        console.log("Booking Summary: ", res.data.data?.countsByType);
      } catch (error) {
        console.error("Error fetching the data", error);
      }
    };
    bookingSummary();
  }, []);

  useEffect(() => {
    setCurrentPageAll(1);
  }, [searchAll, searchRide, searchPayment]);

  const personalInfo = customerData
    ? {
      id: customerData.id,
      name: customerData.name,
      email: customerData.email,
      mobile: customerData.mobile,
    }
    : { id: "-", name: "-", email: "-", mobile: "-" };

  const handleStatusChange = (newStatus: string) => {
    if (customerData) {
      setCustomerData({ ...customerData, status: newStatus });
    }
  };

  const pageSize = 5;

  // Pagination state inside component
  const [currentPageAll, setCurrentPageAll] = useState(1);
  const [currentPageBus, setCurrentPageBus] = useState(1);
  const [currentPageHotel, setCurrentPageHotel] = useState(1);
  const [currentPageRide, setCurrentPageRide] = useState(1);

  const paginate = (data: any[], page: number, pageSize: number) => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  };

  // if (!customerData) return <p>Loading...</p>;
  if (loading) return <CustomerDetailsSkeleton />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/customer-management")}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        {t("customerBookingsDetails.backButton")}
      </Button>

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">
          {t("customerBookingsDetails.pageTitle")}
        </h1>

        {/* Personal Info & Booking Summary */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {t("customerBookingsDetails.summary.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-lg font-medium text-blue-700">
                    {bookingSummary.bus}
                  </p>
                  <p className="text-sm text-blue-600">
                    {t("customerBookingsDetails.summary.bus")}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-lg font-medium text-green-700">
                    {bookingSummary.hotel}
                  </p>
                  <p className="text-sm text-green-600">
                    {t("customerBookingsDetails.summary.hotel")}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-lg font-medium text-purple-700">
                    {bookingSummary.ride}
                  </p>
                  <p className="text-sm text-purple-600">
                    {t("customerBookingsDetails.summary.ride")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          {/* <Tabs defaultValue="all" className="w-full"> */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4">
              {/* <TabsTrigger value="all"></TabsTrigger> */}
              <TabsTrigger
                value="all"
                className="data-[state=active]:!bg-[#3E7C68] data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-700 px-4 py-2 rounded-md transition-all"
              >
                {t("customerBookingsDetails.tabs.all")}
              </TabsTrigger>
              <TabsTrigger
                value="bus"
                className="data-[state=active]:!bg-[#3E7C68] data-[state=active]:text-white
                 data-[state=active]:shadow-sm text-gray-700 px-4 py-2 rounded-md transition-all"
              >
                {t("customerBookingsDetails.summary.bus")}
              </TabsTrigger>
              <TabsTrigger
                value="hotel"
                className="data-[state=active]:!bg-[#3E7C68] data-[state=active]:text-white
                 data-[state=active]:shadow-sm text-gray-700 px-4 py-2 rounded-md transition-all"
              >
                {t("customerBookingsDetails.summary.hotel")}
              </TabsTrigger>
              <TabsTrigger
                value="ride"
                className="data-[state=active]:!bg-[#3E7C68] data-[state=active]:text-white
                 data-[state=active]:shadow-sm text-gray-700 px-4 py-2 rounded-md transition-all"
              >
                {t("customerBookingsDetails.summary.ride")}
              </TabsTrigger>
              <TabsTrigger
                value="transactions"
                className="data-[state=active]:!bg-[#3E7C68] data-[state=active]:text-white
                 data-[state=active]:shadow-sm text-gray-700 px-4 py-2 rounded-md transition-all"
              >
                {t("customerBookingsDetails.tabs.transactions")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>{t("customerBookingsDetails.tabs.all")}</CardTitle>
                  <input
                    type="text"
                    placeholder={t("customerBookingsDetails.search.bookings")}
                    value={searchAll}
                    onChange={(e) => setSearchAll(e.target.value)}
                    className="mt-3 sm:mt-0 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
                  />
                </CardHeader>
                <CardContent>
                  {filterData(customerData.allBookings, searchAll).length ===
                    0 ? (
                    <p className="text-center py-4">
                      {t("customerBookingsDetails.tables.all.noData")}
                    </p>
                  ) : (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginate(
                            filterData(customerData.allBookings, searchAll),
                            currentPageAll,
                            pageSize
                          ).map((b) => (
                            <TableRow key={b.id}>
                              <TableCell>{b.bookingId}</TableCell>
                              <TableCell>{b.type}</TableCell>
                              <TableCell>
                                {new Date(b.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell>₹{b.amount}</TableCell>
                              <TableCell>
                                <StatusBadge status={b.status} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>

                      </Table>

                      <PaginationComponent
                        currentPage={currentPageAll}
                        totalItems={
                          filterData(customerData.allBookings, searchAll).length
                        }
                        pageSize={pageSize}
                        onPageChange={setCurrentPageAll}
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bus">
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>{t("customerBookingsDetails.tabs.bus")}</CardTitle>
                  <input
                    type="text"
                    placeholder={t("customerBookingsDetails.search.bookings")}
                    value={searchRide}
                    onChange={(e) => setSearchRide(e.target.value)}
                    className="mt-3 sm:mt-0 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
                  />
                </CardHeader>
                <CardContent>
                  {customerData.busBookings.length === 0 ? (
                    <p className="text-center py-4">
                      {t("customerBookingsDetails.tables.bus.noData")}
                    </p>
                  ) : (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>From</TableHead>
                            <TableHead>To</TableHead>
                            <TableHead>Journey Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {paginate(
                            customerData.busBookings,
                            currentPageAll,
                            pageSize
                          ).map((b) => (
                            <TableRow key={b.id}>
                              <TableCell>{b.bookingId}</TableCell>
                              <TableCell>{b.from}</TableCell>
                              <TableCell>{b.to}</TableCell>
                              <TableCell>
                                {new Date(b.journeyDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell>₹{b.amount}</TableCell>
                              <TableCell>
                                <StatusBadge status={b.status} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <PaginationComponent
                        currentPage={currentPageAll}
                        totalItems={customerData.busBookings.length}
                        pageSize={pageSize}
                        onPageChange={setCurrentPageAll}
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hotel">
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>
                    {t("customerBookingsDetails.tabs.hotel")}
                  </CardTitle>
                  <input
                    type="text"
                    placeholder={t("customerBookingsDetails.search.bookings")}
                    value={searchRide}
                    onChange={(e) => setSearchRide(e.target.value)}
                    className="mt-3 sm:mt-0 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
                  />
                </CardHeader>
                <CardContent>
                  {customerData.hotelBookings.length === 0 ? (
                    <p className="text-center py-4">
                      {t("customerBookingsDetails.tables.hotel.noData")}
                    </p>
                  ) : (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Check-in</TableHead>
                            <TableHead>Check-out</TableHead>
                            <TableHead>Rooms</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {paginate(
                            customerData.hotelBookings,
                            currentPageAll,
                            pageSize
                          ).map((b) => (
                            <TableRow key={b.id}>
                              <TableCell>{b.bookingId}</TableCell>

                              <TableCell>
                                {new Date(b.checkInDate).toLocaleDateString()}
                              </TableCell>

                              <TableCell>
                                {new Date(b.checkOutDate).toLocaleDateString()}
                              </TableCell>

                              <TableCell>{b.rooms}</TableCell>

                              <TableCell>₹{b.amount}</TableCell>

                              <TableCell>
                                <StatusBadge status={b.status} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <PaginationComponent
                        currentPage={currentPageAll}
                        totalItems={customerData.hotelBookings.length}
                        pageSize={pageSize}
                        onPageChange={setCurrentPageAll}
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ride">
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>
                    {t("customerBookingsDetails.tabs.ride")}
                  </CardTitle>
                  <input
                    type="text"
                    placeholder={t("customerBookingsDetails.search.bookings")}
                    value={searchRide}
                    onChange={(e) => setSearchRide(e.target.value)}
                    className="mt-3 sm:mt-0 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
                  />
                </CardHeader>
                <CardContent>
                  {filterData(customerData.rideBookings, searchRide).length ===
                    0 ? (
                    <p className="text-center py-4">
                      {t("customerBookingsDetails.tables.ride.noData")}
                    </p>
                  ) : (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Vehicle</TableHead>
                            <TableHead>Pickup</TableHead>
                            <TableHead>Drop</TableHead>
                            <TableHead>Fare</TableHead>
                            <TableHead>Ride Status</TableHead>
                            <TableHead>Payment Status</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {paginate(
                            customerData.rideBookings,
                            currentPageAll,
                            pageSize
                          ).map((b) => (
                            <TableRow key={b.id}>
                              <TableCell>{b.bookingId}</TableCell>
                              <TableCell className="capitalize">{b.vehicleType}</TableCell>
                              <TableCell className="max-w-[220px] truncate">
                                {b.pickup}
                              </TableCell>
                              <TableCell className="max-w-[220px] truncate">
                                {b.drop}
                              </TableCell>
                              <TableCell>₹{b.fare}</TableCell>
                              <TableCell>
                                <StatusBadge status={b.rideStatus} />
                              </TableCell>
                              <TableCell>
                                <StatusBadge status={b.paymentStatus} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      <PaginationComponent
                        currentPage={currentPageAll}
                        totalItems={customerData.rideBookings.length}
                        pageSize={pageSize}
                        onPageChange={setCurrentPageAll}
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions">
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>Transactions</CardTitle>

                  <input
                    type="text"
                    placeholder="Search transactions"
                    value={searchPayment}
                    onChange={(e) => setSearchPayment(e.target.value)}
                    className="mt-3 sm:mt-0 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
                  />
                </CardHeader>

                <CardContent>
                  {filterData(customerData.paymentTransactions, searchPayment)
                    .length === 0 ? (
                    <p className="text-center py-4 text-sm text-gray-500">
                      No transactions found
                    </p>
                  ) : (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Transaction ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Transaction</TableHead>
                            <TableHead>From</TableHead>
                            <TableHead>To</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {paginate(
                            filterData(
                              customerData.paymentTransactions,
                              searchPayment
                            ),
                            currentPageAll,
                            pageSize
                          ).map((t) => (
                            <TableRow key={t.id}>
                              <TableCell>{t.transactionId}</TableCell>

                              <TableCell>
                                {new Date(t.date).toLocaleDateString()}
                              </TableCell>

                              <TableCell
                                className={
                                  t.type === "CREDIT"
                                    ? "text-green-600 font-medium"
                                    : "text-red-600 font-medium"
                                }
                              >
                                ₹{t.amount}
                              </TableCell>

                              <TableCell>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-semibold ${t.type === "CREDIT"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                                >
                                  {t.type}
                                </span>
                              </TableCell>

                              <TableCell className="text-sm">
                                {t.label}
                              </TableCell>

                              <TableCell>{t.from}</TableCell>
                              <TableCell>{t.to}</TableCell>

                              <TableCell>
                                <StatusBadge status={t.status} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      <PaginationComponent
                        currentPage={currentPageAll}
                        totalItems={
                          filterData(
                            customerData.paymentTransactions,
                            searchPayment
                          ).length
                        }
                        pageSize={pageSize}
                        onPageChange={setCurrentPageAll}
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </>
  );
};

export default CustomerBookingDetails;
