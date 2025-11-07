import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, Eye, Plus } from "lucide-react";
// import Layout from '@/components/layout/Layout';
import DataTable from "@/components/ui/DataTable";
import { BikeRider } from "@/types/admin";
import StatusBadge from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/api/axiosInstance";
import Loader from "@/components/ui/loader";
import { useTranslation } from "react-i18next";

// Mock data for bike riders
// const mockBikeRiders: BikeRider[] = [
//   {
//     id: "1",
//     name: "Alex Johnson",
//     mobile: "9876543210",
//     email: "alex.j@example.com",
//     status: "Approved",
//     age: 28,
//     experience: 5,
//     vehicleType: "Scooter",
//     vehicleRegistrationNumber: "TN-01-AB-5678",
//   },
//   {
//     id: "2",
//     name: "Sam Wilson",
//     mobile: "8765432109",
//     email: "sam.w@example.com",
//     status: "Approved",
//     age: 25,
//     experience: 3,
//     vehicleType: "MotorBike",
//     vehicleRegistrationNumber: "TN-02-CD-9012",
//   },
//   {
//     id: "3",
//     name: "Ryan Thomas",
//     mobile: "7654321098",
//     email: "ryan.t@example.com",
//     status: "Rejected",
//     age: 22,
//     experience: 1,
//     vehicleType: "Scooter",
//     vehicleRegistrationNumber: "TN-03-EF-3456",
//   },
//   {
//     id: "4",
//     name: "Jake Miller",
//     mobile: "6543210987",
//     email: "jake.m@example.com",
//     status: "Approved",
//     age: 30,
//     experience: 7,
//     vehicleType: "MotorBike",
//     vehicleRegistrationNumber: "TN-04-GH-7890",
//   },
// ];

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

      {loading ? (
        <Loader />
      ) : (
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

export default BikeRiders;
