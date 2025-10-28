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

// Mock Customer Data
interface NormalizedBooking {
  id: string;
  type: string;
  date: string;
  amount: number;
  status: string;
}

interface PaymentTransaction {
  id: string;
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
  hotelBookings: NormalizedBooking[];
  rideBookings: NormalizedBooking[];
  paymentTransactions: PaymentTransaction[];
}

const mockCustomerData: CustomerData = {
  id: "C-1001",
  name: "Riya Sharma",
  email: "riya.sharma@example.com",
  mobile: "+91 9876543210",
  status: "active",
  allBookings: [
    {
      id: "B-1001",
      type: "Bus",
      date: "2025-10-15",
      amount: 850,
      status: "Completed",
    },
    {
      id: "H-2001",
      type: "Hotel",
      date: "2025-10-16",
      amount: 5200,
      status: "Completed",
    },
    {
      id: "R-3001",
      type: "Ride",
      date: "2025-10-17",
      amount: 450,
      status: "Pending",
    },
  ],
  busBookings: [
    {
      id: "B-1001",
      type: "Bus",
      date: "2025-10-15",
      amount: 850,
      status: "Completed",
    },
    {
      id: "B-1001",
      type: "Bus",
      date: "2025-10-15",
      amount: 850,
      status: "Completed",
    },
    {
      id: "B-1001",
      type: "Bus",
      date: "2025-10-15",
      amount: 850,
      status: "Completed",
    },
    {
      id: "B-1001",
      type: "Bus",
      date: "2025-10-15",
      amount: 850,
      status: "Completed",
    },
  ],
  hotelBookings: [
    {
      id: "H-2001",
      type: "Hotel",
      date: "2025-10-16",
      amount: 5200,
      status: "Completed",
    },
    {
      id: "H-2001",
      type: "Hotel",
      date: "2025-10-16",
      amount: 5200,
      status: "Completed",
    },
    {
      id: "H-2001",
      type: "Hotel",
      date: "2025-10-16",
      amount: 5200,
      status: "Completed",
    },
    {
      id: "H-2001",
      type: "Hotel",
      date: "2025-10-16",
      amount: 5200,
      status: "Completed",
    },
    {
      id: "H-2001",
      type: "Hotel",
      date: "2025-10-16",
      amount: 5200,
      status: "Completed",
    },
    {
      id: "H-2001",
      type: "Hotel",
      date: "2025-10-16",
      amount: 5200,
      status: "Completed",
    },
    {
      id: "H-2001",
      type: "Hotel",
      date: "2025-10-16",
      amount: 5200,
      status: "Completed",
    },
  ],
  rideBookings: [
    {
      id: "R-3001",
      type: "Ride",
      date: "2025-10-17",
      amount: 450,
      status: "Pending",
    },
    {
      id: "R-3001",
      type: "Ride",
      date: "2025-10-17",
      amount: 450,
      status: "Pending",
    },
    {
      id: "R-3001",
      type: "Ride",
      date: "2025-10-17",
      amount: 450,
      status: "Pending",
    },
    {
      id: "R-3001",
      type: "Ride",
      date: "2025-10-17",
      amount: 450,
      status: "Pending",
    },
    {
      id: "R-3001",
      type: "Ride",
      date: "2025-10-17",
      amount: 450,
      status: "Pending",
    },
  ],
  paymentTransactions: [
    {
      id: "P-5001",
      date: "2025-10-15",
      amount: 850,
      method: "UPI",
      status: "Completed",
    },
    {
      id: "P-5002",
      date: "2025-10-16",
      amount: 5200,
      method: "Credit Card",
      status: "Completed",
    },
    {
      id: "P-5003",
      date: "2025-10-17",
      amount: 450,
      method: "Wallet",
      status: "Pending",
    },
    {
      id: "P-5004",
      date: "2025-10-18",
      amount: 1200,
      method: "Net Banking",
      status: "Failed",
    },
    {
      id: "P-5005",
      date: "2025-10-19",
      amount: 300,
      method: "UPI",
      status: "Completed",
    },
  ],
};

const CustomerBookingDetails = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [searchAll, setSearchAll] = useState("");
  const [searchBus, setSearchBus] = useState("");
  const [searchHotel, setSearchHotel] = useState("");
  const [searchRide, setSearchRide] = useState("");
  const [searchPayment, setSearchPayment] = useState("");

  const filterData = (data, searchTerm) => {
    return data.filter(
      (item) =>
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.type &&
          item.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.status &&
          item.status.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  useEffect(() => {
    // Mock fetch
    setCustomerData(mockCustomerData);
  }, [customerId]);

  const personalInfo = customerData
    ? {
        id: customerData.id,
        name: customerData.name,
        email: customerData.email,
        mobile: customerData.mobile,
      }
    : { id: "-", name: "-", email: "-", mobile: "-" };

  const bookingSummary = customerData
    ? {
        busBookings: customerData.busBookings.length,
        hotelBookings: customerData.hotelBookings.length,
        rideBookings: customerData.rideBookings.length,
      }
    : { busBookings: 0, hotelBookings: 0, rideBookings: 0 };

  const handleStatusChange = (newStatus: string) => {
    if (customerData) {
      setCustomerData({ ...customerData, status: newStatus });
    }
  };

  const pageSize = 2;

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

  if (!customerData) return <p>Loading...</p>;

  return (
    <>
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/customer-management/bookings")}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to All User Bookings
      </Button>

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">User Details</h1>

        {/* Personal Info & Booking Summary */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-lg font-medium text-blue-700">
                    {bookingSummary.busBookings}
                  </p>
                  <p className="text-sm text-blue-600">Bus Bookings</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-lg font-medium text-green-700">
                    {bookingSummary.hotelBookings}
                  </p>
                  <p className="text-sm text-green-600">Hotel Bookings</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-lg font-medium text-purple-700">
                    {bookingSummary.rideBookings}
                  </p>
                  <p className="text-sm text-purple-600">Ride Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              {/* <TabsTrigger value="all"></TabsTrigger> */}
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-[#3E7C68] data-[state=active]:text-white
                 data-[state=active]:shadow-sm text-gray-700 px-4 py-2 rounded-md transition-all"
              >
                All Bookings
              </TabsTrigger>
              <TabsTrigger
                value="bus"
                className="data-[state=active]:bg-[#3E7C68] data-[state=active]:text-white
                 data-[state=active]:shadow-sm text-gray-700 px-4 py-2 rounded-md transition-all"
              >
                Bus Bookings
              </TabsTrigger>
              <TabsTrigger
                value="hotel"
                className="data-[state=active]:bg-[#3E7C68] data-[state=active]:text-white
                 data-[state=active]:shadow-sm text-gray-700 px-4 py-2 rounded-md transition-all"
              >
                Hotel Bookings
              </TabsTrigger>
              <TabsTrigger
                value="ride"
                className="data-[state=active]:bg-[#3E7C68] data-[state=active]:text-white
                 data-[state=active]:shadow-sm text-gray-700 px-4 py-2 rounded-md transition-all"
              >
                Ride Bookings
              </TabsTrigger>
              <TabsTrigger
                value="payment"
                className="data-[state=active]:bg-[#3E7C68] data-[state=active]:text-white
                 data-[state=active]:shadow-sm text-gray-700 px-4 py-2 rounded-md transition-all"
              >
                Payment Transactions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>All Bookings</CardTitle>
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={searchAll}
                    onChange={(e) => setSearchAll(e.target.value)}
                    className="mt-3 sm:mt-0 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </CardHeader>
                <CardContent>
                  {filterData(customerData.allBookings, searchAll).length ===
                  0 ? (
                    <p className="text-center py-4">No booking history found</p>
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
                              <TableCell>{b.id}</TableCell>
                              <TableCell>{b.type}</TableCell>
                              <TableCell>{b.date}</TableCell>
                              <TableCell>₹{b.amount}</TableCell>
                              <TableCell>{b.status}</TableCell>
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
                  <CardTitle>Bus Bookings</CardTitle>
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={searchRide}
                    onChange={(e) => setSearchRide(e.target.value)}
                    className="mt-3 sm:mt-0 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </CardHeader>
                <CardContent>
                  {customerData.busBookings.length === 0 ? (
                    <p className="text-center py-4">No bus bookings found</p>
                  ) : (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Date</TableHead>
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
                              <TableCell>{b.id}</TableCell>
                              <TableCell>{b.type}</TableCell>
                              <TableCell>{b.date}</TableCell>
                              <TableCell>₹{b.amount}</TableCell>
                              <TableCell>{b.status}</TableCell>
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
                  <CardTitle>Hotel Bookings</CardTitle>
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={searchRide}
                    onChange={(e) => setSearchRide(e.target.value)}
                    className="mt-3 sm:mt-0 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </CardHeader>
                <CardContent>
                  {customerData.hotelBookings.length === 0 ? (
                    <p className="text-center py-4">No hotel bookings found</p>
                  ) : (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Date</TableHead>
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
                              <TableCell>{b.id}</TableCell>
                              <TableCell>{b.type}</TableCell>
                              <TableCell>{b.date}</TableCell>
                              <TableCell>₹{b.amount}</TableCell>
                              <TableCell>{b.status}</TableCell>
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
                  <CardTitle>Ride Bookings</CardTitle>
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={searchRide}
                    onChange={(e) => setSearchRide(e.target.value)}
                    className="mt-3 sm:mt-0 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </CardHeader>
                <CardContent>
                  {filterData(customerData.rideBookings, searchRide).length ===
                  0 ? (
                    <p className="text-center py-4">No ride bookings found</p>
                  ) : (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginate(
                            filterData(customerData.rideBookings, searchRide),
                            currentPageAll,
                            pageSize
                          ).map((b) => (
                            <TableRow key={b.id}>
                              <TableCell>{b.id}</TableCell>
                              <TableCell>{b.type}</TableCell>
                              <TableCell>{b.date}</TableCell>
                              <TableCell>₹{b.amount}</TableCell>
                              <TableCell>{b.status}</TableCell>
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

            <TabsContent value="payment">
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>Payment Transactions</CardTitle>
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchPayment}
                    onChange={(e) => setSearchPayment(e.target.value)}
                    className="mt-3 sm:mt-0 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </CardHeader>

                <CardContent>
                  {/* Total Balance Card (Admin only) */}
                  <div className="mb-6">
                    <div className="relative bg-[#3E7C68] text-white rounded-2xl p-6 w-full max-w-sm shadow-md overflow-hidden">
                      <div className="absolute -top-8 -right-8 w-28 h-28 bg-[#F7B24A] rounded-full opacity-90"></div>
                      <div className="relative z-10">
                        <p className="text-sm font-medium mb-2">
                          Digital Debit Card
                        </p>
                        <p className="tracking-widest mb-3">
                          ***** ***** ***** ****
                        </p>
                        <div className="flex items-baseline space-x-1 mb-2">
                          <p className="text-2xl font-bold">
                            {customerData.walletBalance
                              ? customerData.walletBalance.toLocaleString()
                              : "0"}
                          </p>
                          <span className="text-sm font-semibold">XAF</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {filterData(customerData.paymentTransactions, searchPayment)
                    .length === 0 ? (
                    <p className="text-center py-4">
                      No payment transaction found
                    </p>
                  ) : (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
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
                          ).map((b) => (
                            <TableRow key={b.id}>
                              <TableCell>{b.id}</TableCell>
                              <TableCell>{b.date}</TableCell>
                              <TableCell>₹{b.amount}</TableCell>
                              <TableCell>{b.status}</TableCell>
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
