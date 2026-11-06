
const REQUEST_KEY = "gym_request";

// Keep the token and its matching user together so a browser cannot accidentally
// combine credentials from different roles. Remember-me controls persistence.
const SESSION_KEY = "gym_session";
export const AUTH_CHANGE_EVENT = "gym-auth-change";
const LEGACY_KEYS = [
  ["member_token", "member_user"],
  ["trainer_token", "trainer_user"],
  ["admin_token", "admin_user"],
] as const;

export type MemberUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  photo?: string;
  dashboardPath?: string;
};

export type SavedRequest = {
  id: string;
  email: string;
};

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function getStoredSession(): { token: string; user: MemberUser } | null {
  if (typeof window === "undefined") return null;
  for (const storage of [localStorage, sessionStorage]) {
    try {
      const raw = storage.getItem(SESSION_KEY);
      if (raw) {
        const session = JSON.parse(raw) as { token?: string; user?: MemberUser };
        if (session.token && session.user?.id && session.user.role) {
          return { token: session.token, user: session.user };
        }
        storage.removeItem(SESSION_KEY);
      }
    } catch {
      storage.removeItem(SESSION_KEY);
    }
  }

  // One-time migration for sessions created by the old role-specific logins.
  for (const [tokenKey, userKey] of LEGACY_KEYS) {
    for (const storage of [localStorage, sessionStorage]) {
      const token = storage.getItem(tokenKey);
      let user: MemberUser | null = null;
      try {
        const raw = storage.getItem(userKey);
        user = raw ? (JSON.parse(raw) as MemberUser) : null;
      } catch {
        user = null;
      }
      if (token && user?.id && user.role) {
        saveStoredSession(token, user, storage === localStorage);
        clearLegacySessions();
        return { token, user };
      }
    }
  }
  return null;
}

function saveStoredSession(token: string, user: MemberUser, remember = true) {
  if (typeof window === "undefined") return;
  clearLegacySessions();
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  (remember ? localStorage : sessionStorage).setItem(
    SESSION_KEY,
    JSON.stringify({ token, user })
  );
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

function clearLegacySessions() {
  if (typeof window === "undefined") return;
  for (const [tokenKey, userKey] of LEGACY_KEYS) {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
    sessionStorage.removeItem(tokenKey);
    sessionStorage.removeItem(userKey);
  }
}

function clearStoredSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  clearLegacySessions();
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

// Registration request
export function getSavedRequest(): SavedRequest | null {
  const request = read<SavedRequest>(REQUEST_KEY);
  return request?.id ? request : null;
}

export function saveRequest(request: SavedRequest) {
  if (typeof window !== "undefined") {
    localStorage.setItem(REQUEST_KEY, JSON.stringify(request));
  }
}

export function clearRequest() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(REQUEST_KEY);
  }
}

// Member session
export function getMember() {
  const session = getStoredSession();
  return session?.user.role.toLowerCase() === "member" ? session : null;
}

export function saveMember(token: string, user: MemberUser, remember = true) {
  saveStoredSession(token, user, remember);
}

export function clearMember() {
  if (getStoredSession()?.user.role.toLowerCase() === "member") clearStoredSession();

  // Clear settings cache when member/admin logs out
  // This ensures other tabs refresh on next operation
  if (typeof window !== "undefined") {
    localStorage.removeItem("site_settings");
  }
}

// Trainer session
export function getTrainer() {
  const session = getStoredSession();
  return session?.user.role.toLowerCase() === "trainer" ? session : null;
}

export function saveTrainer(token: string, user: MemberUser, remember = true) {
  saveStoredSession(token, user, remember);
}

export function clearTrainer() {
  if (getStoredSession()?.user.role.toLowerCase() === "trainer") clearStoredSession();
}

// Admin session
export function getAdminSession() {
  const session = getStoredSession();
  return session?.user.role.toLowerCase() === "admin" ? session : null;
}

export function saveAdmin(token: string, user: MemberUser, remember = true) {
  saveStoredSession(token, user, remember);
}

export function clearAdmin() {
  if (getStoredSession()?.user.role.toLowerCase() === "admin") clearStoredSession();
}

// Save according to role
export function saveSession(token: string, user: MemberUser, remember = true) {
  const role = user.role?.toLowerCase();

  if (!role || !["admin", "trainer", "member"].includes(role)) {
    throw new Error(`Unsupported user role: ${user.role}`);
  }
  saveStoredSession(token, { ...user, role }, remember);
}

export function getSession() {
  return getStoredSession();
}

export function clearSession() {
  clearStoredSession();
}

// Role-aware logout keeps unrelated sessions intact and returns to one login.
export function clearAuth(role: string) {
  if (role === "admin") {
    clearAdmin();
  } else if (role === "trainer") {
    clearTrainer();
  } else {
    clearMember();
  }
  if (typeof window !== "undefined") {
    window.location.replace("/login");
  }
}
