"use client";

import { useMemo, useState } from "react";

type AttendanceStatus = "Present" | "Absent" | "Late";

type AttendanceRecord = {
  id: number;
  name: string;
  email: string;
  initials: string;
  trainer: string;
  checkIn: string;
  checkOut: string;
  status: AttendanceStatus;
};

const initialAttendance: AttendanceRecord[] = [
  {
    id: 1,
    name: "Ahmed Khan",
    email: "ahmed@gmail.com",
    initials: "AK",
    trainer: "Ali Raza",
    checkIn: "08:15 AM",
    checkOut: "09:45 AM",
    status: "Present",
  },
  {
    id: 2,
    name: "Usman Ali",
    email: "usman@gmail.com",
    initials: "UA",
    trainer: "Hamza Khan",
    checkIn: "09:05 AM",
    checkOut: "10:30 AM",
    status: "Present",
  },
  {
    id: 3,
    name: "Bilal Ahmed",
    email: "bilal@gmail.com",
    initials: "BA",
    trainer: "Ali Raza",
    checkIn: "10:20 AM",
    checkOut: "--",
    status: "Late",
  },
  {
    id: 4,
    name: "Hamza Malik",
    email: "hamza@gmail.com",
    initials: "HM",
    trainer: "Usman Tariq",
    checkIn: "--",
    checkOut: "--",
    status: "Absent",
  },
  {
    id: 5,
    name: "Saad Khan",
    email: "saad@gmail.com",
    initials: "SK",
    trainer: "Hamza Khan",
    checkIn: "07:50 AM",
    checkOut: "09:10 AM",
    status: "Present",
  },
  {
    id: 6,
    name: "Ahsan Ali",
    email: "ahsan@gmail.com",
    initials: "AA",
    trainer: "Ali Raza",
    checkIn: "11:15 AM",
    checkOut: "--",
    status: "Late",
  },
];

export default function AdminAttendancePage() {
  const [attendance, setAttendance] =
    useState<AttendanceRecord[]>(initialAttendance);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [date, setDate] = useState("2026-10-28");

  const filteredAttendance = useMemo(() => {
    return attendance.filter((item) => {
      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.trainer.toLowerCase().includes(query);

       
      const matchesStatus =
        status === "All Status" || item.status === status;

      return matchesSearch  && matchesStatus;
    });
  }, [attendance, search, status]);

  const total = attendance.length;

  const present = attendance.filter(
    (item) => item.status === "Present"
  ).length;

  const absent = attendance.filter(
    (item) => item.status === "Absent"
  ).length;

  const late = attendance.filter(
    (item) => item.status === "Late"
  ).length;

  const attendanceRate =
    total === 0
      ? 0
      : Math.round(((present + late) / total) * 100);

  function updateStatus(
    id: number,
    newStatus: AttendanceStatus
  ) {
    setAttendance((current) =>
      current.map((item) => {
        if (item.id !== id) return item;

        if (newStatus === "Absent") {
          return {
            ...item,
            status: newStatus,
            checkIn: "--",
            checkOut: "--",
          };
        }

        if (
          newStatus === "Present" &&
          item.checkIn === "--"
        ) {
          return {
            ...item,
            status: newStatus,
            checkIn: "09:00 AM",
          };
        }

        if (
          newStatus === "Late" &&
          item.checkIn === "--"
        ) {
          return {
            ...item,
            status: newStatus,
            checkIn: "10:15 AM",
          };
        }

        return {
          ...item,
          status: newStatus,
        };
      })
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1500px]">
        {/* HEADER */}

        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-[#800020]/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#800020]">
                GymMaster Pro
              </span>

              <span className="h-1 w-1 rounded-full bg-[#c0405a]" />

              <span className="text-xs font-semibold text-slate-400">
                Admin Panel
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-[#261a1d] sm:text-3xl">
              Attendance Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Track and manage daily member attendance.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#800020] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#800020]/15 transition hover:bg-[#680019]"
          >
            <PlusIcon />
            Mark Attendance
          </button>
        </div>

        {/* STATS */}

        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Members"
            value={String(total)}
            description="Registered members"
            icon={<UsersIcon />}
            color="#800020"
            bg="#fff1f4"
          />

          <StatCard
            title="Present Today"
            value={String(present)}
            description={`${attendanceRate}% attendance rate`}
            icon={<CheckIcon />}
            color="#16a34a"
            bg="#f0fdf4"
          />

          <StatCard
            title="Absent Today"
            value={String(absent)}
            description="Not checked in"
            icon={<CloseIcon />}
            color="#dc2626"
            bg="#fef2f2"
          />

          <StatCard
            title="Late Arrivals"
            value={String(late)}
            description="Checked in late"
            icon={<ClockIcon />}
            color="#d97706"
            bg="#fffbeb"
          />
        </section>

        {/* ATTENDANCE RATE */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-[#eadfe1] bg-white shadow-sm">
          <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#800020] text-white shadow-lg shadow-[#800020]/20">
              <ChartIcon />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-extrabold text-[#2d2023]">
                    Today&apos;s Attendance
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Overall member attendance progress
                  </p>
                </div>

                <p className="text-2xl font-black text-[#800020]">
                  {attendanceRate}%
                </p>
              </div>

              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#f3e8ea]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#800020] to-[#c0405a] transition-all"
                  style={{
                    width: `${attendanceRate}%`,
                  }}
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-5 text-xs font-semibold text-slate-500">
                <span>
                  <strong className="text-emerald-600">
                    {present}
                  </strong>{" "}
                  Present
                </span>

                <span>
                  <strong className="text-amber-600">
                    {late}
                  </strong>{" "}
                  Late
                </span>

                <span>
                  <strong className="text-rose-600">
                    {absent}
                  </strong>{" "}
                  Absent
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* TABLE CARD */}

        <section className="overflow-hidden rounded-2xl border border-[#eadfe1] bg-white shadow-sm">
          {/* CARD HEADER */}

          <div className="border-b border-[#eee5e7] p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
              <div>
                <h2 className="text-base font-black text-[#2d2023]">
                  Daily Attendance
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  View and update today&apos;s attendance records
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <CalendarIcon />

                  <input
                    type="date"
                    value={date}
                    onChange={(event) =>
                      setDate(event.target.value)
                    }
                    className="h-10 rounded-xl border border-[#e5dadd] bg-white pl-10 pr-3 text-xs font-bold text-[#4a373c] outline-none transition focus:border-[#800020]"
                  />
                </div>

                <button
                  type="button"
                  className="h-10 rounded-xl border border-[#e5dadd] bg-white px-4 text-xs font-bold text-[#800020] transition hover:bg-[#fff5f7]"
                >
                  Export
                </button>
              </div>
            </div>

            {/* FILTERS */}

            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_190px_180px]">
              <div className="relative">
                <SearchIcon />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search member, email or trainer..."
                  className="h-11 w-full rounded-xl border border-[#e5dadd] bg-[#fdfbfb] pl-10 pr-4 text-xs font-semibold text-[#3d2c30] outline-none transition placeholder:text-slate-400 focus:border-[#800020] focus:bg-white"
                />
              </div>

              

              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                className="h-11 rounded-xl border border-[#e5dadd] bg-[#fdfbfb] px-3 text-xs font-bold text-[#4a373c] outline-none focus:border-[#800020]"
              >
                <option>All Status</option>
                <option>Present</option>
                <option>Late</option>
                <option>Absent</option>
              </select>
            </div>
          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="bg-[#fbf8f8] text-left">
                  <TableHeading>Member</TableHeading>
                  <TableHeading>Trainer</TableHeading>
                  <TableHeading>Check In</TableHeading>
                  <TableHeading>Check Out</TableHeading>
                  <TableHeading>Status</TableHeading>
                  <TableHeading align="right">
                    Action
                  </TableHeading>
                </tr>
              </thead>

              <tbody>
                {filteredAttendance.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-[#f0e8e9] transition hover:bg-[#fdfafa]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#800020] to-[#c0405a] text-xs font-black text-white shadow-sm">
                          {item.initials}
                        </div>

                        <div>
                          <p className="text-sm font-extrabold text-[#332326]">
                            {item.name}
                          </p>

                          <p className="mt-0.5 text-[11px] text-slate-400">
                            {item.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    

                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-[#fff2f5] px-2.5 py-1.5 text-xs font-bold text-[#800020]">
                        {item.trainer}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-xs font-bold text-[#443438]">
                      {item.checkIn}
                    </td>

                    <td className="px-5 py-4 text-xs font-bold text-[#443438]">
                      {item.checkOut}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <StatusButton
                          title="Present"
                          active={item.status === "Present"}
                          color="green"
                          onClick={() =>
                            updateStatus(
                              item.id,
                              "Present"
                            )
                          }
                        >
                          <CheckSmallIcon />
                        </StatusButton>

                        <StatusButton
                          title="Late"
                          active={item.status === "Late"}
                          color="amber"
                          onClick={() =>
                            updateStatus(item.id, "Late")
                          }
                        >
                          <ClockSmallIcon />
                        </StatusButton>

                        <StatusButton
                          title="Absent"
                          active={item.status === "Absent"}
                          color="red"
                          onClick={() =>
                            updateStatus(
                              item.id,
                              "Absent"
                            )
                          }
                        >
                          <CloseSmallIcon />
                        </StatusButton>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredAttendance.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-16 text-center"
                    >
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff2f5] text-[#800020]">
                        <UsersIcon />
                      </div>

                      <p className="mt-4 text-sm font-black text-[#332326]">
                        No attendance records found
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Try changing your search or filters.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}

          <div className="flex flex-col gap-3 border-t border-[#eee5e7] bg-[#fdfbfb] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-semibold text-slate-400">
              Showing{" "}
              <strong className="text-[#800020]">
                {filteredAttendance.length}
              </strong>{" "}
              of {attendance.length} records
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-lg border border-[#e5dadd] bg-white px-3 py-2 text-[11px] font-bold text-slate-400"
              >
                Previous
              </button>

              <button
                type="button"
                className="rounded-lg bg-[#800020] px-3 py-2 text-[11px] font-bold text-white"
              >
                1
              </button>

              <button
                type="button"
                className="rounded-lg border border-[#e5dadd] bg-white px-3 py-2 text-[11px] font-bold text-[#4a373c]"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function StatCard({
  title,
  value,
  description,
  icon,
  color,
  bg,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#eadfe1] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <span
        className="absolute inset-x-0 top-0 h-1"
        style={{
          background: `linear-gradient(90deg, ${color}, transparent)`,
        }}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight text-[#302124]">
            {value}
          </p>

          <p className="mt-2 text-[11px] font-semibold text-slate-400">
            {description}
          </p>
        </div>

        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{
            color,
            backgroundColor: bg,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: AttendanceStatus;
}) {
  const styles = {
    Present:
      "border-emerald-100 bg-emerald-50 text-emerald-600",
    Late: "border-amber-100 bg-amber-50 text-amber-600",
    Absent:
      "border-rose-100 bg-rose-50 text-rose-600",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-extrabold ${styles[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "Present"
            ? "bg-emerald-500"
            : status === "Late"
              ? "bg-amber-500"
              : "bg-rose-500"
        }`}
      />

      {status}
    </span>
  );
}

function StatusButton({
  children,
  title,
  active,
  color,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  active: boolean;
  color: "green" | "amber" | "red";
  onClick: () => void;
}) {
  const styles = {
    green: active
      ? "border-emerald-500 bg-emerald-500 text-white"
      : "border-emerald-100 bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
    amber: active
      ? "border-amber-500 bg-amber-500 text-white"
      : "border-amber-100 bg-amber-50 text-amber-600 hover:bg-amber-100",
    red: active
      ? "border-rose-500 bg-rose-500 text-white"
      : "border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100",
  };

  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${styles[color]}`}
    >
      {children}
    </button>
  );
}

function TableHeading({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-5 py-3.5 text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 ${
        align === "right" ? "text-right" : ""
      }`}
    >
      {children}
    </th>
  );
}

/* =========================================================
   ICONS
========================================================= */

const iconClass = "h-5 w-5";

function UsersIcon() {
  return (
    <svg
      className={iconClass}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className={iconClass}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className={iconClass}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m18 6-12 12" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      className={iconClass}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 19V9" />
      <path d="M10 19V5" />
      <path d="M16 19v-7" />
      <path d="M22 19H2" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#800020]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  );
}

function CheckSmallIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function CloseSmallIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="m18 6-12 12M6 6l12 12" />
    </svg>
  );
}

function ClockSmallIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}