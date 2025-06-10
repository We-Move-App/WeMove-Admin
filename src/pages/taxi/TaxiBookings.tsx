import { useState } from "react";
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

// Mock data for taxi bookings
const mockTaxiBookings: TaxiBooking[] = [
  {
    id: "1",
    customerName: "John Doe",
    driverName: "Michael Brown",
    from: "Airport",
    to: "Downtown",
    rideDate: "2023-10-15",
    vehicleType: "Sedan",
    amount: 45,
    status: "Completed",
  },
  {
    id: "2",
    customerName: "Jane Smith",
    driverName: "Robert Taylor",
    from: "Hotel Grand",
    to: "Shopping Mall",
    rideDate: "2023-10-16",
    vehicleType: "SUV",
    amount: 60,
    status: "Completed",
  },
  {
    id: "3",
    customerName: "David Wilson",
    driverName: "John Smith",
    from: "Beach Resort",
    to: "Airport",
    rideDate: "2023-10-17",
    vehicleType: "Sedan",
    amount: 55,
    status: "Cancelled",
  },
  {
    id: "4",
    customerName: "Sarah Johnson",
    driverName: "Michael Brown",
    from: "City Center",
    to: "Suburb Area",
    rideDate: "2023-10-18",
    vehicleType: "Hatchback",
    amount: 35,
    status: "Pending",
  },
];

const TaxiBookings = () => {
  const [bookings] = useState<TaxiBooking[]>(mockTaxiBookings);
  const [selectedBooking, setSelectedBooking] = useState<TaxiBooking | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const viewBookingDetails = (booking: TaxiBooking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  const columns = [
    { key: "id" as keyof TaxiBooking, header: "Booking ID" },
    { key: "customerName" as keyof TaxiBooking, header: "Customer Name" },
    { key: "driverName" as keyof TaxiBooking, header: "Driver Name" },
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
        { label: "Sedan", value: "Sedan" },
        { label: "SUV", value: "SUV" },
        { label: "Hatchback", value: "Hatchback" },
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
