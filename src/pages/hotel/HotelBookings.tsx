// import { useState } from "react";
// import { ChevronDown, ChevronUp, Bell, Menu, User } from "lucide-react";
// import { Hotel, Booking } from "../../types/hotel";

// const mockHotels: Hotel[] = [
//   {
//     id: "1",
//     hotelName: "ABC HOTEL",
//     hotelId: "113652421",
//     ownerName: "MBAKU ABC",
//     idCardNo: "AA22565412",
//     phone: "237 653 84 1003",
//     email: "vivabhotel@gmail.com",
//     jointDate: "17 FEB 2024",
//     licenseNumber: "SW1155B25SE2",
//     licenseRenewalDate: "07 FEB 2025",
//     licenseType: "Ltd",
//     status: "Active",
//   },
//   {
//     id: "2",
//     hotelName: "DEF HOTEL",
//     hotelId: "113652123",
//     ownerName: "MBAKU DEF",
//     idCardNo: "AA22565123",
//     phone: "237 653 84 1003",
//     email: "cdefhotel@gmail.com",
//     jointDate: "17 FEB 2024",
//     licenseNumber: "SW1155B25SE2",
//     licenseRenewalDate: "07 FEB 2025",
//     licenseType: "Int",
//     status: "Active",
//   },
//   {
//     id: "3",
//     hotelName: "EHJLK HOTEL",
//     hotelId: "113655678",
//     ownerName: "MBAKU GHI",
//     idCardNo: "AA22565456",
//     phone: "237 653 84 1003",
//     email: "fghhotel@gmail.com",
//     jointDate: "17 FEB 2024",
//     licenseNumber: "SW1155B25SE2",
//     licenseRenewalDate: "07 FEB 2025",
//     licenseType: "Est",
//     status: "Active",
//   },
//   {
//     id: "4",
//     hotelName: "LMNOP HOTEL",
//     hotelId: "113651234",
//     ownerName: "MBAKU NICODEMUS",
//     idCardNo: "AA22565789",
//     phone: "237 653 84 1003",
//     email: "jkhotel@gmail.com",
//     jointDate: "17 FEB 2024",
//     licenseNumber: "SW1155B25SE2",
//     licenseRenewalDate: "07 FEB 2025",
//     licenseType: "LLC",
//     status: "Active",
//   },
// ];

// const mockBookings: Record<string, Booking[]> = {
//   "1": [
//     {
//       id: "1",
//       bookingId: "WEH1001001",
//       hotelId: "1",
//       customerName: "John Doe",
//       phone: "+237654321000",
//       email: "john@example.com",
//       checkInDate: "9/20/2025",
//       checkOutDate: "9/22/2025",
//       amount: 2500.0,
//       status: "Booked",
//     },
//     {
//       id: "2",
//       bookingId: "WEH1001002",
//       hotelId: "1",
//       customerName: "Sarah Smith",
//       phone: "+237654321001",
//       email: "sarah@example.com",
//       checkInDate: "9/18/2025",
//       checkOutDate: "9/20/2025",
//       amount: 4200.0,
//       status: "Completed",
//     },
//   ],
//   "2": [
//     {
//       id: "1",
//       bookingId: "WEH2001001",
//       hotelId: "2",
//       customerName: "Michael Johnson",
//       phone: "+237654322000",
//       email: "michael@example.com",
//       checkInDate: "9/21/2025",
//       checkOutDate: "9/23/2025",
//       amount: 3100.0,
//       status: "Booked",
//     },
//     {
//       id: "2",
//       bookingId: "WEH2001002",
//       hotelId: "2",
//       customerName: "Emma Wilson",
//       phone: "+237654322001",
//       email: "emma@example.com",
//       checkInDate: "9/19/2025",
//       checkOutDate: "9/21/2025",
//       amount: 2800.0,
//       status: "Completed",
//     },
//     {
//       id: "3",
//       bookingId: "WEH2001003",
//       hotelId: "2",
//       customerName: "David Brown",
//       phone: "+237654322002",
//       email: "david@example.com",
//       checkInDate: "9/17/2025",
//       checkOutDate: "9/19/2025",
//       amount: 5500.0,
//       status: "Booked",
//     },
//   ],
//   "3": [
//     {
//       id: "1",
//       bookingId: "WEH3001001",
//       hotelId: "3",
//       customerName: "Lisa Anderson",
//       phone: "+237654323000",
//       email: "lisa@example.com",
//       checkInDate: "9/22/2025",
//       checkOutDate: "9/24/2025",
//       amount: 1800.0,
//       status: "Booked",
//     },
//     {
//       id: "2",
//       bookingId: "WEH3001002",
//       hotelId: "3",
//       customerName: "Robert Taylor",
//       phone: "+237654323001",
//       email: "robert@example.com",
//       checkInDate: "9/20/2025",
//       checkOutDate: "9/22/2025",
//       amount: 3600.0,
//       status: "Completed",
//     },
//   ],
//   "4": [
//     {
//       id: "1",
//       bookingId: "WEH8805518",
//       hotelId: "4",
//       customerName: "hjewgfu",
//       phone: "9999999999",
//       email: "jkl@gmail.com",
//       checkInDate: "9/18/2025",
//       checkOutDate: "9/19/2025",
//       amount: 1000.0,
//       status: "Booked",
//     },
//     {
//       id: "2",
//       bookingId: "WEH8377317",
//       hotelId: "4",
//       customerName: "Amit kumar",
//       phone: "+919304871558",
//       email: "ravi@exampl.com",
//       checkInDate: "9/17/2025",
//       checkOutDate: "9/18/2025",
//       amount: 3500.0,
//       status: "Booked",
//     },
//     {
//       id: "3",
//       bookingId: "WEH8564416",
//       hotelId: "4",
//       customerName: "Priya Sen",
//       phone: "8755443210",
//       email: "sen976@example.com",
//       checkInDate: "9/16/2025",
//       checkOutDate: "9/15/2025",
//       amount: 7000.0,
//       status: "Completed",
//     },
//     {
//       id: "4",
//       bookingId: "WEH8948115",
//       hotelId: "4",
//       customerName: "Amit Kumar",
//       phone: "9788001199",
//       email: "amit6565@example.com",
//       checkInDate: "9/16/2025",
//       checkOutDate: "9/17/2025",
//       amount: 3000.0,
//       status: "Booked",
//     },
//     {
//       id: "5",
//       bookingId: "WEH8871714",
//       hotelId: "4",
//       customerName: "Ranjima Ghosh",
//       phone: "8977001244",
//       email: "ghosh245@example.com",
//       checkInDate: "9/16/2025",
//       checkOutDate: "9/15/2025",
//       amount: 7000.0,
//       status: "Completed",
//     },
//     {
//       id: "6",
//       bookingId: "WEH8026113",
//       hotelId: "4",
//       customerName: "Ranjima Ghosh",
//       phone: "8667799001",
//       email: "ghosh25@example.com",
//       checkInDate: "9/16/2025",
//       checkOutDate: "9/17/2025",
//       amount: 3500.0,
//       status: "Booked",
//     },
//     {
//       id: "7",
//       bookingId: "WEH8846712",
//       hotelId: "4",
//       customerName: "Amit kumar",
//       phone: "+919304871558",
//       email: "ravi@exampl.com",
//       checkInDate: "9/15/2025",
//       checkOutDate: "9/16/2025",
//       amount: 500.0,
//       status: "Booked",
//     },
//     {
//       id: "8",
//       bookingId: "WEH8338511",
//       hotelId: "4",
//       customerName: "Amit kumar",
//       phone: "+919304871558",
//       email: "ravi@exampl.com",
//       checkInDate: "9/15/2025",
//       checkOutDate: "9/16/2025",
//       amount: 500.0,
//       status: "Booked",
//     },
//     {
//       id: "9",
//       bookingId: "",
//       hotelId: "4",
//       customerName: "Amit kumar",
//       phone: "+919304871558",
//       email: "ravi@exampl.com",
//       checkInDate: "9/15/2025",
//       checkOutDate: "9/16/2025",
//       amount: 500.0,
//       status: "Booked",
//     },
//     {
//       id: "10",
//       bookingId: "WEH8816810",
//       hotelId: "4",
//       customerName: "Amit kumar",
//       phone: "+919304871558",
//       email: "ravi@exampl.com",
//       checkInDate: "9/12/2025",
//       checkOutDate: "9/13/2025",
//       amount: 3500.0,
//       status: "Booked",
//     },
//   ],
// };

// export default function HotelBookings() {
//   const [expandedRow, setExpandedRow] = useState<string | null>(null);
//   const [statusDropdown, setStatusDropdown] = useState<string | null>(null);

//   const toggleRow = (hotelId: string) => {
//     setExpandedRow(expandedRow === hotelId ? null : hotelId);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       {/* <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <button className="lg:hidden">
//             <Menu className="w-6 h-6" />
//           </button>
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search"
//               className="border border-gray-300 rounded-md px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
//             />
//           </div>
//         </div>
//         <div className="flex items-center gap-4">
//           <button className="relative">
//             <Bell className="w-6 h-6 text-gray-600" />
//             <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//               3
//             </span>
//           </button>
//           <div className="flex items-center gap-2">
//             <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
//               <User className="w-6 h-6 text-white" />
//             </div>
//             <span className="font-medium">BurishDSuperAdmin</span>
//           </div>
//         </div>
//       </header> */}

//       {/* Main Content */}
//       <main className="p-6">
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-900">Hotel Bookings</h1>
//           <p className="text-gray-600">View and manage all hotel bookings</p>
//         </div>

//         {/* Hotels Table */}
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr className="whitespace-nowrap">
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Hotel Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Hotel ID
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Hotel Owner Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     ID Card No
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Hotel Phone
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Hotel Email
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Joint date in wemove
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Hotel License
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     License Re date
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     License Type
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {mockHotels.map((hotel) => (
//                   <>
//                     <tr
//                       key={hotel.id}
//                       className={`hover:bg-gray-50 cursor-pointer transition-colors ${
//                         expandedRow === hotel.id
//                           ? "bg-green-50 border-l-4 border-green-700"
//                           : ""
//                       }`}
//                       onClick={() => toggleRow(hotel.id)}
//                     >
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {hotel.hotelName}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {hotel.hotelId}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {hotel.ownerName}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {hotel.idCardNo}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {hotel.phone}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {hotel.email}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {hotel.jointDate}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {hotel.licenseNumber}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {hotel.licenseRenewalDate}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {hotel.licenseType}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="flex items-center gap-1 text-sm font-medium text-green-700">
//                           {hotel.status}
//                           {expandedRow === hotel.id ? (
//                             <ChevronDown className="w-4 h-4" />
//                           ) : (
//                             <ChevronUp className="w-4 h-4" />
//                           )}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="relative">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               setStatusDropdown(
//                                 statusDropdown === hotel.id ? null : hotel.id
//                               );
//                             }}
//                             className="px-4 py-2 bg-white border border-green-500 text-green-700 rounded hover:bg-green-50 text-sm font-medium flex items-center gap-2"
//                           >
//                             Edit
//                             <ChevronUp className="w-4 h-4" />
//                           </button>
//                           {statusDropdown === hotel.id && (
//                             <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
//                               <button className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-gray-50">
//                                 Active
//                               </button>
//                               <button className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-50">
//                                 Block
//                               </button>
//                               <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
//                                 Black list
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                     </tr>

//                     {/* Expanded Bookings Section */}
//                     {expandedRow === hotel.id && mockBookings[hotel.id] && (
//                       <tr>
//                         <td colSpan={12} className="px-0 py-0">
//                           <div className="bg-gray-50 border-t-2 border-b-2 border-blue-200">
//                             <div className="p-6">
//                               <div className="mb-4">
//                                 <input
//                                   type="text"
//                                   placeholder="Search..."
//                                   className="border border-gray-300 rounded-md px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                   onClick={(e) => e.stopPropagation()}
//                                 />
//                               </div>

//                               <div className="bg-white rounded-lg shadow overflow-hidden">
//                                 <table className="w-full">
//                                   <thead className="bg-gray-100 border-b border-gray-200">
//                                     <tr>
//                                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                         Booking ID
//                                       </th>
//                                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                         Hotel ID
//                                       </th>
//                                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                         Customer Name
//                                       </th>
//                                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                         Phone
//                                       </th>
//                                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                         Email
//                                       </th>
//                                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                         Check-in Date
//                                       </th>
//                                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                         Check-out Date
//                                       </th>
//                                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                         Amount
//                                       </th>
//                                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                         Status
//                                       </th>
//                                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                         Actions
//                                       </th>
//                                     </tr>
//                                   </thead>
//                                   <tbody className="bg-white divide-y divide-gray-200">
//                                     {mockBookings[hotel.id].map((booking) => (
//                                       <tr
//                                         key={booking.id}
//                                         className="hover:bg-gray-50"
//                                       >
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                           {booking.bookingId}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                           {
//                                             mockHotels.find(
//                                               (h) => h.id === booking.hotelId
//                                             )?.hotelId
//                                           }
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                           {booking.customerName}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                           {booking.phone}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                           {booking.email}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                           {booking.checkInDate}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                           {booking.checkOutDate}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                           ${booking.amount.toFixed(2)}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                           <span
//                                             className={`px-3 py-1 rounded-full text-xs font-medium ${
//                                               booking.status === "Booked"
//                                                 ? "bg-yellow-100 text-yellow-800"
//                                                 : "bg-green-100 text-green-800"
//                                             }`}
//                                           >
//                                             {booking.status}
//                                           </span>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                           <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium">
//                                             View Details
//                                           </button>
//                                         </td>
//                                       </tr>
//                                     ))}
//                                   </tbody>
//                                 </table>

//                                 {/* Pagination */}
//                                 <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-center gap-2">
//                                   <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
//                                     Previous
//                                   </button>
//                                   <button className="px-3 py-1 text-sm bg-gray-200 rounded">
//                                     1
//                                   </button>
//                                   <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
//                                     2
//                                   </button>
//                                   <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
//                                     Next
//                                   </button>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
// import Layout from '@/components/layout/Layout';
import DataTable from "@/components/ui/DataTable";
import axiosInstance from "@/api/axiosInstance";
import { HotelBooking } from "@/types/admin";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTranslation } from "react-i18next";

// Mock data for hotel bookings
// const mockHotelBookings: HotelBooking[] = [
//   {
//     id: "1",
//     hotelId: "hotel-001",
//     customerName: "John Doe",
//     customerPhone: "9876543210",
//     customerEmail: "john.doe@example.com",
//     checkInDate: "2023-10-15",
//     checkOutDate: "2023-10-18",
//     amount: 450,
//     status: "Confirmed",
//   },
//   {
//     id: "2",
//     hotelId: "hotel-002",
//     customerName: "Jane Smith",
//     customerPhone: "8765432109",
//     customerEmail: "jane.smith@example.com",
//     checkInDate: "2023-10-20",
//     checkOutDate: "2023-10-25",
//     amount: 750,
//     status: "Completed",
//   },
//   {
//     id: "3",
//     hotelId: "hotel-003",
//     customerName: "Michael Johnson",
//     customerPhone: "7654321098",
//     customerEmail: "michael.j@example.com",
//     checkInDate: "2023-11-01",
//     checkOutDate: "2023-11-05",
//     amount: 600,
//     status: "Cancelled",
//   },
//   {
//     id: "4",
//     hotelId: "hotel-001",
//     customerName: "Sarah Williams",
//     customerPhone: "6543210987",
//     customerEmail: "sarah.w@example.com",
//     checkInDate: "2023-11-10",
//     checkOutDate: "2023-11-12",
//     amount: 350,
//     status: "Pending",
//   },
// ];

const HotelBookings = () => {
  const [bookings, setBookings] = useState<HotelBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<HotelBooking | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalHotelBookings, setTotalHotelBookings] = useState(0);
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axiosInstance.get(
          "/hotel-management/hotel-booking-details",
          {
            params: {
              page: currentPage,
              limit: pageSize,
              search: searchTerm,
            },
          }
        );
        const apiBookings = res.data?.data || [];
        setTotalHotelBookings(res.data?.total || 0);

        // Map API fields into our table format
        const mapped = apiBookings.map((b: any) => ({
          id: b.bookId,
          bookingId: b.bookingId,
          // id: b.bookingId,
          hotelId: b.hotelId,
          customerName: b.customerName,
          customerPhone: b.phone,
          customerEmail: b.email,
          checkInDate: new Date(b.checkInDate).toLocaleDateString(),
          checkOutDate: new Date(b.checkOutDate).toLocaleDateString(),
          amount: b.amount,
          status: b.status,
        }));

        setBookings(mapped);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      }
    };

    fetchBookings();
  }, [currentPage, pageSize, searchTerm]);

  const viewBookingDetails = (booking: HotelBooking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  const columns = [
    { key: "id", header: t("hotelBookings.tableHeaders.bookingId") },
    { key: "hotelId", header: t("hotelBookings.tableHeaders.hotelId") },
    {
      key: "customerName",
      header: t("hotelBookings.tableHeaders.customerName"),
    },
    {
      key: "customerPhone",
      header: t("hotelBookings.tableHeaders.customerPhone"),
    },
    {
      key: "customerEmail",
      header: t("hotelBookings.tableHeaders.customerEmail"),
    },
    { key: "checkInDate", header: t("hotelBookings.tableHeaders.checkInDate") },
    {
      key: "checkOutDate",
      header: t("hotelBookings.tableHeaders.checkOutDate"),
    },
    {
      key: "amount",
      header: t("hotelBookings.tableHeaders.amount"),
      render: (booking) => <span>${booking.amount.toFixed(2)}</span>,
    },
    {
      key: "status",
      header: t("hotelBookings.tableHeaders.status"),
      render: (booking) => <StatusBadge status={booking.status} />,
    },
    {
      key: "actions",
      header: t("hotelBookings.tableHeaders.actions"),
      render: (booking) => (
        <button
          className="action-button flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            viewBookingDetails(booking);
          }}
        >
          <Eye size={16} className="mr-1" />{" "}
          {t("hotelBookings.labels.viewDetails")}
        </button>
      ),
    },
  ];

  // const filterOptions = [
  //   {
  //     key: "status" as keyof HotelBooking,
  //     label: "Status",
  //     options: [
  //       { label: "Booked", value: "Booked" },
  //       { label: "Completed", value: "Completed" },
  //     ],
  //   },
  // ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t("hotelBookings.pageTitle")}</h1>
          <p className="text-gray-600">{t("hotelBookings.pageSubtitle")}</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={bookings}
        keyExtractor={(item) => item.id}
        filterable={true}
        searchable={true}
        searchPlaceholder="Search by name / email"
        exportable={true}
        paginate={true}
        pageSize={pageSize}
        currentPage={currentPage}
        totalItems={totalHotelBookings}
        onPageChange={(page) => setCurrentPage(page)}
        // filterOptions={filterOptions}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Booking Details Sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{t("hotelBookings.detailsSheet.title")}</SheetTitle>
          </SheetHeader>
          {selectedBooking && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm text-gray-500">
                    {t("hotelBookings.detailsSheet.bookingId")}
                  </h4>
                  <p className="font-medium">{selectedBooking.id}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">
                    {t("hotelBookings.detailsSheet.status")}
                  </h4>
                  <StatusBadge status={selectedBooking.status} />
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">
                    {t("hotelBookings.detailsSheet.hotelId")}
                  </h4>
                  {/* <p className="font-medium">{selectedBooking.hotelId}</p> */}
                  <p
                    className="font-medium truncate"
                    title={selectedBooking.hotelId}
                  >
                    {selectedBooking.hotelId}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">
                    {t("hotelBookings.detailsSheet.amount")}
                  </h4>
                  <p className="font-medium">
                    ${selectedBooking.amount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">
                  {t("hotelBookings.detailsSheet.customerInfo.title")}
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <h4 className="text-sm text-gray-500">
                      {t("hotelBookings.detailsSheet.customerInfo.name")}
                    </h4>
                    <p className="font-medium">
                      {selectedBooking.customerName}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">
                      {t("hotelBookings.detailsSheet.customerInfo.phone")}
                    </h4>
                    <p className="font-medium">
                      {selectedBooking.customerPhone}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">
                      {t("hotelBookings.detailsSheet.customerInfo.email")}
                    </h4>
                    <p className="font-medium">
                      {selectedBooking.customerEmail}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">
                  {t("hotelBookings.detailsSheet.stayDetails.title")}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-gray-500">
                      {t("hotelBookings.detailsSheet.stayDetails.checkInDate")}
                    </h4>
                    <p className="font-medium">{selectedBooking.checkInDate}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">
                      {t("hotelBookings.detailsSheet.stayDetails.checkOutDate")}
                    </h4>
                    <p className="font-medium">
                      {selectedBooking.checkOutDate}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">
                  {t("hotelBookings.detailsSheet.journey.title")}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("hotelBookings.detailsSheet.journey.message", {
                    date: new Date().toLocaleDateString(),
                  })}
                </p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default HotelBookings;
