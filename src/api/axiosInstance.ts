import axios from "axios";
import i18n from "i18next";

const axiosInstance = axios.create({
  baseURL: "http://139.59.20.155:8000/api/v1/admin",
  // baseURL: "https://unified-polyester-load-know.trycloudflare.com/api/v1/admin",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers["ln"] = i18n.language;

  return config;
});

export default axiosInstance;
