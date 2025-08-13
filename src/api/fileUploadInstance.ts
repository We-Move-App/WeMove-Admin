import axios from "axios";

const fileUploadInstance = axios.create({
  baseURL: "http://139.59.20.155:8000/api/v1",
});

fileUploadInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default fileUploadInstance;
