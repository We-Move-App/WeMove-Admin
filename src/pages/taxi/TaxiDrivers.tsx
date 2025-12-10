import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, Eye, Plus } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import { TaxiDriver } from "@/types/admin";
import StatusBadge from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/api/axiosInstance";
import { useDebounce } from "@/hooks/useDebounce";
import Loader from "@/components/ui/loader";
import { useTranslation } from "react-i18next";

const TaxiDrivers = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 900);

  const handleRowClick = (driver: TaxiDriver) => {
    navigate(`/taxi-management/drivers/${driver.driverId}`);
  };

  const columns = [
    {
      key: "name" as keyof TaxiDriver,
      header: t("taxiDrivers.columns.name"),
      render: (driver: TaxiDriver) => (
        <div className="flex items-center gap-2">
          <span>{driver.name}</span>
          {driver.batchVerified === true && (
            <BadgeCheck className="text-green-500 w-4 h-4" />
          )}
        </div>
      ),
    },
    { key: "mobile", header: t("taxiDrivers.columns.mobile") },
    { key: "email", header: t("taxiDrivers.columns.email") },
    {
      key: "registrationNumber",
      header: t("taxiDrivers.columns.registrationNumber"),
    },
    {
      key: "balance",
      header: t("taxiDrivers.columns.balance"),
      render: (driver: TaxiDriver) => (
        <span className="text-gray-800 font-medium">
          {t("taxiDrivers.currencySymbol")}
          {driver.balance?.toLocaleString() ?? 0}
        </span>
      ),
    },
    {
      key: "status",
      header: t("taxiDrivers.columns.status"),
      render: (driver: TaxiDriver) => <StatusBadge status={driver.status} />,
    },
    {
      key: "actions" as "actions",
      header: t("taxiDrivers.columns.actions"),
      render: (driver: TaxiDriver) => (
        <button
          type="button" /* <- prevent accidental form submit */
          className="action-button flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/taxi-management/drivers/${driver.driverId}`);
          }}
        >
          <Eye size={16} className="mr-1" />
          {t("taxiDrivers.actions.viewDetails")}
        </button>
      ),
    },
  ];

  const filterOptions = [
    {
      key: "status" as keyof TaxiDriver,
      label: "Status",
      options: [
        { label: "Approved", value: "approved" },
        { label: "Pending", value: "pending" },
        { label: "Blocked", value: "blocked" },
        { label: "Rejected", value: "rejected" },
      ],
    },
  ];

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.get("/driver-management/drivers", {
          params: {
            vehicleType: "taxi",
            page: currentPage,
            limit: pageSize,
            search: debouncedSearch,
            verificationStatus: selectedStatus,
          },
        });

        setDrivers(response.data?.data || []);
        setTotalDrivers(response.data?.total || 0);
      } catch (err: any) {
        setError(err?.message || "Failed to fetch drivers");
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, [currentPage, pageSize, debouncedSearch, selectedStatus]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t("taxiDrivers.title")}</h1>
          <p className="text-gray-600">{t("taxiDrivers.subtitle")}</p>
        </div>
        <Button
          onClick={() => navigate("/taxi-management/drivers/new")}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          {t("taxiDrivers.addButton")}
        </Button>
      </div>

      <div className="relative">
        {loading && (
          <div>
            <Loader />
          </div>
        )}

        {error && (
          <div className="mb-4">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        <DataTable
          columns={columns}
          data={drivers}
          loading={loading}
          keyExtractor={(item) => item.driverId}
          filterable={true}
          filterOptions={filterOptions}
          paginate={true}
          pageSize={10}
          currentPage={currentPage}
          totalItems={totalDrivers}
          onPageChange={(page) => setCurrentPage(page)}
          searchPlaceholder="Search by name / email"
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={{ status: selectedStatus }}
          onFilterChange={(filters) => {
            setSelectedStatus(filters.status || "");
            setCurrentPage(1);
          }}
        />
      </div>
    </>
  );
};

export default TaxiDrivers;
