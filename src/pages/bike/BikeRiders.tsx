import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, Eye, Plus } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import { BikeRider } from "@/types/admin";
import StatusBadge from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/api/axiosInstance";
import Loader from "@/components/ui/loader";
import { useTranslation } from "react-i18next";

const BikeRiders = () => {
  const navigate = useNavigate();
  const [riders, setRiders] = useState<BikeRider[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchRiders = async () => {
      try {
        const res = await axiosInstance.get("/driver-management/drivers", {
          params: {
            vehicleType: "bike",
            page: currentPage,
            limit: pageSize,
            search: searchTerm,
            verificationStatus: selectedStatus,
          },
        });

        const apiData = res.data.data || [];
        // setTotal(res.data.total || 0);

        const mapped: BikeRider[] = apiData.map((rider: any) => ({
          driverId: rider.driverId,
          name: rider.name,
          email: rider.email || "-",
          mobile: rider.mobile || "-",
          balance: rider.balance,
          status: rider.status,
          batchVerified: rider.batchVerified,
          vehicleType: rider.vehicleType,
          registrationNumber: rider.registrationNumber,
        }));

        setRiders(mapped);
        setTotalDrivers(res.data?.total || 0);
      } catch (err) {
        console.error("Error fetching bike riders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRiders();
  }, [currentPage, pageSize, searchTerm, selectedStatus]);

  const handleRowClick = (rider: BikeRider) => {
    navigate(`/bike-management/riders/${rider.driverId}`);
  };

  const columns = [
    {
      key: "name" as keyof BikeRider,
      header: t("bikeDrivers.columns.name"),
      render: (rider: BikeRider) => (
        <div className="flex items-center gap-2">
          <span>{rider.name}</span>
          {rider.batchVerified === true && (
            <BadgeCheck className="text-green-500 w-4 h-4" />
          )}
        </div>
      ),
    },
    {
      key: "mobile" as keyof BikeRider,
      header: t("bikeDrivers.columns.mobile"),
    },
    { key: "email" as keyof BikeRider, header: t("bikeDrivers.columns.email") },
    {
      key: "registrationNumber" as keyof BikeRider,
      header: t("bikeDrivers.columns.registrationNumber"),
    },
    {
      key: "balance" as keyof BikeRider,
      header: t("bikeDrivers.columns.balance"),
      render: (rider: BikeRider) => (
        <span className="text-gray-800 font-medium">
          {t("bikeDrivers.currencySymbol")}
          {rider.balance?.toLocaleString() ?? 0}
        </span>
      ),
    },
    {
      key: "status" as keyof BikeRider,
      header: t("bikeDrivers.columns.status"),
      render: (rider: BikeRider) => <StatusBadge status={rider.status} />,
    },
    {
      key: "actions" as "actions",
      header: t("bikeDrivers.columns.actions"),
      render: (rider: BikeRider) => (
        <button
          className="action-button flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/bike-management/riders/${rider.driverId}`);
          }}
        >
          <Eye size={16} className="mr-1" />
          {t("bikeDrivers.actions.viewDetails")}
        </button>
      ),
    },
  ];

  const filterOptions = [
    {
      key: "status" as keyof BikeRider,
      label: "Status",
      options: [
        { label: "Approved", value: "approved" },
        { label: "Pending", value: "pending" },
        { label: "Blocked", value: "blocked" },
        { label: "Rejected", value: "rejected" },
      ],
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t("bikeDrivers.title")}</h1>
          <p className="text-gray-600">{t("bikeDrivers.subtitle")}</p>
        </div>
        <Button
          onClick={() => navigate("/bike-management/riders/new")}
          className="flex items-center gap-2"
        >
          <Plus size={16} /> {t("bikeDrivers.addButton")}
        </Button>
      </div>

      <div className="relative">
        {loading && (
          <div>
            <Loader />
          </div>
        )}

        <DataTable
          columns={columns}
          data={riders}
          onRowClick={handleRowClick}
          keyExtractor={(item) => item.driverId}
          filterable={true}
          filterOptions={filterOptions}
          paginate={true}
          pageSize={10}
          currentPage={currentPage}
          totalItems={totalDrivers}
          onPageChange={(page) => setCurrentPage(page)}
          searchTerm={searchTerm}
          searchPlaceholder="Search by name / email"
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

export default BikeRiders;
