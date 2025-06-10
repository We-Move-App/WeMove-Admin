import { useState } from "react";
import { Eye } from "lucide-react";
// import Layout from '@/components/layout/Layout';
import DataTable from "@/components/ui/DataTable";
import { BikeBooking } from "@/types/admin";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// Mock data for bike bookings
const mockBikeBookings: BikeBooking[] = [
  {
    id: "1",
    customerName: "John Doe",
    riderName: "Alex Johnson",
    from: "City Center",
    to: "University Campus",
    rideDate: "2023-10-15",
    vehicleType: "Scooter",
    amount: 20,
    status: "Completed",
  },
  {
    id: "2",
    customerName: "Jane Smith",
    riderName: "Sam Wilson",
    from: "Shopping Mall",
    to: "Residential Area",
    rideDate: "2023-10-16",
    vehicleType: "MotorBike",
    amount: 25,
    status: "Completed",
  },
  {
    id: "3",
    customerName: "David Wilson",
    riderName: "Jake Miller",
    from: "Hotel Zone",
    to: "Tourist Spot",
    rideDate: "2023-10-17",
    vehicleType: "Scooter",
    amount: 18,
    status: "Cancelled",
  },
  {
    id: "4",
    customerName: "Sarah Johnson",
    riderName: "Ryan Thomas",
    from: "Metro Station",
    to: "Office Park",
    rideDate: "2023-10-18",
    vehicleType: "MotorBike",
    amount: 22,
    status: "Pending",
  },
];

const BikeBookings = () => {
  const [bookings] = useState<BikeBooking[]>(mockBikeBookings);
  const [selectedBooking, setSelectedBooking] = useState<BikeBooking | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const viewBookingDetails = (booking: BikeBooking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  const columns = [
    { key: "id" as keyof BikeBooking, header: "Booking ID" },
    { key: "customerName" as keyof BikeBooking, header: "Customer Name" },
    { key: "riderName" as keyof BikeBooking, header: "Rider Name" },
    { key: "from" as keyof BikeBooking, header: "From" },
    { key: "to" as keyof BikeBooking, header: "To" },
    { key: "rideDate" as keyof BikeBooking, header: "Ride Date" },
    { key: "vehicleType" as keyof BikeBooking, header: "Vehicle Type" },
    {
      key: "amount" as keyof BikeBooking,
      header: "Amount",
      render: (booking: BikeBooking) => (
        <span>${booking.amount.toFixed(2)}</span>
      ),
    },
    {
      key: "status" as keyof BikeBooking,
      header: "Status",
      render: (booking: BikeBooking) => <StatusBadge status={booking.status} />,
    },
    {
      key: "actions" as "actions",
      header: "Actions",
      render: (booking: BikeBooking) => (
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
      key: "status" as keyof BikeBooking,
      label: "Status",
      options: [
        { label: "Completed", value: "Completed" },
        { label: "Cancelled", value: "Cancelled" },
        { label: "Pending", value: "Pending" },
      ],
    },
    {
      key: "vehicleType" as keyof BikeBooking,
      label: "Vehicle Type",
      options: [
        { label: "Scooter", value: "Scooter" },
        { label: "MotorBike", value: "MotorBike" },
      ],
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Bike Bookings</h1>
          <p className="text-gray-600">View and manage all bike bookings</p>
        </div>
      </div>

      <DataTable
        columns={[
          { key: "id" as keyof BikeBooking, header: "Booking ID" },
          { key: "customerName" as keyof BikeBooking, header: "Customer Name" },
          { key: "riderName" as keyof BikeBooking, header: "Rider Name" },
          { key: "from" as keyof BikeBooking, header: "From" },
          { key: "to" as keyof BikeBooking, header: "To" },
          { key: "rideDate" as keyof BikeBooking, header: "Ride Date" },
          { key: "vehicleType" as keyof BikeBooking, header: "Vehicle Type" },
          {
            key: "amount" as keyof BikeBooking,
            header: "Amount",
            render: (booking: BikeBooking) => (
              <span>${booking.amount.toFixed(2)}</span>
            ),
          },
          {
            key: "status" as keyof BikeBooking,
            header: "Status",
            render: (booking: BikeBooking) => (
              <StatusBadge status={booking.status} />
            ),
          },
          {
            key: "actions" as any,
            header: "Actions",
            render: (booking: BikeBooking) => (
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
        ]}
        data={bookings}
        keyExtractor={(item) => item.id}
        filterable={true}
        // searchable={true}
        // exportable={true}
        filterOptions={[
          {
            key: "status" as keyof BikeBooking,
            label: "Status",
            options: [
              { label: "Completed", value: "Completed" },
              { label: "Cancelled", value: "Cancelled" },
              { label: "Pending", value: "Pending" },
            ],
          },
          {
            key: "vehicleType" as keyof BikeBooking,
            label: "Vehicle Type",
            options: [
              { label: "Scooter", value: "Scooter" },
              { label: "MotorBike", value: "MotorBike" },
            ],
          },
        ]}
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
                <h3 className="font-semibold mb-2">Rider Information</h3>
                <p className="font-medium">{selectedBooking.riderName}</p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default BikeBookings;
