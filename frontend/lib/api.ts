import { clearSession, getSession } from "./memberAuth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

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

// Admin logout only
export function clearAuth(): void {
  if (typeof window === "undefined") return;

  clearSession();
}

type ApiOptions = {
  method?: string;
  body?: string;
};

async function request(
  path: string,
  options: ApiOptions,
  role: "admin" | "member"
) {
  const token = role === "admin" ? getAdminToken() : getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(API_URL + path, {
    method: options.method || "GET",
    body: options.body,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401 && typeof window !== "undefined") {
    clearSession();
    window.location.replace("/login");
  }

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
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
