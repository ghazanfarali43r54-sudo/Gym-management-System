"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { apiFetch } from "@/lib/api";
import { useSettings } from "@/lib/SettingsContext";
import {
  isValidEmail,
  isValidPersonName,
  phoneError,
} from "@/lib/formValidation";

type MemberStatus = "Active" | "Inactive" | "Pending";

type TrainerOption = {
  _id: string;
  name: string;
  email?: string;
  status?: "active" | "inactive";
  assignedMemberCount?: number;
  assignedCount?: number;
  memberLimit?: number;
  isFull?: boolean;
};

type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: MemberStatus;
  assignedTrainerId?: string;
  assignedTrainerName?: string;
};

type MemberForm = {
  name: string;
  email: string;
  phone: string;
  password: string;
  status: MemberStatus;
};

const emptyForm: MemberForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  status: "Active",
};

function getArray<T>(response: any, key: string): T[] {
  const data = response?.data ?? response;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.[key])) return data.data[key];

  return [];
}

function normalizeStatus(status: unknown): MemberStatus {
  const value = String(status ?? "").toLowerCase();

  if (value === "active") return "Active";
  if (value === "inactive") return "Inactive";

  return "Pending";
}

function normalizeMember(item: any): Member {
  const assignedTrainer = item.assignedTrainer ?? item.trainer ?? null;

  const assignedTrainerId =
    typeof assignedTrainer === "string"
      ? assignedTrainer
      : assignedTrainer?._id ??
        assignedTrainer?.id ??
        item.assignedTrainerId ??
        "";

  const assignedTrainerName =
    (typeof assignedTrainer === "object" && assignedTrainer
      ? assignedTrainer.name ?? assignedTrainer.fullName ?? ""
      : "") ||
    item.assignedTrainerName ||
    item.trainerName ||
    "";

  return {
    id: String(item._id ?? item.id ?? ""),
    name: item.name ?? item.fullName ?? "Unnamed Member",
    email: item.email ?? "",
    phone: item.phone ?? item.phoneNumber ?? "",
    status: normalizeStatus(item.status),
    assignedTrainerId: String(assignedTrainerId || ""),
    assignedTrainerName: String(assignedTrainerName || ""),
  };
}

function statusClass(status: MemberStatus) {
  if (status === "Active") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Inactive") {
    return "bg-red-100 text-red-700";
  }

  return "bg-amber-100 text-amber-700";
}

/* -------------------------------------------------------
   MEMBER DETAILS VIEW
------------------------------------------------------- */

type MemberDetailsProps = {
  member: Member;
  onBack: () => void;
  onEdit: () => void;
};

function MemberDetails({ member, onBack, onEdit }: MemberDetailsProps) {
  const initials = member.name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formatPrice = (price?: number) => {
    if (typeof price !== "number") return "Not specified";

    return new Intl.NumberFormat("en-PK", {
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatDuration = (days?: number) => {
    if (typeof days !== "number") return "Not specified";

    if (days === 1) return "1 day";
    if (days < 30) return `${days} days`;

    if (days % 30 === 0) {
      const months = days / 30;
      return `${months} ${months === 1 ? "month" : "months"}`;
    }

    return `${days} days`;
  };

  return (
    <div className="min-h-screen space-y-6 bg-[#f8f6f2] p-4 text-[#342323] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-[#e7dcd6] bg-white px-4 py-2.5 text-sm font-semibold text-[#641d32] transition hover:bg-[#faf2f3]"
        >
          <span aria-hidden="true">←</span>
          Back to Members
        </button>

        <button
          type="button"
          onClick={onEdit}
          className="rounded-xl bg-[#641d32] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4b1725]"
        >
          Edit Member
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#eadfd9] bg-white shadow-sm">
        <div className="h-2 bg-[#641d32]" />

        <div className="p-5 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#641d32] text-2xl font-bold text-white shadow-sm">
              {initials || "M"}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-[#4b1725] sm:text-3xl">
                  {member.name}
                </h1>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                    member.status
                  )}`}
                >
                  {member.status}
                </span>
              </div>

              <div className="mt-3 flex flex-col gap-2 text-sm text-[#8b7771] sm:flex-row sm:flex-wrap sm:gap-5">
                <span className="flex items-center gap-2 break-all">
                  <span aria-hidden="true">✉</span>
                  {member.email || "No email provided"}
                </span>

                <span className="flex items-center gap-2">
                  <span aria-hidden="true">☎</span>
                  {member.phone || "No phone provided"}
                </span>
              </div>

              <p className="mt-3 text-xs text-[#a18f88]">
                Member ID: {member.id || "Not available"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-[#eadfd9] bg-white shadow-sm">
          <div className="border-b border-[#eee5e0] px-5 py-4">
            <h2 className="font-bold text-[#4b1725]">Personal Information</h2>
            <p className="mt-1 text-xs text-[#8b7771]">
              Member&apos;s basic contact details.
            </p>
          </div>

          <div className="space-y-5 p-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#a18f88]">
                Full Name
              </p>
              <p className="mt-1 font-semibold text-[#4b1725]">
                {member.name || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#a18f88]">
                Email Address
              </p>
              <p className="mt-1 break-all font-medium text-[#6f5b55]">
                {member.email || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#a18f88]">
                Phone Number
              </p>
              <p className="mt-1 font-medium text-[#6f5b55]">
                {member.phone || "—"}
              </p>
            </div>

            {/* Assigned Trainer */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#a18f88]">
                Assigned Trainer
              </p>
              <p className="mt-1 font-semibold text-[#641d32]">
                {member.assignedTrainerName || "No trainer assigned"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#a18f88]">
                Member ID
              </p>
              <p className="mt-1 break-all font-medium text-[#6f5b55]">
                {member.id || "—"}
              </p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#eadfd9] bg-white shadow-sm">
          <div className="space-y-5 p-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#a18f88]">
                Membership Status
              </p>
              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                  member.status
                )}`}
              >
                {member.status}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   MEMBERS PAGE
------------------------------------------------------- */

export default function MembersPage() {
  const { settings } = useSettings();
  const gymName = settings?.general?.gymName || "Gym Management";

  const [members, setMembers] = useState<Member[]>([]);
  const [trainers, setTrainers] = useState<TrainerOption[]>([]);

  const [loading, setLoading] = useState(true);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [trainersLoading, setTrainersLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [form, setForm] = useState<MemberForm>(emptyForm);

  const [trainerId, setTrainerId] = useState("");

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [error, setError] = useState("");

  const loadMembers = async () => {
    try {
      setLoading(true);

      const response: any = await apiFetch(
        "/api/admin/requests?role=member&status=all"
      );

      if (!response.ok) {
        throw new Error(response.data?.message || "Unable to load members.");
      }

      const rows = getArray<any>(response, "requests");
      const normalizedMembers = rows.map(normalizeMember);

      setMembers(normalizedMembers);

      setSelectedMember((current) => {
        if (!current) return null;

        return (
          normalizedMembers.find((member) => member.id === current.id) || null
        );
      });
    } catch (err:any) {
      console.error("Members loading error:", err);
      setError(err?.message || "Unable to load members.");
    } finally {
      setLoading(false);
    }
  };

  const loadTrainers = async () => {
    try {
      setTrainersLoading(true);

      const response = await apiFetch("/api/admin/trainers");

      if (!response.ok) {
        throw new Error(response.data?.message || "Unable to load trainers.");
      }

      const trainerList = getArray<TrainerOption>(response, "trainers");

      setTrainers(trainerList);
    } catch (err) {
      console.error("Trainer loading error:", err);
      setTrainers([]);
    } finally {
      setTrainersLoading(false);
    }
  };

  const loadOptions = async () => {
    try {
      setOptionsLoading(true);
    } catch (err) {
    } finally {
      setOptionsLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
    loadOptions();
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

  const openAddModal = () => {
    setEditingMember(null);
    setForm(emptyForm);
    setTrainerId("");
    setError("");
    setShowModal(true);

    loadTrainers();
  };

  const openEditModal = (member: Member) => {
    setEditingMember(member);

    setForm({
      name: member.name,
      email: member.email,
      phone: member.phone,
      password: "",

      status: member.status,
    });

    setTrainerId(member.assignedTrainerId || "");

    setError("");
    setShowModal(true);

    loadTrainers();
  };

  const closeModal = () => {
    if (submitting) return;

    setShowModal(false);
    setEditingMember(null);
    setForm(emptyForm);
    setTrainerId("");
    setError("");
  };

  const updateField = (field: keyof MemberForm, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!isValidPersonName(form.name)) {
      setError(
        "Enter a valid name using letters, spaces, apostrophes, or hyphens."
      );
      return;
    }

    if (!isValidEmail(form.email)) {
      setError("Enter a valid email address, such as name@example.com.");
      return;
    }

    const phoneValidationError = phoneError(form.phone);

    if (phoneValidationError) {
      setError(phoneValidationError);
      return;
    }

    if (!editingMember && form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      setSubmitting(true);

      if (editingMember) {
        const payload = {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          status: form.status.toLowerCase(),
          assignedTrainerId: trainerId || null,
        };

        const response = await apiFetch(
          `/api/admin/requests/${editingMember.id}`,
          {
            method: "PATCH",
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error(response.data?.message || "Unable to update member.");
        }
      } else {
        const payload = {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
          role: "member",
          status: form.status.toLowerCase(),
          message: "",
          photo: "",
          assignedTrainerId: trainerId || null,
        };

        const response = await apiFetch("/api/admin/requests", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(response.data?.message || "Unable to create member.");
        }
      }

      setShowModal(false);
      setEditingMember(null);
      setForm(emptyForm);
      setTrainerId("");
      setError("");

      await loadMembers();
      await loadTrainers();
    } catch (err: any) {
      console.error("Member save error:", err);
      setError(err?.message || "Unable to save member.");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async (member: Member) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${member.name}?`
    );

    if (!confirmed) return;

    try {
      const response: any = await apiFetch(`/api/admin/requests/${member.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(response.data?.message || "Unable to delete member.");
      }

      if (selectedMember?.id === member.id) {
        setSelectedMember(null);
      }

      await loadMembers();
      await loadTrainers();
    } catch (err: any) {
      alert(err?.message || "Unable to delete member.");
    }
  };

  const toggleStatus = async (member: Member) => {
    const nextStatus = member.status === "Active" ? "inactive" : "active";

    try {
      const response: any = await apiFetch(`/api/admin/requests/${member.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        throw new Error(
          response.data?.message || "Unable to update member status."
        );
      }

      await loadMembers();
    } catch (err: any) {
      alert(err?.message || "Unable to update member status.");
    }
  };

  const activeCount = members.filter(
    (member) => member.status === "Active"
  ).length;

  const inactiveCount = members.filter(
    (member) => member.status === "Inactive"
  ).length;

  const pendingCount = members.filter(
    (member) => member.status === "Pending"
  ).length;

  return (
    <AdminShell>
      {showModal ? null : selectedMember ? (
        <MemberDetails
          member={selectedMember}
          onBack={() => setSelectedMember(null)}
          onEdit={() => openEditModal(selectedMember)}
        />
      ) : (
        <div className="min-h-screen space-y-6 bg-[#f8f6f2] p-4 text-[#342323] sm:p-6">
          {/* Header */}
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
              onClick={openAddModal}
              className="rounded-xl bg-[#641d32] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4b1725]"
            >
              + Add Member
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#eadfd9] bg-white p-5 shadow-sm">
              <p className="text-sm text-[#8b7771]">Total Members</p>
              <p className="mt-2 text-3xl font-bold text-[#4b1725]">
                {members.length}
              </p>
            </div>

            <div className="rounded-2xl border border-[#eadfd9] bg-white p-5 shadow-sm">
              <p className="text-sm text-[#8b7771]">Active Members</p>
              <p className="mt-2 text-3xl font-bold text-green-700">
                {activeCount}
              </p>
            </div>

            <div className="rounded-2xl border border-[#eadfd9] bg-white p-5 shadow-sm">
              <p className="text-sm text-[#8b7771]">Inactive / Pending</p>
              <p className="mt-2 text-3xl font-bold text-[#9a6b16]">
                {inactiveCount + pendingCount}
              </p>
            </div>
          </div>

          {/* Search and filters */}
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
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-[#e7dcd6] bg-[#fffdfa] px-4 py-3 text-sm outline-none focus:border-[#641d32]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Error */}
          {error && !showModal && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Members table */}
          <div className="overflow-hidden rounded-2xl border border-[#eadfd9] bg-white shadow-sm">
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
                {/* Desktop table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#faf6f2] text-xs uppercase text-[#8b7771]">
                      <tr>
                        <th className="px-5 py-4">Member</th>
                        <th className="px-5 py-4">Phone</th>

                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4 text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#f0e8e3]">
                      {filteredMembers.map((member) => (
                        <tr
                          key={member.id}
                          onClick={() => setSelectedMember(member)}
                          className="cursor-pointer transition hover:bg-[#fcf8f5]"
                        >
                          <td className="px-5 py-4">
                            <div className="font-semibold text-[#4b1725]">
                              {member.name}
                            </div>
                            <div className="mt-1 text-xs text-[#8b7771]">
                              {member.email}
                            </div>
                          </td>

                          <td className="px-5 py-4 text-[#6f5b55]">
                            {member.phone || "—"}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                                member.status
                              )}`}
                            >
                              {member.status}
                            </span>
                          </td>

                          <td
                            className="px-5 py-4"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <details className="group relative flex justify-end">
                              <summary
                                aria-label={`Actions for ${member.name}`}
                                className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-[#e7dcd6] text-xl leading-none text-[#641d32] hover:bg-[#faf2f3] [&::-webkit-details-marker]:hidden"
                              >
                                ⋮
                              </summary>
                              <div className="absolute right-0 top-11 z-20 min-w-40 rounded-xl border border-[#eadfd9] bg-white p-1.5 shadow-lg">
                                <button
                                  onClick={() => openEditModal(member)}
                                  className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-[#641d32] hover:bg-[#faf2f3]"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => toggleStatus(member)}
                                  className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-[#6f5b55] hover:bg-[#faf6f2]"
                                >
                                  {member.status === "Active"
                                    ? "Deactivate"
                                    : "Activate"}
                                </button>
                                <button
                                  onClick={() => confirmDelete(member)}
                                  className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </details>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="space-y-3 p-4 md:hidden">
                  {filteredMembers.map((member) => (
                    <article
                      key={member.id}
                      onClick={() => setSelectedMember(member)}
                      className="cursor-pointer rounded-xl border border-[#eadfd9] bg-[#fffdfa] p-4 transition hover:border-[#c9aeb4]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate font-bold text-[#4b1725]">
                            {member.name}
                          </h3>
                          <p className="mt-1 break-all text-xs text-[#8b7771]">
                            {member.email}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                            member.status
                          )}`}
                        >
                          {member.status}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-[#9a8982]">Phone</p>
                          <p className="mt-1 font-medium">
                            {member.phone || "—"}
                          </p>
                        </div>
                      </div>

                      <div
                        className="mt-4 flex justify-end border-t border-[#eee5e0] pt-3"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <details className="group relative">
                          <summary
                            aria-label={`Actions for ${member.name}`}
                            className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-[#e7dcd6] text-xl leading-none text-[#641d32] hover:bg-[#faf2f3] [&::-webkit-details-marker]:hidden"
                          >
                            ⋮
                          </summary>
                          <div className="absolute right-0 top-11 z-20 min-w-40 rounded-xl border border-[#eadfd9] bg-white p-1.5 shadow-lg">
                            <button
                              onClick={() => openEditModal(member)}
                              className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-[#641d32] hover:bg-[#faf2f3]"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => toggleStatus(member)}
                              className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-[#6f5b55] hover:bg-[#faf6f2]"
                            >
                              {member.status === "Active"
                                ? "Deactivate"
                                : "Activate"}
                            </button>
                            <button
                              onClick={() => confirmDelete(member)}
                              className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </details>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Dashboard Add/Edit form */}
      {showModal && (
        <section className="min-h-screen space-y-6 bg-[#f8f6f2] p-4 text-[#342323] sm:p-6">
          <div className="mx-auto w-full max-w-5xl">
            {/* Form header */}
            <div className="mb-6 flex items-center justify-between rounded-2xl border border-[#eadfd9] bg-white px-5 py-5 sm:px-8">
              <div>
                <h2 className="text-xl font-bold text-[#4b1725] sm:text-2xl">
                  {editingMember ? "Edit Member" : "Add New Member"}
                </h2>
                <p className="mt-1 text-xs text-[#8b7771] sm:text-sm">
                  {editingMember
                    ? "Update the member details below."
                    : "Enter member details and optionally assign a trainer."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={submitting}
                className="rounded-lg px-3 py-2 text-2xl text-[#8b7771] hover:bg-[#f3eae5] disabled:opacity-50"
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            {/* Scrollable form area */}
            <div className="rounded-2xl border border-[#eadfd9] bg-white p-5 shadow-sm sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#4b1725]">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={(event) =>
                        updateField("name", event.target.value)
                      }
                      placeholder="Enter full name"
                      className="w-full rounded-xl border border-[#e7dcd6] bg-white px-4 py-3 text-sm outline-none focus:border-[#641d32]"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#4b1725]">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      placeholder="Enter email address"
                      className="w-full rounded-xl border border-[#e7dcd6] bg-white px-4 py-3 text-sm outline-none focus:border-[#641d32]"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#4b1725]">
                      Phone Number *
                    </label>
                    <input
                      required
                      type="tel"
                      inputMode="numeric"
                      maxLength={15}
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(event) =>
                        updateField("phone", event.target.value)
                      }
                      placeholder="Enter phone number"
                      className="w-full rounded-xl border border-[#e7dcd6] bg-white px-4 py-3 text-sm outline-none focus:border-[#641d32]"
                    />
                  </div>

                  {/* Password - only when adding */}
                  {!editingMember && (
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#4b1725]">
                        Password *
                      </label>
                      <input
                        required
                        type="password"
                        minLength={8}
                        autoComplete="new-password"
                        value={form.password}
                        onChange={(event) =>
                          updateField("password", event.target.value)
                        }
                        placeholder="At least 8 characters"
                        className="w-full rounded-xl border border-[#e7dcd6] bg-white px-4 py-3 text-sm outline-none focus:border-[#641d32]"
                      />
                    </div>
                  )}

                  {/* Optional Trainer Assignment */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#4b1725]">
                      Assign Trainer
                      <span className="ml-2 font-normal text-[#9b8982]">
                        (Optional)
                      </span>
                    </label>

                    <select
                      value={trainerId}
                      onChange={(event) => setTrainerId(event.target.value)}
                      disabled={trainersLoading}
                      className="w-full rounded-xl border border-[#e7dcd6] bg-white px-4 py-3 text-sm outline-none focus:border-[#641d32] disabled:opacity-60"
                    >
                      <option value="">
                        {trainersLoading
                          ? "Loading trainers..."
                          : "No trainer assigned"}
                      </option>

                      {trainers.map((trainer) => {
                        const count =
                          trainer.assignedMemberCount ??
                          trainer.assignedCount ??
                          0;

                        const limit = trainer.memberLimit ?? 20;

                        const isFull =
                          trainer.isFull === true || count >= limit;

                        const isCurrent =
                          editingMember?.assignedTrainerId === trainer._id;
                        const isInactive = trainer.status === "inactive";

                        return (
                          <option
                            key={trainer._id}
                            value={trainer._id}
                            disabled={
                              (isFull && !isCurrent) ||
                              (isInactive && !isCurrent)
                            }
                          >
                            {trainer.name} ({count}/{limit} members)
                            {isFull ? " - Full" : ""}
                            {isInactive ? " - Inactive" : ""}
                          </option>
                        );
                      })}
                    </select>

                    <p className="mt-2 text-xs text-[#8b7771]">
                      {editingMember
                        ? "Select a trainer or leave empty to remove the current assignment."
                        : "You can leave this empty. The member will be created without an assigned trainer."}
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#4b1725]">
                      Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(event) =>
                        updateField("status", event.target.value)
                      }
                      className="w-full rounded-xl border border-[#e7dcd6] bg-white px-4 py-3 text-sm outline-none focus:border-[#641d32]"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>

                {/* Bottom actions */}
                <div className="flex flex-col-reverse gap-3 border-t border-[#eadfd9] pt-6 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={submitting}
                    className="rounded-xl border border-[#e7dcd6] px-6 py-3 text-sm font-semibold text-[#6f5b55] hover:bg-[#f7f0ec] disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-[#641d32] px-8 py-3 text-sm font-semibold text-white hover:bg-[#4b1725] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting
                      ? "Saving..."
                      : editingMember
                      ? "Update Member"
                      : "Create Member"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}
    </AdminShell>
  );
}
