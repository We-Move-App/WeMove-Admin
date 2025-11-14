// Admin related types

export interface Branch {
  branchId: string;
  name: string;
  location: string;
  coordinates?: {
    latitude: number | null;
    longitude: number | null;
  };
}

export interface User {
  id: string;
  userName: string;
  email: string;
  phoneNumber?: string;
  role: "Admin" | "Subadmin";
  permissions: string[];
  createdAt: string;
  branchId?: string;
  branchName?: string;
  branch?: Branch;
  adminId?: string;
}

// Define a ChartData type for the charts
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

// Operator related types
export interface BusOperator {
  id: string;
  name: string;
  companyName: string;
  email: string;
  branch?: string;
  mobile?: string;
  phone?: string;
  address?: string;
  city?: string;
  remark?: string;
  state?: string;
  status:
    | "active"
    | "inactive"
    | "pending"
    | "approved"
    | "rejected"
    | "Submitted"
    | "blocked"
    | "Pending";
  batchVerified: boolean;
  numberOfBuses?: number;
  balance?: number;
  busCount?: number;
  joinDate?: string;
  // Additional properties used in BusOperatorDetails.tsx
  profilePhoto?: File | string;
  idCardFront?: File | string;
  idCardBack?: File | string;
  businessLicense?: string;
  bankName?: string;
  bankAccountNumber?: string;
  accountHolderName?: string;
  bankAccountDetails?: File | string;
}

export interface Bus {
  id: string;
  operatorId: string;
  registrationNumber: string;
  type: string;
  capacity: number;
  amenities?: string[];
  status: "active" | "inactive" | "maintenance";
  manufactureYear?: number;
  lastMaintenance?: string;
  insuranceValidTill?: string;
  route?: string;
}

export interface BusBooking {
  id: string;
  bookingId: string;
  busRegistrationNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  from: string;
  to: string;
  journeyDate: string;
  amount: number;
  status: "Completed" | "Upcoming" | "Cancelled" | "Confirmed" | "Pending";
  paymentStatus: "PAID";
}

interface PolicyDocument {
  fileUrl: string;
  fileName: string;
  public_id: string;
  fileType: string;
  _id: string;
}

export interface FileObject {
  _id?: string;
  public_id?: string;
  url?: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
}

// Hotel related types
export interface HotelManager {
  id: string;
  name: string;
  companyName: string;
  companyAddress: string;
  email: string;
  branch?: string;
  mobile?: string;
  phone?: string;
  address?: string;
  city?: string;
  remark?: string;
  balance?: string;
  state?: string;
  status:
    | "active"
    | "inactive"
    | "pending"
    | "approved"
    | "rejected"
    | "Submitted"
    | "blocked"
    | "Pending";
  roomCount?: number;
  joinDate?: string;
  batchVerified: boolean;
  // Additional properties used in HotelManagerDetails.tsx
  profilePhoto?: string;
  hotelName?: string;
  businessLicense?: string;
  hotelPhotos?: string[];
  locality?: string;
  landmark?: string;
  pinCode?: string;
  totalRooms?: number;
  standardRooms?: {
    price: number;
    numberOfRooms: number;
    amenities: string[];
    photos: string[];
  };
  luxuryRooms?: {
    price: number;
    numberOfRooms: number;
    amenities: string[];
    photos: string[];
  };
  checkInTime?: string;
  checkOutTime?: string;
  amenities?: string[];
  policyDocuments?: PolicyDocument[];
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountDetails?: string | FileObject;
  accountHolderName?: string;
  idCardFront?: string;
  idCardBack?: string;
}

export interface HotelBooking {
  id: string;
  hotelId: string;
  stayDuration?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  checkInDate: string;
  checkOutDate: string;
  amount: number;
  status:
    | "Completed"
    | "Upcoming"
    | "Cancelled"
    | "Confirmed"
    | "Pending"
    | "Booked";
}

// Taxi related types
export interface TaxiDriver {
  id?: string;
  driverId?: string;
  name: string;
  email: string;
  branch?: string;
  branchId?: string;
  mobile?: string;
  remark?: string;
  phone?: string;
  balance?: string;
  licenseNumber?: string;
  vehicleNumber?: string;
  vehicleType?: string;
  city?: string;
  status:
    | "active"
    | "inactive"
    | "pending"
    | "approved"
    | "rejected"
    | "submitted"
    | "blocked"
    | "pending";
  joinDate?: string;
  batchVerified: boolean;

  // Extra details
  age?: number;
  address?: string;
  experience?: number;

  // Files
  vehicleModel?: string;
  vehicleRegistrationNumber?: string;
  accountNumber?: string;
  accountHolderName?: string;

  profilePhoto?: string | FileObject;
  idProofs?: string[];
  driverLicense?: string;
  vehiclePhotos?: string[];
  vehicleInsurance?: string;
  vehicleRegistrationCertificate?: string;
  bankAccountDetails?: string;
}

// Taxi Booking related types
export interface TaxiBooking {
  id: string;
  bookingId?: string;
  customerName: string;
  driverName: string;
  from: string;
  to: string;
  rideDate: string;
  vehicleType: string;
  amount: number;
  status: string;
}

// Bike related types
export interface BikeRider {
  id: string;
  driverId?: string;
  name: string;
  email: string;
  mobile?: string;
  phone?: string;
  licenseNumber?: string;
  bikeNumber?: string;
  branchId?: string;
  balance?: string;
  bikeModel?: string;
  vehicleType?: string;
  vehicleRegistrationNumber?: string;
  vehicleInsurance?: string;
  vehicleRegistrationCertificate?: string;
  vehiclePhotos?: string[];
  city?: string;
  status:
    | "active"
    | "inactive"
    | "pending"
    | "approved"
    | "Rejected"
    | "Submitted"
    | "Blocked"
    | "Pending";
  joinDate?: string;
  batchVerified: boolean;
  age?: number;
  address?: string;
  experience?: number;
  idProofs?: string[];
}

// Bike Booking related types
export interface BikeBooking {
  id: string;
  customerName: string;
  riderName: string;
  from: string;
  to: string;
  rideDate: string;
  vehicleType: string;
  amount: number;
  status: string;
}

// Customer related types
export interface Customer {
  id: string;
  userId: string;
  name: string;
  mobile: string;
  email: string;
  status:
    | "active"
    | "inactive"
    | "pending"
    | "Approved"
    | "Rejected"
    | "Submitted"
    | "Blocked"
    | "Pending";
}

// User related types

export interface BusBookingUser {
  busBookingId: string;
  type: "bus";
  busNumber: string | null;
  route: string | null;
  date: string;
  amount: number;
  status: string;
}

export interface HotelBookingUser {
  id: string;
  hotelId: string;
  type: "hotel";
  stayDuration: string;
  amount: number;
  status: string;
}

export interface RideBookingUser {
  bookingId: string;
  type: "ride";
  rideDate: string;
  amount: number;
  status: string;
}

// Commission related types
export interface Commission {
  id: string;
  serviceType: string;
  percentage: number | null;
  fixedRate: number | null;
  commissionType: "percentage" | "fixed";
  // effectiveFrom: string;
  // effectiveTo?: string;
  isActive: boolean;
}

// Coupon related types
export interface Coupon {
  id: string;
  name: string;
  code: string;
  serviceType: string;
  discount: string;
  discountType: "percentage" | "fixed";
  discountPercentage: number | null;
  discountAmount: number | null;
  startDate: string;
  expiryDate: string;
  isActive: boolean;
}

// Wallet related types
export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: "credit" | "debit";
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

export interface WalletTransaction {
  id: string;
  userId: string;
  userName: string;
  role: string;
  type: string;
  amount: number;
  date: string;
  status: string;
  description: string;
}

// Notification related types
// export interface Notification {
//   id: string;
//   title: string;
//   message: string;
//   type?: "info" | "success" | "warning" | "error";
//   recipientType?: string;
//   read?: boolean;
//   sentAt?: string;
//   status?: string;
//   userId?: string;
//   createdAt?: string;
// }

// Dashboard related types
export interface BookingSummary {
  service?: string;
  count?: number;
  percentage?: number;
  trend?: "up" | "down" | "flat";
  color?: string;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  pendingBookings: number;
  revenue: number;
}

export interface RevenueData {
  month: string;
  bus: number;
  hotel: number;
  taxi: number;
  bike: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  image: string;
  timestamp: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
}
