import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import Layout from '@/components/layout/Layout';
import { busBookings } from "@/data/mockData";
import { BusBooking } from "@/types/admin";
import { ArrowLeft, Loader } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import axiosInstance from "@/api/axiosInstance";
import CustomerDetailsSkeleton from "@/components/ui/loader-skeleton";

const BusBookingDetails = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<BusBooking | null>(null);

  useEffect(() => {
    const foundBooking = busBookings.find((b) => b.id === bookingId);
    if (foundBooking) {
      setBooking(foundBooking);
    }
  }, [bookingId]);

  // useEffect(() => {
  //   const fetchBookingDetails = async () => {
  //     try {
  //       const response = await axiosInstance.get(
  //         `/bus-management/bus-booking-details/${bookingId}`
  //       );

  //       const booking = response.data?.data;
  //       console.log(booking);

  //       if (!booking) return;

  //       const passenger = booking.passengers?.[0] || {};

  //       const formattedBooking = {
  //         // id: booking._id,
  //         id: booking._id,
  //         bookingId: booking.bookingId, // add this
  //         busRegistrationNumber: booking.busId?.busRegNumber || "N/A",
  //         from: booking.from,
  //         to: booking.to,
  //         journeyDate: booking.journeyDate
  //           ? new Date(booking.journeyDate).toLocaleDateString("en-GB", {
  //               day: "2-digit",
  //               month: "short",
  //               year: "numeric",
  //             })
  //           : "N/A",
  //         status: booking.status,
  //         amount: booking.price,
  //         customerName: passenger.name || "N/A",
  //         customerPhone: passenger.contactNumber || "N/A",
  //         customerEmail: passenger.email || "N/A",
  //         paymentStatus: booking.paymentStatus,
  //       };

  //       setBooking(formattedBooking);
  //     } catch (error) {
  //       console.error("Error fetching booking details:", error);
  //     }
  //   };

  //   if (bookingId) {
  //     fetchBookingDetails();
  //   }
  // }, [bookingId]);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) return;
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/bus-management/bus-booking-details/${bookingId}`
        );

        const booking = response.data?.data;
        if (!booking) return;

        const passenger = booking.passengers?.[0] || {};

        setBooking({
          id: booking._id,
          bookingId: booking.bookingId,
          busRegistrationNumber: booking.busId?.busRegNumber || "N/A",
          from: booking.from,
          to: booking.to,
          journeyDate: booking.journeyDate
            ? new Date(booking.journeyDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "N/A",
          status: booking.status,
          amount: booking.price,
          customerName: passenger.name || "N/A",
          customerPhone: passenger.contactNumber || "N/A",
          customerEmail: passenger.email || "N/A",
          paymentStatus: booking.paymentStatus,
        });
      } catch (error) {
        console.error("Error fetching booking details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  // if (!booking) {
  //   return (
  //     <>
  //       <div className="flex justify-center items-center h-64">
  //         <p className="text-gray-500">Booking not found</p>
  //       </div>
  //     </>
  //   );
  // }
  if (loading) {
    return <CustomerDetailsSkeleton />;
  }
  return (
    <>
      <div className="mb-6">
        <button
          onClick={() => navigate("/bus-management/bookings")}
          className="mb-4 flex items-center text-blue-600 hover:underline"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Bookings
        </button>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Booking Details</h1>
            <p className="text-gray-600">Booking ID: {booking.bookingId}</p>
          </div>
          <StatusBadge status={booking.status} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Journey Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Bus Registration:</span>
                <span className="font-medium">
                  {booking.busRegistrationNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">From:</span>
                <span className="font-medium">{booking.from}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">To:</span>
                <span className="font-medium">{booking.to}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Journey Date:</span>
                <span className="font-medium">{booking.journeyDate}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{booking.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{booking.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{booking.customerEmail}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Amount</p>
              <p className="text-xl font-bold">₹{booking.amount}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Payment Status</p>
              <p className="text-xl font-bold">Paid</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Payment Method</p>
              <p className="text-xl font-bold">Credit Card</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BusBookingDetails;
