import { Routes, Route } from "react-router-dom";
import ProtectedLayout from "@/components/layout/ProtectedLayout"

// Pages
import Login from "@/pages/login/Login";
import NotFound from "@/pages/NotFound";

// Dashboard
import Dashboard from "@/pages/Dashboard";

// Bus
import BusOperators from "@/pages/bus/BusOperators";
import BusOperatorDetails from "@/pages/bus/BusOperatorDetails";
import BusList from "@/pages/bus/BusList";
import BusBookings from "@/pages/bus/BusBookings";
import BusBookingDetails from "@/pages/bus/BusBookingDetails";

// Hotel
import HotelManagers from "@/pages/hotel/HotelManagers";
import HotelManagerDetails from "@/pages/hotel/HotelManagerDetails";
import HotelBookings from "@/pages/hotel/HotelBookings";

// Taxi
import TaxiDrivers from "@/pages/taxi/TaxiDrivers";
import TaxiDriverDetails from "@/pages/taxi/TaxiDriverDetails";
import TaxiBookings from "@/pages/taxi/TaxiBookings";

// Bike
import BikeRiders from "@/pages/bike/BikeRiders";
import BikeRiderDetails from "@/pages/bike/BikeRiderDetails";
import BikeBookings from "@/pages/bike/BikeBookings";

// Customers
import CustomerManagement from "@/pages/customers/CustomerManagement";
import CustomerDetails from "@/pages/customers/CustomerDetails";

// Users
import UserManagement from "@/pages/users/UserManagement";
import UserDetails from "@/pages/users/UserDetails";

// Misc
import CommissionManagement from "@/pages/commission/CommissionManagement";
import Coupons from "@/pages/coupons/Coupons";
import Wallet from "@/pages/wallet/Wallet";
import NotificationsManagement from "@/pages/notifications/NotificationsManagement";
import Settings from "@/pages/settings/Settings";

const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/" element={<Login />} />

    {/* Protected routes */}
    <Route element={<ProtectedLayout />}>
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Bus Management */}
      <Route path="/bus-management/operators" element={<BusOperators />} />
      <Route path="/bus-management/operators/:id" element={<BusOperatorDetails />} />
      <Route path="/bus-management/operators/:operatorId/buses" element={<BusList />} />
      <Route path="/bus-management/bookings" element={<BusBookings />} />
      <Route path="/bus-management/bookings/:bookingId" element={<BusBookingDetails />} />

      {/* Hotel Management */}
      <Route path="/hotel-management/managers" element={<HotelManagers />} />
      <Route path="/hotel-management/managers/:id" element={<HotelManagerDetails />} />
      <Route path="/hotel-management/bookings" element={<HotelBookings />} />

      {/* Taxi Management */}
      <Route path="/taxi-management/drivers" element={<TaxiDrivers />} />
      <Route path="/taxi-management/drivers/:id" element={<TaxiDriverDetails />} />
      <Route path="/taxi-management/bookings" element={<TaxiBookings />} />

      {/* Bike Management */}
      <Route path="/bike-management/riders" element={<BikeRiders />} />
      <Route path="/bike-management/riders/:id" element={<BikeRiderDetails />} />
      <Route path="/bike-management/bookings" element={<BikeBookings />} />

      {/* Customer Management */}
      <Route path="/customer-management" element={<CustomerManagement />} />
      <Route path="/customer-management/:customerId" element={<CustomerDetails />} />

      {/* User Management */}
      <Route path="/user-management" element={<UserManagement />} />
      <Route path="/user-management/:userId" element={<UserDetails />} />

      {/* Misc */}
      <Route path="/commission-management" element={<CommissionManagement />} />
      <Route path="/coupons" element={<Coupons />} />
      <Route path="/wallet" element={<Wallet />} />
      <Route path="/notifications" element={<NotificationsManagement />} />
      <Route path="/settings" element={<Settings />} />
    </Route>

    {/* 404 Fallback */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
