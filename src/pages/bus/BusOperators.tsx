import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import Layout from "@/components/layout/Layout";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import { Plus, Eye, BadgeCheck } from "lucide-react";
import { busOperators } from "@/data/mockData";
import { BusOperator } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { fetchBusOperators } from "@/api/busOperators";
import { FadeLoader } from "react-spinners";
import Loader from "@/components/ui/loader";

const BusOperators = () => {
  const navigate = useNavigate();
  const [operators, setOperators] = useState<BusOperator[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalBusOperators, setTotalBusOperators] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  useEffect(() => {
    const loadBusOperators = async () => {
      try {
        const { data, total } = await fetchBusOperators(
          currentPage,
          pageSize,
          searchTerm,
          selectedStatus
        );
        setOperators(data);
        setTotalBusOperators(total);
      } catch (error) {
        console.error("Failed to fetch bus operators", error);
        setOperators(busOperators);
        setTotalBusOperators(busOperators.length);
      } finally {
        setLoading(false);
      }
    };

    loadBusOperators();
  }, [currentPage, pageSize, searchTerm, selectedStatus]);

  const columns = [
    {
      key: "name" as keyof BusOperator,
      header: "Name",
      render: (operator: BusOperator) => (
        <div className="flex items-center gap-2">
          <span>{operator.name}</span>
          {operator.status === "approved" && (
            <BadgeCheck className="text-green-500 w-4 h-4" />
          )}
        </div>
      ),
    },
    { key: "mobile" as keyof BusOperator, header: "Mobile" },
    { key: "email" as keyof BusOperator, header: "Email ID" },
    {
      key: "numberOfBuses" as keyof BusOperator,
      header: "Number of Buses",
      render: (operator: BusOperator) => (
        <span
          className="cursor-pointer text-blue-600 hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/bus-management/operators/${operator.id}/buses`);
          }}
        >
          {operator.numberOfBuses}
        </span>
      ),
    },
    {
      key: "balance" as keyof BusOperator,
      header: "Wallet Balance",
      render: (operator: BusOperator) => (
        <span className="text-gray-800 font-medium">
          ₹{operator.balance?.toLocaleString() ?? 0}
        </span>
      ),
    },
    {
      key: "status" as keyof BusOperator,
      header: "Status",
      render: (operator: BusOperator) => (
        <StatusBadge status={operator.status} />
      ),
    },
    {
      key: "actions" as "actions",
      header: "Actions",
      render: (operator: BusOperator) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/bus-management/operators/${operator.id}`);
          }}
          className="action-button flex items-center"
        >
          <Eye size={16} className="mr-1" />
          View Details
        </button>
      ),
    },
  ];

  const filterOptions = [
    {
      key: "status" as keyof BusOperator,
      label: "Status",
      options: [
        { label: "approved", value: "approved" },
        { label: "processing", value: "processing" },
        { label: "pending", value: "pending" },
        { label: "submitted", value: "submitted" },
        { label: "rejected", value: "rejected" },
        { label: "blocked", value: "blocked" },
      ],
    },
  ];

  const handleRowClick = (operator: BusOperator) => {
    navigate(`/bus-management/operators/${operator.id}`);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Bus Operators</h1>
          <p className="text-gray-600">Manage all bus operators</p>
        </div>
        <Button
          onClick={() => navigate("/bus-management/operators/new")}
          className="flex items-center gap-2"
        >
          <Plus size={18} />
          Add Bus Operator
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={operators}
        loading={loading}
        paginate={true}
        pageSize={pageSize}
        currentPage={currentPage}
        totalItems={totalBusOperators}
        onPageChange={(page) => setCurrentPage(page)}
        keyExtractor={(item) => item.id}
        onRowClick={handleRowClick}
        filterOptions={filterOptions}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={{ status: selectedStatus }}
        onFilterChange={(filters) => {
          setSelectedStatus(filters.status || "");
          setCurrentPage(1);
        }}
        // onFilterChange={(filters) => setSelectedStatus(filters.status || "")}
      />
    </>
  );
};

export default BusOperators;
