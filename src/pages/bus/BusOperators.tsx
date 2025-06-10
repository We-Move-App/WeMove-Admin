import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import Layout from "@/components/layout/Layout";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import { Plus, Eye } from "lucide-react";
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

  useEffect(() => {
    const loadBusOperators = async () => {
      try {
        const data = await fetchBusOperators();
        setOperators(data);
      } catch (error) {
        console.error("Failed to fetch bus operators", error);
      } finally {
        setLoading(false);
      }
    };

    loadBusOperators();
  }, []);

  const columns = [
    { key: "name" as keyof BusOperator, header: "Name" },
    { key: "mobile" as keyof BusOperator, header: "Mobile" },
    { key: "email" as keyof BusOperator, header: "Email ID" },
    {
      key: "status" as keyof BusOperator,
      header: "Status",
      render: (operator: BusOperator) => (
        <StatusBadge status={operator.status} />
      ),
    },
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
        {/* <Button
          onClick={() => navigate("/bus-management/operators/new")}
          className="flex items-center gap-2"
        >
          <Plus size={18} />
          Add Bus Operator
        </Button> */}
      </div>

      <DataTable
        columns={columns}
        data={operators}
        loading={loading}
        keyExtractor={(item) => item.id}
        onRowClick={handleRowClick}
        filterOptions={filterOptions}
      />
    </>
  );
};

export default BusOperators;
