"use client";

import { useParams, useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSettings } from "@/lib/SettingsContext";
import { formatHours } from "@/lib/formatHours";
import { getTrainer, clearTrainer } from "@/lib/memberAuth";


type IconName =
  | "dashboard"
  | "members"
  | "schedule"
  | "attendance"
  | "workout"
  | "profile"
  | "settings"
  | "logout"
  | "menu"
  | "bell"
  | "search"
  | "refresh"
  | "calendar"
  | "chevronDown"
  | "chevronRight"
  | "users"
  | "clock"
  | "check"
  | "plus"
  | "activity"
  | "target"
  | "fire"
  | "dumbbell";

/* =========================================================
   ICON
========================================================= */

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: IconName;
  className?: string;
}) {
  const icons: Record<IconName, React.ReactNode> = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),

    members: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),

    schedule: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </>
    ),

    attendance: (
      <>
        <path d="M20 6 9 17l-5-5" />
      </>
    ),

    workout: (
      <>
        <path d="M6 4v16M18 4v16M3 8v8M21 8v8M6 12h12" />
      </>
    ),

    profile: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),

    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.42 1.42-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2v-.08A1.7 1.7 0 0 0 12.38 18.4a1.7 1.7 0 0 0-1.88.34l-.06.06-1.42 1.42.06-.06A1.7 1.7 0 0 0 9.42 15 1.7 1.7 0 0 0 7.86 14H7.8v-2h.06a1.7 1.7 0 0 0 1.56-1.03 1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.42-1.42.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 13.4 6.46V6h2v.46a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.42 1.42-.06.06a1.7 1.7 0 0 0-.34 1.88A1.7 1.7 0 0 0 20.94 12H21v2h-.06A1.7 1.7 0 0 0 19.4 15Z" />
      </>
    ),

    logout: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="m16 17 5-5-5-5" />
        <path d="M21 12H9" />
      </>
    ),

    menu: (
      <>
        <path d="M4 6h16M4 12h16M4 18h16" />
      </>
    ),

    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),

    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),

    refresh: (
      <>
        <path d="M20 11a8.1 8.1 0 0 0-15.5-3M4 4v4h4" />
        <path d="M4 13a8.1 8.1 0 0 0 15.5 3M20 20v-4h-4" />
      </>
    ),

    calendar: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </>
    ),

    chevronDown: <path d="m6 9 6 6 6-6" />,

    chevronRight: <path d="m9 18 6-6-6-6" />,

    users: (
      <>
        <circle cx="9" cy="7" r="4" />
        <path d="M2 21a7 7 0 0 1 14 0" />
        <path d="M17 4a4 4 0 0 1 0 8" />
        <path d="M22 21a7 7 0 0 0-4-6.32" />
      </>
    ),

    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),

    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </>
    ),

    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),

    activity: (
      <>
        <path d="M3 12h4l2-7 4 14 2-7h6" />
      </>
    ),

    target: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),

    fire: (
      <>
        <path d="M12 22c4.5 0 8-3.1 8-7.5 0-3.1-1.7-5.9-4.6-8.5.2 2.3-.7 3.8-2.1 4.9.1-3.8-1.9-6.8-4.8-8.9.3 3.9-2.5 6.1-3.5 9.2C3.7 15.9 6.8 22 12 22Z" />
      </>
    ),

    dumbbell: (
      <>
        <path d="M6 4v16M18 4v16M3 8v8M21 8v8M6 12h12" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {icons[name]}
    </svg>
  );
}

/* =========================================================
   DATA
========================================================= */
const navGroups = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "#",
        icon: "dashboard" as IconName,
      },
    ],
  },
  {
    title: "Training",
    items: [
      {
        label: "My Members",
        href: "/trainer/members",
        icon: "members" as IconName,
      },
      {
        label: "Schedule",
        href: "/trainer/schedule",
        icon: "schedule" as IconName,
      },
      {
        label: "Attendance",
        href: "/trainer/attendance",
        icon: "attendance" as IconName,
      },
      {
        label: "Workouts",
        href: "/trainer/workouts",
        icon: "workout" as IconName,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        label: "Profile",
        href: "/trainer/profile",
        icon: "profile" as IconName,
      },
      {
        label: "Settings",
        href: "/trainer/settings",
        icon: "settings" as IconName,
      },
    ],
  },
];

const stats = [
  {
    title: "My Members",
    value: "48",
    change: "+8%",
    positive: true,
    icon: "members" as IconName,
    className: "blue",
  },
  {
    title: "Today's Sessions",
    value: "06",
    change: "+12%",
    positive: true,
    icon: "calendar" as IconName,
    className: "purple",
  },
  {
    title: "Attendance",
    value: "92%",
    change: "+5%",
    positive: true,
    icon: "attendance" as IconName,
    className: "orange",
  },
];

const memberDistribution = [
  { label: "Weight Loss", value: 32, color: "#7a1226" },
  { label: "Strength Training", value: 24, color: "#a63446" },
  { label: "Muscle Building", value: 20, color: "#c9606f" },
  { label: "Cardio", value: 14, color: "#d9a0a8" },
  { label: "General Fitness", value: 10, color: "#c2a27c" },
];

/* =========================================================
   PAGE
========================================================= */

export default function TrainerDashboard() {
  const router = useRouter();

  const params = useParams();
  const trainerId = params.id as string;

  const [authChecking, setAuthChecking] = useState(true);
  const [trainerName, setTrainerName] = useState("Trainer");
  const [trainerEmail, setTrainerEmail] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const { settings } = useSettings();
  const gymName = settings.general.gymName || "Gym Fetness";
  const tagline = settings.general.tagline;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [period, setPeriod] = useState("7D");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadTrainer() {
      try {
        const stored = getTrainer() as any;
        const token = stored?.token;

        if (!token) {
          clearTrainer();
          router.replace("/login");
          return;
        }

        const storedName =
          stored?.name || stored?.trainer?.name || stored?.user?.name;
        const storedEmail =
          stored?.email || stored?.trainer?.email || stored?.user?.email;

        if (mounted) {
          if (storedName) setTrainerName(storedName);
          if (storedEmail) setTrainerEmail(storedEmail);
        }

        if (!trainerId) return;

        const res = await fetch(
          `${API_URL}/api/admin/trainers/${trainerId}/dashboard`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Unable to load trainer");
        }

        if (mounted) {
          setTrainerName(data.trainer?.name || storedName || "Trainer");
          setTrainerEmail(data.trainer?.email || storedEmail || "");
        }
      } catch (error) {
        console.error("Trainer dashboard error:", error);
      } finally {
        if (mounted) {
          setAuthChecking(false);
        }
      }
    }

    loadTrainer();

    return () => {
      mounted = false;
    };
  }, [trainerId, router]);

  useEffect(() => {
    if (!profileOpen) {
      return;
    }

    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as HTMLElement;

      if (!target.closest("[data-trainer-profile]")) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [profileOpen]);

  function handleLogout() {
    setProfileOpen(false);
    router.replace("/admin/trainers");
  }

  function refreshDashboard() {
    setRefreshing(true);

    window.setTimeout(() => {
      setRefreshing(false);
    }, 800);
  }

  const trainerInitial = trainerName.trim().charAt(0).toUpperCase() || "T";

  if (authChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f2ec]">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#e8c9ce] border-t-[#7a1226]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f2ec] text-[#2b0d13]">
      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-[#2a0610]/50 lg:hidden"
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[#4a0a17] text-[#fffdfa] transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "w-[82px]" : "w-[250px]"}`}
      >
        <div className="flex h-[94px] items-center border-b border-white/[0.08] px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fffdfa] text-[#7a1226] shadow-lg">
              <Icon name="dumbbell" className="h-5 w-5" />
            </div>

            {!collapsed && (
              <div className="min-w-">
                <h1 className="text-1xl font-extrabold mt-3">{gymName}</h1>
                <p className="text-xs text-white/70">{tagline}</p>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="ml-auto hidden rounded-lg p-2 text-[#d9bfc2] transition hover:bg-white/10 hover:text-white lg:block"
              aria-label="Collapse sidebar"
            >
              <span className="text-sm">«</span>
            </button>
          )}
        </div>

        {collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="mx-auto mt-4 hidden rounded-lg p-2 text-[#d9bfc2] hover:bg-white/10 hover:text-white lg:block"
            aria-label="Expand sidebar"
          >
            <span>»</span>
          </button>
        )}

        <nav className="flex-1 overflow-y-auto px-3 py-6">
          {navGroups.map((group) => (
            <div key={group.title} className="mb-7">
              {!collapsed && (
                <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#b58e94]">
                  {group.title}
                </p>
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = item.label === "Dashboard";

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      title={item.label}
                      className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-[13px] font-semibold transition ${
                        active
                          ? "bg-[#f7f2ec] text-[#4a0a17] shadow-lg shadow-black/20"
                          : "text-[#d9bfc2] hover:bg-white/[0.08] hover:text-white"
                      } ${collapsed ? "justify-center px-2" : ""}`}
                    >
                      <Icon
                        name={item.icon}
                        className="h-[18px] w-[18px] shrink-0"
                      />

                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {!collapsed && (
          <div className="border-t border-white/[0.08] px-5 py-4">
            <p className="text-center text-[10px] text-[#b58e94]">
              Powered by{" "}
              <span className="font-semibold text-[#e8d5d7]">Clickmasters</span>{" "}
              v1.0
            </p>
          </div>
        )}
      </aside>

      {/* MAIN */}

      <div
        className={`min-h-screen transition-all duration-300 ${
          collapsed ? "lg:pl-[82px]" : "lg:pl-[250px]"
        }`}
      >
        {/* TOP BAR */}

        <header className="sticky top-0 z-30 flex h-[74px] items-center justify-between border-b border-[#e8dcd2] bg-[#fffdfa]/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-[#e8dcd2] bg-[#fffdfa] p-2.5 text-[#2b0d13] shadow-sm lg:hidden"
              aria-label="Open sidebar"
            >
              <Icon name="menu" />
            </button>

            <div className="hidden w-full max-w-[440px] items-center gap-3 rounded-xl border border-[#e8dcd2] bg-[#faf6f1] px-4 py-2.5 md:flex">
              <Icon name="search" className="h-4 w-4 text-stone-400" />

              <input
                type="text"
                placeholder="Search members, sessions..."
                className="w-full bg-transparent text-sm text-[#2b0d13] outline-none placeholder:text-stone-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              className="relative rounded-xl p-2.5 text-[#7a6a62] transition hover:bg-[#f3ece4]"
              aria-label="Notifications"
            >
              <Icon name="bell" className="h-[19px] w-[19px]" />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#7a1226] ring-2 ring-[#fffdfa]" />
            </button>

            <div className="hidden h-7 w-px bg-[#e8dcd2] sm:block" />

            {/* PROFILE */}

            <div className="relative" data-trainer-profile>
              <button
                type="button"
                onClick={() => setProfileOpen((current) => !current)}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-xl px-1.5 py-1.5 transition hover:bg-[#f3ece4]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#7a1226] to-[#b04556] text-xs font-bold text-white">
                  {trainerInitial}
                </span>

                <span className="hidden max-w-[150px] text-left sm:block">
                  <span className="block truncate text-[13px] font-bold text-[#2b0d13]">
                    {trainerName}
                  </span>

                  <span className="block truncate text-[11px] text-stone-500">
                    Personal Trainer
                  </span>
                </span>

                <Icon
                  name="chevronDown"
                  className={`hidden h-4 w-4 text-stone-400 transition-transform sm:block ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 top-[calc(100%+10px)] z-[100] w-[260px] overflow-hidden rounded-2xl border border-[#e8dcd2] bg-[#fffdfa] shadow-xl shadow-stone-900/10"
                  role="menu"
                >
                  <div className="border-b border-[#efe5dc] bg-[#faf6f1] px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7a1226] to-[#b04556] text-sm font-bold text-white">
                        {trainerInitial}
                      </span>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold text-[#2b0d13]">
                          {trainerName}
                        </p>

                        <p className="truncate text-xs text-stone-500">
                          {trainerEmail || "Trainer Account"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setProfileOpen(false);
                        router.push("/trainer/profile");
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-[#4a3a36] transition hover:bg-[#f3ece4]"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f6e6e8] text-[#7a1226]">
                        <Icon name="profile" className="h-[17px] w-[17px]" />
                      </span>

                      <span>
                        <span className="block">My Profile</span>
                        <span className="mt-0.5 block text-[10px] font-normal text-stone-400">
                          View and edit your profile
                        </span>
                      </span>
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setProfileOpen(false);
                        router.push("/trainer/settings");
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-[#4a3a36] transition hover:bg-[#f3ece4]"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f3ece4] text-stone-600">
                        <Icon name="settings" className="h-[17px] w-[17px]" />
                      </span>

                      <span>
                        <span className="block">Settings</span>
                        <span className="mt-0.5 block text-[10px] font-normal text-stone-400">
                          Manage account settings
                        </span>
                      </span>
                    </button>

                    <div className="my-1 border-t border-[#efe5dc]" />

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-[#7a1226] transition hover:bg-[#f6e6e8]"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f6e6e8] text-[#7a1226]">
                        <Icon name="logout" className="h-[17px] w-[17px]" />
                      </span>

                      <span>
                        <span className="block">Logout</span>
                        <span className="mt-0.5 block text-[10px] font-normal text-[#b56b78]">
                          Sign out of your account
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}

        <main className="space-y-5 p-4 sm:p-6 lg:p-7">
          {/* HEADER CARD */}

          <section className="flex flex-col justify-between gap-5 rounded-2xl border border-[#e8dcd2] bg-[#fffdfa] p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f6e6e8] text-[#7a1226]">
                <Icon name="dashboard" className="h-5 w-5" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a1226]">
                  Trainer Overview
                </p>

                <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#2b0d13]">
                  Dashboard
                </h1>

                <p className="mt-1 text-sm text-stone-500">
                  Track your members, sessions, attendance and training
                  activity.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-2 rounded-full border border-[#ead3d6] bg-[#f6e6e8] px-3.5 py-2 text-[11px] font-bold text-[#7a1226]">
                <span className="h-2 w-2 rounded-full bg-[#7a1226]" />
                LIVE
              </span>

              <button
                type="button"
                onClick={refreshDashboard}
                className="rounded-xl border border-[#e8dcd2] bg-[#fffdfa] p-2.5 text-stone-500 transition hover:bg-[#faf6f1]"
                aria-label="Refresh dashboard"
              >
                <Icon
                  name="refresh"
                  className={`h-[18px] w-[18px] ${
                    refreshing ? "animate-spin" : ""
                  }`}
                />
              </button>

              <label className="relative">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="appearance-none rounded-xl border border-[#e8dcd2] bg-[#fffdfa] py-2.5 pl-3.5 pr-9 text-xs font-bold text-[#4a3a36] outline-none focus:border-[#7a1226]"
                >
                  <option value="7D">Last 7 Days</option>
                  <option value="30D">Last 30 Days</option>
                  <option value="3M">Last 3 Months</option>
                  <option value="6M">Last 6 Months</option>
                  <option value="1Y">Last Year</option>
                </select>

                <Icon
                  name="chevronDown"
                  className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400"
                />
              </label>
            </div>
          </section>

          {/* STAT CARDS */}

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map((stat) => (
              <StatCard key={stat.title} stat={stat} />
            ))}
          </section>

          {/* BUSINESS HOURS */}

          <section className="rounded-2xl border border-[#e8dcd2] bg-[#fffdfa] p-5 shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#efe5dc] pb-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f6e6e8] text-[#7a1226]">
                <Icon name="clock" className="h-[18px] w-[18px]" />
              </span>

              <div>
                <h2 className="text-sm font-extrabold text-[#2b0d13]">
                  Gym Hours
                </h2>

                <p className="mt-0.5 text-[11px] text-stone-400">
                  {settings.general.gymName} operating hours
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {formatHours(settings.businessHours).map((row) => (
                <div
                  key={row.days}
                  className="flex items-center justify-between rounded-xl bg-[#faf6f1] px-4 py-3"
                >
                  <span className="text-sm font-semibold text-[#4a3a36]">
                    {row.days}
                  </span>

                  <span className="text-sm font-bold text-[#2b0d13]">
                    {row.time}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({ stat }: { stat: (typeof stats)[number] }) {
  const colors: Record<string, { accent: string; bg: string }> = {
    blue: { accent: "#7a1226", bg: "#f6e6e8" },
    purple: { accent: "#a63446", bg: "#f9ecee" },
    orange: { accent: "#c9606f", bg: "#fbeff1" },
    green: { accent: "#a8805a", bg: "#f7efe6" },
    pink: { accent: "#d28b96", bg: "#fbf0f2" },
    yellow: { accent: "#c2a27c", bg: "#f8f1e8" },
  };

  const color = colors[stat.className];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#e8dcd2] bg-[#fffdfa] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <span
        className="absolute inset-x-0 top-0 h-1"
        style={{
          background: `linear-gradient(90deg, ${color.accent}, transparent)`,
        }}
      />

      <div className="flex items-center justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{
            backgroundColor: color.bg,
            color: color.accent,
          }}
        >
          <Icon name={stat.icon} className="h-[18px] w-[18px]" />
        </div>

        <MiniSpark color={color.accent} />
      </div>

      <p className="mt-4 text-xs font-semibold text-stone-500">{stat.title}</p>

      <p className="mt-1 text-2xl font-extrabold tracking-tight text-[#2b0d13]">
        {stat.value}
      </p>

      <div className="mt-3 flex items-center gap-2 border-t border-[#efe5dc] pt-3">
        <span
          className={`rounded-full px-2 py-1 text-[10px] font-bold ${
            stat.positive
              ? "bg-[#f6e6e8] text-[#7a1226]"
              : "bg-stone-100 text-stone-600"
          }`}
        >
          {stat.change}
        </span>

        <span className="text-[10px] text-stone-400">vs previous period</span>
      </div>
    </div>
  );
}

/* =========================================================
   SPARKLINE
========================================================= */

function MiniSpark({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 80 30" className="h-8 w-20" aria-hidden>
      <path
        d="M2 25 L14 21 L25 23 L36 15 L47 18 L59 9 L78 5"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="78" cy="5" r="2.5" fill={color} />
    </svg>
  );
}
