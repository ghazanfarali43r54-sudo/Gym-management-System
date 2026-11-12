"use client";

import { FormEvent, useMemo, useState, useEffect } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useSettings } from "@/lib/SettingsContext";
import { apiFetch } from "@/lib/api";
import {
  isValidEmail,
  isValidPersonName,
  phoneError,
} from "@/lib/formValidation";
import { useRouter } from "next/navigation";

/* =========================================================
   TYPES
========================================================= */

type TrainerStatus = "Active" | "Inactive";

type Trainer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: number;
  status: TrainerStatus;
  memberLimit: number;
  assignedMemberCount: number;
};

type TrainerForm = {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: string;
  password: string;
  status: TrainerStatus;
  memberLimit: string;
};

type ApiTrainer = {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  specialization?: string;
  experience?: number;
  status?: string;
  memberLimit?: number;
  assignedMemberCount?: number;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  trainers?: ApiTrainer[];
  trainer?: ApiTrainer;
};

/* =========================================================
   DEFAULT DATA
========================================================= */

const emptyForm: TrainerForm = {
  name: "",
  email: "",
  phone: "",
  specialization: "",
  experience: "",
  password: "",
  status: "Active",
  memberLimit: "20",
};

/* =========================================================
   ICONS
========================================================= */

type IconName =
  | "users"
  | "check"
  | "inactive"
  | "plus"
  | "search"
  | "filter"
  | "edit"
  | "trash"
  | "close"
  | "trainer"
  | "mail"
  | "phone"
  | "briefcase"
  | "dots"
  | "chevronDown";

const iconPaths: Record<IconName, React.ReactNode> = {
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
    </>
  ),
  inactive: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 8l8 8M16 8l-8 8" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  filter: (
    <>
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </>
  ),
  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </>
  ),
  trash: (
    <>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v5M14 11v5" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
  trainer: (
    <>
      <path d="M3 10v4M6.5 7v10M17.5 7v10M21 10v4M6.5 12h11" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  phone: (
    <>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
    </>
  ),
  dots: (
    <>
      <circle cx="12" cy="5" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  chevronDown: <path d="m6 9 6 6 6-6" />,
};

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
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

/* =========================================================
   PAGE
========================================================= */

export default function TrainersPage() {
  const { settings } = useSettings();

  const router = useRouter();

  const openTrainerDashboard = (trainerId: string) => {
    router.push(`/admin/trainers/${trainerId}/dashboard`);
  };

  const gymName = settings?.general?.gymName?.trim() || "GymMaster Pro";

  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<"All" | TrainerStatus>(
    "All"
  );

  const [modalOpen, setModalOpen] = useState(false);

  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);

  const [form, setForm] = useState<TrainerForm>(emptyForm);

  const [deleteTrainer, setDeleteTrainer] = useState<Trainer | null>(null);

  // Close trainer action menus when a pointer press lands outside the open menu.
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

  /* =======================================================
     FETCH TRAINERS
  ======================================================= */

  const fetchTrainers = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const result = await apiFetch("/api/admin/trainers");
      const data = result.data as ApiResponse;

      if (!result.ok) {
        throw new Error(data.message || "Failed to load trainers");
      }

      const list = data.trainers || [];

      setTrainers(
        list.map((item) => ({
          id: item._id,
          name: item.name || "",
          email: item.email || "",
          phone: item.phone || "",
          specialization: item.specialization || "",
          experience: item.experience || 0,
          status: item.status === "active" ? "Active" : "Inactive",
          memberLimit: Number(item.memberLimit ?? 20),
          assignedMemberCount: Number(item.assignedMemberCount ?? 0),
        }))
      );
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchTrainers();
    }, 0);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =======================================================
     FILTER TRAINERS
  ======================================================= */

  const filteredTrainers = useMemo(() => {
    return trainers.filter((trainer) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        trainer.name.toLowerCase().includes(searchValue) ||
        trainer.email.toLowerCase().includes(searchValue) ||
        (trainer.phone || "").toLowerCase().includes(searchValue) ||
        (trainer.specialization || "").toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || trainer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [trainers, search, statusFilter]);

  const activeCount = trainers.filter(
    (trainer) => trainer.status === "Active"
  ).length;

  const inactiveCount = trainers.filter(
    (trainer) => trainer.status === "Inactive"
  ).length;

  /* =======================================================
     OPEN ADD MODAL
  ======================================================= */

  const openAddModal = () => {
    setEditingTrainer(null);
    setForm(emptyForm);
    setErrorMessage("");
    setModalOpen(true);
  };

  /* =======================================================
     OPEN EDIT MODAL
  ======================================================= */

  const openEditModal = (trainer: Trainer) => {
    setEditingTrainer(trainer);

    setForm({
      name: trainer.name,
      email: trainer.email,
      phone: trainer.phone,
      specialization: trainer.specialization,
      experience: String(trainer.experience || ""),
      password: "",
      status: trainer.status,
      memberLimit: String(trainer.memberLimit ?? 20),
    });

    setErrorMessage("");
    setModalOpen(true);
  };

  /* =======================================================
     FORM SUBMIT
  ======================================================= */

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidPersonName(form.name)) {
      setErrorMessage(
        "Enter a valid name using letters, spaces, apostrophes, or hyphens."
      );
      return;
    }

    if (!isValidEmail(form.email)) {
      setErrorMessage("Enter a valid email address, such as name@example.com.");
      return;
    }

    const phoneValidationError = phoneError(form.phone, false);

    if (phoneValidationError) {
      setErrorMessage(phoneValidationError);
      return;
    }

    if (
      form.experience.trim() &&
      (!Number.isFinite(Number(form.experience)) || Number(form.experience) < 0)
    ) {
      setErrorMessage("Experience must be a zero or positive number of years.");
      return;
    }

    const memberLimit = Number(form.memberLimit);

    if (!Number.isSafeInteger(memberLimit) || memberLimit < 1) {
      setErrorMessage("Member limit must be a positive whole number.");
      return;
    }

    setSaving(true);
    setErrorMessage("");

    if (!editingTrainer && form.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      setSaving(false);
      return;
    }

    try {
      const payload: Record<string, unknown> = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        specialization: form.specialization.trim(),
        experience: Number(form.experience || 0),
        status: form.status === "Active" ? "active" : "inactive",
        memberLimit: memberLimit,
      };

      if (form.password.trim()) {
        payload.password = form.password;
      }

      const result = await apiFetch(
        editingTrainer
          ? `/api/admin/trainers/${editingTrainer.id}`
          : "/api/admin/trainers",
        {
          method: editingTrainer ? "PUT" : "POST",
          body: JSON.stringify(payload),
        }
      );

      if (!result.ok) {
        throw new Error(result.data?.message || "Unable to save trainer");
      }

      setModalOpen(false);
      setForm(emptyForm);
      setEditingTrainer(null);

      await fetchTrainers();
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     DELETE TRAINER
  ======================================================= */

  const confirmDelete = async () => {
    if (!deleteTrainer) return;

    setSaving(true);
    setErrorMessage("");

    try {
      const result = await apiFetch(`/api/admin/trainers/${deleteTrainer.id}`, {
        method: "DELETE",
      });

      if (!result.ok) {
        throw new Error(result.data?.message || "Unable to delete trainer");
      }

      setDeleteTrainer(null);
      await fetchTrainers();
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     TOGGLE STATUS
  ======================================================= */

  const toggleStatus = async (trainer: Trainer) => {
    setErrorMessage("");

    try {
      const newStatus = trainer.status === "Active" ? "inactive" : "active";

      const result = await apiFetch(`/api/admin/trainers/${trainer.id}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });

      if (!result.ok) {
        throw new Error(result.data?.message || "Unable to update status");
      }

      await fetchTrainers();
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  /* =======================================================
     INPUT HANDLER
  ======================================================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((previous: TrainerForm) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <AdminShell>
      {!modalOpen && (
       
      <div className="min-h-screen w-full min-w-0 max-w-none overflow-x-hidden bg-[#f8f6f2] px-0 py-6 text-[#292323]">
          <div className="">
            {/* HEADER */}

            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#800020]">
                  {gymName}
                </p>

                <h1 className="text-3xl font-bold text-[#2b2022]">
                  Trainers Management
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Manage your gym trainers, profiles and activity.
                </p>
              </div>

              <button
                onClick={openAddModal}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#800020] px-5 py-3 font-semibold text-white shadow-md transition hover:bg-[#650019]"
              >
                <Icon name="plus" />
                Add New Trainer
              </button>
            </div>

            {/* ERROR MESSAGE */}

            {errorMessage && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            {/* STATS */}

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#eee7e4] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Trainers</p>
                    <h2 className="mt-2 text-3xl font-bold text-[#800020]">
                      {trainers.length}
                    </h2>
                  </div>

                  <div className="rounded-xl bg-[#f7e9ed] p-3 text-[#800020]">
                    <Icon name="users" className="h-6 w-6" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#eee7e4] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Trainers</p>
                    <h2 className="mt-2 text-3xl font-bold text-green-700">
                      {activeCount}
                    </h2>
                  </div>

                  <div className="rounded-xl bg-green-50 p-3 text-green-700">
                    <Icon name="check" className="h-6 w-6" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#eee7e4] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Inactive Trainers</p>
                    <h2 className="mt-2 text-3xl font-bold text-gray-600">
                      {inactiveCount}
                    </h2>
                  </div>

                  <div className="rounded-xl bg-gray-100 p-3 text-gray-600">
                    <Icon name="inactive" className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* TRAINERS SECTION */}

            <div className="overflow-visible rounded-2xl border border-[#eee7e4] bg-white shadow-sm">
              <div className="border-b border-[#eee7e4] p-5">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                  <div>
                    <h2 className="text-xl font-bold text-[#302326]">
                      All Trainers
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      View and manage all registered trainers.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    {/* SEARCH */}

                    <div className="relative">
                      <Icon
                        name="search"
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search trainers..."
                        className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#800020] sm:w-64"
                      />
                    </div>

                    {/* FILTER */}

                    <div className="relative">
                      <Icon
                        name="filter"
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                      />

                      <select
                        value={statusFilter}
                        onChange={(e) =>
                          setStatusFilter(
                            e.target.value as "All" | TrainerStatus
                          )
                        }
                        className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-9 text-sm outline-none focus:border-[#800020] sm:w-40"
                      >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>

                      <Icon
                        name="chevronDown"
                        className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* LOADING */}

              {loading ? (
                <div className="p-12 text-center text-gray-500">
                  Loading trainers...
                </div>
              ) : filteredTrainers.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#f7e9ed] text-[#800020]">
                    <Icon name="trainer" className="h-7 w-7" />
                  </div>

                  <h3 className="font-semibold text-gray-800">
                    No trainers found
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Add a trainer or change your search filters.
                  </p>
                </div>
              ) : (
                <>
                  {/* DESKTOP TABLE */}

                   <div className="hidden w-full max-w-full overflow-visible md:block">
                   <table className="w-full table-fixed text-left"> 
                      <thead className="bg-[#faf8f6] text-xs uppercase tracking-wider text-gray-500">
                        <tr>
                          <th className="px-3 py-4 font-semibold">Trainer</th>
                          <th className="px-3 py-4 font-semibold">Contact</th>
                          <th className="px-3 py-4 font-semibold">
                            Specialization
                          </th>
                          <th className="px-3 py-4 font-semibold">
                            Experience
                          </th>
                          <th className="px-3 py-4 font-semibold">
                            Member Capacity
                          </th>
                          <th className="px-3 py-4 font-semibold">Status</th>
                          <th className="px-3 py-4 text-right font-semibold">
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100">
                        {filteredTrainers.map((trainer, index) => (
                          <tr
                            key={trainer.id}
                            onClick={() => openTrainerDashboard(trainer.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                openTrainerDashboard(trainer.id);
                              }
                            }}
                            tabIndex={0}
                            role="link"
                            aria-label={`Open ${trainer.name}'s dashboard`}
                            className="cursor-pointer transition hover:bg-[#f9edf0] focus:bg-[#f9edf0] focus:outline-none"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f4e5e9] font-bold text-[#800020]">
                                  {initials(trainer.name)}
                                </div>

                                <div>
                                  <p className="font-semibold text-gray-800">
                                    {trainer.name}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    Trainer
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div className="space-y-1 text-sm">
                                <p className="flex items-center gap-2 text-gray-700">
                                  <Icon
                                    name="mail"
                                    className="h-3.5 w-3.5 text-gray-400"
                                  />
                                  {trainer.email}
                                </p>

                                <p className="flex items-center gap-2 text-gray-500">
                                  <Icon
                                    name="phone"
                                    className="h-3.5 w-3.5 text-gray-400"
                                  />
                                  {trainer.phone || "Not provided"}
                                </p>
                              </div>
                            </td>

                            <td className="px-6 py-4 text-sm text-gray-600">
                              {trainer.specialization || "General Fitness"}
                            </td>

                            <td className="px-6 py-4 text-sm text-gray-600">
                              {trainer.experience} years
                            </td>

                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                <p className="text-sm font-semibold text-gray-800">
                                  {trainer.assignedMemberCount} /{" "}
                                  {trainer.memberLimit}
                                </p>

                                <p
                                  className={`text-xs font-medium ${
                                    trainer.assignedMemberCount >=
                                    trainer.memberLimit
                                      ? "text-red-600"
                                      : "text-green-700"
                                  }`}
                                >
                                  {trainer.assignedMemberCount >=
                                  trainer.memberLimit
                                    ? "Capacity Full"
                                    : `${
                                        trainer.memberLimit -
                                        trainer.assignedMemberCount
                                      } slots available`}
                                </p>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  trainer.status === "Active"
                                    ? "bg-green-50 text-green-700"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {trainer.status}
                              </span>
                            </td>

                            <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                              <details className="group relative flex justify-end">
                                <summary aria-label={`Actions for ${trainer.name}`} title="Trainer actions" className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-gray-200 text-xl leading-none text-gray-600 transition hover:border-[#800020] hover:bg-[#f9edf0] hover:text-[#800020] [&::-webkit-details-marker]:hidden">⋮</summary>
                                <div className={`absolute right-0 z-20 min-w-40 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg ${index === filteredTrainers.length - 1 ? "bottom-11" : "top-11"}`}>
                                  <button onClick={() => openEditModal(trainer)} className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-[#f9edf0]">Edit</button>
                                  <button onClick={() => toggleStatus(trainer)} className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">{trainer.status === "Active" ? "Deactivate" : "Activate"}</button>
                                  <button onClick={() => setDeleteTrainer(trainer)} className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50">Delete</button>
                                </div>
                              </details>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* MOBILE CARDS */}

                  <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
                    {filteredTrainers.map((trainer, index) => (
                      <div
                        key={trainer.id}
                        onClick={() => openTrainerDashboard(trainer.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            openTrainerDashboard(trainer.id);
                          }
                        }}
                        tabIndex={0}
                        role="link"
                        aria-label={`Open ${trainer.name}'s dashboard`}
                        className="cursor-pointer rounded-xl border border-gray-100 p-4 transition hover:border-[#e5c4ce] hover:bg-[#fdf9fa] focus:outline-none focus:ring-2 focus:ring-[#800020]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f4e5e9] font-bold text-[#800020]">
                              {initials(trainer.name)}
                            </div>

                            <div>
                              <h3 className="font-bold text-gray-800">
                                {trainer.name}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {trainer.specialization || "General Fitness"}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              trainer.status === "Active"
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {trainer.status}
                          </span>
                        </div>

                        <div className="mt-4 space-y-2 text-sm text-gray-600">
                          <p className="flex items-center gap-2 break-all">
                            <Icon name="mail" className="h-4 w-4 shrink-0" />
                            {trainer.email}
                          </p>

                          <p className="flex items-center gap-2">
                            <Icon name="phone" className="h-4 w-4 shrink-0" />
                            {trainer.phone || "Not provided"}
                          </p>

                          <p className="flex items-center gap-2">
                            <Icon
                              name="briefcase"
                              className="h-4 w-4 shrink-0"
                            />
                            {trainer.experience} years experience
                          </p>
                        </div>

                        <div className="mt-4 rounded-xl border border-[#eee7e4] bg-[#faf8f6] p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Member Capacity
                          </p>

                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-800">
                              {trainer.assignedMemberCount} /{" "}
                              {trainer.memberLimit} Members
                            </span>

                            <span
                              className={`text-xs font-semibold ${
                                trainer.assignedMemberCount >=
                                trainer.memberLimit
                                  ? "text-red-600"
                                  : "text-green-700"
                              }`}
                            >
                              {trainer.assignedMemberCount >=
                              trainer.memberLimit
                                ? "Full"
                                : `${
                                    trainer.memberLimit -
                                    trainer.assignedMemberCount
                                  } Available`}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end border-t border-gray-100 pt-3" onClick={(e) => e.stopPropagation()}>
                          <details className="group relative">
                            <summary aria-label={`Actions for ${trainer.name}`} title="Trainer actions" className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-gray-200 text-xl leading-none text-gray-600 transition hover:border-[#800020] hover:bg-[#f9edf0] hover:text-[#800020] [&::-webkit-details-marker]:hidden">⋮</summary>
                            <div className={`absolute right-0 z-20 min-w-40 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg ${index === filteredTrainers.length - 1 ? "bottom-11" : "top-11"}`}>
                              <button onClick={() => openEditModal(trainer)} className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-[#f9edf0]">Edit</button>
                              <button onClick={() => toggleStatus(trainer)} className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">{trainer.status === "Active" ? "Deactivate" : "Activate"}</button>
                              <button onClick={() => setDeleteTrainer(trainer)} className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50">Delete</button>
                            </div>
                          </details>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* FOOTER */}

              {!loading && filteredTrainers.length > 0 && (
                <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-500">
                  Showing {filteredTrainers.length} of {trainers.length}{" "}
                  trainers
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Add/Edit form */}
      {modalOpen && (
        <section className="min-h-screen bg-[#f8f6f2] px-4 py-6 text-[#292323] sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-[#302326]">
                  {editingTrainer ? "Edit Trainer" : "Add New Trainer"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingTrainer
                    ? "Update trainer information."
                    : "Enter details to register a new trainer."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Back to Trainers
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              autoComplete="off"
              className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              {errorMessage && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Full Name *</label>
                  <input type="text" autoComplete="off" name="name" value={form.name} onChange={handleChange} required placeholder="Enter trainer name" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#800020]" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Email Address *</label>
                  <input type="email" autoComplete="off" name="email" value={form.email} onChange={handleChange} required placeholder="trainer@example.com" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#800020]" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Phone Number</label>
                  <input type="tel" inputMode="numeric" maxLength={15} autoComplete="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Enter phone number" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#800020]" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Specialization</label>
                  <input type="text" name="specialization" value={form.specialization} onChange={handleChange} placeholder="e.g. Weight Training" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#800020]" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Experience (Years)</label>
                  <input type="number" name="experience" min="0" value={form.experience} onChange={handleChange} placeholder="e.g. 3 years" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#800020]" />
                </div>
                {/* PASSWORD */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Password {editingTrainer ? "(Optional)" : "*"}
                  </label>

                  <input
                    type="password"
                    autoComplete="new-password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required={!editingTrainer}
                    minLength={6}
                    placeholder={
                      editingTrainer
                        ? "Leave blank to keep current password"
                        : "Minimum 6 characters"
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#800020]"
                  />
                </div>

                {/* STATUS */}

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Account Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#800020]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>

                  {/* MEMBER ASSIGNMENT LIMIT */}

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Member Assignment Limit *
                    </label>

                    <input
                      type="number"
                      name="memberLimit"
                      min="1"
                      step="1"
                      inputMode="numeric"
                      value={form.memberLimit}
                      onChange={handleChange}
                      required
                      placeholder="Enter maximum members"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#800020]"
                    />

                    <p className="mt-1 text-xs text-gray-500">
                      Maximum number of members this trainer can manage. Default
                      capacity is 20 members.
                    </p>
                  </div>
                </div>
              </div>

              {/* BUTTONS */}

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#800020] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#650019] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingTrainer
                    ? "Update Trainer"
                    : "Add Trainer"}
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* DELETE CONFIRMATION */}

      {deleteTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Icon name="trash" className="h-6 w-6" />
            </div>

            <h2 className="text-xl font-bold text-gray-800">Delete Trainer?</h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                {deleteTrainer.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setDeleteTrainer(null)}
                disabled={saving}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={saving}
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {saving ? "Deleting..." : "Delete Trainer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
