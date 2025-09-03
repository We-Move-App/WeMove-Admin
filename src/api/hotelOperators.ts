import axiosInstance from "./axiosInstance";
import { HotelManager } from "@/types/admin";

// export const fetchHotelManagers = async (): Promise<HotelManager[]> => {
//   const response = await axiosInstance.get("/hotel-management/hotel-managers");
//   return response.data.data.users.map((user: any) => ({
//     id: user._id,
//     name: user.fullName,
//     email: user.email,
//     mobile: user.phoneNumber,
//     status: user.verificationStatus,
//   }));
// };

export const fetchHotelManagers = async (): Promise<HotelManager[]> => {
  const response = await axiosInstance.get("/hotel-management/hotel-managers");

  const users = response.data?.data || []; // ← access correctly

  return users.map((user: any) => ({
    id: user._id,
    name: user.fullName,
    email: user.email,
    mobile: user.phoneNumber,
    status: user.verificationStatus,
  }));
};
