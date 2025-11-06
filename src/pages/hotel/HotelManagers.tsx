import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, Eye, Plus } from "lucide-react";
// import Layout from '@/components/layout/Layout';
import DataTable from "@/components/ui/DataTable";
import { HotelManager } from "@/types/admin";
import StatusBadge from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { fetchHotelManagers } from "@/api/hotelOperators";
import Loader from "@/components/ui/loader";
import { useTranslation } from "react-i18next";

// Mock data for hotel managers
// const mockHotelManagers: HotelManager[] = [
//   {
//     id: "1",
//     name: "Grand Plaza Hotel",
//     mobile: "9876543210",
//     email: "manager@grandplaza.com",
//     status: "Approved",
//     hotelName: "Grand Plaza Hotel",
//     totalRooms: 120,
//   },
//   {
//     id: "2",
//     name: "Luxury Inn",
//     mobile: "9876123450",
//     email: "manager@luxuryinn.com",
//     status: "Pending",
//     hotelName: "Luxury Inn",
//     totalRooms: 85,
//   },
//   {
//     id: "3",
//     name: "Sunset Resort",
//     mobile: "8765432109",
//     email: "manager@sunsetresort.com",
//     status: "Submitted",
//     hotelName: "Sunset Resort",
//     totalRooms: 160,
//   },
//   {
//     id: "4",
//     name: "Mountain View",
//     mobile: "7654321098",
//     email: "manager@mountainview.com",
//     status: "Rejected",
//     hotelName: "Mountain View Hotel",
//     totalRooms: 65,
//   },
//   {
//     id: "5",
//     name: "Urban Stay",
//     mobile: "8901234567",
//     email: "manager@urbanstay.com",
//     status: "Blocked",
//     hotelName: "Urban Stay Hotel",
//     totalRooms: 45,
//   },
// ];

const HotelManagers = () => {
  const navigate = useNavigate();
  const [managers, setManagers] = useState<HotelManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalHotelManagers, setTotalHotelManagers] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const getManagers = async () => {
      try {
        setLoading(true);
        const { data, total } = await fetchHotelManagers(
          currentPage,
          pageSize,
          searchTerm,
          selectedStatus
        );
        setManagers(data);
        setTotalHotelManagers(total);
      } catch (err) {
        console.error(err);
        setError("Failed to load hotel managers.");
      } finally {
        setLoading(false);
      }
    };

    getManagers();
  }, [currentPage, pageSize, searchTerm, selectedStatus]);

  const handleRowClick = (manager: HotelManager) => {
    navigate(`/hotel-management/managers/${manager.id}?mode=view`);
  };

  const columns = [
    {
      key: "name" as keyof HotelManager,
      header: t("hotelManagers.tableHeaders.name"),
      render: (manager: HotelManager) => (
        <div className="flex items-center gap-2">
          <span>{manager.name}</span>
          {manager.batchVerified === true && (
            <BadgeCheck className="text-green-500 w-4 h-4" />
          )}
        </div>
      ),
    },
    {
      key: "mobile" as keyof HotelManager,
      header: t("hotelManagers.tableHeaders.mobile"),
    },
    {
      key: "email" as keyof HotelManager,
      header: t("hotelManagers.tableHeaders.email"),
    },
    {
      key: "balance" as keyof HotelManager,
      header: t("hotelManagers.tableHeaders.balance"),
      render: (manager: HotelManager) => (
        <span className="text-gray-800 font-medium">
          ₹{manager.balance?.toLocaleString() ?? 0}
        </span>
      ),
    },
    {
      key: "status" as keyof HotelManager,
      header: t("hotelManagers.tableHeaders.status"),
      render: (manager: HotelManager) => (
        <StatusBadge status={manager.status} />
      ),
    },
    {
      key: "actions" as "actions",
      header: t("hotelManagers.tableHeaders.actions"),
      render: (manager: HotelManager) => (
        <button
          className="action-button flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/hotel-management/managers/${manager.id}?mode=view`);
          }}
        >
          <Eye size={16} className="mr-1" />{" "}
          {t("hotelManagers.labels.viewDetails")}
        </button>
      ),
    },
  ];

  const filterOptions = [
    {
      key: "status" as keyof HotelManager,
      label: "Status",
      options: [
        { label: "Approved", value: "approved" },
        { label: "Pending", value: "pending" },
        { label: "Processing", value: "processing" },
        { label: "Submitted", value: "submitted" },
        { label: "Rejected", value: "rejected" },
        { label: "Blocked", value: "blocked" },
      ],
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t("hotelManagers.pageTitle")}</h1>
          <p className="text-gray-600">{t("hotelManagers.pageSubtitle")}</p>
        </div>
        <Button
          onClick={() => navigate(`/hotel-management/managers/new?mode=post`)}
          className="flex items-center gap-2"
        >
          <Plus size={16} /> {t("hotelManagers.addButton")}
        </Button>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <DataTable
          columns={columns}
          data={managers}
          loading={loading}
          paginate={true}
          pageSize={pageSize}
          currentPage={currentPage}
          totalItems={totalHotelManagers}
          onPageChange={(page) => setCurrentPage(page)}
          onRowClick={handleRowClick}
          keyExtractor={(item) => item.id}
          filterable={true}
          filterOptions={filterOptions}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={{ status: selectedStatus }}
          onFilterChange={(filters) => {
            setSelectedStatus(filters.status || "");
            setCurrentPage(1);
          }}
        />
      )}
    </>
  );
};

export default HotelManagers;
