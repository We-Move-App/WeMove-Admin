
import { useParams } from 'react-router-dom';
// import Layout from '@/components/layout/Layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Customer, BusBooking, HotelBooking } from '@/types/admin';

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

const CustomerDetails = () => {
  const { customerId } = useParams();
  const customer = mockCustomers.find(c => c.id === customerId);

  // Filter bookings for this customer
  const customerBookings = mockBookingHistory.filter(booking =>
    booking.customerEmail === customer?.email || booking.customerPhone === customer?.mobile
  );

  if (!customer) {
    return (
      <>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-red-500">Customer not found</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Customer Details</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">ID</TableCell>
                    <TableCell>{customer.id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Name</TableCell>
                    <TableCell>{customer.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Email</TableCell>
                    <TableCell>{customer.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Mobile</TableCell>
                    <TableCell>{customer.mobile}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-lg font-medium text-blue-700">{customerBookings.filter(b => 'busRegistrationNumber' in b).length}</p>
                  <p className="text-sm text-blue-600">Bus Bookings</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-lg font-medium text-green-700">{customerBookings.filter(b => 'hotelId' in b).length}</p>
                  <p className="text-sm text-green-600">Hotel Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Bookings</TabsTrigger>
              <TabsTrigger value="bus">Bus Bookings</TabsTrigger>
              <TabsTrigger value="hotel">Hotel Bookings</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>All Bookings History</CardTitle>
                </CardHeader>
                <CardContent>
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
                      {customerBookings.map(booking => (
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
                      {customerBookings.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            No booking history found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bus">
              <Card>
                <CardHeader>
                  <CardTitle>Bus Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Bus Number</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customerBookings
                        .filter(booking => 'busRegistrationNumber' in booking)
                        .map(booking => {
                          const busBooking = booking as BusBooking;
                          return (
                            <TableRow key={booking.id}>
                              <TableCell>{booking.id}</TableCell>
                              <TableCell>{busBooking.busRegistrationNumber}</TableCell>
                              <TableCell>{busBooking.from} to {busBooking.to}</TableCell>
                              <TableCell>{busBooking.journeyDate}</TableCell>
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
                          );
                        })}
                      {customerBookings.filter(booking => 'busRegistrationNumber' in booking).length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">
                            No bus booking history found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hotel">
              <Card>
                <CardHeader>
                  <CardTitle>Hotel Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Hotel ID</TableHead>
                        <TableHead>Stay Duration</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customerBookings
                        .filter(booking => 'hotelId' in booking)
                        .map(booking => {
                          const hotelBooking = booking as HotelBooking;
                          return (
                            <TableRow key={booking.id}>
                              <TableCell>{booking.id}</TableCell>
                              <TableCell>{hotelBooking.hotelId}</TableCell>
                              <TableCell>{hotelBooking.checkInDate} to {hotelBooking.checkOutDate}</TableCell>
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
                          );
                        })}
                      {customerBookings.filter(booking => 'hotelId' in booking).length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            No hotel booking history found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default CustomerDetails;
