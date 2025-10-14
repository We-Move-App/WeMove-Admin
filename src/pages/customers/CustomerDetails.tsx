import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
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

import { Customer, BusBooking, HotelBooking } from "@/types/admin";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectIcon } from "@radix-ui/react-select";
import { StatusDropdown } from "@/components/ui/StatusDropdown";

const CustomerDetails = () => {
  const { customerId } = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState<any>(null);
  // const [formData, setFormData] = useState({
  //   status: "pending",
  // });

  interface NormalizedBooking {
    id: string;
    type: "bus" | "hotel" | "ride";
    date: string;
    amount: number;
    status: string;
    extra?: Record<string, any>;
  }

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/user-management/users/${customerId}`
        );

        // Normalize bookings
        const allBookings: NormalizedBooking[] = [
          ...data.busBookings.map((b: any) => ({
            id: b.busBookingId,
            type: "bus",
            date: b.date,
            amount: b.amount,
            status: b.status,
            extra: b,
          })),
          ...data.hotelBookings.map((h: any) => ({
            id: h.id,
            type: "hotel",
            date: h.stayDuration,
            amount: h.amount,
            status: h.status,
            extra: h,
          })),
          ...data.rideBookings.map((r: any) => ({
            id: r.bookingId,
            type: "ride",
            date: r.rideDate,
            amount: r.amount,
            status: r.status,
            extra: r,
          })),
        ];

        setCustomerData({
          ...data,
          status: data.status ?? data.personalInfo?.status ?? "pending",
          allBookings,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
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
        <h1 className="text-2xl font-bold text-red-500">Customer not found</h1>
      </div>
    );
  }

  const handleStatusChange = async (nextStatus: string) => {
    console.log("Sending PUT request with body:", { status: nextStatus });

    try {
      const res = await axiosInstance.put(
        `/user-management/users/verify/${customerId}`,
        { status: nextStatus }
      );
      console.log("API response:", res.data);

      setCustomerData((prev) => ({ ...prev, status: nextStatus }));
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const {
    personalInfo,
    bookingSummary,
    allBookings,
    busBookings,
    hotelBookings,
    rideBookings,
  } = customerData;

  return (
    <>
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/customer-management")}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to All Users
      </Button>

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
                  <TableRow>
                    <TableCell className="font-medium">Status</TableCell>
                    <TableCell>
                      <StatusDropdown
                        value={(customerData.status as any) || "pending"}
                        onChange={handleStatusChange}
                      />
                    </TableCell>
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
              <TabsTrigger value="ride">Ride Bookings</TabsTrigger>
            </TabsList>

            {/* All Bookings */}
            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>All Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {customerData.allBookings.length === 0 ? (
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
                        {customerData.allBookings.map(
                          (b: NormalizedBooking) => (
                            <TableRow key={b.id}>
                              <TableCell>{b.id}</TableCell>
                              <TableCell>{b.type}</TableCell>
                              <TableCell>{b.date}</TableCell>
                              <TableCell>₹{b.amount}</TableCell>
                              <TableCell>{b.status}</TableCell>
                            </TableRow>
                          )
                        )}
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
                          <TableRow key={b.busBookingId}>
                            <TableCell>{b.busBookingId}</TableCell>
                            <TableCell>{b.busNumber || "-"}</TableCell>
                            <TableCell>{b.route || "-"}</TableCell>
                            <TableCell>
                              {new Date(b.date).toLocaleDateString()}
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
                            <TableCell>{b.stayDuration}</TableCell>
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
            <TabsContent value="ride">
              <Card>
                <CardHeader>
                  <CardTitle>Ride Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {rideBookings.length === 0 ? (
                    <p className="text-center py-4">No ride bookings found</p>
                  ) : (
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
                        {rideBookings.map((b) => (
                          <TableRow key={b.bookingId}>
                            <TableCell>{b.bookingId}</TableCell>
                            <TableCell>
                              {" "}
                              {new Date(b.date).toLocaleDateString(
                                "en-GB"
                              )}{" "}
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
    </>
  );
};

export default CustomerDetails;
