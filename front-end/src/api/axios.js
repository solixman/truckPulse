import axios from "axios";
import { notify } from "../services/notificationService";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Network error";
    notify(msg, "error");
    return Promise.reject(err);
  }
);

export default api;
