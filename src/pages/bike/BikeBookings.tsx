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

const BikeBookings = () => {
  const [bookings, setBookings] = useState<TaxiBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<TaxiBooking | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalBookings, setTotalBookings] = useState(0);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debounceRef = useRef<number | null>(null);
  const DEBOUNCE_MS = 900;

  const { t } = useTranslation();

  const viewBookingDetails = (booking: TaxiBooking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  const columns = [
    {
      key: "bookingId" as keyof TaxiBooking,
      header: t("bikeBookings.columns.bookingId"),
    },
    {
      key: "customerName" as keyof TaxiBooking,
      header: t("bikeBookings.columns.customerName"),
    },
    {
      key: "riderName" as keyof TaxiBooking,
      header: t("bikeBookings.columns.riderName"),
    },
    {
      key: "from" as keyof TaxiBooking,
      header: t("bikeBookings.columns.from"),
    },
    { key: "to" as keyof TaxiBooking, header: t("bikeBookings.columns.to") },
    {
      key: "rideDate" as keyof TaxiBooking,
      header: t("bikeBookings.columns.rideDate"),
      render: (booking: TaxiBooking) => (
        <span>
          {new Date(booking.rideDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "vehicleType" as keyof TaxiBooking,
      header: t("bikeBookings.columns.vehicleType"),
    },
    {
      key: "amount" as keyof TaxiBooking,
      header: t("bikeBookings.columns.amount"),
      render: (booking: TaxiBooking) => (
        <span>
          {t("bikeBookings.currencySymbol")}
          {booking.amount.toFixed(2)}
        </span>
      ),
    },
    {
      key: "status" as keyof TaxiBooking,
      header: t("bikeBookings.columns.status"),
      render: (booking: TaxiBooking) => <StatusBadge status={booking.status} />,
    },
    {
      key: "actions" as "actions",
      header: t("bikeBookings.columns.actions"),
      render: (booking: TaxiBooking) => (
        <button
          className="action-button flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            viewBookingDetails(booking);
          }}
        >
          <Eye size={16} className="mr-1" />{" "}
          {t("bikeBookings.actions.viewDetails")}
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
              vehicleType: "bike",
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
          setTotalBookings(0);
        }
      } catch (error) {
        console.error("Error fetching taxi bookings:", error);
        if (!mounted) return;
        setBookings([]);
        setTotalBookings(0);
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
        debounceRef.current = null;
      }
    };
  }, [currentPage, pageSize, searchTerm]);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t("bikeBookings.title")}</h1>
          <p className="text-gray-600">{t("bikeBookings.subtitle")}</p>
        </div>
      </div>

      <div className="relative">
        {loading && (
          <div>
            <Loader />
          </div>
        )}
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
          searchPlaceholder="Search by ID / name"
          onSearchChange={handleSearchChange}
          filterOptions={filterOptions}
        />
      </div>

      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{t("bikeBookings.sheet.title")}</SheetTitle>
          </SheetHeader>
          {selectedBooking && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm text-gray-500">
                    {t("bikeBookings.sheet.labels.bookingId")}
                  </h4>
                  <p className="font-medium">{selectedBooking.bookingId}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">
                    {t("bikeBookings.sheet.labels.status")}
                  </h4>
                  <StatusBadge status={selectedBooking.status} />
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">
                    {t("bikeBookings.sheet.labels.vehicleType")}
                  </h4>
                  <p className="font-medium">{selectedBooking.vehicleType}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">
                    {t("bikeBookings.sheet.labels.amount")}
                  </h4>
                  <p className="font-medium">
                    {t("bikeBookings.currencySymbol")}
                    {selectedBooking.amount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">
                  {t("bikeBookings.sheet.labels.rideDetails")}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-gray-500">
                      {t("bikeBookings.sheet.labels.from")}
                    </h4>
                    <p className="font-medium">{selectedBooking.from}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">
                      {t("bikeBookings.sheet.labels.to")}
                    </h4>
                    <p className="font-medium">{selectedBooking.to}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">
                      {t("bikeBookings.sheet.labels.rideDate")}
                    </h4>
                    <p className="font-medium">
                      {selectedBooking.rideDate.slice(0, 10)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">
                  {t("bikeBookings.sheet.labels.customerInformation")}
                </h3>
                <p className="font-medium">{selectedBooking.customerName}</p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default BikeBookings;
