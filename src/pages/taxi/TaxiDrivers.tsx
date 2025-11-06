import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, Eye, Plus } from "lucide-react";
// import Layout from '@/components/layout/Layout';
import DataTable from "@/components/ui/DataTable";
import { TaxiDriver } from "@/types/admin";
import StatusBadge from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/api/axiosInstance";
import { useDebounce } from "@/hooks/useDebounce";
import CustomerDetailsSkeleton from "@/components/ui/loader-skeleton";
import Loader from "@/components/ui/loader";

const TaxiDrivers = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const handleRowClick = (driver: TaxiDriver) => {
    navigate(`/taxi-management/drivers/${driver.driverId}`);
  };

  const columns = [
    {
      key: "name" as keyof TaxiDriver,
      header: "Name",
      render: (driver: TaxiDriver) => (
        <div className="flex items-center gap-2">
          <span>{driver.name}</span>
          {driver.batchVerified === true && (
            <BadgeCheck className="text-green-500 w-4 h-4" />
          )}
        </div>
      ),
    },
    { key: "mobile" as keyof TaxiDriver, header: "Mobile" },
    { key: "email" as keyof TaxiDriver, header: "Email" },
    {
      key: "registrationNumber" as keyof TaxiDriver,
      header: "Registration Number",
    },
    {
      key: "balance" as keyof TaxiDriver,
      header: "Wallet Balance",
      render: (driver: TaxiDriver) => (
        <span className="text-gray-800 font-medium">
          ₹{driver.balance?.toLocaleString() ?? 0}
        </span>
      ),
    },
    {
      key: "status" as keyof TaxiDriver,
      header: "Status",
      render: (driver: TaxiDriver) => <StatusBadge status={driver.status} />,
    },
    {
      key: "actions" as "actions",
      header: "Actions",
      render: (driver: TaxiDriver) => (
        <button
          className="action-button flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/taxi-management/drivers/${driver.driverId}`);
          }}
        >
          <Eye size={16} className="mr-1" /> View Details
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
        // { label: "Rejected", value: "Rejected" },
        { label: "Pending", value: "pending" },
        { label: "Blocked", value: "blocked" },
        { label: "Rejected", value: "rejected" },
      ],
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/driver-management/drivers", {
          params: {
            vehicleType: "taxi",
            page: currentPage,
            limit: pageSize,
            search: searchTerm,
            verificationStatus: selectedStatus,
          },
        });
        setDrivers(response.data?.data || []);
        setTotalDrivers(response.data?.total || 0);
      } catch (err: any) {
        setError(err.message || "Failed to fetch drivers");
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, [currentPage, pageSize, searchTerm, selectedStatus]);

  if (loading)
    return (
      <>
        <Loader />
      </>
    );
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Taxi Drivers</h1>
          <p className="text-gray-600">Manage all taxi drivers</p>
        </div>
        <Button
          onClick={() => navigate("/taxi-management/drivers/new")}
          className="flex items-center gap-2"
        >
          <Plus size={16} /> Add Taxi Driver
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={drivers}
        keyExtractor={(item) => item.driverId}
        filterable={true}
        filterOptions={filterOptions}
        paginate={true}
        pageSize={10}
        currentPage={currentPage}
        totalItems={totalDrivers}
        onPageChange={(page) => setCurrentPage(page)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={{ status: selectedStatus }}
        onFilterChange={(filters) => {
          setSelectedStatus(filters.status || "");
          setCurrentPage(1);
        }}
      />
    </>
  );
};

export default TaxiDrivers;
