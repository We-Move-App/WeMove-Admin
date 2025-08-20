import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '@/components/ui/DataTable';
import { Eye, History } from 'lucide-react';
import { Customer } from '@/types/admin';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import axiosInstance from '@/api/axiosInstance';

const CustomerManagement = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axiosInstance.get("/user-management/users", {
          params: { page: 1, limit: 10 }
        });

        if (response.data.success) {
          const apiUsers = response.data.userDetails.map((u: any) => ({
            id: u._id,
            name: u.fullName,
            mobile: u.phoneNumber,
            email: u.email,
            status: u.verificationStatus,
          }));
          setCustomers(apiUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleShowHistory = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowHistory(true);
  };

  const columns = [
    { key: 'name' as keyof Customer, header: 'Name' },
    { key: 'mobile' as keyof Customer, header: 'Mobile' },
    { key: 'email' as keyof Customer, header: 'Email ID' },
    { key: 'status' as keyof Customer, header: 'Status' },
    {
      key: 'actions' as string,
      header: 'Actions',
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
      )
    }
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
        <p>Loading users...</p>
      ) : (
        <DataTable
          columns={columns}
          data={customers}
          keyExtractor={(item) => item.id}
          onRowClick={handleRowClick}
          searchable={true}
        />
      )}

      {/* <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Booking History for {selectedCustomer?.name}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No booking history found
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog> */}
    </>
  );
};

export default CustomerManagement;
