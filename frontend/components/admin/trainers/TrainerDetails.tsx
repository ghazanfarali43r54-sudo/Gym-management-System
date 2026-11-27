
"use client";

import Image from "next/image";
import Link from "next/link";

/* =========================================================
   TYPES
========================================================= */

export type TrainerDetailsData = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  photo: string;
  specialization: string;
  experience: string;
  code: string;
  active: boolean;
  joinedAt: string;
  updatedBy: string;
  updatedAt: string;
  memberLimit: number;
};

export type AssignedMemberData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
};

type TrainerDetailsProps = {
  trainer: TrainerDetailsData;
  assignedMembers: AssignedMemberData[];
};

/* =========================================================
   HELPERS
========================================================= */

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

  dumbbell: (
    <path d="M6 4v16M18 4v16M3 8v8M21 8v8M6 12h12" />
  ),

  calendar: (
    <>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),

  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),

  pencil: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
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
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function TrainerDetails({
  trainer,
  assignedMembers,
}: TrainerDetailsProps) {
  const initial = trainer.name.trim().charAt(0).toUpperCase() || "T";

  const editHref = `/admin/trainers?view=edit&id=${encodeURIComponent(
    trainer.id
  )}`;

  // Show every assigned member.
  // Add one empty slot only if capacity remains.
  const memberSlots =
    assignedMembers.length < trainer.memberLimit
      ? assignedMembers.length + 1
      : assignedMembers.length;

  return (
    <div className="min-h-screen space-y-5 bg-[#f7f2ec] p-4 text-[#2b0d13] sm:p-6 lg:p-8">
      {/* PROFILE CARD */}

      <section className="flex flex-col gap-6 rounded-2xl border border-[#e8dcd2] bg-[#e8dcd2] p-5 shadow-sm sm:p-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {/* PROFILE PHOTO */}

          <div className="relative shrink-0">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-[#ead3d6] bg-[#f6e6e8] text-4xl font-bold text-[#7a1226]">
              {trainer.photo?.trim() ? (
                <Image
                  src={trainer.photo}
                  alt={`${trainer.name} profile`}
                  width={96}
                  height={96}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              ) : (
                initial
              )}
            </div>

            <span
              className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#fffdfa] ${
                trainer.active ? "bg-[#7a1226]" : "bg-stone-400"
              }`}
            />
          </div>

          {/* TRAINER INFORMATION */}

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
              {trainer.updatedAt && (
                <> · {formatDateTime(trainer.updatedAt)}</>
              )}
            </p>
          </div>
        </div>

        {/* EDIT BUTTON */}

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

      {/* ASSIGNED MEMBERS */}

      <section className="rounded-2xl border-2 border-[#d9c5b7] bg-[#fffdfa] p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#efe5dc] pb-4">
          <div className="flex items-center gap-2.5">
            <span className="h-4 w-1 rounded-full bg-[#7a1226]" />

            <Icon
              name="users"
              className="h-[18px] w-[18px] text-[#7a1226]"
            />

            <h2 className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#4a3a36]">
              Assigned Members
            </h2>
          </div>

          <span className="rounded-full bg-[#f6e6e8] px-3 py-1.5 text-sm font-bold text-[#7a1226]">
            {assignedMembers.length} / {trainer.memberLimit} Members
          </span>
        </div>

        {/* MEMBER BOXES */}

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
