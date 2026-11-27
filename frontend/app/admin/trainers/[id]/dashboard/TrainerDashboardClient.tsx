"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { API_URL } from "@/lib/api";
import { getAdminSession } from "@/lib/memberAuth";

import TrainerDetails, {
  type TrainerDetailsData,
  type AssignedMemberData,
} from "@/components/admin/trainers/TrainerDetails";

/* =========================================================
   TYPES
========================================================= */

type Obj = Record<string, unknown>;

type ProfileData = {
  trainer: TrainerDetailsData;
  assignedMembers: AssignedMemberData[];
};

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

/* API response ko ek fixed shape me convert karta hai */

function normalize(raw: unknown, fallbackId: string): ProfileData {
  const root = obj(raw);
  const t = root.trainer ? obj(root.trainer) : root;

  const trainerDetails = obj(
    root.trainerDetails ?? root.details ?? t.trainerDetails ?? t.trainerData
  );

  // Assigned members
  const membersRaw = root.assignedMembers ?? root.members ?? [];

  const assignedMembers: AssignedMemberData[] = Array.isArray(membersRaw)
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

  // Member limit
  const rawLimit = num(
    root.memberLimit ?? t.memberLimit ?? trainerDetails.memberLimit ?? 20
  );

  const memberLimit =
    Number.isInteger(rawLimit) && rawLimit >= 1 ? rawLimit : 20;

  // Normalized trainer data
  return {
    trainer: {
      id: text(t._id ?? t.id, fallbackId),
      name: text(t.name ?? t.fullName, "Trainer"),
      username: text(t.username),
      email: text(t.email),
      phone: text(t.phone),
      photo: text(t.photo, ""),

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
      memberLimit,
    },

    assignedMembers,
  };
}

/* =========================================================
   API
========================================================= */

async function fetchProfile(id: string): Promise<ProfileData> {
  const session = getAdminSession();

  if (!session?.token) {
    throw new Error("Admin session not found. Please login again.");
  }

  const response = await fetch(
    `${API_URL}/api/admin/trainers/${id}/dashboard`,
    {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
      cache: "no-store",
    }
  );

  const json: unknown = await response.json();

  if (!response.ok) {
    throw new Error(text(obj(json).message, "Unable to load trainer profile."));
  }

  return normalize(json, id);
}

/* =========================================================
   SKELETON
========================================================= */

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-[#efe5dc] ${className}`} />
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function TrainerDashboardClient() {
  const { id } = useParams<{ id: string }>();

  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  /* =========================================================
     FETCH TRAINER PROFILE + LIVE REFRESH
  ========================================================= */

  useEffect(() => {
    if (!id) return;

    let active = true;

    async function run(silent: boolean) {
      try {
        const result = await fetchProfile(id);

        if (!active) return;

        setData(result);
        setError("");
      } catch (err) {
        if (!active || silent) return;

        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void run(false);

    const timer = window.setInterval(() => {
      void run(true);
    }, 30000);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [id, reloadKey]);

  /* =========================================================
     RETRY
  ========================================================= */

  function handleRetry() {
    setError("");
    setLoading(true);
    setReloadKey((key) => key + 1);
  }

  /* =========================================================
     LOADING UI
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen space-y-5 bg-[#f7f2ec] p-4 sm:p-6 lg:p-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-14 w-72" />
        <Skeleton className="h-44 w-full" />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32" />
          ))}
        </div>

        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  /* =========================================================
     ERROR UI
  ========================================================= */

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f2ec] p-6">
        <div className="max-w-md rounded-2xl border border-[#e8dcd2] bg-[#fffdfa] p-8 text-center shadow-sm">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f6e6e8] text-[#7a1226]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
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

  /* =========================================================
     TRAINER DETAILS COMPONENT
  ========================================================= */

  const { trainer, assignedMembers } = data;

  return <TrainerDetails trainer={trainer} assignedMembers={assignedMembers} />;
}
