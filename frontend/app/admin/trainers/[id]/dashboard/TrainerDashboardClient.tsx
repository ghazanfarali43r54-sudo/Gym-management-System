"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import { getAdminSession, getTrainer } from "@/lib/memberAuth";

/* =========================================================
   TOKEN
========================================================= */

function getToken(): string {
  const trainer = getTrainer() as { token?: string } | null;
  return trainer?.token || "";
}

/* =========================================================
   TYPES
========================================================= */

type Trainer = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  specialization: string;
  experience: string;
  code: string;
  active: boolean;
  joinedAt: string;
  updatedBy: string;
  updatedAt: string;
  memberLimit: number;
};

type Stats = {
  members: number;
  sessions: number;
  rating: number;
};

type Permission = {
  key: string;
  label: string;
  enabled: boolean;
};

type ActivityItem = {
  id: string;
  title: string;
  module: string;
  by: string;
  createdAt: string;
};

type AssignedMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
};

type ProfileData = {
  trainer: Trainer;
  account: Obj;
  details: Obj;
  stats: Stats;
  permissions: Permission[];
  activity: ActivityItem[];
  assignedMembers: AssignedMember[];
};

type Obj = Record<string, unknown>;

/* =========================================================
   HELPERS
========================================================= */

function obj(value: unknown): Obj {
  return value && typeof value === "object" ? (value as Obj) : {};
}

function text(value: unknown, fallback = "—"): string {
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function num(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function prettify(key: string): string {
  const last = key.split(".").pop() || key;
  return last
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}

function profileEntries(value: Obj, prefix = ""): Array<[string, string]> {
  return Object.entries(value).flatMap(([key, item]) => {
    if (key === "_id" || key === "__v" || key === "trainerId") return [];

    const label = prefix ? `${prefix} ${prettify(key)}` : prettify(key);

    if (item && typeof item === "object" && !Array.isArray(item)) {
      const nested = obj(item);

      if (
        item instanceof Date ||
        nested.name ||
        nested.email ||
        nested.city ||
        nested.address ||
        nested.phone ||
        nested.isActive !== undefined
      ) {
        const reference = [
          nested.name,
          nested.email,
          nested.city,
          nested.address,
          nested.phone,
        ]
          .filter((part) => part !== undefined && part !== "")
          .map(String);

        if (nested.isActive !== undefined) {
          reference.push(nested.isActive ? "Active" : "Inactive");
        }

        return [[label, reference.join(" · ") || String(item)]];
      }

      return profileEntries(nested, label);
    }

    if (Array.isArray(item)) {
      return [[label, item.map((entry) => text(entry)).join(", ") || "—"]];
    }

    if (item === null || item === undefined || item === "") {
      return [[label, "—"]];
    }

    if (typeof item === "boolean") {
      return [[label, item ? "Yes" : "No"]];
    }

    if (key === "createdAt" || key === "updatedAt" || key === "reviewedAt") {
      return [[label, formatDateTime(String(item))]];
    }

    return [[label, String(item)]];
  });
}

function formatDate(value: string): string {
  const d = new Date(value);

  if (Number.isNaN(d.getTime())) return "—";

  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value: string): string {
  const d = new Date(value);

  if (Number.isNaN(d.getTime())) return "—";

  const date = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const time = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${date} at ${time}`;
}

function timeAgo(value: string): string {
  const diff = Date.now() - new Date(value).getTime();

  if (!Number.isFinite(diff)) return "";

  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}h ago`;

  return `${Math.floor(hours / 24)}d ago`;
}

/* API response ko ek fixed shape me convert karta hai */
function normalize(raw: unknown, fallbackId: string): ProfileData {
  const root = obj(raw);
  const t = root.trainer ? obj(root.trainer) : root;

  const trainerDetails = obj(
    root.trainerDetails ??
      root.details ??
      t.trainerDetails ??
      t.trainerData
  );

  const s = obj(root.stats);

  const permsRaw = root.permissions ?? t.permissions ?? {};

  const permissions: Permission[] = Array.isArray(permsRaw)
    ? permsRaw.map((item) => {
        const p = obj(item);
        const key = text(p.key ?? p.name, "");

        return {
          key,
          label: text(p.label, prettify(key)),
          enabled: Boolean(p.enabled),
        };
      })
    : Object.entries(obj(permsRaw)).map(([key, value]) => ({
        key,
        label: prettify(key),
        enabled: Boolean(value),
      }));

  const activityRaw = root.activity ?? root.activityLog ?? [];

  const activity: ActivityItem[] = Array.isArray(activityRaw)
    ? activityRaw.map((item, i) => {
        const a = obj(item);

        return {
          id: text(a.id ?? a._id, String(i)),
          title: text(a.title ?? a.message, "Activity"),
          module: text(a.module ?? a.type, "TRAINER MANAGEMENT"),
          by: text(a.by ?? a.actor, "admin"),
          createdAt: text(a.createdAt ?? a.date, ""),
        };
      })
    : [];

  // Assigned members
  const membersRaw = root.assignedMembers ?? root.members ?? [];

  const assignedMembers: AssignedMember[] = Array.isArray(membersRaw)
    ? membersRaw.map((item, i) => {
        const m = obj(item);

        return {
          id: text(m._id ?? m.id, String(i)),
          name: text(m.name ?? m.fullName, "Member"),
          email: text(m.email),
          phone: text(m.phone ?? m.phoneNumber),
          status: text(m.status, "Active"),
        };
      })
    : [];

  return {
    account: t,

    trainer: {
      id: text(t._id ?? t.id, fallbackId),
      name: text(t.name ?? t.fullName, "Trainer"),
      username: text(t.username),
      email: text(t.email),
      phone: text(t.phone),

      specialization: text(
        t.specialization ??
          trainerDetails.specialization ??
          t.department ??
          trainerDetails.department
      ),

      experience: text(
        t.experience ??
          trainerDetails.experience ??
          t.yearsOfExperience ??
          trainerDetails.yearsOfExperience,
        ""
      ),

      code: text(t.trainerCode ?? t.employeeCode ?? t.code),

      active: t.status
        ? String(t.status).toLowerCase() === "active"
        : Boolean(t.isActive ?? true),

      joinedAt: text(t.joinedAt ?? t.createdAt, ""),
      updatedBy: text(obj(t.updatedBy).name ?? t.updatedBy, "admin"),
      updatedAt: text(t.updatedAt, ""),

      memberLimit: (() => {
        const limit = num(
          root.memberLimit ??
            t.memberLimit ??
            trainerDetails.memberLimit ??
            20
        );

        return Number.isInteger(limit) && limit >= 1 ? limit : 20;
      })(),
    },

    details: trainerDetails,

    stats: {
      members: num(s.members ?? s.assignedMembers ?? assignedMembers.length),
      sessions: num(s.sessions ?? s.sessionsConducted),
      rating: num(s.rating),
    },

    permissions,
    activity,
    assignedMembers,
  };
}

async function fetchProfile(id: string): Promise<ProfileData> {
  const session = getAdminSession();

  const res = await fetch(`${API_URL}/api/admin/trainers/${id}/dashboard`, {
    headers: { Authorization: `Bearer ${session?.token}` },
    cache: "no-store",
  });

  const json: unknown = await res.json();

  if (!res.ok) {
    throw new Error(text(obj(json).message, "Unable to load trainer"));
  }

  return normalize(json, id);
}

/* =========================================================
   ICONS
========================================================= */

const ICONS = {
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),

  users: (
    <>
      <circle cx="9" cy="7" r="4" />
      <path d="M2 21a7 7 0 0 1 14 0" />
      <path d="M17 4a4 4 0 0 1 0 8" />
      <path d="M22 21a7 7 0 0 0-4-6.32" />
    </>
  ),

  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),

  phone: (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
  ),

  dumbbell: <path d="M6 4v16M18 4v16M3 8v8M21 8v8M6 12h12" />,

  calendar: (
    <>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),

  calendarCheck: (
    <>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="m9 15 2 2 4-4" />
    </>
  ),

  shield: (
    <>
      <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),

  idcard: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="11" r="2" />
      <path d="M14 10h4M14 14h4M6 16c.5-1.5 1.5-2 3-2s2.5.5 3 2" />
    </>
  ),

  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),

  tag: (
    <>
      <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" />
      <circle cx="7.5" cy="7.5" r="1" />
    </>
  ),

  pencil: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </>
  ),

  arrowLeft: <path d="M19 12H5m7-7-7 7 7 7" />,

  star: (
    <polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3" />
  ),

  clipboard: (
    <>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </>
  ),

  activity: <path d="M3 12h4l2-7 4 14 2-7h6" />,
  check: <path d="m5 12 5 5 9-10" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,

  refresh: (
    <>
      <path d="M20 11a8.1 8.1 0 0 0-15.5-3M4 4v4h4" />
      <path d="M4 13a8.1 8.1 0 0 0 15.5 3M20 20v-4h-4" />
    </>
  ),
};

type IconName = keyof typeof ICONS;

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: IconName;
  className?: string;
}) {
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
      {ICONS[name]}
    </svg>
  );
}

/* =========================================================
   SMALL UI PIECES
========================================================= */

function SectionTitle({
  icon,
  title,
  right,
}: {
  icon: IconName;
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#efe5dc] pb-4">
      <div className="flex items-center gap-2.5">
        <span className="h-4 w-1 rounded-full bg-[#7a1226]" />
        <Icon name={icon} className="h-[18px] w-[18px] text-[#7a1226]" />
        <h2 className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#4a3a36]">
          {title}
        </h2>
      </div>
      {right}
    </div>
  );
}

function EditLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-[#4a3a36] transition hover:bg-[#f3ece4]"
    >
      <Icon name="pencil" className="h-4 w-4" />
      Edit
    </Link>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: IconName;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3ece4] text-stone-500">
        <Icon name={icon} className="h-[18px] w-[18px]" />
      </span>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-400">
          {label}
        </p>
        <p className="truncate text-sm font-bold text-[#2b0d13]">{value}</p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  caption,
  icon,
}: {
  label: string;
  value: string;
  caption: string;
  icon: IconName;
}) {
  return (
    <div className="rounded-2xl border border-[#e8dcd2] bg-[#fffdfa] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b border-[#efe5dc] pb-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-stone-500">
            {label}
          </p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight text-[#2b0d13]">
            {value}
          </p>
        </div>

        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f6e6e8] text-[#7a1226]">
          <Icon name={icon} className="h-5 w-5" />
        </span>
      </div>

      <p className="mt-3 text-xs font-medium text-stone-500">{caption}</p>
    </div>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-[#efe5dc] ${className}`} />
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function TrainerDashboardClient() {
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!id) return;

    let active = true;

    async function run(silent: boolean) {
      try {
        const result = await fetchProfile(id);

        if (active) {
          setData(result);
          setError("");
        }
      } catch (err) {
        if (active && !silent) {
          setError(err instanceof Error ? err.message : "Something went wrong");
        }
      } finally {
        if (active) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    }

    run(false);

    // LIVE: har 30 second me chupke se refresh
    const timer = window.setInterval(() => run(true), 30000);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [id, reloadKey]);

  function handleRefresh() {
    setRefreshing(true);
    setReloadKey((key) => key + 1);
  }

  function handleRetry() {
    setError("");
    setLoading(true);
    setReloadKey((key) => key + 1);
  }

  /* ---------- LOADING ---------- */

  if (loading) {
    return (
      <div className="min-h-screen space-y-5 bg-[#f7f2ec] p-4 sm:p-6 lg:p-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-14 w-72" />
        <Skeleton className="h-44 w-full" />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>

        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  /* ---------- ERROR ---------- */

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f2ec] p-6">
        <div className="max-w-md rounded-2xl border border-[#e8dcd2] bg-[#fffdfa] p-8 text-center shadow-sm">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f6e6e8] text-[#7a1226]">
            <Icon name="x" className="h-6 w-6" />
          </span>

          <h2 className="mt-4 text-lg font-extrabold text-[#2b0d13]">
            Unable to load trainer
          </h2>

          <p className="mt-1 text-sm text-stone-500">
            {error || "No data found for this trainer."}
          </p>

          <div className="mt-5 flex justify-center gap-2">
            <Link
              href="/admin/trainers"
              className="rounded-xl border border-[#e8dcd2] bg-[#fffdfa] px-4 py-2.5 text-sm font-semibold text-[#4a3a36] hover:bg-[#faf6f1]"
            >
              Back
            </Link>

            <button
              type="button"
              onClick={handleRetry}
              className="rounded-xl bg-[#7a1226] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5e0d1c]"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- DATA ---------- */

  const { trainer, stats, permissions, activity, assignedMembers } = data;
  const details = data.details;

  const enabledCount = permissions.filter((p) => p.enabled).length;
  const initial = trainer.name.trim().charAt(0).toUpperCase() || "T";

  const accessHref = `/admin/trainers/${trainer.id}/access`;
  const editHref = `/admin/trainers?view=edit&id=${encodeURIComponent(trainer.id)}`;

  // Show every assigned member. Add one empty slot only if capacity remains.
  const memberSlots =
    assignedMembers.length < trainer.memberLimit
      ? assignedMembers.length + 1
      : assignedMembers.length;

  return (
    <div className="min-h-screen space-y-5 bg-[#f7f2ec] p-4 text-[#2b0d13] sm:p-6 lg:p-8">
      {/* PROFILE CARD */}

      <section className="flex flex-col gap-6 rounded-2xl border border-[#e8dcd2] bg-[#e8dcd2] p-5 shadow-sm sm:p-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative shrink-0">
            <span className="flex h-24 w-24 items-center justify-center rounded-2xl border border-[#ead3d6] bg-[#f6e6e8] text-4xl font-bold text-[#7a1226]">
              {initial}
            </span>

            <span
              className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#fffdfa] ${
                trainer.active ? "bg-[#7a1226]" : "bg-stone-400"
              }`}
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-extrabold tracking-tight">
                {trainer.name}
              </h2>

              <span
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
                  trainer.active
                    ? "border-[#ead3d6] bg-[#f6e6e8] text-[#7a1226]"
                    : "border-stone-200 bg-stone-100 text-stone-500"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    trainer.active ? "bg-[#7a1226]" : "bg-stone-400"
                  }`}
                />
                {trainer.active ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="flex items-center gap-2 rounded-full bg-[#f3ece4] px-3 py-1.5 text-sm text-[#4a3a36]">
                <Icon name="mail" className="h-4 w-4" />
                {trainer.email}
              </span>

              <span className="flex items-center gap-2 rounded-full bg-[#f3ece4] px-3 py-1.5 text-sm text-[#4a3a36]">
                <Icon name="phone" className="h-4 w-4" />
                {trainer.phone}
              </span>

              <span className="flex items-center gap-2 rounded-full bg-[#f6e6e8] px-3 py-1.5 text-sm font-semibold text-[#7a1226]">
                <Icon name="dumbbell" className="h-4 w-4" />
                {trainer.specialization}
              </span>

              {trainer.experience && (
                <span className="flex items-center gap-2 rounded-full bg-[#f6e6e8] px-3 py-1.5 text-sm font-semibold text-[#7a1226]">
                  <Icon name="clock" className="h-4 w-4" />
                  {trainer.experience} Years Experience
                </span>
              )}

              <span className="flex items-center gap-2 rounded-full bg-[#f3ece4] px-3 py-1.5 text-sm text-[#4a3a36]">
                <Icon name="calendar" className="h-4 w-4" />
                Joined {formatDate(trainer.joinedAt)}
              </span>
            </div>

            <p className="mt-3 flex items-center gap-2 text-sm text-stone-500">
              <Icon name="pencil" className="h-4 w-4 text-[#7a1226]" />
              Last updated by{" "}
              <b className="text-[#2b0d13]">{trainer.updatedBy}</b>
              {trainer.updatedAt && <> · {formatDateTime(trainer.updatedAt)}</>}
            </p>
          </div>
        </div>

        <div className="mb-20 flex flex-wrap items-center gap-2">
          <Link
            href={editHref}
            className="flex items-center gap-2 rounded-xl bg-[#7a1226] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5e0d1c]"
          >
            <Icon name="pencil" className="h-4 w-4" />
            Edit Trainer
          </Link>
        </div>
      </section>

      {/* ASSIGNED MEMBERS RECTANGULAR CONTAINER */}

      <section className="rounded-2xl border-2 border-[#d9c5b7] bg-[#fffdfa] p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#efe5dc] pb-4">
          <div className="flex items-center gap-2.5">
            <span className="h-4 w-1 rounded-full bg-[#7a1226]" />
            <Icon name="users" className="h-[18px] w-[18px] text-[#7a1226]" />
            <h2 className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#4a3a36]">
              Assigned Members
            </h2>
          </div>

          <span className="rounded-full bg-[#f6e6e8] px-3 py-1.5 text-sm font-bold text-[#7a1226]">
            {assignedMembers.length} / {trainer.memberLimit} Members
          </span>
        </div>

        {/* SMALL MEMBER BOXES INSIDE THE LARGE RECTANGLE */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: memberSlots }).map((_, index) => {
            const member = assignedMembers[index];

            return (
              <div
                key={member?.id ?? `empty-${index}`}
                className={`min-h-[155px] rounded-xl border p-4 transition ${
                  member
                    ? "border-[#e8dcd2] bg-[#faf6f1] shadow-sm"
                    : "border-2 border-dashed border-[#cbb7a8] bg-[#fffdfa]"
                }`}
              >
                {member ? (
                  <>
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f6e6e8] text-sm font-bold text-[#7a1226]">
                        {member.name.charAt(0).toUpperCase()}
                      </span>

                      <span className="rounded-full bg-[#f6e6e8] px-2.5 py-1 text-[10px] font-bold text-[#7a1226]">
                        {member.status}
                      </span>
                    </div>

                    <h3 className="truncate text-sm font-bold text-[#2b0d13]">
                      {member.name}
                    </h3>

                    <p className="mt-1 truncate text-xs text-stone-500">
                      {member.email}
                    </p>

                    <p className="mt-1 truncate text-xs text-stone-500">
                      {member.phone}
                    </p>
                  </>
                ) : (
                  <div className="flex h-full min-h-[120px] flex-col items-center justify-center text-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3ece4] text-[#7a1226]">
                      <Icon name="user" className="h-5 w-5" />
                    </span>

                    <p className="mt-2 text-sm font-bold text-[#4a3a36]">
                      Empty Member Slot
                    </p>

                    <p className="mt-1 text-xs text-stone-400">
                      Waiting for member assignment
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
