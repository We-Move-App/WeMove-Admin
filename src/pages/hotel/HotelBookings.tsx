import { useState } from "react";
import { Eye } from "lucide-react";
// import Layout from '@/components/layout/Layout';
import DataTable from "@/components/ui/DataTable";
import { HotelBooking } from "@/types/admin";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// Mock data for hotel bookings
const mockHotelBookings: HotelBooking[] = [
  {
    id: "1",
    hotelId: "hotel-001",
    customerName: "John Doe",
    customerPhone: "9876543210",
    customerEmail: "john.doe@example.com",
    checkInDate: "2023-10-15",
    checkOutDate: "2023-10-18",
    amount: 450,
    status: "Confirmed",
  },
  {
    id: "2",
    hotelId: "hotel-002",
    customerName: "Jane Smith",
    customerPhone: "8765432109",
    customerEmail: "jane.smith@example.com",
    checkInDate: "2023-10-20",
    checkOutDate: "2023-10-25",
    amount: 750,
    status: "Completed",
  },
  {
    id: "3",
    hotelId: "hotel-003",
    customerName: "Michael Johnson",
    customerPhone: "7654321098",
    customerEmail: "michael.j@example.com",
    checkInDate: "2023-11-01",
    checkOutDate: "2023-11-05",
    amount: 600,
    status: "Cancelled",
  },
  {
    id: "4",
    hotelId: "hotel-001",
    customerName: "Sarah Williams",
    customerPhone: "6543210987",
    customerEmail: "sarah.w@example.com",
    checkInDate: "2023-11-10",
    checkOutDate: "2023-11-12",
    amount: 350,
    status: "Pending",
  },
];

const HotelBookings = () => {
  const [bookings] = useState<HotelBooking[]>(mockHotelBookings);
  const [selectedBooking, setSelectedBooking] = useState<HotelBooking | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const viewBookingDetails = (booking: HotelBooking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  const columns = [
    { key: "id" as keyof HotelBooking, header: "Booking ID" },
    { key: "hotelId" as keyof HotelBooking, header: "Hotel ID" },
    { key: "customerName" as keyof HotelBooking, header: "Customer Name" },
    { key: "customerPhone" as keyof HotelBooking, header: "Phone" },
    { key: "customerEmail" as keyof HotelBooking, header: "Email" },
    { key: "checkInDate" as keyof HotelBooking, header: "Check-in Date" },
    { key: "checkOutDate" as keyof HotelBooking, header: "Check-out Date" },
    {
      key: "amount" as keyof HotelBooking,
      header: "Amount",
      render: (booking: HotelBooking) => (
        <span>${booking.amount.toFixed(2)}</span>
      ),
    },
    {
      key: "status" as keyof HotelBooking,
      header: "Status",
      render: (booking: HotelBooking) => (
        <StatusBadge status={booking.status} />
      ),
    },
    {
      key: "actions" as "actions",
      header: "Actions",
      render: (booking: HotelBooking) => (
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
      key: "status" as keyof HotelBooking,
      label: "Status",
      options: [
        { label: "Confirmed", value: "Confirmed" },
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
          <h1 className="text-2xl font-bold">Hotel Bookings</h1>
          <p className="text-gray-600">View and manage all hotel bookings</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={bookings}
        keyExtractor={(item) => item.id}
        filterable={true}
        // searchable={true}
        // exportable={true}
        filterOptions={filterOptions}
      />

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
                  <h4 className="text-sm text-gray-500">Hotel ID</h4>
                  <p className="font-medium">{selectedBooking.hotelId}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">Amount</h4>
                  <p className="font-medium">
                    ${selectedBooking.amount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <h4 className="text-sm text-gray-500">Name</h4>
                    <p className="font-medium">
                      {selectedBooking.customerName}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">Phone</h4>
                    <p className="font-medium">
                      {selectedBooking.customerPhone}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">Email</h4>
                    <p className="font-medium">
                      {selectedBooking.customerEmail}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Stay Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-gray-500">Check-in Date</h4>
                    <p className="font-medium">{selectedBooking.checkInDate}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">Check-out Date</h4>
                    <p className="font-medium">
                      {selectedBooking.checkOutDate}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Customer Journey</h3>
                <p className="text-sm text-gray-600">
                  Booking was made on {new Date().toLocaleDateString()}.
                  Customer ID proof verification complete.
                </p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default HotelBookings;
