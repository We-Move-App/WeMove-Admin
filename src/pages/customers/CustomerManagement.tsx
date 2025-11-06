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
import { useTranslation } from "react-i18next";

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
  const [status, setStatus] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/user-management/users", {
          params: {
            page: currentPage,
            limit: pageSize,
            search: searchTerm,
            verificationStatus: status,
          },
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
          setTotalUsers(response.data?.totalUsers || 0);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [currentPage, pageSize, searchTerm, status]);

  const handleShowHistory = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowHistory(true);
  };

  const columns = [
    { key: "name", header: t("customerManagement.tableHeaders.name") },
    { key: "mobile", header: t("customerManagement.tableHeaders.mobile") },
    { key: "email", header: t("customerManagement.tableHeaders.email") },
    {
      key: "status",
      header: t("customerManagement.tableHeaders.status"),
      render: (customer: Customer) => <StatusBadge status={customer.status} />,
    },
    {
      key: "actions",
      header: t("customerManagement.tableHeaders.actions"),
      render: (customer: Customer) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/customer-management/${customer.id}`);
          }}
          className="action-button flex items-center"
        >
          <Eye size={16} className="mr-1" />
          {t("customerManagement.labels.viewDetails")}
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
        <h1 className="text-2xl font-bold">
          {t("customerManagement.pageTitle")}
        </h1>
        <p className="text-gray-600">{t("customerManagement.pageSubtitle")}</p>
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
          pageSize={pageSize}
          currentPage={currentPage}
          totalItems={totalUsers}
          onPageChange={setCurrentPage}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterable
          filterOptions={filterOptions}
          filters={{ status: status }}
          onFilterChange={(filters) => {
            setStatus(filters.status || "");
            setCurrentPage(1);
          }}
        />
      )}
    </>
  );
};

export default CustomerManagement;
