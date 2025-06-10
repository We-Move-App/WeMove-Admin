
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Layout from '@/components/layout/Layout';
import DataTable from '@/components/ui/DataTable';
import { Eye, History } from 'lucide-react';
import { Customer, BusBooking, HotelBooking } from '@/types/admin';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

// Mock customer data
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    mobile: '+91 9876543210',
    email: 'john@example.com'
  },
  {
    id: '2',
    name: 'Jane Smith',
    mobile: '+91 9876543211',
    email: 'jane@example.com'
  },
  {
    id: '3',
    name: 'Robert Johnson',
    mobile: '+91 9876543212',
    email: 'robert@example.com'
  },
  {
    id: '4',
    name: 'Emily Brown',
    mobile: '+91 9876543213',
    email: 'emily@example.com'
  },
  {
    id: '5',
    name: 'Michael Wilson',
    mobile: '+91 9876543214',
    email: 'michael@example.com'
  }
];

// Mock booking history
const mockBookingHistory: (BusBooking | HotelBooking)[] = [
  {
    id: 'b1',
    busRegistrationNumber: 'MH01AB1234',
    customerName: 'John Doe',
    customerPhone: '+91 9876543210',
    customerEmail: 'john@example.com',
    from: 'Mumbai',
    to: 'Delhi',
    journeyDate: '2023-05-15',
    amount: 1200,
    status: 'Completed'
  },
  {
    id: 'h1',
    hotelId: 'h123',
    customerName: 'John Doe',
    customerPhone: '+91 9876543210',
    customerEmail: 'john@example.com',
    checkInDate: '2023-06-10',
    checkOutDate: '2023-06-12',
    amount: 3500,
    status: 'Completed'
  },
  {
    id: 'b2',
    busRegistrationNumber: 'MH01CD5678',
    customerName: 'John Doe',
    customerPhone: '+91 9876543210',
    customerEmail: 'john@example.com',
    from: 'Delhi',
    to: 'Mumbai',
    journeyDate: '2023-05-20',
    amount: 1200,
    status: 'Upcoming'
  }
];

const CustomerManagement = () => {
  const navigate = useNavigate();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleShowHistory = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowHistory(true);
  };

  const columns = [
    { key: 'name' as keyof Customer, header: 'Name' },
    { key: 'mobile' as keyof Customer, header: 'Mobile' },
    { key: 'email' as keyof Customer, header: 'Email ID' },
    {
      key: 'history' as string, // Changed from 'history' as 'history' to 'history' as string
      header: 'Booking History',
      render: (customer: Customer) => (
        <button
          className="flex items-center text-blue-600 hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            handleShowHistory(customer);
          }}
        >
          <History size={16} className="mr-1" />
          View History
        </button>
      )
    },
    {
      key: 'actions' as string, // Changed from 'actions' as 'actions' to 'actions' as string
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
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <p className="text-gray-600">View and manage all customers</p>
      </div>

      <DataTable
        columns={columns}
        data={mockCustomers}
        keyExtractor={(item) => item.id}
        onRowClick={handleRowClick}
        searchable={true}
      />

      <Dialog open={showHistory} onOpenChange={setShowHistory}>
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
                {mockBookingHistory.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.id}</TableCell>
                    <TableCell>
                      {'busRegistrationNumber' in booking ? 'Bus Booking' : 'Hotel Booking'}
                    </TableCell>
                    <TableCell>
                      {'journeyDate' in booking
                        ? booking.journeyDate
                        : `${booking.checkInDate} to ${booking.checkOutDate}`
                      }
                    </TableCell>
                    <TableCell>₹{booking.amount}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        {booking.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {!mockBookingHistory.length && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No booking history found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomerManagement;
