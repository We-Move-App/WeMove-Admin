import axiosInstance from "./axiosInstance";

interface LoginPayload {
  username: string;
  password: string;
}

export const loginUser = async (data: LoginPayload) => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
};
