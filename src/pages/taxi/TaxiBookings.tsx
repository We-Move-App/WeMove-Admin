import { useEffect, useRef, useState } from "react";
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
import { useTranslation } from "react-i18next";

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
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debounceRef = useRef<number | null>(null);
  const DEBOUNCE_MS = 900;

  const { t } = useTranslation();

  const viewBookingDetails = (booking: TaxiBooking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  const handleSearchChange = (val: string) => {
    setSearchInput(val);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      setCurrentPage(1);
      setSearchTerm(val);
      debounceRef.current = null;
    }, DEBOUNCE_MS);
  };

  useEffect(() => {
    let mounted = true;

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

        if (!mounted) return;

        if (response.data?.statusCode === 200) {
          setBookings(response.data.data || []);
          setTotalBookings(response.data?.totalBookings || 0);
        } else {
          setBookings([]);
        }
      } catch (error) {
        console.error("Error fetching taxi bookings:", error);
        if (!mounted) return;
        setBookings([]);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    fetchBookings();

    return () => {
      mounted = false;
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [currentPage, pageSize, searchTerm]);

  const columns = [
    { key: "bookingId", header: t("taxiBookings.columns.bookingId") },
    { key: "customerName", header: t("taxiBookings.columns.customerName") },
    { key: "riderName", header: t("taxiBookings.columns.driverName") },
    { key: "from", header: t("taxiBookings.columns.from") },
    { key: "to", header: t("taxiBookings.columns.to") },
    {
      key: "rideDate",
      header: t("taxiBookings.columns.rideDate"),
      render: (booking: TaxiBooking) => (
        <span>
          {booking.rideDate
            ? new Date(booking.rideDate).toLocaleDateString("en-GB")
            : "-"}
        </span>
      ),
    },
    {
      key: "amount",
      header: t("taxiBookings.columns.amount"),
      render: (booking: TaxiBooking) => (
        <span>
          {t("taxiBookings.currencySymbol")}
          {booking.amount ? booking.amount.toFixed(2) : "0.00"}
        </span>
      ),
    },
    {
      key: "status",
      header: t("taxiBookings.columns.status"),
      render: (booking: TaxiBooking) => <StatusBadge status={booking.status} />,
    },
    {
      key: "actions",
      header: t("taxiBookings.columns.actions"),
      render: (booking: TaxiBooking) => (
        <button
          className="action-button flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            viewBookingDetails(booking);
          }}
        >
          <Eye size={16} className="mr-1" />
          {t("taxiBookings.actions.viewDetails")}
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t("taxiBookings.title")}</h1>
          <p className="text-gray-600">{t("taxiBookings.subtitle")}</p>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <DataTable
          columns={columns}
          data={bookings}
          keyExtractor={(item) => item.bookingId}
          paginate
          pageSize={pageSize}
          currentPage={currentPage}
          totalItems={totalBookings}
          onPageChange={setCurrentPage}
          searchTerm={searchInput}
          onSearchChange={handleSearchChange}
        />
      )}

      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{t("taxiBookings.sheet.title")}</SheetTitle>
          </SheetHeader>

          {selectedBooking && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm text-gray-500">
                    {t("taxiBookings.sheet.labels.bookingId")}
                  </h4>
                  <p className="font-medium">{selectedBooking.bookingId}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">
                    {t("taxiBookings.sheet.labels.status")}
                  </h4>
                  <StatusBadge status={selectedBooking.status} />
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">
                    {t("taxiBookings.sheet.labels.amount")}
                  </h4>
                  <p className="font-medium">
                    {t("taxiBookings.currencySymbol")}
                    {selectedBooking.amount
                      ? selectedBooking.amount.toFixed(2)
                      : "0.00"}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">
                  {t("taxiBookings.sheet.labels.rideDetails")}
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-gray-500">
                      {t("taxiBookings.sheet.labels.from")}
                    </h4>
                    <p className="font-medium">{selectedBooking.from}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">
                      {t("taxiBookings.sheet.labels.to")}
                    </h4>
                    <p className="font-medium">{selectedBooking.to}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">
                      {t("taxiBookings.sheet.labels.rideDate")}
                    </h4>
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

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">
                  {t("taxiBookings.sheet.labels.customerInformation")}
                </h3>
                <p className="font-medium">{selectedBooking.customerName}</p>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">
                  {t("taxiBookings.sheet.labels.driverInformation")}
                </h3>
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
