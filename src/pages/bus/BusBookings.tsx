import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import Layout from '@/components/layout/Layout';
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import { busBookings } from "@/data/mockData";
import { BusBooking } from "@/types/admin";
import { Eye } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import Loader from "@/components/ui/loader";
import { useTranslation } from "react-i18next";

const BusBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalBusOperators, setTotalBusOperators] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const { i18n, t } = useTranslation();
  // const [fromOptions, setFromOptions] = useState<
  //   { label: string; value: string }[]
  // >([]);
  // const [toOptions, setToOptions] = useState<
  //   { label: string; value: string }[]
  // >([]);
  // const [selectedFrom, setSelectedFrom] = useState("");
  // const [selectedTo, setSelectedTo] = useState("");

  // const filteredBookings = bookings.filter(
  //   (b) =>
  //     (!selectedFrom || b.from === selectedFrom) &&
  //     (!selectedTo || b.to === selectedTo)
  // );

  const handleRowClick = (booking: BusBooking) => {
    navigate(`/bus-management/bookings/${booking.bookingId}`);
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await axiosInstance.get(
          "/bus-management/AllBusBookings",
          {
            params: {
              page: currentPage,
              limit: pageSize,
              search: searchTerm,
            },
          }
        );

        const bookingsData = response.data?.data || [];

        setTotalBusOperators(response.data?.total || 0);

        const formattedBookings = bookingsData.map((booking: any) => {
          const primaryName =
            booking?.bookedBy?.fullName ||
            booking?.passengers?.[0]?.name ||
            "N/A";

          const primaryPhone =
            booking?.bookedBy?.phoneNumber ||
            booking?.passengers?.[0]?.contactNumber ||
            "N/A";

          const primaryEmail =
            booking?.bookedBy?.email ||
            booking?.passengers?.[0]?.email ||
            "N/A";

          return {
            id: booking.bookId,
            bookingId: booking.bookingId,
            busRegistrationNumber: booking.busRegNumber || "N/A",
            customerName: primaryName,
            customerPhone: primaryPhone,
            customerEmail: primaryEmail,
            from: booking.from || "N/A",
            to: booking.to || "N/A",
            journeyDate: booking.journeyDate
              ? new Date(booking.journeyDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
              : "N/A",
            amount: booking.amount || 0,
            // status: booking.status || "N/A",
            paymentStatus: booking.paymentStatus || "N/A",
            createdAt: booking.createdAt
              ? new Date(booking.createdAt).toLocaleString("en-GB")
              : "N/A",
            passengers: booking.passengers || [],
          };
        });
        console.log('API raw response:', response.data);
        console.log('bookingsData length:', bookingsData.length, bookingsData);
        console.log('formattedBookings:', formattedBookings);
        console.log(
          'duplicate ids:',
          formattedBookings.map(b => b.id).filter((v, i, a) => a.indexOf(v) !== i)
        );
        setBookings(formattedBookings);
      } catch (error) {
        console.error("❌ Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentPage, pageSize, searchTerm]);

  const columns = [
    { key: "id" as keyof BusBooking, header: t("busBookings.columns.id") },
    {
      key: "busRegistrationNumber" as keyof BusBooking,
      header: t("busBookings.columns.busRegistrationNumber"),
    },
    {
      key: "customerName" as keyof BusBooking,
      header: t("busBookings.columns.customerName"),
    },
    {
      key: "customerPhone" as keyof BusBooking,
      header: t("busBookings.columns.customerPhone"),
    },
    {
      key: "customerEmail" as keyof BusBooking,
      header: t("busBookings.columns.customerEmail"),
    },
    { key: "from" as keyof BusBooking, header: t("busBookings.columns.from") },
    { key: "to" as keyof BusBooking, header: t("busBookings.columns.to") },
    {
      key: "journeyDate" as keyof BusBooking,
      header: t("busBookings.columns.journeyDate"),
    },
    {
      key: "amount" as keyof BusBooking,
      header: t("busBookings.columns.amount"),
      render: (booking: BusBooking) => (
        <span>
          {t("busBookings.currencySymbol")}
          {booking.amount}
        </span>
      ),
    },
    {
      key: "paymentStatus" as keyof BusBooking,
      header: t("busBookings.columns.paymentStatus"),
      render: (booking: BusBooking) => (
        <StatusBadge status={booking.paymentStatus} />
      ),
    },
    {
      key: "actions" as "actions",
      header: t("busBookings.columns.actions"),
      render: (booking: BusBooking) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/bus-management/bookings/${booking.bookingId}`);
          }}
          className="action-button flex items-center"
        >
          <Eye size={16} className="mr-1" />
          {t("busBookings.actions.viewDetails")}
        </button>
      ),
    },
  ];

  // const filterOptions = [
  //   {
  //     key: "status" as keyof BusBooking,
  //     label: "Status",
  //     options: [
  //       { label: "Completed", value: "Completed" },
  //       { label: "Upcoming", value: "Upcoming" },
  //       { label: "Cancelled", value: "Cancelled" },
  //     ],
  //   },
  //   {
  //     key: "from" as keyof BusBooking,
  //     label: "From",
  //     options: [
  //       { label: "Mumbai", value: "Mumbai" },
  //       { label: "Delhi", value: "Delhi" },
  //       { label: "Bangalore", value: "Bangalore" },
  //       { label: "Chennai", value: "Chennai" },
  //     ],
  //   },
  //   {
  //     key: "to" as keyof BusBooking,
  //     label: "To",
  //     options: [
  //       { label: "Pune", value: "Pune" },
  //       { label: "Jaipur", value: "Jaipur" },
  //       { label: "Chennai", value: "Chennai" },
  //       { label: "Hyderabad", value: "Hyderabad" },
  //       { label: "Chandigarh", value: "Chandigarh" },
  //     ],
  //   },
  // ];

  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const handleRowToggle = (bookingId: string) => {
    setExpandedRow(expandedRow === bookingId ? null : bookingId);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("busBookings.title")}</h1>
        <p className="text-gray-600">{t("busBookings.subtitle")}</p>
      </div>

      <DataTable
        columns={columns}
        data={bookings}
        paginate={true}
        pageSize={pageSize}
        currentPage={currentPage}
        totalItems={totalBusOperators}
        onPageChange={(page) => setCurrentPage(page)}
        keyExtractor={(item) => item.id}
        onRowClick={handleRowClick}
        searchTerm={searchTerm}
        searchPlaceholder="Search by name / email"
        onSearchChange={setSearchTerm}
      />

      {/* <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b px-2 py-1">Bus Name</th>
              <th className="border-b px-2 py-1">Phone</th>
              <th className="border-b px-2 py-1">Email</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) =>
              booking.passengers?.map((p, idx) => (
                <Fragment key={`${booking.bookingId}-${idx}`}>
                  <tr
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleRowToggle(booking.bookingId)}
                  >
                    <td className="border-b px-2 py-1">{p.name}</td>
                    <td className="border-b px-2 py-1">{p.contactNumber}</td>
                    <td className="border-b px-2 py-1">{p.email}</td>
                  </tr>

                  {expandedRow === booking.bookingId && idx === 0 && (
                    <tr>
                      <td colSpan={3} className="bg-gray-50 p-4 border-b">
                        <DataTable
                          columns={columns}
                          data={[booking]}
                          paginate
                          pageSize={pageSize}
                          currentPage={currentPage}
                          totalItems={totalBusOperators}
                          onPageChange={setCurrentPage}
                          keyExtractor={(item) => item.id}
                          onRowClick={handleRowClick}
                          searchTerm={searchTerm}
                          onSearchChange={setSearchTerm}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div> */}
    </>
  );
};

export default BusBookings;
