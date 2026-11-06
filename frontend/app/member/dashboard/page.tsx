"use client";

import { useCallback, useEffect, useState } from "react";
import { API_URL } from "../../../lib/api";
import { useSettings } from "@/lib/SettingsContext";
import {
  getMember,
  clearMember,
  type MemberUser,
} from "../../../lib/memberAuth";

 

 

type DashboardUser = MemberUser & {
  phone?: string;
  status?: string;
   
};

type ApiResponse = {
  user?: DashboardUser;
  message?: string;
};

export default function MemberDashboard() {
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileDropdown, setProfileDropdown] = useState(false);
  const { settings } = useSettings();
  const gymName = settings.general.gymName || "GymMaster Pro";
  const tagline = settings.general.tagline;

  // Fetch member dashboard
  const fetchDashboard = useCallback(async () => {
    const session = getMember();

    if (!session) {
      window.location.replace("/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      const result: ApiResponse = await response.json();

      if (response.status === 401) {
        clearMember();
        window.location.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(result.message || "Unable to load dashboard");
      }

      if (!result.user) {
        throw new Error("Member information not found");
      }

      setUser(result.user);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
  const loadDashboard = async () => {
    await fetchDashboard();
  };

  loadDashboard();

  const interval = setInterval(() => {
    loadDashboard();
  }, 30000);

  return () => clearInterval(interval);
}, [fetchDashboard]);
  // Logout member
  const handleLogout = () => {
    clearMember();
    window.location.replace("/login");
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF5EF] flex items-center justify-center">
        <div className="text-[#641629] text-lg font-semibold animate-pulse">
          Loading your fitness dashboard...
        </div>
      </div>
    );
  }

  // Error screen
  if (error && !user) {
    return (
      <div className="min-h-screen bg-[#FBF5EF] flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow text-center max-w-md w-full">
          <h2 className="text-xl font-bold text-[#641629]">Dashboard Error</h2>

          <p className="text-gray-600 mt-3">{error}</p>

          <button
            onClick={fetchDashboard}
            className="mt-5 bg-[#641629] text-white px-6 py-3 rounded-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;


  const stats = [
    {
      icon: "🏋️",
      label: "Total Workouts",
      value: "—",
      note: "Workout records unavailable",
    },
    {
      icon: "📅",
      label: "Days Attended",
      value: "—",
      note: "Attendance records unavailable",
    },
    {
      icon: "🔥",
      label: "Calories Burned",
      value: "—",
      note: "Workout records unavailable",
    },
    {
      icon: "🏆",
      label: "Current Streak",
      value: "—",
      note: "Attendance records unavailable",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBF5EF] text-[#28171A] flex">
      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-[250px] bg-gradient-to-b from-[#651326] to-[#3F0A17] text-white flex-col fixed inset-y-0 left-0 z-30">
        <div className="px-6 py-8 text-center border-b border-white/10">
          <div className="text-5xl">🏋️</div>
          <h1 className="text-2xl font-extrabold mt-3">{gymName}</h1>
          <p className="text-sm text-white/70">{tagline}</p>
        </div>

        <nav className="flex-1 px-4 py-7 space-y-2">
          {[
            ["⌂", "Dashboard"],
            ["▣", "My Membership"],
            ["🏋", "Workouts"],
            ["🥗", "Diet Plan"],
            ["◈", "Progress"],
            ["▦", "Attendance"],
            ["♙", "Profile"],
            ["⚙", "Settings"],
          ].map(([icon, label], index) => (
            <a
              key={label}
              href={index === 0 ? "/member/dashboard" : "#"}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition ${
                index === 0
                  ? "bg-white/15 border-l-4 border-[#E9A0A8]"
                  : "hover:bg-white/10"
              }`}
            >
              <span className="text-xl">{icon}</span>
              <span className="font-medium">{label}</span>
            </a>
          ))}
        </nav>

        <div className="p-5">
          <div className="bg-white/10 rounded-2xl p-5 text-center">
            <div className="text-5xl">💪</div>
            <h3 className="font-bold italic mt-3">Stronger Than Yesterday</h3>
          </div>

          {/* SIDEBAR LOGOUT */}
          <button
            onClick={handleLogout}
            className="w-full mt-5 py-3 rounded-xl hover:bg-white/10 flex items-center justify-center gap-2 transition"
          >
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-[250px] min-w-0">
        {/* HEADER */}
        <header className="h-[75px] bg-[#FFFDF9] border-b border-[#EADDD5] flex items-center px-5 md:px-9 sticky top-0 z-40">
          {/* REFRESH BUTTON
          <button
            onClick={fetchDashboard}
            title="Refresh dashboard"
            className="text-xl p-2 hover:bg-[#F4E8E4] rounded-full transition"
          >
            ↻
          </button> */}

          <div className="ml-auto flex items-center gap-3">
            {/* PROFILE DROPDOWN */}
            <div className="relative">
              {/* PROFILE BUTTON */}
              <button
                type="button"
                onClick={() => setProfileDropdown((prev) => !prev)}
                aria-expanded={profileDropdown}
                aria-label="Open profile menu"
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F4E8E4] transition"
              >
                {/* PROFILE IMAGE */}
                {user.photo ? (
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#641629]"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-[#641629] text-white flex items-center justify-center font-bold text-lg">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* USER NAME */}
                <div className="hidden sm:block text-left">
                  <p className="font-bold text-[#28171A]">{user.name}</p>

                  <p className="text-xs text-gray-500 capitalize">
                    {user.role}
                  </p>
                </div>

                {/* DROPDOWN ARROW */}
                <span className="text-[#641629] text-sm">
                  {profileDropdown ? "▲" : "▼"}
                </span>
              </button>

              {/* DROPDOWN MENU */}
              {profileDropdown && (
                <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-xl border border-[#EADDD5] overflow-hidden z-50">
                  {/* USER INFORMATION */}
                  <div className="p-4 border-b border-[#F0E5DF]">
                    <p className="font-bold text-[#641629]">{user.name}</p>

                    <p className="text-sm text-gray-500 mt-1 break-all">
                      {user.email}
                    </p>

                    <p className="text-xs text-gray-400 mt-1 capitalize">
                      {user.role}
                    </p>
                  </div>

                  {/* LOGOUT BUTTON */}
                  <div className="p-3">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdown(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-semibold transition"
                    >
                      <span className="text-lg">↪</span>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <div className="p-4 md:p-7 space-y-6">
          {/* WELCOME BANNER */}
          <section className="rounded-2xl overflow-hidden bg-gradient-to-r from-[#160D0F] via-[#48121E] to-[#791D35] text-white p-7 md:p-10 relative">
            <div className="relative z-10 max-w-xl">
              <p className="text-white/80 text-lg">Welcome Back,</p>

              <h1 className="text-3xl md:text-5xl font-extrabold text-[#E69BA5] mt-2">
                {user.name}!
              </h1>

              <p className="mt-4 text-white/80">
                Keep pushing your limits and achieve your fitness goals.
              </p>

              <a
                href="#membership"
                className="inline-block bg-[#7C1A31] hover:bg-[#A02A46] px-6 py-3 rounded-full mt-6 font-semibold transition"
              >
                View My Membership →
              </a>
            </div>

            <div className="absolute right-10 bottom-[-30px] text-[150px] opacity-10 hidden md:block">
              🏋️
            </div>
          </section>

          {/* STATS */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-[#FFFDF9] border border-[#E8D8CF] rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{stat.icon}</span>

                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>

                    <h3 className="text-2xl font-extrabold text-[#641629]">
                      {stat.value}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-gray-400 mt-3">{stat.note}</p>
              </div>
            ))}
          </section>

          {/* MEMBERSHIP + PROFILE */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {/* MEMBERSHIP */}
            <div
              id="membership"
              className="bg-[#FFFDF9] rounded-2xl border border-[#E8D8CF] overflow-hidden shadow-sm"
            >
              <div className="bg-gradient-to-r from-[#641629] to-[#831F3C] text-white px-6 py-4">
                <h2 className="font-bold text-lg">♛ My Membership</h2>
              </div>

              
            </div>

            {/* PROFILE */}
            <div className="bg-[#FFFDF9] rounded-2xl border border-[#E8D8CF] overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-[#641629] to-[#831F3C] text-white px-6 py-4">
                <h2 className="font-bold text-lg">♙ My Profile</h2>
              </div>

              <div className="p-6 space-y-4">
                <ProfileRow label="Full Name" value={user.name} />

                <ProfileRow label="Email" value={user.email} />

                <ProfileRow
                  label="Phone"
                  value={user.phone || "Not provided"}
                />

                 

                <ProfileRow
                  label="Account Status"
                  value={user.status || "Unknown"}
                />
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {/* UPCOMING CLASSES */}
            <div className="bg-[#FFFDF9] rounded-2xl border border-[#E8D8CF] overflow-hidden">
              <div className="bg-gradient-to-r from-[#641629] to-[#831F3C] text-white px-6 py-4">
                <h2 className="font-bold text-lg">▦ Upcoming Classes</h2>
              </div>

              <div className="p-6 text-center">
                <div className="text-4xl">📅</div>

                <p className="font-semibold mt-3">
                  Classes API not connected yet
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  Classes scheduled by your trainer will appear here once the
                  classes feature is implemented.
                </p>
              </div>
            </div>

             
          </section>

          {/* QUICK ACTIONS */}
          <section className="bg-[#FFFDF9] rounded-2xl border border-[#E8D8CF] overflow-hidden">
            <div className="bg-gradient-to-r from-[#641629] to-[#831F3C] text-white px-6 py-4">
              <h2 className="font-bold text-lg">⚡ Quick Actions</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5">
              {[
                ["🏋️", "Workouts"],
                ["🥗", "Diet Plan"],
                ["📅", "Attendance"],
                ["👤", "Profile"],
              ].map(([icon, label]) => (
                <div
                  key={label}
                  className="border border-[#E8D8CF] bg-[#FAF0E9] rounded-xl p-6 text-center"
                >
                  <div className="text-3xl">{icon}</div>

                  <p className="font-semibold mt-3">{label}</p>

                  <p className="text-xs text-gray-400 mt-1">Coming soon</p>
                </div>
              ))}
            </div>
          </section>

          <p className="text-center text-xs text-gray-400 pb-4">
            Gym Fitness Management System
          </p>
        </div>
      </main>
    </div>
  );
}

// PROFILE ROW COMPONENT
function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-[#F0E5DF] pb-3">
      <span className="text-gray-500 text-sm">{label}</span>

      <span className="font-semibold text-[#641629] text-sm text-right">
        {value}
      </span>
    </div>
  );
}
