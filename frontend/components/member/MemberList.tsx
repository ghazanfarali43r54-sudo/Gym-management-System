"use client";

import { useEffect, useMemo, useState } from "react";
import { statusClass, type Member } from "@/features/memberApi";

type FitnessRecordType = "body-measurement" | "fitness-assessment";
type MemberStatusFilter = "All" | Member["status"];

type MemberListProps = {
  gymName: string;
  members: Member[];
  loading: boolean;
  error: string;
  onAddMember: () => void;
  onSelectMember: (member: Member) => void;
  onEditMember: (member: Member) => void;
  onOpenFitnessEntry: (member: Member, type: FitnessRecordType) => void;
  onToggleStatus: (member: Member) => void;
  onDeleteMember: (member: Member) => void;
};

type MemberActionsProps = Pick<
  MemberListProps,
  "onEditMember" | "onOpenFitnessEntry" | "onToggleStatus" | "onDeleteMember"
> & {
  member: Member;
  isLast: boolean;
  compact?: boolean;
};

function MemberActionsMenu({
  member,
  isLast,
  compact = false,
  onEditMember,
  onOpenFitnessEntry,
  onToggleStatus,
  onDeleteMember,
}: MemberActionsProps) {
  return (
    <div
      className={
        compact
          ? "mt-4 flex justify-end border-t border-[#eee5e0] pt-3"
          : "px-5 py-4"
      }
      onClick={(event) => event.stopPropagation()}
    >
      <details
        className={
          compact ? "group relative" : "group relative flex justify-end"
        }
      >
        <summary
          aria-label={`Actions for ${member.name}`}
          className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-[#e7dcd6] text-xl leading-none text-[#641d32] hover:bg-[#faf2f3] [&::-webkit-details-marker]:hidden"
        >
          ⋮
        </summary>
        <div
          className={`absolute right-0 z-20 min-w-48 rounded-xl border border-[#eadfd9] bg-white p-1.5 shadow-lg ${
            isLast ? "bottom-11" : "top-11"
          }`}
        >
          <button
            type="button"
            onClick={() => onEditMember(member)}
            className="w-full whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-medium text-[#641d32] hover:bg-[#faf2f3]"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onOpenFitnessEntry(member, "body-measurement")}
            className="w-full whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-medium text-[#641d32] hover:bg-[#faf2f3]"
          >
            Body Measurement
          </button>
          <button
            type="button"
            onClick={() => onOpenFitnessEntry(member, "fitness-assessment")}
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-[#641d32] hover:bg-[#faf2f3]"
          >
            Fitness Assessment
          </button>
          <button
            type="button"
            onClick={() => onToggleStatus(member)}
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-[#6f5b55] hover:bg-[#faf6f2]"
          >
            {member.status === "Active" ? "Deactivate" : "Activate"}
          </button>
          <button
            type="button"
            onClick={() => onDeleteMember(member)}
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </details>
    </div>
  );
}

export default function MemberList({
  gymName,
  members,
  loading,
  error,
  onAddMember,
  onSelectMember,
  onEditMember,
  onOpenFitnessEntry,
  onToggleStatus,
  onDeleteMember,
}: MemberListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<MemberStatusFilter>("All");

  useEffect(() => {
    const closeMenusOnOutsideClick = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;

      document
        .querySelectorAll<HTMLDetailsElement>("details[open]")
        .forEach((menu) => {
          if (!menu.contains(target)) menu.open = false;
        });
    };

    document.addEventListener("pointerdown", closeMenusOnOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", closeMenusOnOutsideClick);
  }, []);

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return members.filter((member) => {
      const matchesSearch =
        !query ||
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.phone.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "All" || member.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [members, search, statusFilter]);

  const memberCounts = members.reduce(
    (counts, member) => {
      counts[member.status] += 1;
      return counts;
    },
    { Active: 0, Inactive: 0, Pending: 0 }
  );

  return (
    <div className="min-h-screen space-y-6 bg-[#f8f6f2] p-4 text-[#342323] sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-[#8b7771]">{gymName}</p>
          <h1 className="mt-1 text-2xl font-bold text-[#4b1725] sm:text-3xl">
            Members
          </h1>
          <p className="mt-1 text-sm text-[#8b7771]">
            Manage your gym members and their memberships.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddMember}
          className="rounded-xl bg-[#641d32] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4b1725]"
        >
          + Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Members" value={members.length} />
        <StatCard
          label="Active Members"
          value={memberCounts.Active}
          valueClass="text-green-700"
        />
        <StatCard
          label="Inactive / Pending"
          value={memberCounts.Inactive + memberCounts.Pending}
          valueClass="text-[#9a6b16]"
        />
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-[#eadfd9] bg-white p-4 shadow-sm sm:flex-row">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, email or phone..."
          className="min-w-0 flex-1 rounded-xl border border-[#e7dcd6] bg-[#fffdfa] px-4 py-3 text-sm outline-none focus:border-[#641d32]"
        />
        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as MemberStatusFilter)
          }
          className="rounded-xl border border-[#e7dcd6] bg-[#fffdfa] px-4 py-3 text-sm outline-none focus:border-[#641d32]"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-visible rounded-2xl border border-[#eadfd9] bg-white shadow-sm">
        <div className="border-b border-[#eee5e0] px-5 py-4">
          <h2 className="font-bold text-[#4b1725]">All Members</h2>
          <p className="mt-1 text-xs text-[#8b7771]">
            Click a member to view their details.
          </p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-[#8b7771]">
            Loading members...
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-semibold text-[#4b1725]">No members found</p>
            <p className="mt-1 text-sm text-[#8b7771]">
              Try changing your search or add a new member.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-visible md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#faf6f2] text-xs uppercase text-[#8b7771]">
                  <tr>
                    <th className="px-5 py-4">Member</th>
                    <th className="px-5 py-4">Phone</th>
                    <th className="px-5 py-4">Measurements</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0e8e3]">
                  {filteredMembers.map((member, index) => (
                    <tr
                      key={member.id}
                      onClick={() => onSelectMember(member)}
                      className="cursor-pointer transition hover:bg-[#fcf8f5]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {member.photo ? (
                            <img
                              src={member.photo}
                              alt={`${member.name}'s profile`}
                              className="h-11 w-11 shrink-0 rounded-full border border-[#eadfd9] object-cover"
                            />
                          ) : (
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f3eae5] text-sm font-bold text-[#641d32]">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="truncate font-semibold text-[#4b1725]">
                              {member.name}
                            </div>
                            <div className="mt-1 truncate text-xs text-[#8b7771]">
                              {member.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[#6f5b55]">
                        {member.phone || "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className="inline-flex min-w-9 items-center justify-center rounded-full bg-[#f3eae5] px-3 py-1 text-xs font-semibold text-[#641d32]"
                          title={`${
                            member.measurementCount
                          } body measurement record${
                            member.measurementCount === 1 ? "" : "s"
                          }`}
                        >
                          {member.measurementCount}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <MemberStatusBadge member={member} />
                      </td>
                      <td className="p-0">
                        <MemberActionsMenu
                          member={member}
                          isLast={index === filteredMembers.length - 1}
                          onEditMember={onEditMember}
                          onOpenFitnessEntry={onOpenFitnessEntry}
                          onToggleStatus={onToggleStatus}
                          onDeleteMember={onDeleteMember}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 p-4 md:hidden">
              {filteredMembers.map((member, index) => (
                <article
                  key={member.id}
                  onClick={() => onSelectMember(member)}
                  className="cursor-pointer rounded-xl border border-[#eadfd9] bg-[#fffdfa] p-4 transition hover:border-[#c9aeb4]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      {member.photo ? (
                        <img
                          src={member.photo}
                          alt={`${member.name}'s profile`}
                          className="h-12 w-12 shrink-0 rounded-full border border-[#eadfd9] object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f3eae5] font-bold text-[#641d32]">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-[#4b1725]">
                          {member.name}
                        </h3>
                        <p className="mt-1 break-all text-xs text-[#8b7771]">
                          {member.email}
                        </p>
                      </div>
                    </div>

                    <MemberStatusBadge member={member} compact />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-[#9a8982]">Phone</p>
                      <p className="mt-1 font-medium">{member.phone || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[#9a8982]">Measurements</p>
                      <p className="mt-1 font-semibold text-[#641d32]">
                        {member.measurementCount}
                      </p>
                    </div>
                  </div>

                  <MemberActionsMenu
                    member={member}
                    isLast={index === filteredMembers.length - 1}
                    compact
                    onEditMember={onEditMember}
                    onOpenFitnessEntry={onOpenFitnessEntry}
                    onToggleStatus={onToggleStatus}
                    onDeleteMember={onDeleteMember}
                  />
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  valueClass = "text-[#4b1725]",
}: {
  label: string;
  value: number;
  valueClass?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#eadfd9] bg-white p-5 shadow-sm">
      <p className="text-sm text-[#8b7771]">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}

function MemberStatusBadge({
  member,
  compact = false,
}: {
  member: Member;
  compact?: boolean;
}) {
  return (
    <span
      className={`${
        compact ? "shrink-0 " : ""
      }rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
        member.status
      )}`}
    >
      {member.status}
    </span>
  );
}
