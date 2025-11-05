import axiosInstance from "./axiosInstance";
import { HotelManager } from "@/types/admin";

export const fetchHotelManagers = async (
  page: number,
  limit: number,
  searchTerm?: string,
  status?: string
): Promise<{ data: HotelManager[]; total: number }> => {
  const response = await axiosInstance.get("/hotel-management/hotel-managers", {
    params: { page, limit, search: searchTerm, filter: status },
  });

  const users = response.data?.data || [];
  const total = response.data?.total || 0;

  return {
    data: users.map((user: any) => ({
      id: user._id,
      name: user.fullName,
      email: user.email,
      mobile: user.phoneNumber,
      status: user.verificationStatus,
      balance: user?.balance,
      batchVerified: user.batchVerified ?? false,
    })),
    total,
  };
};
