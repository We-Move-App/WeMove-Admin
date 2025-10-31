export interface Hotel {
  id: string;
  hotelName: string;
  hotelId: string;
  ownerName: string;
  idCardNo: string;
  phone: string;
  email: string;
  jointDate: string;
  licenseNumber: string;
  licenseRenewalDate: string;
  licenseType: string;
  status: "Active" | "Block";
}

export interface Booking {
  id: string;
  bookingId: string;
  hotelId: string;
  customerName: string;
  phone: string;
  email: string;
  checkInDate: string;
  checkOutDate: string;
  amount: number;
  status: "Booked" | "Completed";
}
