import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import { Eye } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import CustomerDetailsSkeleton from "@/components/ui/loader-skeleton";
import { useTranslation } from "react-i18next";
import Loader from "@/components/ui/loader";

interface CustomerBooking {
  id: string;
  userId: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: string;
  bookingDate: string;
  amount: number;
  paymentStatus: string;
  createdAt: string;
}

const CustomerBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debounceRef = useRef<number | null>(null);

  const [totalItems, setTotalItems] = useState(0);
  const { t } = useTranslation();

  const handleSearchChange = (val: string) => {
    setSearchInput(val);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      setCurrentPage(1);
      setSearchTerm(val);
      debounceRef.current = null;
    }, 900);
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/user-management/bookings?page=${currentPage}&limit=${pageSize}&search=${searchTerm}`
      );

      if (response.data.success) {
        const mappedData: CustomerBooking[] = (response.data.data || []).map(
          (item: any) => ({
            id: item._id,
            userId: item.userId,
            bookingId: item.bookingId || "-",
            customerName: item.fullName || "N/A",
            customerEmail: item.email || "N/A",
            customerPhone: item.phone || "N/A",
            serviceType:
              item.serviceType?.charAt(0).toUpperCase() +
              item.serviceType?.slice(1).toLowerCase() || "N/A",
            bookingDate: item.bookingDate
              ? new Date(item.bookingDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
              : "-",
            amount: item.amount || 0,
            paymentStatus:
              item.paymentStatus?.charAt(0).toUpperCase() +
              item.paymentStatus?.slice(1).toLowerCase() || "Unknown",
            createdAt: item.createdAt
              ? new Date(item.createdAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
              : "-",
          })
        );

        setBookings(mappedData);
        setTotalItems(response.data.total || mappedData.length);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentPage, searchTerm]);

  const handleRowClick = (booking: CustomerBooking) => {
    navigate(`/customer-management/bookings/${booking.id}`);
  };

  const columns = [
    { key: "userId", header: t("customerBookings.tableHeaders.userId") },
    { key: "bookingId", header: t("customerBookings.tableHeaders.bookingId") },
    {
      key: "customerName",
      header: t("customerBookings.tableHeaders.customerName"),
    },
    {
      key: "customerEmail",
      header: t("customerBookings.tableHeaders.customerEmail"),
    },
    {
      key: "customerPhone",
      header: t("customerBookings.tableHeaders.customerPhone"),
    },
    {
      key: "serviceType",
      header: t("customerBookings.tableHeaders.serviceType"),
    },
    {
      key: "bookingDate",
      header: t("customerBookings.tableHeaders.bookingDate"),
    },
    {
      key: "amount",
      header: t("customerBookings.tableHeaders.amount"),
      render: (booking: CustomerBooking) => <span>₹{booking.amount}</span>,
    },
    {
      key: "paymentStatus",
      header: t("customerBookings.tableHeaders.paymentStatus"),
      render: (booking: CustomerBooking) => (
        <StatusBadge status={booking.paymentStatus} />
      ),
    },
    // {
    //   key: "actions",
    //   header: t("customerBookings.tableHeaders.actions"),
    //   render: (booking: CustomerBooking) => (
    //     <button
    //       onClick={(e) => {
    //         e.stopPropagation();
    //         navigate(`/customer-management/bookings/${booking.id}`);
    //       }}
    //       className="action-button flex items-center"
    //     >
    //       <Eye size={16} className="mr-1" />
    //       {t("customerBookings.labels.viewDetails")}
    //     </button>
    //   ),
    // },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {t("customerBookings.pageTitle")}
        </h1>
        <p className="text-gray-600">{t("customerBookings.pageSubtitle")}</p>
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
          paginate={true}
          pageSize={pageSize}
          currentPage={currentPage}
          totalItems={totalItems}
          onPageChange={(page) => setCurrentPage(page)}
          keyExtractor={(item) => item.id}
          onRowClick={handleRowClick}
          searchTerm={searchInput}
          searchPlaceholder="Search by Booking ID"
          onSearchChange={handleSearchChange}
          loading={loading}
        />
      </div>
    </>
  );
};

export default CustomerBookings;
