"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useRouter } from "next/navigation";

import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Dumbbell,
  Users,
  Snowflake,
  Loader2,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ================= API CONFIG ================= */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

const PLANS_URL = `${API_BASE}/api/membership-plans`;
const FEATURES_URL = `${API_BASE}/api/features`;

/* ================= TYPES ================= */

type Feature = {
  _id: string;
  name: string;
  description?: string;
  category?: "equipment" | "training" | "facility" | "service";
  status?: "active" | "inactive";
};

type MembershipPlan = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  duration: {
    value: number;
    unit: string;
  };
  status: "active" | "inactive";
  features?: (string | Feature)[];
  limits?: {
    personalTrainingSessions?: number;
    groupClassesPerMonth?: number;
  };
  freezeAllowed?: boolean;
  maxFreezeDays?: number;
};

/* ================= API HELPERS ================= */

function authHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}

async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers ?? {}),
    },
    credentials: "include",
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      body?.message || body?.error || `Request failed (${res.status})`
    );
  }

  return body as T;
}

function unwrap<T>(body: any, keys: string[]): T {
  if (body == null) return body;

  if (Array.isArray(body)) return body as T;

  for (const key of keys) {
    if (body[key] !== undefined) {
      return body[key] as T;
    }
  }

  return body as T;
}

/* ================= HELPERS ================= */

const formatPrice = (price: number) =>
  "Rs. " + price.toLocaleString("en-PK");

const formatDuration = (duration: MembershipPlan["duration"]) =>
  `${duration.value} ${duration.unit}${
    duration.value > 1 ? "s" : ""
  }`;

function toFeatureArray(value: unknown): (string | Feature)[] {
  if (Array.isArray(value)) {
    return value as (string | Feature)[];
  }

  if (value) {
    return [value as string | Feature];
  }

  return [];
}

function featureIdOf(f: string | Feature): string {
  return typeof f === "string" ? f : f._id;
}

/* ================= MEMBERSHIP PAGE ================= */

export default function MembershipPage() {
  // FIX: useRouter must be inside the component
  const router = useRouter();

  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [allFeatures, setAllFeatures] = useState<Feature[]>([]);

  const [featuresError, setFeaturesError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [deleteTarget, setDeleteTarget] =
    useState<MembershipPlan | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const sliderRef = useRef<HTMLDivElement>(null);

  /* ================= SLIDER ================= */

  function scrollSlider(direction: "left" | "right") {
    sliderRef.current?.scrollBy({
      left: direction === "left" ? -340 : 340,
      behavior: "smooth",
    });
  }

  /* ================= FEATURE NAME ================= */

  function featureName(f: string | Feature): string | null {
    if (typeof f !== "string") {
      return f.name;
    }

    return allFeatures.find((x) => x._id === f)?.name ?? null;
  }

  /* ================= LOAD FEATURES ================= */

  const loadFeatures = useCallback(async () => {
    setFeaturesError("");

    try {
      const body = await request<any>(FEATURES_URL);

      const list = unwrap<Feature[]>(body, [
        "data",
        "features",
      ]);

      setAllFeatures(Array.isArray(list) ? list : []);
    } catch (err) {
      setFeaturesError(
        err instanceof Error
          ? err.message
          : "Could not load features"
      );
    }
  }, []);

  /* ================= LOAD PLANS ================= */

  const loadPlans = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    try {
      const body = await request<any>(PLANS_URL);

      const list = unwrap<MembershipPlan[]>(body, [
        "data",
        "plans",
        "membershipPlans",
      ]);

      setPlans(Array.isArray(list) ? list : []);
    } catch (err) {
      setLoadError(
        err instanceof Error
          ? err.message
          : "Could not load plans"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    loadFeatures();
    loadPlans();
  }, [loadFeatures, loadPlans]);

  /* ================= FILTER PLANS ================= */

  const filteredPlans = useMemo(() => {
    const term = search.trim().toLowerCase();

    return plans.filter((p) => {
      const matchesStatus =
        statusFilter === "all" || p.status === statusFilter;

      const matchesSearch =
        !term ||
        p.name.toLowerCase().includes(term) ||
        (p.description ?? "").toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [plans, search, statusFilter]);

  /* ================= SUMMARY ================= */

  const activeCount = plans.filter(
    (p) => p.status === "active"
  ).length;

  const inactiveCount = plans.length - activeCount;

  /* ================= DELETE PLAN ================= */

  async function confirmDelete() {
    if (!deleteTarget) return;

    setDeleting(true);
    setDeleteError("");

    try {
      await request(
        `${PLANS_URL}/${deleteTarget._id}`,
        {
          method: "DELETE",
        }
      );

      setPlans((current) =>
        current.filter((p) => p._id !== deleteTarget._id)
      );

      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(
        err instanceof Error
          ? err.message
          : "Could not delete plan"
      );
    } finally {
      setDeleting(false);
    }
  }

  /* ================= UI ================= */

  return (
    <AdminShell>
      <main className="min-h-screen bg-[#F8F5F0] p-4 text-[#352126] sm:p-6 lg:p-8">
        <div className="mx-auto max-w-[1600px] space-y-7">

          {/* HEADER */}

          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#541629] sm:text-4xl">
                Membership Plans
              </h1>

              <p className="mt-2 text-sm text-[#866F74] sm:text-base">
                Create and manage the plans your gym offers.
              </p>
            </div>

            <button
              onClick={() =>
                router.push("/admin/membership/add")
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#721D35] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#541629]"
            >
              <Plus size={18} />
              Add plan
            </button>
          </header>

          {/* SUMMARY */}

          <section className="grid grid-cols-3 gap-4">
            <Summary
              label="Total plans"
              value={plans.length}
            />

            <Summary
              label="Active"
              value={activeCount}
            />

            <Summary
              label="Inactive"
              value={inactiveCount}
            />
          </section>

          {/* FILTERS */}

          <section className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative sm:w-[300px]">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A18B90]"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search plans"
                className="w-full rounded-xl border border-[#E9DDE0] bg-white py-3 pl-10 pr-4 text-sm outline-none placeholder:text-[#AD999E] focus:border-[#721D35] focus:ring-2 focus:ring-[#721D35]/10"
              />
            </div>

            <div className="inline-flex rounded-xl border border-[#E9DDE0] bg-white p-1">
              {(["all", "active", "inactive"] as const).map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition ${
                      statusFilter === s
                        ? "bg-[#721D35] text-white"
                        : "text-[#866F74] hover:bg-[#F3E5E9]"
                    }`}
                  >
                    {s}
                  </button>
                )
              )}
            </div>
          </section>

          {/* CONTENT */}

          {loading ? (
            <div className="flex items-center justify-center gap-3 rounded-2xl border border-[#E9DDE0] bg-white py-20 text-[#866F74]">
              <Loader2
                className="animate-spin"
                size={20}
              />
              Loading plans
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-100 bg-white py-16 text-center">
              <AlertCircle
                className="text-red-500"
                size={32}
              />

              <p className="font-semibold text-[#541629]">
                Plans could not be loaded
              </p>

              <p className="max-w-md text-sm text-[#866F74]">
                {loadError}
              </p>

              <button
                onClick={loadPlans}
                className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#721D35] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#541629]"
              >
                <RefreshCw size={16} />
                Try again
              </button>
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E9DDE0] bg-white py-16 text-center">
              <p className="font-semibold text-[#541629]">
                {plans.length === 0
                  ? "No plans yet"
                  : "No plans match your search"}
              </p>

              <p className="text-sm text-[#947B80]">
                {plans.length === 0
                  ? "Add your first membership plan to get started."
                  : "Try a different search or status filter."}
              </p>

              {plans.length === 0 && (
                <button
                  onClick={() =>
                    router.push("/admin/membership/add")
                  }
                  className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#721D35] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#541629]"
                >
                  <Plus size={16} />
                  Add plan
                </button>
              )}
            </div>
          ) : (
            <div className="relative">

              {/* LEFT SCROLL */}

              <button
                onClick={() => scrollSlider("left")}
                aria-label="Scroll plans left"
                className="absolute -left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#E9DDE0] bg-white text-[#721D35] shadow-md transition hover:bg-[#F3E5E9] md:flex"
              >
                <ChevronLeft size={22} />
              </button>

              {/* RIGHT SCROLL */}

              <button
                onClick={() => scrollSlider("right")}
                aria-label="Scroll plans right"
                className="absolute -right-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#E9DDE0] bg-white text-[#721D35] shadow-md transition hover:bg-[#F3E5E9] md:flex"
              >
                <ChevronRight size={22} />
              </button>

              {/* PLAN SLIDER */}

              <div
                ref={sliderRef}
                className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-1 pb-4 pt-1"
              >
                {filteredPlans.map((plan) => {
                  const planFeatures = toFeatureArray(
                    plan.features
                  )
                    .map((f) => ({
                      id: featureIdOf(f),
                      name: featureName(f),
                    }))
                    .filter(
                      (
                        f
                      ): f is {
                        id: string;
                        name: string;
                      } => !!f.name
                    );

                  return (
                    <article
                      key={plan._id}
                      className={`flex w-[300px] shrink-0 snap-start flex-col rounded-2xl border border-[#E9DDE0] bg-white p-5 shadow-sm sm:w-[320px] ${
                        plan.status === "inactive"
                          ? "opacity-75"
                          : ""
                      }`}
                    >

                      {/* PLAN HEADER */}

                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-xl font-bold text-[#541629]">
                          {plan.name}
                        </h3>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            plan.status === "active"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-stone-100 text-stone-600"
                          }`}
                        >
                          {plan.status}
                        </span>
                      </div>

                      {/* DESCRIPTION */}

                      {plan.description && (
                        <p className="mt-1 text-sm text-[#947B80]">
                          {plan.description}
                        </p>
                      )}

                      {/* PRICE */}

                      <p className="mt-5 text-3xl font-bold tracking-tight text-[#541629]">
                        {formatPrice(plan.price)}
                      </p>

                      <p className="mt-1 text-sm text-[#947B80]">
                        for {formatDuration(plan.duration)}
                      </p>

                      <div className="my-5 h-px bg-[#F0E5E5]" />

                      {/* FEATURES */}

                      <ul className="flex-1 space-y-3">
                        {planFeatures.map((feature) => (
                          <li
                            key={feature.id}
                            className="flex items-start gap-2 text-sm text-[#735C62]"
                          >
                            <Check
                              size={17}
                              className="mt-0.5 shrink-0 text-[#721D35]"
                            />

                            <span>{feature.name}</span>
                          </li>
                        ))}

                        {/* PERSONAL TRAINING */}

                        <li className="flex items-start gap-2 text-sm text-[#735C62]">
                          <Dumbbell
                            size={17}
                            className="mt-0.5 shrink-0 text-[#721D35]"
                          />

                          <span>
                            {plan.limits
                              ?.personalTrainingSessions ?? 0}{" "}
                            personal training sessions
                          </span>
                        </li>

                        {/* GROUP CLASSES */}

                        <li className="flex items-start gap-2 text-sm text-[#735C62]">
                          <Users
                            size={17}
                            className="mt-0.5 shrink-0 text-[#721D35]"
                          />

                          <span>
                            {plan.limits?.groupClassesPerMonth ??
                              0}{" "}
                            group classes per month
                          </span>
                        </li>

                        {/* FREEZE */}

                        <li className="flex items-start gap-2 text-sm text-[#735C62]">
                          <Snowflake
                            size={17}
                            className="mt-0.5 shrink-0 text-[#721D35]"
                          />

                          <span>
                            {plan.freezeAllowed
                              ? `Freeze allowed, up to ${plan.maxFreezeDays} days`
                              : "Freeze not allowed"}
                          </span>
                        </li>
                      </ul>

                      {/* ACTIONS */}

                      <div className="mt-6 flex gap-2">
                        <button
                          onClick={() =>
                            router.push(
                              `/admin/membership/edit/${plan._id}`
                            )
                          }
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#721D35] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#541629]"
                        >
                          <Pencil size={15} />
                          Edit
                        </button>

                        <button
                          title="Delete plan"
                          aria-label={`Delete ${plan.name}`}
                          onClick={() => {
                            setDeleteError("");
                            setDeleteTarget(plan);
                          }}
                          className="rounded-xl border border-red-100 px-3 text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* DELETE CONFIRMATION */}

        {deleteTarget && (
          <Modal
            title="Delete plan"
            onClose={() =>
              !deleting && setDeleteTarget(null)
            }
          >
            <p className="text-sm text-[#735C62]">
              Delete{" "}
              <span className="font-semibold text-[#541629]">
                {deleteTarget.name}
              </span>
              ? This cannot be undone.
            </p>

            {deleteError && (
              <p className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle
                  size={16}
                  className="mt-0.5 shrink-0"
                />
                {deleteError}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 rounded-xl border border-[#E9DDE0] px-4 py-3 text-sm font-semibold text-[#721D35] hover:bg-[#F3E5E9] disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting && (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                )}
                Delete plan
              </button>
            </div>
          </Modal>
        )}
      </main>
    </AdminShell>
  );
}

/* ================= SUMMARY COMPONENT ================= */

function Summary({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-[#E9DDE0] bg-white p-5 shadow-sm">
      <p className="text-sm text-[#947B80]">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-[#541629]">
        {value}
      </p>
    </div>
  );
}

/* ================= MODAL COMPONENT ================= */

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#291018]/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-[#E9DDE0] bg-[#FDFBFA] p-6 shadow-2xl">

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#541629]">
            {title}
          </h2>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-[#721D35] hover:bg-[#F3E5E9]"
          >
            <X size={20} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}