import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import Layout from '@/components/layout/Layout';
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import { busBookings } from "@/data/mockData";
import { BusBooking } from "@/types/admin";
import { Eye } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";

const BusBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalBusOperators, setTotalBusOperators] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
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
          };
        });
        // const uniqueFrom = Array.from(
        //   new Set(bookingsData.map((b: any) => String(b.from)))
        // ).map((f) => ({ label: f, value: f }));

        // const uniqueTo = Array.from(
        //   new Set(bookingsData.map((b: any) => String(b.to)))
        // ).map((t) => ({ label: t, value: t }));

        // setFromOptions(uniqueFrom);
        // setToOptions(uniqueTo);

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
    { key: "id" as keyof BusBooking, header: "ID" },
    {
      key: "busRegistrationNumber" as keyof BusBooking,
      header: "Bus Reg. No.",
    },
    { key: "customerName" as keyof BusBooking, header: "Customer Name" },
    { key: "customerPhone" as keyof BusBooking, header: "Phone" },
    { key: "customerEmail" as keyof BusBooking, header: "Email" },
    { key: "from" as keyof BusBooking, header: "From" },
    { key: "to" as keyof BusBooking, header: "To" },
    { key: "journeyDate" as keyof BusBooking, header: "Journey Date" },
    {
      key: "amount" as keyof BusBooking,
      header: "Amount",
      render: (booking: BusBooking) => <span>₹{booking.amount}</span>,
    },
    // {
    //   key: "status" as keyof BusBooking,
    //   header: "Status",
    //   render: (booking: BusBooking) => (
    //     <StatusBadge status={booking.paymentStatus} />
    //   ),
    // },
    {
      key: "paymentStatus" as keyof BusBooking,
      header: "Payment",
      render: (booking: BusBooking) => (
        <StatusBadge status={booking.paymentStatus} />
      ),
    },

    {
      key: "actions" as "actions",
      header: "Actions",
      render: (booking: BusBooking) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/bus-management/bookings/${booking.id}`);
          }}
          className="action-button flex items-center"
        >
          <Eye size={16} className="mr-1" />
          View Details
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

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Bus Bookings</h1>
        <p className="text-gray-600">View and manage all bus bookings</p>
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
        // filterOptions={filterOptions}
        // onFilterChange={(key, value) => {
        //   if (key === "from") setSelectedFrom(value);
        //   if (key === "to") setSelectedTo(value);
        // }}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
    </>
  );
};

export default BusBookings;
