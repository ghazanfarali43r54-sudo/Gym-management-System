"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { apiFetch } from "@/lib/api";
import { useSettings } from "@/lib/SettingsContext";
import {
  isValidEmail,
  isValidPersonName,
  phoneError,
} from "@/lib/formValidation";
import MemberFitnessRecords from "@/components/admin/MemberFitnessRecords";
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

type MembershipPlanOption = { _id: string; name: string; price: number; description?: string; status?: "active" | "inactive" };

type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: MemberStatus;
  assignedTrainerId?: string;
  assignedTrainerName?: string;
  gender: string;
  dateOfBirth: string;
  address: { street: string; city: string; country: string };
  emergencyContact: { name: string; relationship: string; phone: string };
  photo: string;
  membershipPlans: MembershipPlanOption[];
  measurementCount: number;
};

type MemberForm = {
  name: string;
  email: string;
  phone: string;
  password: string;
  status: MemberStatus;
  gender: string;
  dateOfBirth: string;
  street: string;
  city: string;
  country: string;
  emergencyName: string;
  emergencyRelationship: string;
  emergencyPhone: string;
  confirmPassword: string;
};

const emptyForm: MemberForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  status: "Active",
  gender: "",
  dateOfBirth: "",
  street: "",
  city: "",
  country: "",
  emergencyName: "",
  emergencyRelationship: "",
  emergencyPhone: "",
  confirmPassword: "",
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
    gender: item.gender ?? "",
    dateOfBirth: item.dateOfBirth ? String(item.dateOfBirth).slice(0, 10) : "",
    address: item.address ?? { street: "", city: "", country: "" },
    emergencyContact: item.emergencyContact ?? { name: "", relationship: "", phone: "" },
    photo: item.photo ?? "",
    membershipPlans: Array.isArray(item.membershipPlans) ? item.membershipPlans.map((plan: any) => typeof plan === "string" ? { _id: plan, name: "Membership plan", price: 0 } : plan) : [],
    measurementCount: Number(item.measurementCount ?? 0),
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
  onEdit: () => void;
};

function MemberDetails({ member, onEdit }: MemberDetailsProps) {
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
      <div className="flex flex-wrap items-center justify-end gap-">

        <button
          type="button"
          onClick={onEdit}
          className="rounded-xl bg-[#641d32]   px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4b1725]"
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

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#a18f88]">Membership Plans</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {member.membershipPlans.length ? member.membershipPlans.map((plan) => <span key={plan._id} className="rounded-full bg-[#f3eae5] px-3 py-1 text-xs font-semibold text-[#641d32]">{plan.name}</span>) : <span className="text-sm text-[#8b7771]">No plans assigned</span>}
              </div>
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
      <MemberFitnessRecords memberId={member.id} />
    </div>
  );
}

/* -------------------------------------------------------
   MEMBERS PAGE
------------------------------------------------------- */

function MembersPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { settings } = useSettings();
  const gymName = settings?.general?.gymName || "Gym Management";

  const [members, setMembers] = useState<Member[]>([]);
  const [trainers, setTrainers] = useState<TrainerOption[]>([]);
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlanOption[]>([]);
  const [membershipPlanIds, setMembershipPlanIds] = useState<string[]>([]);
  const [photo, setPhoto] = useState("");
  const [photoError, setPhotoError] = useState("");

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
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(new Date().toISOString().slice(0, 10));
  }, []);

  // Native <details> menus stay open until their own summary is toggled.
  // Close an open actions menu when the pointer lands elsewhere on the page.
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

  // Keep detail selection in the URL so browser back returns to the member list.
  useEffect(() => {
    const memberId = searchParams.get("member");
    if (!memberId || searchParams.get("view") === "list") {
      setSelectedMember(null);
      return;
    }
    const matchingMember = members.find((member) => member.id === memberId);
    if (matchingMember) setSelectedMember(matchingMember);
  }, [searchParams, members]);

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
      const response: any = await apiFetch("/api/public/membership-plans");
      if (!response.ok) throw new Error(response.data?.message || "Unable to load membership plans.");
      setMembershipPlans(getArray<MembershipPlanOption>(response, "data"));
    } catch (err) {
      setMembershipPlans([]);
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
    setMembershipPlanIds([]);
    setPhoto("");
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
      gender: member.gender,
      dateOfBirth: member.dateOfBirth,
      street: member.address.street || "",
      city: member.address.city || "",
      country: member.address.country || "",
      emergencyName: member.emergencyContact.name || "",
      emergencyRelationship: member.emergencyContact.relationship || "",
      emergencyPhone: member.emergencyContact.phone || "",
      confirmPassword: "",
    });

    setMembershipPlanIds(member.membershipPlans.map((plan) => plan._id));
    setPhoto(member.photo || "");

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
    setMembershipPlanIds([]);
    setPhoto("");
    setError("");
  };

  const updateField = (field: keyof MemberForm, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handlePhoto = async (file?: File) => {
    if (!file) return;
    setPhotoError("");
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setPhotoError("Choose a PNG, JPG, or WEBP image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setPhotoError("Photo must be smaller than 2 MB.");
      return;
    }
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Image processing is unavailable.");
      const side = Math.min(bitmap.width, bitmap.height);
      context.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, 256, 256);
      bitmap.close();
      setPhoto(canvas.toDataURL("image/jpeg", 0.85));
    } catch {
      setPhotoError("Unable to process this photo.");
    }
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

    if (!editingMember && form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (!editingMember && form.password.length > 72) {
      setError("Password must be 72 characters or fewer.");
      return;
    }

    if (!editingMember && form.confirmPassword !== form.password) {
      setError("Passwords do not match.");
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
          gender: form.gender || "",
          dateOfBirth: form.dateOfBirth || null,
          address: { street: form.street.trim(), city: form.city.trim(), country: form.country.trim() },
          emergencyContact: { name: form.emergencyName.trim(), relationship: form.emergencyRelationship.trim(), phone: form.emergencyPhone.trim() },
          membershipPlanIds,
          photo,
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
          assignedTrainerId: trainerId || null,
          gender: form.gender || "",
          dateOfBirth: form.dateOfBirth || null,
          address: { street: form.street.trim(), city: form.city.trim(), country: form.country.trim() },
          emergencyContact: { name: form.emergencyName.trim(), relationship: form.emergencyRelationship.trim(), phone: form.emergencyPhone.trim() },
          membershipPlanIds,
          photo,
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
      setMembershipPlanIds([]);
      setPhoto("");
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

  const openFitnessEntry = (member: Member, type: "body-measurement" | "fitness-assessment") => {
    router.push(`/admin/members/${encodeURIComponent(member.id)}/fitness/${type}`);
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
                {/* Desktop table */}
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
                          onClick={() => {
                            setSelectedMember(member);
                            router.push(`/admin/members?member=${encodeURIComponent(member.id)}`);
                          }}
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
                            <span className="inline-flex min-w-9 items-center justify-center rounded-full bg-[#f3eae5] px-3 py-1 text-xs font-semibold text-[#641d32]" title={`${member.measurementCount} body measurement record${member.measurementCount === 1 ? "" : "s"}`}>
                              {member.measurementCount}
                            </span>
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
                              <div className={`absolute right-0 z-20 min-w-48 rounded-xl border border-[#eadfd9] bg-white p-1.5 shadow-lg ${index === filteredMembers.length - 1 ? "bottom-11" : "top-11"}`}>
                                <button
                                  onClick={() => openEditModal(member)}
                                  className="w-full whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-medium text-[#641d32] hover:bg-[#faf2f3]"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => openFitnessEntry(member, "body-measurement")}
                                  className="w-full whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-medium text-[#641d32] hover:bg-[#faf2f3]"
                                >
                                  Body Measurement
                                </button>
                                <button
                                  onClick={() => openFitnessEntry(member, "fitness-assessment")}
                                  className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-[#641d32] hover:bg-[#faf2f3]"
                                >
                                  Fitness Assessment
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
                  {filteredMembers.map((member, index) => (
                    <article
                      key={member.id}
                      onClick={() => {
                        setSelectedMember(member);
                        router.push(`/admin/members?member=${encodeURIComponent(member.id)}`);
                      }}
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
                        <div>
                          <p className="text-[#9a8982]">Measurements</p>
                          <p className="mt-1 font-semibold text-[#641d32]">
                            {member.measurementCount}
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
                          <div className={`absolute right-0 z-20 min-w-48 rounded-xl border border-[#eadfd9] bg-white p-1.5 shadow-lg ${index === filteredMembers.length - 1 ? "bottom-11" : "top-11"}`}>
                            <button
                              onClick={() => openEditModal(member)}
                              className="w-full whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-medium text-[#641d32] hover:bg-[#faf2f3]"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => openFitnessEntry(member, "body-measurement")}
                              className="w-full whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-medium text-[#641d32] hover:bg-[#faf2f3]"
                            >
                              Body Measurement
                            </button>
                            <button
                              onClick={() => openFitnessEntry(member, "fitness-assessment")}
                              className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-[#641d32] hover:bg-[#faf2f3]"
                            >
                              Fitness Assessment
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
                    : "Enter member details and optionally assign plans or a trainer."}
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

          <div className="mb-6 rounded-xl border border-[#e7dcd6] bg-[#fffdfa] p-4">
            <h3 className="text-sm font-semibold text-[#4b1725]">Profile Picture <span className="font-normal text-[#8b7771]">(Optional)</span></h3>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#f3eae5] text-xl font-bold text-[#641d32]">{photo ? <img src={photo} alt="Member profile preview" className="h-full w-full object-cover" /> : form.name.trim().charAt(0).toUpperCase() || "M"}</div>
              <div><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => { void handlePhoto(event.target.files?.[0]); event.target.value = ""; }} className="block text-sm" /><p className="mt-1 text-xs text-[#8b7771]">PNG, JPG or WEBP, maximum 2 MB.</p>{photo && <button type="button" onClick={() => setPhoto("")} className="mt-1 text-xs font-semibold text-[#641d32] underline">Remove photo</button>}{photoError && <p className="mt-1 text-xs text-red-700">{photoError}</p>}</div>
            </div>
          </div>
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
                        minLength={6}
                        maxLength={72}
                        autoComplete="new-password"
                        value={form.password}
                        onChange={(event) =>
                          updateField("password", event.target.value)
                        }
                        placeholder="At least 6 characters"
                        className="w-full rounded-xl border border-[#e7dcd6] bg-white px-4 py-3 text-sm outline-none focus:border-[#641d32]"
                      />
                    </div>
                  )}

                  {!editingMember && (
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#4b1725]">Confirm Password *</label>
                      <input required type="password" minLength={6} maxLength={72} autoComplete="new-password" value={form.confirmPassword} onChange={(event) => updateField("confirmPassword", event.target.value)} placeholder="Confirm password" className="w-full rounded-xl border border-[#e7dcd6] bg-white px-4 py-3 text-sm outline-none focus:border-[#641d32]" />
                    </div>
                  )}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#4b1725]">Date of Birth</label>
                    <input type="date" value={form.dateOfBirth} max={today || undefined} onChange={(event) => updateField("dateOfBirth", event.target.value)} className="w-full rounded-xl border border-[#e7dcd6] bg-white px-4 py-3 text-sm outline-none focus:border-[#641d32]" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#4b1725]">Gender</label>
                    <select value={form.gender} onChange={(event) => updateField("gender", event.target.value)} className="w-full rounded-xl border border-[#e7dcd6] bg-white px-4 py-3 text-sm outline-none focus:border-[#641d32]">
                      <option value="">Select gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 border-t border-[#eadfd9] pt-4"><h3 className="font-semibold text-[#4b1725]">Address</h3></div>
                  {[ ["street", "Street"], ["city", "City"], ["country", "Country"] ].map(([key, label]) => (
                    <div key={key}><label className="mb-2 block text-sm font-semibold text-[#4b1725]">{label}</label><input value={form[key as keyof MemberForm] as string} onChange={(event) => updateField(key as keyof MemberForm, event.target.value)} maxLength={key === "street" ? 150 : 100} className="w-full rounded-xl border border-[#e7dcd6] bg-white px-4 py-3 text-sm outline-none focus:border-[#641d32]" /></div>
                  ))}
                  <div className="md:col-span-2 border-t border-[#eadfd9] pt-4"><h3 className="font-semibold text-[#4b1725]">Emergency Contact <span className="font-normal text-[#9b8982]">(complete all fields if provided)</span></h3></div>
                  {([["emergencyName", "Name"], ["emergencyRelationship", "Relationship"], ["emergencyPhone", "Phone"]] as const).map(([key, label]) => (
                    <div key={key}><label className="mb-2 block text-sm font-semibold text-[#4b1725]">{label}</label><input type={key === "emergencyPhone" ? "tel" : "text"} value={form[key]} onChange={(event) => updateField(key, event.target.value)} maxLength={key === "emergencyName" ? 60 : key === "emergencyRelationship" ? 50 : 15} className="w-full rounded-xl border border-[#e7dcd6] bg-white px-4 py-3 text-sm outline-none focus:border-[#641d32]" /></div>
                  ))}

                  <div className="md:col-span-2 border-t border-[#eadfd9] pt-4">
                    <h3 className="font-semibold text-[#4b1725]">Membership Plans <span className="font-normal text-[#9b8982]">(Optional, select any active plans)</span></h3>
                    {(() => {
                      const currentInactivePlans = editingMember?.membershipPlans.filter((plan) => plan.status === "inactive" && !membershipPlans.some((active) => active._id === plan._id)) || [];
                      const visiblePlans = [...membershipPlans, ...currentInactivePlans];
                      return visiblePlans.length === 0 ? <p className="mt-2 text-sm text-[#8b7771]">No active plans available.</p> : <div className="mt-3 grid gap-3 sm:grid-cols-2">{visiblePlans.map((plan) => <label key={plan._id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#e7dcd6] p-3"><input type="checkbox" checked={membershipPlanIds.includes(plan._id)} disabled={plan.status === "inactive" && !membershipPlanIds.includes(plan._id)} onChange={(event) => setMembershipPlanIds((current) => event.target.checked ? [...current, plan._id] : current.filter((id) => id !== plan._id))} className="mt-1 accent-[#641d32]" /><span><span className="block text-sm font-semibold text-[#4b1725]">{plan.name}</span><span className="text-xs text-[#8b7771]">{plan.status === "inactive" ? "Inactive · currently assigned" : `PKR ${plan.price}${plan.description ? ` · ${plan.description}` : ""}`}</span></span></label>)}</div>;
                    })()}
                  </div>

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

export default function MembersPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading members...</div>}>
      <MembersPageContent />
    </Suspense>
  );
}
