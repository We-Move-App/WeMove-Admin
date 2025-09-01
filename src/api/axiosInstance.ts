import axios from "axios";

const axiosInstance = axios.create({
  // Deployed URL
  baseURL: "http://139.59.20.155:8000/api/v1/admin",
  // Local URL
  // baseURL:
  //   "https://accomplish-local-attractions-thread.trycloudflare.com/api/v1/admin",

  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

console.log("Stored token:", localStorage.getItem("accessToken"));

export default axiosInstance;
