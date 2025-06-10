import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Plus } from "lucide-react";
// import Layout from '@/components/layout/Layout';
import DataTable from "@/components/ui/DataTable";
import { TaxiDriver } from "@/types/admin";
import StatusBadge from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";

// Mock data for taxi drivers
const mockTaxiDrivers: TaxiDriver[] = [
  {
    id: "1",
    name: "John Smith",
    mobile: "9876543210",
    email: "john.smith@example.com",
    status: "Approved",
    age: 35,
    experience: 8,
    vehicleType: "Car",
    vehicleRegistrationNumber: "TN-01-AB-1234",
  },
  {
    id: "2",
    name: "Michael Brown",
    mobile: "8765432109",
    email: "michael.brown@example.com",
    status: "Approved",
    age: 42,
    experience: 15,
    vehicleType: "Car",
    vehicleRegistrationNumber: "TN-02-CD-5678",
  },
  {
    id: "3",
    name: "David Wilson",
    mobile: "7654321098",
    email: "david.wilson@example.com",
    status: "Rejected",
    age: 28,
    experience: 3,
    vehicleType: "Car",
    vehicleRegistrationNumber: "TN-03-EF-9012",
  },
  {
    id: "4",
    name: "Robert Taylor",
    mobile: "6543210987",
    email: "robert.taylor@example.com",
    status: "Approved",
    age: 38,
    experience: 10,
    vehicleType: "Car",
    vehicleRegistrationNumber: "TN-04-GH-3456",
  },
];

const TaxiDrivers = () => {
  const navigate = useNavigate();
  const [drivers] = useState<TaxiDriver[]>(mockTaxiDrivers);

  const handleRowClick = (driver: TaxiDriver) => {
    navigate(`/taxi-management/drivers/${driver.id}`);
  };

  const columns = [
    { key: "name" as keyof TaxiDriver, header: "Name" },
    { key: "mobile" as keyof TaxiDriver, header: "Mobile" },
    { key: "email" as keyof TaxiDriver, header: "Email" },
    { key: "vehicleType" as keyof TaxiDriver, header: "Vehicle Type" },
    {
      key: "vehicleRegistrationNumber" as keyof TaxiDriver,
      header: "Registration Number",
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
            navigate(`/taxi-management/drivers/${driver.id}`);
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
        { label: "Approved", value: "Approved" },
        { label: "Rejected", value: "Rejected" },
      ],
    },
    {
      key: "vehicleType" as keyof TaxiDriver,
      label: "Vehicle Type",
      options: [
        { label: "Car", value: "Car" },
        { label: "Bike", value: "Bike" },
      ],
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Taxi Drivers</h1>
          <p className="text-gray-600">Manage all taxi drivers</p>
        </div>
        {/* <Button
          onClick={() => navigate('/taxi-management/drivers/new')}
          className="flex items-center gap-2"
        >
          <Plus size={16} /> Add Taxi Driver
        </Button> */}
      </div>

      <DataTable
        columns={columns}
        data={drivers}
        onRowClick={handleRowClick}
        keyExtractor={(item) => item.id}
        filterable={true}
        filterOptions={filterOptions}
      />
    </>
  );
};

export default TaxiDrivers;
