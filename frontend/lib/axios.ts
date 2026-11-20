import axios from "axios";
import { clearSession, getSession } from "./memberAuth";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
  // FormData ke liye browser ko Content-Type boundary set karne dein.
  if (
    typeof FormData !== "undefined" &&
    config.data instanceof FormData
  ) {
    config.headers.delete("Content-Type");
  }

  // Existing authentication logic
  if (config.headers.has("Authorization")) return config;

  const session = getSession();
  const isAdminRequest = config.url?.startsWith("/api/admin/") ?? false;
  const isAdminSession = session?.user.role.toLowerCase() === "admin";

  const token = isAdminRequest
    ? isAdminSession
      ? session?.token
      : null
    : session?.token;

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      typeof window !== "undefined"
    ) {
      clearSession();
      window.location.replace("/login");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
