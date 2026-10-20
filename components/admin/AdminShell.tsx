"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { getToken, clearAuth } from "@/lib/api";

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
  chevRight: <path d="m9 6 6 6-6 6" />,
  collapse: <path d="m11 7-5 5 5 5M18 7l-5 5 5 5" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  logout: <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M16 8l4 4-4 4M20 12H9" />,
  building: (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="2" />
      <path d="M9 8h2M13 8h2M9 12h2M13 12h2M10 20.5v-4h4v4" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
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

const nav: { group: string; items: { label: string; href: string; icon: IconName }[] }[] = [
  { group: "Overview", items: [{ label: "Dashboard", href: "/admin/dashboard", icon: "dashboard" }] },
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
  { group: "System", items: [{ label: "Settings", href: "/admin/settings", icon: "settings" }] },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("Admin");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // login check: token na ho to login page par bhej do
  useEffect(() => {
    if (!getToken()) {
      router.replace("/admin/login");
      return;
    }
    // localStorage read + setState ko microtask me daala taake effect ke
    // andar synchronously setState na ho (react-hooks/set-state-in-effect)
    queueMicrotask(() => {
      try {
        const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
        if (raw) {
          const u = JSON.parse(raw);
          setName(u.name || u.fullName || "Admin");
        }
      } catch {
        /* ignore */
      }
      setReady(true);
    });
  }, [router]);

  function logout() {
    clearAuth();
    router.push("/admin/login");
  }

  if (!ready) return <div className="min-h-screen bg-[#faf7f2]" />;

  const hide = collapsed ? "lg:hidden" : "";

  return (
    <div className="flex min-h-screen bg-[#faf7f2] text-[#800020]">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

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
              <span className="block text-base font-bold leading-tight text-[#800020]">GymMaster Pro</span>
              <span className="block text-[10px] font-semibold tracking-[0.2em] text-[#800020]/55">
                ADMIN PANEL
              </span>
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

        <div className="border-t border-[#800020]/10 p-3">
          <button
            onClick={logout}
            title="Logout"
            className={`flex w-full items-center gap-3.5 rounded-xl px-3.5 py-3 text-[15px] font-semibold text-[#800020] transition hover:bg-[#800020]/10 ${
              collapsed ? "lg:justify-center" : ""
            }`}
          >
            <Icon name="logout" className="h-5 w-5 shrink-0" />
            <span className={hide}>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[#800020]/10 bg-[#faf7f2]/85 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-xl bg-white p-2.5 text-[#800020] shadow-sm ring-1 ring-[#800020]/10 lg:hidden"
          >
            <Icon name="menu" />
          </button>

          <div className="ml-auto flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#800020] to-[#c0405a] text-sm font-bold text-white">
              {name.charAt(0).toUpperCase()}
            </span>
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-sm font-bold text-[#800020]">{name}</span>
              <span className="block text-xs text-[#800020]/60">Gym Admin</span>
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}