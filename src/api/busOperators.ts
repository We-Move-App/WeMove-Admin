import axiosInstance from "./axiosInstance";
import { BusOperator } from "@/types/admin";

export const fetchBusOperators = async (): Promise<BusOperator[]> => {
  const response = await axiosInstance.get("/bus-management/bus-operators");
  // console.log("Fetched Bus Operators:", response.data);

  const operators = response.data?.data?.data;

  if (!Array.isArray(operators)) {
    throw new Error("Invalid API response: 'data.data' is not an array");
  }

  return operators.map((user: any) => ({
    id: user._id,
    name: user.fullName,
    email: user.email,
    mobile: user.phoneNumber,
    status: user.verificationStatus,
    numberOfBuses: user.busCount || 0,
  }));
};
