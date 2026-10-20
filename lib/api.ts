export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

export function clearAuth() {
  for (const s of [localStorage, sessionStorage]) {
    s.removeItem("token");
    s.removeItem("user");
  }
}

export async function api(
  path: string,
  options: { method?: string; body?: string } = {}
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    method: options.method,
    body: options.body,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (res.status === 401) {
    clearAuth();
   // eslint-disable-next-line @next/next/no-location-assign-relative-destination
window.location.href = "/admin/login";
    throw new Error(data.message || "Session expire ho gaya");
  }
  if (!res.ok) throw new Error(data.message || "Request failed");

  return data;
}