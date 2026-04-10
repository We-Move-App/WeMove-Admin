import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
// import Layout from '@/components/layout/Layout';
import DataTable from "@/components/ui/DataTable";
import axiosInstance from "@/api/axiosInstance";
import { HotelBooking } from "@/types/admin";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTranslation } from "react-i18next";

// Mock data for hotel bookings
// const mockHotelBookings: HotelBooking[] = [
//   {
//     id: "1",
//     hotelId: "hotel-001",
//     customerName: "John Doe",
//     customerPhone: "9876543210",
//     customerEmail: "john.doe@example.com",
//     checkInDate: "2023-10-15",
//     checkOutDate: "2023-10-18",
//     amount: 450,
//     status: "Confirmed",
//   },
//   {
//     id: "2",
//     hotelId: "hotel-002",
//     customerName: "Jane Smith",
//     customerPhone: "8765432109",
//     customerEmail: "jane.smith@example.com",
//     checkInDate: "2023-10-20",
//     checkOutDate: "2023-10-25",
//     amount: 750,
//     status: "Completed",
//   },
//   {
//     id: "3",
//     hotelId: "hotel-003",
//     customerName: "Michael Johnson",
//     customerPhone: "7654321098",
//     customerEmail: "michael.j@example.com",
//     checkInDate: "2023-11-01",
//     checkOutDate: "2023-11-05",
//     amount: 600,
//     status: "Cancelled",
//   },
//   {
//     id: "4",
//     hotelId: "hotel-001",
//     customerName: "Sarah Williams",
//     customerPhone: "6543210987",
//     customerEmail: "sarah.w@example.com",
//     checkInDate: "2023-11-10",
//     checkOutDate: "2023-11-12",
//     amount: 350,
//     status: "Pending",
//   },
// ];

const HotelBookings = () => {
  const [bookings, setBookings] = useState<HotelBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<HotelBooking | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalHotelBookings, setTotalHotelBookings] = useState(0);
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axiosInstance.get(
          "/hotel-management/hotel-booking-details",
          {
            params: {
              page: currentPage,
              limit: pageSize,
              search: searchTerm,
            },
          }
        );
        const apiBookings = res.data?.data || [];
        setTotalHotelBookings(res.data?.total || 0);

        // Map API fields into our table format
        const mapped = apiBookings.map((b: any) => ({
          id: b.bookId,
          bookingId: b.bookingId,
          // id: b.bookingId,
          hotelId: b.hotelId,
          customerName: b.customerName,
          customerPhone: b.phone,
          customerEmail: b.email,
          checkInDate: new Date(b.checkInDate).toLocaleDateString(),
          checkOutDate: new Date(b.checkOutDate).toLocaleDateString(),
          amount: b.amount,
          status: b.status,
        }));

        setBookings(mapped);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      }
    };

    fetchBookings();
  }, [currentPage, pageSize, searchTerm]);

  const viewBookingDetails = (booking: HotelBooking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  const columns = [
    { key: "id", header: t("hotelBookings.tableHeaders.bookingId") },
    { key: "hotelId", header: t("hotelBookings.tableHeaders.hotelId") },
    {
      key: "customerName",
      header: t("hotelBookings.tableHeaders.customerName"),
    },
    {
      key: "customerPhone",
      header: t("hotelBookings.tableHeaders.customerPhone"),
    },
    {
      key: "customerEmail",
      header: t("hotelBookings.tableHeaders.customerEmail"),
    },
    { key: "checkInDate", header: t("hotelBookings.tableHeaders.checkInDate") },
    {
      key: "checkOutDate",
      header: t("hotelBookings.tableHeaders.checkOutDate"),
    },
    {
      key: "amount",
      header: t("hotelBookings.tableHeaders.amount"),
      render: (booking) => <span>${booking.amount.toFixed(2)}</span>,
    },
    {
      key: "status",
      header: t("hotelBookings.tableHeaders.status"),
      render: (booking) => <StatusBadge status={booking.status} />,
    },
    {
      key: "actions",
      header: t("hotelBookings.tableHeaders.actions"),
      render: (booking) => (
        <button
          className="action-button flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            viewBookingDetails(booking);
          }}
        >
          <Eye size={16} className="mr-1" />{" "}
          {t("hotelBookings.labels.viewDetails")}
        </button>
      ),
    },
  ];

  // const filterOptions = [
  //   {
  //     key: "status" as keyof HotelBooking,
  //     label: "Status",
  //     options: [
  //       { label: "Booked", value: "Booked" },
  //       { label: "Completed", value: "Completed" },
  //     ],
  //   },
  // ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t("hotelBookings.pageTitle")}</h1>
          <p className="text-gray-600">{t("hotelBookings.pageSubtitle")}</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={bookings}
        keyExtractor={(item) => item.id}
        filterable={true}
        searchable={true}
        searchPlaceholder={t("common.searchPlaceholder")}
        exportable={true}
        paginate={true}
        pageSize={pageSize}
        currentPage={currentPage}
        totalItems={totalHotelBookings}
        onPageChange={(page) => setCurrentPage(page)}
        // filterOptions={filterOptions}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Booking Details Sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{t("hotelBookings.detailsSheet.title")}</SheetTitle>
          </SheetHeader>
          {selectedBooking && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm text-gray-500">
                    {t("hotelBookings.detailsSheet.bookingId")}
                  </h4>
                  <p className="font-medium">{selectedBooking.id}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">
                    {t("hotelBookings.detailsSheet.status")}
                  </h4>
                  <StatusBadge status={selectedBooking.status} />
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">
                    {t("hotelBookings.detailsSheet.hotelId")}
                  </h4>
                  {/* <p className="font-medium">{selectedBooking.hotelId}</p> */}
                  <p
                    className="font-medium truncate"
                    title={selectedBooking.hotelId}
                  >
                    {selectedBooking.hotelId}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">
                    {t("hotelBookings.detailsSheet.amount")}
                  </h4>
                  <p className="font-medium">
                    ${selectedBooking.amount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">
                  {t("hotelBookings.detailsSheet.customerInfo.title")}
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <h4 className="text-sm text-gray-500">
                      {t("hotelBookings.detailsSheet.customerInfo.name")}
                    </h4>
                    <p className="font-medium">
                      {selectedBooking.customerName}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">
                      {t("hotelBookings.detailsSheet.customerInfo.phone")}
                    </h4>
                    <p className="font-medium">
                      {selectedBooking.customerPhone}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">
                      {t("hotelBookings.detailsSheet.customerInfo.email")}
                    </h4>
                    <p className="font-medium">
                      {selectedBooking.customerEmail}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">
                  {t("hotelBookings.detailsSheet.stayDetails.title")}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-gray-500">
                      {t("hotelBookings.detailsSheet.stayDetails.checkInDate")}
                    </h4>
                    <p className="font-medium">{selectedBooking.checkInDate}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">
                      {t("hotelBookings.detailsSheet.stayDetails.checkOutDate")}
                    </h4>
                    <p className="font-medium">
                      {selectedBooking.checkOutDate}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">
                  {t("hotelBookings.detailsSheet.journey.title")}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("hotelBookings.detailsSheet.journey.message", {
                    date: new Date().toLocaleDateString(),
                  })}
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
