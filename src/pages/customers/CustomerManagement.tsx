import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DataTable from "@/components/ui/DataTable";
import { Eye } from "lucide-react";
import { Customer } from "@/types/admin";
import axiosInstance from "@/api/axiosInstance";
import StatusBadge from "@/components/ui/StatusBadge";
import CustomerDetailsSkeleton from "@/components/ui/loader-skeleton";
import { useTranslation } from "react-i18next";
import Loader from "@/components/ui/loader";

const CustomerManagement = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<string>("");
  const { t } = useTranslation();

  const debounceRef = useRef<number | null>(null);
  const handleSearchChange = (val: string) => {
    setSearchInput(val);
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      setCurrentPage(1);
      setSearchTerm(val);
      debounceRef.current = null;
    }, 900);
  };

  useEffect(() => {
    let mounted = true;

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

        const success = response.data?.success ?? true;
        const apiUsers = response.data?.data ?? response.data ?? [];

        if (success && Array.isArray(apiUsers)) {
          const mapped = apiUsers.map((u: any) => ({
            id: u._id,
            userId: u.userId,
            name: u.fullName,
            mobile: u.phoneNumber,
            email: u.email,
            status: u.verificationStatus,
          }));

          if (!mounted) return;
          setCustomers(mapped);
          const total =
            response.data?.totalUsers ??
            response.data?.total ??
            response.data?.data?.total ??
            0;
          setTotalUsers(total);
        } else {
          if (!mounted) return;
          setCustomers([]);
          setTotalUsers(0);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        if (!mounted) return;
        setCustomers([]);
        setTotalUsers(0);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    fetchCustomers();

    return () => {
      mounted = false;
    };
  }, [currentPage, pageSize, searchTerm, status]);

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
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/customer-management/${customer.id}`);
          }}
          className="action-button flex items-center text-sm"
        >
          <Eye size={16} className="mr-1" />
          {t("customerManagement.labels.viewDetails")}
        </button>
      ),
    },
    {
      key: "bookings",
      header: t("customerManagement.tableHeaders.bookings"),
      render: (customer: Customer) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/customer-management/bookings/${customer.id}`);
          }}
          className="action-button flex items-center text-sm text-green-700"
        >
          <Eye size={16} className="mr-1" />
          {t("customerManagement.labels.bookingHistory")}
        </button>
      ),
    }
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {t("customerManagement.pageTitle")}
        </h1>
        <p className="text-gray-600">{t("customerManagement.pageSubtitle")}</p>
      </div>

      <div className="relative">
        {loading && (
          <div>
            <Loader />
          </div>
        )}
        <DataTable
          columns={columns}
          data={customers}
          keyExtractor={(item) => item.id}
          onRowClick={(c) => navigate(`/customer-management/${c.id}`)}
          paginate={true}
          pageSize={pageSize}
          currentPage={currentPage}
          totalItems={totalUsers}
          onPageChange={(page) => setCurrentPage(page)}
          searchPlaceholder="Search by name / email"
          searchTerm={searchInput}
          onSearchChange={handleSearchChange}
          filterable
          filterOptions={[
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
          ]}
          filters={{ status }}
          onFilterChange={(filters) => {
            setStatus(filters.status || "");
            setCurrentPage(1);
          }}
          loading={loading}
        />
      </div>
    </>
  );
};

export default CustomerManagement;
