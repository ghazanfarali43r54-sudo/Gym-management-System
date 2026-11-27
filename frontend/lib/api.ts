import axios, { type Method } from "axios";
import axiosClient, { API_URL } from "./axios";
import { clearSession, getSession } from "./memberAuth";

export { API_URL };

// Token for the active role-specific session.
export function getToken(): string | null {
  return getSession()?.token ?? null;
}

// Admin token only
export function getAdminToken(): string | null {
  const session = getSession();
  return session?.user.role.toLowerCase() === "admin" ? session.token : null;
}

// Clear the current admin session
export function clearAdminSession(): void {
  if (typeof window === "undefined") return;

  clearSession();
}

type ApiOptions = {
  method?: string;
  body?: string | FormData;
};

async function request(
  path: string,
  options: ApiOptions,
  role: "admin" | "member"
) {
  const token = role === "admin" ? getAdminToken() : getToken();

  try {
    const response = await axiosClient.request({
      url: path,
      method: (options.method || "GET") as Method,
      data: options.body,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    return {
      ok: true,
      status: response.status,
      data: response.data || {},
    };
  } catch (error: unknown) {
    if (!axios.isAxiosError(error) || !error.response) throw error;

    return {
      ok: false,
      status: error.response.status,
      data: error.response.data || {},
    };
  }
}

// Automatically use the correct token for admin API routes
export function apiFetch(path: string, options: ApiOptions = {}) {
  const isAdminRequest = path.startsWith("/api/admin/");
  return request(path, options, isAdminRequest ? "admin" : "member");
}

// Explicit admin request
export function adminApiFetch(path: string, options: ApiOptions = {}) {
  return request(path, options, "admin");
}
