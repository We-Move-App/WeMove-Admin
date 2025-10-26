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
              <TabsTrigger value="all">All Bookings</TabsTrigger>
              <TabsTrigger value="bus">Bus Bookings</TabsTrigger>
              <TabsTrigger value="hotel">Hotel Bookings</TabsTrigger>
              <TabsTrigger value="ride">Ride Bookings</TabsTrigger>
              <TabsTrigger value="payment">Payment Transactions</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>All Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {customerData.allBookings.length === 0 ? (
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
                            customerData.allBookings,
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
                        totalItems={customerData.allBookings.length}
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
                <CardHeader>
                  <CardTitle>Bus Bookings</CardTitle>
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
                <CardHeader>
                  <CardTitle>Hotel Bookings</CardTitle>
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
                <CardHeader>
                  <CardTitle>Ride Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {customerData.rideBookings.length === 0 ? (
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
                            customerData.rideBookings,
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
                <CardHeader>
                  <CardTitle>Payment Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  {customerData.rideBookings.length === 0 ? (
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
                            customerData.paymentTransactions,
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
                        totalItems={customerData.paymentTransactions.length}
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
