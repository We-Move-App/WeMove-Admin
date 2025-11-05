import axiosInstance from "./axiosInstance";
import { BusOperator } from "@/types/admin";

export const fetchBusOperators = async (
  page: number,
  limit: number,
  searchTerm?: string,
  status?: string
): Promise<{ data: BusOperator[]; total: number }> => {
  const response = await axiosInstance.get("/bus-management/bus-operators", {
    params: {
      page,
      limit,
      search: searchTerm,
      filter: status,
    },
  });

  const operators = response.data?.data;
  const total = response.data?.total || 0;

  if (!Array.isArray(operators)) {
    throw new Error("Invalid API response: 'data' is not an array");
  }

  return {
    total,
    data: operators.map((user: any) => ({
      id: user._id,
      name: user.fullName,
      email: user.email,
      mobile: user.phoneNumber,
      status: user.verificationStatus,
      numberOfBuses: user.busCount || 0,
      balance: user.balance,
      companyName: user.companyName || "",
      batchVerified: user.batchVerified ?? false,
    })),
  };
};
