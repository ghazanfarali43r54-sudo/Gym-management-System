"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { apiFetch, clearAuth, getToken } from "@/lib/api";

/* ================= ICONS ================= */

const paths = {
  dashboard: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </>
  ),
  members: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5" />
      <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c2 .7 3.5 2.3 3.5 5.2" />
    </>
  ),
  plans: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3 10h18M7 15h3" />
    </>
  ),
  attendance: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  trainers: <path d="M3 10v4M6.5 7v10M17.5 7v10M21 10v4M6.5 12h11" />,
  classes: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </>
  ),
  schedule: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  payments: (
    <>
      <path d="M3 7h15a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7Z" />
      <path d="M3 7l2-3h11" />
      <circle cx="16.5" cy="13.5" r="1" />
    </>
  ),
  reports: <path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1" />
    </>
  ),
  bell: (
    <>
      <path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4l2-2Z" />
      <path d="M10 21h4" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  chevDown: <path d="m6 9 6 6 6-6" />,
  chevRight: <path d="m9 6 6 6-6 6" />,
  collapse: <path d="m11 7-5 5 5 5M18 7l-5 5 5 5" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  logout: <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M10 8l-4 4 4 4M6 12h11" />,
  building: (
    <path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M16 9h2a2 2 0 0 1 2 2v10M3 21h18M8 7h4M8 11h4M8 15h4" />
  ),
  check: <path d="m5 12 4 4 10-10" />,
  save: (
    <>
      <path d="M5 4h11l3 3v13H5V4Z" />
      <path d="M8 4v5h7V4M8 20v-6h8v6" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 11a8 8 0 1 0-2.3 6" />
      <path d="M20 5v6h-6" />
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16.5v.5" />
    </>
  ),
};

export type IconName = keyof typeof paths;

export function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {paths[name]}
    </svg>
  );
}

/* ================= SIDEBAR LINKS ================= */

const nav: { group: string; items: { label: string; href: string; icon: IconName }[] }[] = [
  {
    group: "Overview",
    items: [{ label: "Dashboard", href: "/admin/dashboard", icon: "dashboard" }],
  },
  {
    group: "Members",
    items: [
      { label: "Members", href: "/admin/members", icon: "members" },
      { label: "Memberships", href: "/admin/memberships", icon: "plans" },
      { label: "Attendance", href: "/admin/attendance", icon: "attendance" },
    ],
  },
  {
    group: "Training",
    items: [
      { label: "Trainers", href: "/admin/trainers", icon: "trainers" },
      { label: "Classes", href: "/admin/classes", icon: "classes" },
      { label: "Schedule", href: "/admin/schedule", icon: "schedule" },
    ],
  },
  {
    group: "Finance",
    items: [
      { label: "Payments", href: "/admin/payments", icon: "payments" },
      { label: "Reports", href: "/admin/reports", icon: "reports" },
    ],
  },
  {
    group: "System",
    items: [{ label: "Settings", href: "/admin/settings", icon: "settings" }],
  },
];

type AdminUser = { id: string; name: string; email: string; role: string };

/* ================= SHELL ================= */

export default function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [connectError, setConnectError] = useState(false);

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Page khulte hi check karo ke banda logged-in admin hai ya nahi
  async function checkLogin() {
    setChecking(true);
    setConnectError(false);

    if (!getToken()) {
      router.replace("/admin/login");
      return;
    }

    try {
      const { ok, data } = await apiFetch("/api/auth/me");
      if (!ok || data.user?.role !== "admin") {
        clearAuth();
        router.replace("/admin/login");
        return;
      }
      setUser(data.user);
      setChecking(false);
    } catch {
      setConnectError(true);
        const [attempt, setAttempt] = useState(0);
      setChecking(false);
    }
  }

  useEffect(() => {
    checkLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function logout() {
    clearAuth();
    router.replace("/admin/login");
  }

  /* ---------- loading / error screens ---------- */

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf7f2]">
        <div className="flex flex-col items-center gap-4 text-[#800020]">
          <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#800020]/20 border-t-[#800020]" />
          <p className="text-sm font-semibold">Checking login...</p>
        </div>
      </div>
    );
  }

  if (connectError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf7f2] p-6">
        <div className="max-w-sm rounded-3xl bg-white p-8 text-center shadow-lg ring-1 ring-[#800020]/10">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#800020]/10 text-[#800020]">
            <Icon name="alert" />
          </span>
          <h2 className="text-lg font-bold text-[#800020]">Server se connect nahi ho paya</h2>
          <p className="mt-2 text-sm text-[#800020]/65">Backend chal raha hai? Check karke dobara try karo.</p>
          <button
            onClick={checkLogin}
            className="mt-5 rounded-xl bg-[#800020] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#5e0018]"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const hide = collapsed ? "lg:hidden" : "";

  return (
    <div className="flex min-h-screen bg-[#faf7f2] text-[#800020]">
      {/* ---------- mobile overlay ---------- */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden />
      )}

      {/* ---------- sidebar ---------- */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col border-r border-[#800020]/10 bg-white transition-all duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:w-[88px]" : "lg:w-[272px]"}`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-[#800020]/10 px-5 py-5">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#800020] text-white shadow-md shadow-[#800020]/25">
              <Icon name="trainers" />
            </span>
            <span className={hide}>
              <span className="block text-base font-bold leading-tight">GymMaster Pro</span>
              <span className="block text-[10px] font-semibold tracking-[0.2em] text-[#800020]/55">ADMIN PANEL</span>
            </span>
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Collapse sidebar"
            className={`hidden rounded-lg p-1.5 text-[#800020]/70 hover:bg-[#800020]/10 lg:block ${
              collapsed ? "lg:hidden" : ""
            }`}
          >
            <Icon name="collapse" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              aria-label="Expand sidebar"
              className="mx-auto mb-4 hidden rounded-lg p-1.5 text-[#800020]/70 hover:bg-[#800020]/10 lg:block"
            >
              <Icon name="chevRight" />
            </button>
          )}

          {nav.map((g) => (
            <div key={g.group} className="mb-5">
              <p className={`mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#800020]/50 ${hide}`}>
                {g.group}
              </p>
              <ul className="space-y-1">
                {g.items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        title={item.label}
                        className={`flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-[15px] font-semibold transition ${
                          active
                            ? "bg-[#800020] text-white shadow-md shadow-[#800020]/25"
                            : "text-[#800020] hover:bg-[#800020]/10"
                        } ${collapsed ? "lg:justify-center" : ""}`}
                      >
                        <Icon name={item.icon} className="h-5 w-5 shrink-0" />
                        <span className={hide}>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className={`border-t border-[#800020]/10 px-5 py-4 text-center text-xs text-[#800020]/60 ${hide}`}>
          Powered by <b className="text-[#800020]">GymMaster Pro</b> v1.0
        </div>
      </aside>

      {/* ---------- right side ---------- */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[#800020]/10 bg-[#faf7f2]/85 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex flex-1 items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="rounded-xl bg-white p-2.5 shadow-sm ring-1 ring-[#800020]/10 lg:hidden"
            >
              <Icon name="menu" />
            </button>

            <label className="hidden max-w-md flex-1 items-center gap-3 rounded-2xl bg-white px-4 py-2.5 shadow-sm ring-1 ring-[#800020]/10 focus-within:ring-2 focus-within:ring-[#800020] sm:flex">
              <Icon name="search" className="h-4 w-4 text-[#800020]/60" />
              <input
                type="text"
                placeholder="Search members, trainers, classes..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#800020]/40"
              />
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button
              aria-label="Notifications"
              className="relative rounded-xl bg-white p-2.5 shadow-sm ring-1 ring-[#800020]/10 transition hover:bg-[#800020]/5"
            >
              <Icon name="bell" />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#c0405a] ring-2 ring-white" />
            </button>

            <span className="hidden h-8 w-px bg-[#800020]/15 sm:block" />

            {/* profile + logout */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-3 rounded-xl py-1 pl-1 pr-2 transition hover:bg-[#800020]/5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#800020] to-[#c0405a] text-sm font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase() ?? "A"}
                </span>
                <span className="hidden text-left leading-tight sm:block">
                  <span className="block text-sm font-bold">{user?.name}</span>
                  <span className="block text-xs capitalize text-[#800020]/60">{user?.role}</span>
                </span>
                <Icon name="chevDown" className="hidden h-4 w-4 text-[#800020]/60 sm:block" />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} aria-hidden />
                  <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-[#800020]/10">
                    <div className="border-b border-[#800020]/10 px-3 py-2.5">
                      <p className="text-sm font-bold">{user?.name}</p>
                      <p className="truncate text-xs text-[#800020]/60">{user?.email}</p>
                    </div>
                    <button
                      onClick={logout}
                      className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-[#800020]/10"
                    >
                      <Icon name="logout" className="h-[18px] w-[18px]" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}