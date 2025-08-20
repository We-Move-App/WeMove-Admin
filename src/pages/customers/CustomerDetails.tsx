import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { Customer, BusBooking, HotelBooking } from "@/types/admin";

type ApiResponse = {
  success: boolean;
  message: string;
  personalInfo: Customer;
  bookingSummary: {
    busBookings: number;
    hotelBookings: number;
    rideBookings: number;
  };
  busBookings: BusBooking[];
  hotelBookings: HotelBooking[];
  rideBookings: any[];
  allBookings: (BusBooking | HotelBooking)[];
};

const CustomerDetails = () => {
  const { customerId } = useParams();
  const [customerData, setCustomerData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const res = await axiosInstance.get<ApiResponse>(
          `/user-management/users/${customerId}`
        );
        setCustomerData(res.data);
      } catch (err) {
        console.error("Error fetching customer details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) fetchCustomerDetails();
  }, [customerId]);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Loading...</h1>
      </div>
    );
  }

  if (!customerData) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-500">
          Customer not found
        </h1>
      </div>
    );
  }

  const { personalInfo, bookingSummary, allBookings, busBookings, hotelBookings } =
    customerData;


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Customer Details</h1>

      {/* Personal Info & Booking Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">ID</TableCell>
                  <TableCell>{personalInfo.id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Name</TableCell>
                  <TableCell>{personalInfo.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Email</TableCell>
                  <TableCell>{personalInfo.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Mobile</TableCell>
                  <TableCell>{personalInfo.mobile}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

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

      {/* Tabs for Bookings */}
      <div className="mt-8">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Bookings</TabsTrigger>
            <TabsTrigger value="bus">Bus Bookings</TabsTrigger>
            <TabsTrigger value="hotel">Hotel Bookings</TabsTrigger>
          </TabsList>

          {/* All Bookings */}
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {allBookings.length === 0 ? (
                  <p className="text-center py-4">No booking history found</p>
                ) : (
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
                      {allBookings.map((b) => (
                        <TableRow key={b.id}>
                          <TableCell>{b.id}</TableCell>
                          <TableCell>
                            {"busRegistrationNumber" in b
                              ? "Bus"
                              : "Hotel"}
                          </TableCell>
                          <TableCell>
                            <TableCell>
                              {"journeyDate" in b
                                ? b.journeyDate
                                : (b as HotelBooking).stayDuration}
                            </TableCell>
                          </TableCell>
                          <TableCell>₹{b.amount}</TableCell>
                          <TableCell>{b.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bus Bookings */}
          <TabsContent value="bus">
            <Card>
              <CardHeader>
                <CardTitle>Bus Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {busBookings.length === 0 ? (
                  <p className="text-center py-4">No bus bookings found</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Bus No.</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {busBookings.map((b) => (
                        <TableRow key={b.id}>
                          <TableCell>{b.id}</TableCell>
                          <TableCell>{b.busRegistrationNumber}</TableCell>
                          <TableCell>
                            {b.from} → {b.to}
                          </TableCell>
                          <TableCell>{b.journeyDate}</TableCell>
                          <TableCell>₹{b.amount}</TableCell>
                          <TableCell>{b.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hotel Bookings */}
          <TabsContent value="hotel">
            <Card>
              <CardHeader>
                <CardTitle>Hotel Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {hotelBookings.length === 0 ? (
                  <p className="text-center py-4">No hotel bookings found</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Hotel ID</TableHead>
                        <TableHead>Stay</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {hotelBookings.map((b) => (
                        <TableRow key={b.id}>
                          <TableCell>{b.id}</TableCell>
                          <TableCell>{b.hotelId}</TableCell>
                          <TableCell>
                            {b.stayDuration}
                          </TableCell>
                          <TableCell>₹{b.amount}</TableCell>
                          <TableCell>{b.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerDetails;
