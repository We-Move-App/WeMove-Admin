import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import { Eye, Loader } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import CustomerDetailsSkeleton from "@/components/ui/loader-skeleton";
import { useTranslation } from "react-i18next";

// Mock Data Type
interface CustomerBooking {
  id: string;
  userId: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: string; // e.g., Hotel, Bus, Package
  bookingDate: string;
  amount: number;
  paymentStatus: string;
  createdAt: string;
}

// Mock Data
// const mockCustomerBookings: CustomerBooking[] = [
//   {
//     id: "1",
//     bookingId: "CB-1001",
//     customerName: "Riya Sharma",
//     customerEmail: "riya.sharma@example.com",
//     customerPhone: "+91 9876543210",
//     serviceType: "Hotel",
//     bookingDate: "15 Oct 2025",
//     amount: 5200,
//     paymentStatus: "Completed",
//     createdAt: "14 Oct 2025, 10:00 AM",
//   },
//   {
//     id: "2",
//     bookingId: "CB-1002",
//     customerName: "Amit Verma",
//     customerEmail: "amit.verma@example.com",
//     customerPhone: "+91 9123456789",
//     serviceType: "Bus",
//     bookingDate: "20 Oct 2025",
//     amount: 850,
//     paymentStatus: "Pending",
//     createdAt: "18 Oct 2025, 3:15 PM",
//   },
//   {
//     id: "3",
//     bookingId: "CB-1003",
//     customerName: "Sneha Patel",
//     customerEmail: "sneha.patel@example.com",
//     customerPhone: "+91 9988776655",
//     serviceType: "Package",
//     bookingDate: "22 Oct 2025",
//     amount: 15500,
//     paymentStatus: "Failed",
//     createdAt: "19 Oct 2025, 9:30 AM",
//   },
// ];

const CustomerBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const { t, i18n } = useTranslation();

  // Mock Data
  // useEffect(() => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     const filtered = mockCustomerBookings.filter((b) =>
  //       b.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //     setBookings(filtered);
  //     setLoading(false);
  //   }, 500);
  // }, [searchTerm]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/user-management/bookings?page=${currentPage}&limit=${pageSize}&search=${searchTerm}`
      );

      if (response.data.success) {
        const mappedData: CustomerBooking[] = (response.data.data || []).map(
          (item: any, index: number) => ({
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
    {
      key: "actions",
      header: t("customerBookings.tableHeaders.actions"),
      render: (booking: CustomerBooking) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/customer-management/bookings/${booking.id}`);
          }}
          className="action-button flex items-center"
        >
          <Eye size={16} className="mr-1" />
          {t("customerBookings.labels.viewDetails")}
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {t("customerBookings.pageTitle")}
        </h1>
        <p className="text-gray-600">{t("customerBookings.pageSubtitle")}</p>
      </div>

      {loading ? (
        <CustomerDetailsSkeleton />
      ) : (
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
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          loading={loading}
        />
      )}
    </>
  );
};

export default CustomerBookings;
