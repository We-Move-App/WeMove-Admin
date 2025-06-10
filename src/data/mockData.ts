
import { 
  BookingSummary, 
  BusOperator, 
  HotelManager, 
  BusBooking, 
  HotelBooking,
  TaxiDriver,
  BikeRider,
  TaxiBooking,
  BikeBooking,
  Customer,
  User,
  Commission,
  Coupon,
  WalletTransaction,
  Notification,
  ChartData
} from '../types/admin';

export const bookingSummary: BookingSummary = {
  totalBookings: 12587,
  completedBookings: 10235,
  cancelledBookings: 1120,
  pendingBookings: 1232,
  revenue: 2345678
};

export const busOperators: BusOperator[] = [
  {
    id: '1',
    name: 'Metro Travels',
    mobile: '9876543210',
    email: 'info@metrotravels.com',
    status: 'Approved',
    numberOfBuses: 12
  },
  {
    id: '2',
    name: 'Express Travels',
    mobile: '9876543211',
    email: 'info@expresstravels.com',
    status: 'Pending',
    numberOfBuses: 8
  },
  {
    id: '3',
    name: 'City Link',
    mobile: '9876543212',
    email: 'info@citylink.com',
    status: 'Submitted',
    numberOfBuses: 15
  },
  {
    id: '4',
    name: 'Golden Tours',
    mobile: '9876543213',
    email: 'info@goldentours.com',
    status: 'Rejected',
    numberOfBuses: 0
  },
  {
    id: '5',
    name: 'Highway Express',
    mobile: '9876543214',
    email: 'info@highwayexpress.com',
    status: 'Blocked',
    numberOfBuses: 7
  }
];

export const hotelManagers: HotelManager[] = [
  {
    id: '1',
    name: 'Grand Palace Hotels',
    mobile: '9876543220',
    email: 'info@grandpalace.com',
    status: 'Approved'
  },
  {
    id: '2',
    name: 'Ocean View Resorts',
    mobile: '9876543221',
    email: 'info@oceanview.com',
    status: 'Pending'
  },
  {
    id: '3',
    name: 'Mountain Retreat',
    mobile: '9876543222',
    email: 'info@mountainretreat.com',
    status: 'Submitted'
  },
  {
    id: '4',
    name: 'City Center Inn',
    mobile: '9876543223',
    email: 'info@citycenter.com',
    status: 'Rejected'
  },
  {
    id: '5',
    name: 'Sunset Hotels',
    mobile: '9876543224',
    email: 'info@sunsethotels.com',
    status: 'Blocked'
  }
];

export const busBookings: BusBooking[] = [
  {
    id: 'BK001',
    busRegistrationNumber: 'MH01AB1234',
    customerName: 'Rahul Sharma',
    customerPhone: '9876543230',
    customerEmail: 'rahul@example.com',
    from: 'Mumbai',
    to: 'Pune',
    journeyDate: '2023-05-20',
    amount: 650,
    status: 'Completed'
  },
  {
    id: 'BK002',
    busRegistrationNumber: 'MH02CD5678',
    customerName: 'Priya Patel',
    customerPhone: '9876543231',
    customerEmail: 'priya@example.com',
    from: 'Delhi',
    to: 'Jaipur',
    journeyDate: '2023-05-22',
    amount: 850,
    status: 'Upcoming'
  },
  {
    id: 'BK003',
    busRegistrationNumber: 'KA03EF9012',
    customerName: 'Amit Kumar',
    customerPhone: '9876543232',
    customerEmail: 'amit@example.com',
    from: 'Bangalore',
    to: 'Chennai',
    journeyDate: '2023-05-23',
    amount: 750,
    status: 'Cancelled'
  },
  {
    id: 'BK004',
    busRegistrationNumber: 'TN04GH3456',
    customerName: 'Sneha Reddy',
    customerPhone: '9876543233',
    customerEmail: 'sneha@example.com',
    from: 'Chennai',
    to: 'Hyderabad',
    journeyDate: '2023-05-24',
    amount: 950,
    status: 'Completed'
  },
  {
    id: 'BK005',
    busRegistrationNumber: 'DL05IJ7890',
    customerName: 'Vikram Singh',
    customerPhone: '9876543234',
    customerEmail: 'vikram@example.com',
    from: 'Delhi',
    to: 'Chandigarh',
    journeyDate: '2023-05-25',
    amount: 550,
    status: 'Upcoming'
  }
];

export const hotelBookings: HotelBooking[] = [
  {
    id: 'HB001',
    hotelId: 'HTL001',
    customerName: 'Rahul Sharma',
    customerPhone: '9876543230',
    customerEmail: 'rahul@example.com',
    checkInDate: '2023-05-26',
    checkOutDate: '2023-05-28',
    amount: 4500,
    status: 'Confirmed'
  },
  {
    id: 'HB002',
    hotelId: 'HTL002',
    customerName: 'Priya Patel',
    customerPhone: '9876543231',
    customerEmail: 'priya@example.com',
    checkInDate: '2023-05-27',
    checkOutDate: '2023-05-30',
    amount: 6500,
    status: 'Confirmed'
  },
  {
    id: 'HB003',
    hotelId: 'HTL003',
    customerName: 'Amit Kumar',
    customerPhone: '9876543232',
    customerEmail: 'amit@example.com',
    checkInDate: '2023-05-28',
    checkOutDate: '2023-05-29',
    amount: 3500,
    status: 'Cancelled'
  },
  {
    id: 'HB004',
    hotelId: 'HTL004',
    customerName: 'Sneha Reddy',
    customerPhone: '9876543233',
    customerEmail: 'sneha@example.com',
    checkInDate: '2023-05-29',
    checkOutDate: '2023-06-01',
    amount: 7500,
    status: 'Confirmed'
  },
  {
    id: 'HB005',
    hotelId: 'HTL005',
    customerName: 'Vikram Singh',
    customerPhone: '9876543234',
    customerEmail: 'vikram@example.com',
    checkInDate: '2023-05-30',
    checkOutDate: '2023-06-02',
    amount: 8500,
    status: 'Pending'
  }
];

export const taxiDrivers: TaxiDriver[] = [
  {
    id: 'TD001',
    name: 'Rajesh Kumar',
    mobile: '9876543240',
    email: 'rajesh@example.com',
    status: 'Approved'
  },
  {
    id: 'TD002',
    name: 'Suresh Singh',
    mobile: '9876543241',
    email: 'suresh@example.com',
    status: 'Rejected'
  },
  {
    id: 'TD003',
    name: 'Mahesh Patel',
    mobile: '9876543242',
    email: 'mahesh@example.com',
    status: 'Approved'
  },
  {
    id: 'TD004',
    name: 'Dinesh Sharma',
    mobile: '9876543243',
    email: 'dinesh@example.com',
    status: 'Approved'
  },
  {
    id: 'TD005',
    name: 'Ramesh Yadav',
    mobile: '9876543244',
    email: 'ramesh@example.com',
    status: 'Rejected'
  }
];

export const bikeRiders: BikeRider[] = [
  {
    id: 'BR001',
    name: 'Ajay Kumar',
    mobile: '9876543250',
    email: 'ajay@example.com',
    status: 'Approved'
  },
  {
    id: 'BR002',
    name: 'Vijay Singh',
    mobile: '9876543251',
    email: 'vijay@example.com',
    status: 'Rejected'
  },
  {
    id: 'BR003',
    name: 'Sanjay Patel',
    mobile: '9876543252',
    email: 'sanjay@example.com',
    status: 'Approved'
  },
  {
    id: 'BR004',
    name: 'Neeraj Sharma',
    mobile: '9876543253',
    email: 'neeraj@example.com',
    status: 'Approved'
  },
  {
    id: 'BR005',
    name: 'Prakash Yadav',
    mobile: '9876543254',
    email: 'prakash@example.com',
    status: 'Rejected'
  }
];

export const taxiBookings: TaxiBooking[] = [
  {
    id: 'TB001',
    customerName: 'Rahul Sharma',
    driverName: 'Rajesh Kumar',
    from: 'Airport',
    to: 'City Center',
    rideDate: '2023-05-20',
    vehicleType: 'Sedan',
    amount: 450,
    status: 'Completed'
  },
  {
    id: 'TB002',
    customerName: 'Priya Patel',
    driverName: 'Suresh Singh',
    from: 'Hotel Grand',
    to: 'Mall of India',
    rideDate: '2023-05-21',
    vehicleType: 'SUV',
    amount: 650,
    status: 'Cancelled'
  },
  {
    id: 'TB003',
    customerName: 'Amit Kumar',
    driverName: 'Mahesh Patel',
    from: 'Railway Station',
    to: 'Business Park',
    rideDate: '2023-05-22',
    vehicleType: 'Sedan',
    amount: 350,
    status: 'Completed'
  },
  {
    id: 'TB004',
    customerName: 'Sneha Reddy',
    driverName: 'Dinesh Sharma',
    from: 'Residence',
    to: 'Airport',
    rideDate: '2023-05-23',
    vehicleType: 'Premium',
    amount: 750,
    status: 'Upcoming'
  },
  {
    id: 'TB005',
    customerName: 'Vikram Singh',
    driverName: 'Ramesh Yadav',
    from: 'Office',
    to: 'Home',
    rideDate: '2023-05-24',
    vehicleType: 'Mini',
    amount: 250,
    status: 'Upcoming'
  }
];

export const bikeBookings: BikeBooking[] = [
  {
    id: 'BB001',
    customerName: 'Rahul Sharma',
    riderName: 'Ajay Kumar',
    from: 'College',
    to: 'Mall',
    rideDate: '2023-05-20',
    vehicleType: 'Scooter',
    amount: 150,
    status: 'Completed'
  },
  {
    id: 'BB002',
    customerName: 'Priya Patel',
    riderName: 'Vijay Singh',
    from: 'Home',
    to: 'Office',
    rideDate: '2023-05-21',
    vehicleType: 'Bike',
    amount: 180,
    status: 'Cancelled'
  },
  {
    id: 'BB003',
    customerName: 'Amit Kumar',
    riderName: 'Sanjay Patel',
    from: 'Metro Station',
    to: 'Market',
    rideDate: '2023-05-22',
    vehicleType: 'Scooter',
    amount: 120,
    status: 'Completed'
  },
  {
    id: 'BB004',
    customerName: 'Sneha Reddy',
    riderName: 'Neeraj Sharma',
    from: 'Restaurant',
    to: 'Home',
    rideDate: '2023-05-23',
    vehicleType: 'Bike',
    amount: 200,
    status: 'Upcoming'
  },
  {
    id: 'BB005',
    customerName: 'Vikram Singh',
    riderName: 'Prakash Yadav',
    from: 'Gym',
    to: 'Office',
    rideDate: '2023-05-24',
    vehicleType: 'Scooter',
    amount: 130,
    status: 'Upcoming'
  }
];

export const customers: Customer[] = [
  {
    id: 'CUS001',
    name: 'Rahul Sharma',
    mobile: '9876543230',
    email: 'rahul@example.com'
  },
  {
    id: 'CUS002',
    name: 'Priya Patel',
    mobile: '9876543231',
    email: 'priya@example.com'
  },
  {
    id: 'CUS003',
    name: 'Amit Kumar',
    mobile: '9876543232',
    email: 'amit@example.com'
  },
  {
    id: 'CUS004',
    name: 'Sneha Reddy',
    mobile: '9876543233',
    email: 'sneha@example.com'
  },
  {
    id: 'CUS005',
    name: 'Vikram Singh',
    mobile: '9876543234',
    email: 'vikram@example.com'
  }
];

export const users: User[] = [
  {
    id: 'USR001',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Admin',
    permissions: ['all'],
    createdAt: '2023-01-01'
  },
  {
    id: 'USR002',
    name: 'Bus Manager',
    email: 'busmanager@example.com',
    role: 'Subadmin',
    permissions: ['bus_management', 'reports_view'],
    createdAt: '2023-01-15'
  },
  {
    id: 'USR003',
    name: 'Hotel Manager',
    email: 'hotelmanager@example.com',
    role: 'Subadmin',
    permissions: ['hotel_management', 'reports_view'],
    createdAt: '2023-01-20'
  },
  {
    id: 'USR004',
    name: 'Customer Support',
    email: 'support@example.com',
    role: 'Manager',
    permissions: ['customer_management', 'bookings_view'],
    createdAt: '2023-02-01'
  },
  {
    id: 'USR005',
    name: 'Finance Manager',
    email: 'finance@example.com',
    role: 'Manager',
    permissions: ['reports_view', 'finance_management'],
    createdAt: '2023-02-15'
  }
];

export const commissions: Commission[] = [
  {
    id: 'COM001',
    serviceType: 'Bus',
    percentage: 10,
    fixedRate: null,
    commissionType: 'percentage',
    effectiveFrom: '2023-01-01',
    isActive: true
  },
  {
    id: 'COM002',
    serviceType: 'Hotel',
    percentage: 15,
    fixedRate: null,
    commissionType: 'percentage',
    effectiveFrom: '2023-01-01',
    isActive: true
  },
  {
    id: 'COM003',
    serviceType: 'Taxi',
    percentage: 12,
    fixedRate: null,
    commissionType: 'percentage',
    effectiveFrom: '2023-01-01',
    isActive: true
  },
  {
    id: 'COM004',
    serviceType: 'Bike',
    percentage: 8,
    fixedRate: null,
    commissionType: 'percentage',
    effectiveFrom: '2023-01-01',
    isActive: true
  }
];

export const coupons: Coupon[] = [
  {
    id: 'CPN001',
    name: 'Welcome Offer',
    code: 'WELCOME10',
    serviceType: 'All',
    discountType: 'percentage',
    discountPercentage: 10,
    discountAmount: null,
    startDate: '2023-01-01',
    expiryDate: '2023-12-31',
    isActive: true
  },
  {
    id: 'CPN002',
    name: 'Summer Special',
    code: 'SUMMER15',
    serviceType: 'Hotel',
    discountType: 'percentage',
    discountPercentage: 15,
    discountAmount: null,
    startDate: '2023-01-01',
    expiryDate: '2023-08-31',
    isActive: true
  },
  {
    id: 'CPN003',
    name: 'First Ride',
    code: 'RIDE20',
    serviceType: 'Taxi',
    discountType: 'percentage',
    discountPercentage: 20,
    discountAmount: null,
    startDate: '2023-01-01',
    expiryDate: '2023-12-31',
    isActive: true
  },
  {
    id: 'CPN004',
    name: 'Weekend Travel',
    code: 'WEEKEND12',
    serviceType: 'Bus',
    discountType: 'percentage',
    discountPercentage: 12,
    discountAmount: null,
    startDate: '2023-01-01',
    expiryDate: '2023-12-31',
    isActive: true
  },
  {
    id: 'CPN005',
    name: 'Bike Offer',
    code: 'BIKE15',
    serviceType: 'Bike',
    discountType: 'percentage',
    discountPercentage: 15,
    discountAmount: null,
    startDate: '2023-01-01',
    expiryDate: '2023-09-30',
    isActive: true
  }
];

export const walletTransactions: WalletTransaction[] = [
  {
    id: 'WT001',
    userId: 'CUS001',
    userName: 'Rahul Sharma',
    type: 'Credit',
    amount: 1000,
    date: '2023-05-15',
    status: 'Completed',
    description: 'Refund for cancelled booking'
  },
  {
    id: 'WT002',
    userId: 'CUS002',
    userName: 'Priya Patel',
    type: 'Debit',
    amount: 500,
    date: '2023-05-16',
    status: 'Completed',
    description: 'Payment for taxi booking'
  },
  {
    id: 'WT003',
    userId: 'CUS003',
    userName: 'Amit Kumar',
    type: 'Transfer',
    amount: 300,
    date: '2023-05-17',
    status: 'Completed',
    description: 'Transfer to bank account'
  },
  {
    id: 'WT004',
    userId: 'CUS004',
    userName: 'Sneha Reddy',
    type: 'Withdrawal',
    amount: 1500,
    date: '2023-05-18',
    status: 'Pending',
    description: 'Withdrawal request'
  },
  {
    id: 'WT005',
    userId: 'CUS005',
    userName: 'Vikram Singh',
    type: 'Credit',
    amount: 800,
    date: '2023-05-19',
    status: 'Failed',
    description: 'Payment from added card'
  }
];

export const notifications: Notification[] = [
  {
    id: 'NOT001',
    title: 'Summer Offer',
    message: 'Enjoy 20% off on all hotel bookings this summer!',
    recipientType: 'All',
    sentAt: '2023-05-15',
    status: 'Sent'
  },
  {
    id: 'NOT002',
    title: 'New Feature Alert',
    message: 'Now book multiple seats at once for bus travel!',
    recipientType: 'Customers',
    sentAt: '2023-05-16',
    status: 'Sent'
  },
  {
    id: 'NOT003',
    title: 'Driver Update',
    message: 'New ride assignment system is now live. Check the app for details.',
    recipientType: 'Drivers',
    sentAt: '2023-05-17',
    status: 'Sent'
  },
  {
    id: 'NOT004',
    title: 'Hotel Partner Update',
    message: 'New dashboard features for hotel partners are now available.',
    recipientType: 'Hotel Managers',
    sentAt: '2023-05-18',
    status: 'Sent'
  },
  {
    id: 'NOT005',
    title: 'Weekend Offer',
    message: 'Special discount on weekend bus travel!',
    recipientType: 'All',
    sentAt: '2023-05-19',
    status: 'Draft'
  }
];

export const monthlyBookingData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Hotel Bookings',
      data: [65, 59, 80, 81, 56, 55, 40, 45, 50, 55, 60, 65],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    },
    {
      label: 'Bus Bookings',
      data: [28, 48, 40, 19, 86, 27, 90, 85, 80, 75, 70, 65],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    },
    {
      label: 'Taxi Bookings',
      data: [45, 55, 65, 75, 85, 95, 85, 75, 65, 55, 45, 35],
      backgroundColor: 'rgba(255, 206, 86, 0.5)',
      borderColor: 'rgba(255, 206, 86, 1)',
      borderWidth: 1
    },
    {
      label: 'Bike Bookings',
      data: [35, 45, 55, 65, 75, 85, 95, 85, 75, 65, 55, 45],
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }
  ]
};

export const weeklyBookingData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Hotel Bookings',
      data: [12, 19, 13, 15, 12, 18, 20],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    },
    {
      label: 'Bus Bookings',
      data: [8, 15, 12, 9, 16, 22, 25],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    },
    {
      label: 'Taxi Bookings',
      data: [15, 18, 20, 22, 25, 30, 35],
      backgroundColor: 'rgba(255, 206, 86, 0.5)',
      borderColor: 'rgba(255, 206, 86, 1)',
      borderWidth: 1
    },
    {
      label: 'Bike Bookings',
      data: [10, 12, 15, 18, 20, 25, 30],
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }
  ]
};

export const yearlyBookingData = {
  labels: ['2020', '2021', '2022', '2023'],
  datasets: [
    {
      label: 'Hotel Bookings',
      data: [250, 420, 680, 820],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    },
    {
      label: 'Bus Bookings',
      data: [320, 480, 550, 690],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    },
    {
      label: 'Taxi Bookings',
      data: [180, 320, 450, 580],
      backgroundColor: 'rgba(255, 206, 86, 0.5)',
      borderColor: 'rgba(255, 206, 86, 1)',
      borderWidth: 1
    },
    {
      label: 'Bike Bookings',
      data: [120, 250, 380, 490],
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }
  ]
};

export const revenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Revenue (in lakhs)',
      data: [12, 19, 15, 17, 14, 18, 20, 22, 24, 26, 28, 30],
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }
  ]
};
