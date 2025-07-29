import axiosInstance from "./axiosInstance";
import { BusOperator } from "@/types/admin";

export const fetchBusOperators = async (): Promise<BusOperator[]> => {
  const response = await axiosInstance.get("/bus-management/bus-operators");
  return response.data.data.users.map((user: any) => ({
    id: user._id,
    name: user.fullName,
    email: user.email,
    mobile: user.phoneNumber,
    status: user.verificationStatus,
    numberOfBuses: 0,
  }));
};
