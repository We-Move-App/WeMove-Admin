import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
// import Layout from '@/components/layout/Layout';
import DataTable from "@/components/ui/DataTable";
import { TaxiBooking } from "@/types/admin";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import axiosInstance from "@/api/axiosInstance";

// Mock data for bike bookings
// const mockBikeBookings: BikeBooking[] = [
//   {
//     id: "1",
//     customerName: "John Doe",
//     riderName: "Alex Johnson",
//     from: "City Center",
//     to: "University Campus",
//     rideDate: "2023-10-15",
//     vehicleType: "Scooter",
//     amount: 20,
//     status: "Completed",
//   },
//   {
//     id: "2",
//     customerName: "Jane Smith",
//     riderName: "Sam Wilson",
//     from: "Shopping Mall",
//     to: "Residential Area",
//     rideDate: "2023-10-16",
//     vehicleType: "MotorBike",
//     amount: 25,
//     status: "Completed",
//   },
//   {
//     id: "3",
//     customerName: "David Wilson",
//     riderName: "Jake Miller",
//     from: "Hotel Zone",
//     to: "Tourist Spot",
//     rideDate: "2023-10-17",
//     vehicleType: "Scooter",
//     amount: 18,
//     status: "Cancelled",
//   },
//   {
//     id: "4",
//     customerName: "Sarah Johnson",
//     riderName: "Ryan Thomas",
//     from: "Metro Station",
//     to: "Office Park",
//     rideDate: "2023-10-18",
//     vehicleType: "MotorBike",
//     amount: 22,
//     status: "Pending",
//   },
// ];

const BikeBookings = () => {
  // const [bookings] = useState<BikeBooking[]>(mockBikeBookings);
  const [bookings, setBookings] = useState<TaxiBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<TaxiBooking | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalBookings, setTotalBookings] = useState(0);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const viewBookingDetails = (booking: TaxiBooking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  const columns = [
    { key: "id" as keyof TaxiBooking, header: "Booking ID" },
    { key: "customerName" as keyof TaxiBooking, header: "Customer Name" },
    { key: "riderName" as keyof TaxiBooking, header: "Rider Name" },
    { key: "from" as keyof TaxiBooking, header: "From" },
    { key: "to" as keyof TaxiBooking, header: "To" },
    { key: "rideDate" as keyof TaxiBooking, header: "Ride Date" },
    { key: "vehicleType" as keyof TaxiBooking, header: "Vehicle Type" },
    {
      key: "amount" as keyof TaxiBooking,
      header: "Amount",
      render: (booking: TaxiBooking) => (
        <span>${booking.amount.toFixed(2)}</span>
      ),
    },
    {
      key: "status" as keyof TaxiBooking,
      header: "Status",
      render: (booking: TaxiBooking) => <StatusBadge status={booking.status} />,
    },
    {
      key: "actions" as "actions",
      header: "Actions",
      render: (booking: TaxiBooking) => (
        <button
          className="action-button flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            viewBookingDetails(booking);
          }}
        >
          <Eye size={16} className="mr-1" /> View Details
        </button>
      ),
    },
  ];

  const filterOptions = [
    {
      key: "status" as keyof TaxiBooking,
      label: "Status",
      options: [
        { label: "Completed", value: "Completed" },
        { label: "Cancelled", value: "Cancelled" },
        { label: "Pending", value: "Pending" },
      ],
    },
    {
      key: "vehicleType" as keyof TaxiBooking,
      label: "Vehicle Type",
      options: [
        { label: "Scooter", value: "Scooter" },
        { label: "MotorBike", value: "MotorBike" },
      ],
    },
  ];

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          "/driver-management/booking/allBookings",
          {
            params: {
              vehicleType: "bike",
              page: currentPage,
              limit: pageSize,
            },
          }
        );

        if (response.data?.statusCode === 200) {
          setBookings(response.data.data || []);
          setTotalBookings(response.data?.totalBookings || 0);
        } else {
          setBookings([]);
        }
      } catch (error) {
        console.error("Error fetching taxi bookings:", error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentPage, pageSize]);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Bike Bookings</h1>
          <p className="text-gray-600">View and manage all bike bookings</p>
        </div>
      </div>

      {loading ? (
        <p>Loading bookings...</p>
      ) : (
        <DataTable
          columns={columns}
          data={bookings}
          keyExtractor={(item) => item.bookingId}
          filterable
          filterOptions={filterOptions}
          paginate
          pageSize={pageSize}
          currentPage={currentPage}
          totalItems={totalBookings}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Booking Details Sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Booking Details</SheetTitle>
          </SheetHeader>
          {selectedBooking && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm text-gray-500">Booking ID</h4>
                  <p className="font-medium">{selectedBooking.id}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">Status</h4>
                  <StatusBadge status={selectedBooking.status} />
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">Vehicle Type</h4>
                  <p className="font-medium">{selectedBooking.vehicleType}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">Amount</h4>
                  <p className="font-medium">
                    ${selectedBooking.amount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Ride Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-gray-500">From</h4>
                    <p className="font-medium">{selectedBooking.from}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">To</h4>
                    <p className="font-medium">{selectedBooking.to}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">Ride Date</h4>
                    <p className="font-medium">{selectedBooking.rideDate}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <p className="font-medium">{selectedBooking.customerName}</p>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Rider Information</h3>
                <p className="font-medium">{selectedBooking.driverName}</p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default BikeBookings;
