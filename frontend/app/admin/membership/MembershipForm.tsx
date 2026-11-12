
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { ArrowLeft, Loader2, Save, AlertCircle } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

const PLANS_URL = `${API_BASE}/api/membership-plans`;
const FEATURES_URL = `${API_BASE}/api/features`;

type Feature = {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  status?: string;
};

type DurationUnit = "day" | "week" | "month";

type MembershipPlan = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  duration: {
    value: number;
    unit: DurationUnit;
  };
  features: (string | Feature)[];
  status: "active" | "inactive";
};

type FormState = {
  name: string;
  description: string;
  price: string;
  durationValue: string;
  durationUnit: DurationUnit;
  features: string[];
  status: "active" | "inactive";
};

const initialForm: FormState = {
  name: "",
  description: "",
  price: "",
  durationValue: "",
  durationUnit: "month",
  features: [],
  status: "active",
};

const PLAN_NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M} .,'&()\-]*$/u;
const MAX_NAME_LENGTH = 80;
const MAX_DESCRIPTION_LENGTH = 500;

function isValidPlanName(value: string) {
  const name = value.trim();
  return (
    name.length > 0 &&
    name.length <= MAX_NAME_LENGTH &&
    PLAN_NAME_PATTERN.test(name)
  );
}

function hasValidTextContent(value: string) {
  return !/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value);
}

function getHeaders(): HeadersInit {
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

async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers ?? {}),
    },
    credentials: "include",
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      body?.message || body?.error || `Request failed (${response.status})`
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

function getFeatureIds(features: unknown): string[] {
  if (!Array.isArray(features)) return [];

  return features
    .map((feature) =>
      typeof feature === "string" ? feature : feature?._id
    )
    .filter(Boolean);
}

type MembershipFormProps = {
  planId?: string;
};

export default function MembershipForm({ planId = "" }: MembershipFormProps) {
  const router = useRouter();
  const isEdit = Boolean(planId);

  const [form, setForm] = useState<FormState>(initialForm);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [featureError, setFeatureError] = useState("");

  useEffect(() => {
    async function loadFormData() {
      setLoading(true);
      setError("");
      setFeatureError("");

      try {
        const featureResponse = await apiRequest<any>(FEATURES_URL);
        const featureList = unwrap<Feature[]>(featureResponse, [
          "data",
          "features",
        ]);

        setFeatures(
          Array.isArray(featureList)
            ? featureList.filter(
                (feature) => feature.status !== "inactive"
              )
            : []
        );

        if (isEdit) {
          const plansResponse = await apiRequest<any>(PLANS_URL);
          const plans = unwrap<MembershipPlan[]>(plansResponse, [
            "data",
            "plans",
            "membershipPlans",
          ]);

          const plan = Array.isArray(plans)
            ? plans.find((item) => item._id === planId)
            : null;

          if (!plan) {
            throw new Error("Membership plan not found.");
          }

          setForm({
            name: plan.name ?? "",
            description: plan.description ?? "",
            price: String(plan.price ?? ""),
            durationValue: String(plan.duration?.value ?? 1),
            durationUnit: plan.duration?.unit ?? "month",
            features: getFeatureIds(plan.features),
            status: plan.status ?? "active",
          });
        } else {
          // The add route can reuse this component after an edit route.
          // Reset explicitly so a new plan never inherits the previous plan.
          setForm(initialForm);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not load membership form."
        );
      } finally {
        setLoading(false);
      }
    }

    loadFormData();
  }, [isEdit, planId]);

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function toggleFeature(featureId: string) {
    setForm((current) => ({
      ...current,
      features: current.features.includes(featureId)
        ? current.features.filter((id) => id !== featureId)
        : [...current.features, featureId],
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const price = Number(form.price);
    const durationValue = Number(form.durationValue);

    if (!form.name.trim()) {
      setError("Please enter the membership plan name.");
      return;
    }

    if (!isValidPlanName(form.name)) {
      setError("Plan name must be 1–80 characters and use letters, spaces, or basic punctuation only (no numbers).");
      return;
    }

    if (
      form.description.length > MAX_DESCRIPTION_LENGTH ||
      !hasValidTextContent(form.description)
    ) {
      setError("Description must be 500 characters or fewer and cannot contain control characters.");
      return;
    }

    if (
      !/^\d+(?:\.\d{1,2})?$/.test(form.price) ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      setError("Price must be a non-negative amount with no more than two decimal places.");
      return;
    }

    if (
      !/^\d+$/.test(form.durationValue) ||
      !Number.isSafeInteger(durationValue) ||
      durationValue < 1
    ) {
      setError("Duration must be a positive whole number.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      duration: {
        value: durationValue,
        unit: form.durationUnit,
      },
      features: form.features,
      status: form.status,
    };

    setSaving(true);

    try {
      await apiRequest(
        isEdit ? `${PLANS_URL}/${planId}` : PLANS_URL,
        {
          method: isEdit ? "PUT" : "POST",
          body: JSON.stringify(payload),
        }
      );

      router.push("/admin/membership");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not save membership plan."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell>
      <main className="min-h-screen bg-[#f8f0f0] p-4 text-[#352126] sm:p-6 lg:p-8">
        <div className="mx-auto max-w-9xl space-y-6">

          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#541629]">
                {isEdit ? "Edit Membership Plan" : "Add Membership Plan"}
              </h1>

              <p className="mt-2 text-sm text-[#866F74]">
                {isEdit
                  ? "Update your membership plan details."
                  : "Create a new membership plan for your gym."}
              </p>
            </div>

          </header>

          {loading ? (
            <div className="flex items-center justify-center gap-3 rounded-2xl border border-[#E9DDE0] bg-white py-20 text-[#866F74]">
              <Loader2 className="animate-spin" size={22} />
              Loading form...
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-2xl border border-[#E9DDE0] bg-white p-5 shadow-sm sm:p-8"
            >
              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <AlertCircle size={19} className="mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <section className="space-y-5">
                <h2 className="text-lg font-bold text-[#541629]">
                  Basic Information
                </h2>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Plan Name *
                  </label>

                  <input
                    required
                    maxLength={MAX_NAME_LENGTH}
                    autoComplete="off"
                    aria-describedby="plan-name-help"
                    value={form.name}
                    onChange={(e) =>
                      updateField("name", e.target.value)
                    }
                    placeholder="e.g. Monthly Premium"
                    className="w-full rounded-xl border border-[#E9DDE0] px-4 py-3 outline-none focus:border-[#721D35]"
                  />
                  <p id="plan-name-help" className="mt-1 text-xs text-[#866F74]">
                    Use letters, spaces, and basic punctuation. Numbers are not allowed.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Description
                  </label>

                  <textarea
                    rows={4}
                    maxLength={MAX_DESCRIPTION_LENGTH}
                    aria-describedby="plan-description-help"
                    value={form.description}
                    onChange={(e) =>
                      updateField("description", e.target.value)
                    }
                    placeholder="Describe what this membership plan includes..."
                    className="w-full resize-y rounded-xl border border-[#E9DDE0] px-4 py-3 outline-none focus:border-[#721D35]"
                  />
                  <p id="plan-description-help" className="mt-1 text-xs text-[#866F74]">
                    Up to {MAX_DESCRIPTION_LENGTH} characters.
                  </p>
                </div>
              </section>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Price (Rs.) *
                  </label>

                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                    }}
                    value={form.price}
                    onChange={(e) =>
                      updateField("price", e.target.value)
                    }
                    placeholder="5000"
                    className="w-full rounded-xl border border-[#E9DDE0] px-4 py-3 outline-none focus:border-[#721D35]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Duration *
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      required
                      type="number"
                      min="1"
                      step="1"
                      inputMode="numeric"
                      onKeyDown={(e) => {
                        if (["e", "E", ".", ",", "+", "-"].includes(e.key)) e.preventDefault();
                      }}
                      value={form.durationValue}
                      onChange={(e) =>
                        updateField("durationValue", e.target.value)
                      }
                      className="min-w-0 rounded-xl border border-[#E9DDE0] px-4 py-3 outline-none focus:border-[#721D35]"
                    />

                    <select
                      value={form.durationUnit}
                      onChange={(e) =>
                        updateField(
                          "durationUnit",
                          e.target.value as DurationUnit
                        )
                      }
                      className="min-w-0 rounded-xl border border-[#E9DDE0] px-3 py-3 outline-none focus:border-[#721D35]"
                    >
                      <option value="day">Days</option>
                      <option value="week">Weeks</option>
                      <option value="month">Months</option>
                    </select>
                  </div>
                </div>
              </div>

              <section className="space-y-3">
                <div>
                  <h2 className="text-lg font-bold text-[#541629]">
                    Plan Features
                  </h2>
                  <p className="mt-1 text-sm text-[#866F74]">
                    Select the features included in this membership.
                  </p>
                </div>

                {featureError && (
                  <p className="text-sm text-red-600">
                    {featureError}
                  </p>
                )}

                {features.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#E9DDE0] bg-[#FCFAF8] p-5 text-sm text-[#866F74]">
                    No active features found. You can still save this plan.
                  </div>
                ) : (
                  <div className="grid max-h-72 gap-3 overflow-y-auto overscroll-contain rounded-xl border border-[#E9DDE0] bg-[#FCFAF8] p-3 sm:grid-cols-2">
                    {features.map((feature) => {
                      const checked = form.features.includes(feature._id);

                      return (
                        <label
                          key={feature._id}
                          className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                            checked
                              ? "border-[#721D35] bg-[#F9EFF2]"
                              : "border-[#E9DDE0] hover:bg-[#FCFAF8]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleFeature(feature._id)}
                            className="mt-1 h-4 w-4 accent-[#721D35]"
                          />

                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-[#541629]">
                              {feature.name}
                            </span>

                            {feature.description && (
                              <span className="mt-1 block text-xs text-[#866F74]">
                                {feature.description}
                              </span>
                            )}

                            {feature.category && (
                              <span className="mt-2 inline-block text-xs capitalize text-[#947B80]">
                                {feature.category}
                              </span>
                            )}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </section>

              <section>
                <label className="mb-2 block text-sm font-semibold">
                  Plan Status
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    updateField(
                      "status",
                      e.target.value as "active" | "inactive"
                    )
                  }
                  className="w-full rounded-xl border border-[#E9DDE0] px-4 py-3 outline-none focus:border-[#721D35] sm:max-w-xs"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </section>

              <div className="flex flex-col-reverse gap-3 border-t border-[#F0E7E9] pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => router.push("/admin/membership")}
                  disabled={saving}
                  className="rounded-xl border border-[#E9DDE0] px-6 py-3 text-sm font-semibold text-[#721D35] hover:bg-[#F3E5E9] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#721D35] px-7 py-3 text-sm font-semibold text-white hover:bg-[#541629] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      {isEdit ? "Update Plan" : "Save Plan"}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </AdminShell>
  );
}
