import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
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
import Loader from "@/components/ui/loader";

const TaxiBookings = () => {
  const [bookings, setBookings] = useState<TaxiBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<TaxiBooking | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalBookings, setTotalBookings] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const viewBookingDetails = (booking: TaxiBooking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          "/driver-management/booking/allBookings",
          {
            params: {
              vehicleType: "taxi",
              page: currentPage,
              limit: pageSize,
              search: searchTerm,
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
  }, [currentPage, pageSize, searchTerm]);

  const columns = [
    { key: "bookingId" as keyof TaxiBooking, header: "Booking ID" },
    { key: "customerName" as keyof TaxiBooking, header: "Customer Name" },
    { key: "riderName" as keyof TaxiBooking, header: "Driver Name" },
    { key: "from" as keyof TaxiBooking, header: "From" },
    { key: "to" as keyof TaxiBooking, header: "To" },
    {
      key: "rideDate" as keyof TaxiBooking,
      header: "Ride Date",
      render: (booking: TaxiBooking) => (
        <span>
          {booking.rideDate
            ? new Date(booking.rideDate).toLocaleDateString("en-GB")
            : "-"}
        </span>
      ),
    },
    {
      key: "amount" as keyof TaxiBooking,
      header: "Amount",
      render: (booking: TaxiBooking) => (
        <span>${booking.amount ? booking.amount.toFixed(2) : "0.00"}</span>
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
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Taxi Bookings</h1>
          <p className="text-gray-600">View and manage all taxi bookings</p>
        </div>
      </div>

      {loading ? (
        <Loader />
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
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
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
                  <p className="font-medium">{selectedBooking.bookingId}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">Status</h4>
                  <StatusBadge status={selectedBooking.status} />
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">Amount</h4>
                  <p className="font-medium">
                    $
                    {selectedBooking.amount
                      ? selectedBooking.amount.toFixed(2)
                      : "0.00"}
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
                    <p className="font-medium">
                      {selectedBooking.rideDate
                        ? new Date(selectedBooking.rideDate).toLocaleDateString(
                            "en-GB"
                          )
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <p className="font-medium">{selectedBooking.customerName}</p>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Driver Information</h3>
                <p className="font-medium">{selectedBooking.driverName}</p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default TaxiBookings;
