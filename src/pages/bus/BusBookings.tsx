
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Layout from '@/components/layout/Layout';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import { busBookings } from '@/data/mockData';
import { BusBooking } from '@/types/admin';
import { Eye } from 'lucide-react';

const BusBookings = () => {
  const navigate = useNavigate();

  const columns = [
    { key: 'id' as keyof BusBooking, header: 'ID' },
    { key: 'busRegistrationNumber' as keyof BusBooking, header: 'Bus Reg. No.' },
    { key: 'customerName' as keyof BusBooking, header: 'Customer Name' },
    { key: 'customerPhone' as keyof BusBooking, header: 'Phone' },
    { key: 'customerEmail' as keyof BusBooking, header: 'Email' },
    { key: 'from' as keyof BusBooking, header: 'From' },
    { key: 'to' as keyof BusBooking, header: 'To' },
    { key: 'journeyDate' as keyof BusBooking, header: 'Journey Date' },
    {
      key: 'amount' as keyof BusBooking,
      header: 'Amount',
      render: (booking: BusBooking) => <span>₹{booking.amount}</span>
    },
    {
      key: 'status' as keyof BusBooking,
      header: 'Status',
      render: (booking: BusBooking) => <StatusBadge status={booking.status} />
    },
    {
      key: 'actions' as 'actions',
      header: 'Actions',
      render: (booking: BusBooking) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/bus-management/bookings/${booking.id}`);
          }}
          className="action-button flex items-center"
        >
          <Eye size={16} className="mr-1" />
          View Details
        </button>
      )
    }
  ];

  const filterOptions = [
    {
      key: 'status' as keyof BusBooking,
      label: 'Status',
      options: [
        { label: 'Completed', value: 'Completed' },
        { label: 'Upcoming', value: 'Upcoming' },
        { label: 'Cancelled', value: 'Cancelled' }
      ]
    },
    {
      key: 'from' as keyof BusBooking,
      label: 'From',
      options: [
        { label: 'Mumbai', value: 'Mumbai' },
        { label: 'Delhi', value: 'Delhi' },
        { label: 'Bangalore', value: 'Bangalore' },
        { label: 'Chennai', value: 'Chennai' }
      ]
    },
    {
      key: 'to' as keyof BusBooking,
      label: 'To',
      options: [
        { label: 'Pune', value: 'Pune' },
        { label: 'Jaipur', value: 'Jaipur' },
        { label: 'Chennai', value: 'Chennai' },
        { label: 'Hyderabad', value: 'Hyderabad' },
        { label: 'Chandigarh', value: 'Chandigarh' }
      ]
    }
  ];

  const handleRowClick = (booking: BusBooking) => {
    navigate(`/bus-management/bookings/${booking.id}`);
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Bus Bookings</h1>
        <p className="text-gray-600">View and manage all bus bookings</p>
      </div>

      <DataTable
        columns={columns}
        data={busBookings}
        keyExtractor={(item) => item.id}
        onRowClick={handleRowClick}
        filterOptions={filterOptions}
      />
    </>
  );
};

export default BusBookings;
