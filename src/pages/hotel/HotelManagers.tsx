import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, Eye, Plus } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import { HotelManager } from "@/types/admin";
import StatusBadge from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { fetchHotelManagers } from "@/api/hotelOperators";
import Loader from "@/components/ui/loader";
import { useTranslation } from "react-i18next";

const HotelManagers = () => {
  const navigate = useNavigate();
  const [managers, setManagers] = useState<HotelManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalHotelManagers, setTotalHotelManagers] = useState(0);

  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debounceRef = useRef<number | null>(null);
  const DEBOUNCE_MS = 900;

  const { t } = useTranslation();
  const handleSearchChange = (val: string) => {
    setSearchInput(val);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      setSearchTerm(val);
      setCurrentPage(1);
      debounceRef.current = null;
    }, DEBOUNCE_MS);
  };

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

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
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
    { key: "mobile", header: t("hotelManagers.tableHeaders.mobile") },
    { key: "email", header: t("hotelManagers.tableHeaders.email") },
    {
      key: "balance",
      header: t("hotelManagers.tableHeaders.balance"),
      render: (manager: HotelManager) => (
        <span className="text-gray-800 font-medium">
          ₹{manager.balance?.toLocaleString() ?? 0}
        </span>
      ),
    },
    {
      key: "status",
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
          <Eye size={16} className="mr-1" />
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
          <Plus size={16} />
          {t("hotelManagers.addButton")}
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
          searchTerm={searchInput}
          onSearchChange={handleSearchChange}
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
