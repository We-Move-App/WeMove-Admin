import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DataTable from "@/components/ui/DataTable";
import { Eye, History } from "lucide-react";
import { Customer } from "@/types/admin";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import axiosInstance from "@/api/axiosInstance";
import StatusBadge from "@/components/ui/StatusBadge";
import CustomerDetailsSkeleton from "@/components/ui/loader-skeleton";

const CustomerManagement = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [showHistory, setShowHistory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axiosInstance.get("/user-management/users", {
          params: { page: currentPage, limit: pageSize, search: searchTerm },
        });

        if (response.data.success) {
          const apiUsers = response.data.data.map((u: any) => ({
            id: u._id,
            userId: u.userId,
            name: u.fullName,
            mobile: u.phoneNumber,
            email: u.email,
            status: u.verificationStatus,
          }));
          setCustomers(apiUsers);
          setTotalUsers(response.data?.totaluser || 0);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [currentPage, pageSize, searchTerm]);

  const handleShowHistory = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowHistory(true);
  };

  const columns = [
    { key: "name" as keyof Customer, header: "Name" },
    { key: "mobile" as keyof Customer, header: "Mobile" },
    { key: "email" as keyof Customer, header: "Email ID" },
    // { key: 'status' as keyof Customer, header: 'Status' },
    {
      key: "status" as keyof Customer,
      header: "Status",
      render: (driver: Customer) => <StatusBadge status={driver.status} />,
    },
    {
      key: "actions" as string,
      header: "Actions",
      render: (customer: Customer) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/customer-management/${customer.id}`);
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
      key: "status" as keyof Customer,
      label: "Status",
      options: [
        { label: "Approved", value: "Approved" },
        { label: "Submitted", value: "Submitted" },
        { label: "Blocked", value: "Blocked" },
        { label: "Rejected", value: "Rejected" },
      ],
    },
  ];

  const handleRowClick = (customer: Customer) => {
    navigate(`/customer-management/${customer.id}`);
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-gray-600">View and manage all Users</p>
      </div>

      {loading ? (
        <>
          <CustomerDetailsSkeleton />
        </>
      ) : (
        <DataTable
          columns={columns}
          data={customers}
          keyExtractor={(item) => item.id}
          onRowClick={handleRowClick}
          paginate={true}
          pageSize={10}
          filterable
          filterOptions={filterOptions}
          currentPage={currentPage}
          totalItems={totalUsers}
          onPageChange={(page) => setCurrentPage(page)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      )}
    </>
  );
};

export default CustomerManagement;
