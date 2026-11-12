
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApiFetch } from "@/lib/api";

interface Feature {
  _id: string;
  name: string;
  description: string;
  category: "equipment" | "training" | "facility" | "service";
  status: "active" | "inactive";
}

interface FeatureFormProps {
  featureId?: string;
}

export default function FeatureForm({ featureId }: FeatureFormProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(!!featureId);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "facility" as Feature["category"],
    status: "active" as Feature["status"],
  });

  // Load existing feature for editing
  useEffect(() => {
    if (!featureId) return;

    const fetchFeature = async () => {
      try {
        const result = await adminApiFetch("/api/features/admin");

        if (result.ok && result.data?.success) {
          const feature = (result.data.data || []).find(
            (item: Feature) => item._id === featureId
          );

          if (!feature) {
            setError("Feature not found.");
            return;
          }

          setFormData({
            name: feature.name,
            description: feature.description || "",
            category: feature.category,
            status: feature.status,
          });
        } else {
          setError(result.data?.message || "Could not load feature.");
        }
      } catch {
        setError("Could not connect to the server.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchFeature();
  }, [featureId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Feature name is required.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const result = await adminApiFetch(
        featureId
          ? `/api/features/${featureId}`
          : "/api/features",
        {
          method: featureId ? "PUT" : "POST",
          body: JSON.stringify({
            ...formData,
            name: formData.name.trim(),
          }),
        }
      );

      if (!result.ok || !result.data?.success) {
        setError(result.data?.message || "Could not save feature.");
        return;
      }

      router.push("/admin/features");
      router.refresh();
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-[#866F74]">
        Loading feature...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0] p-4 md:p-8">

      <div className="mx-auto max-w-9xl">

        <div className="mb-8">
        
          <h1 className="text-2xl font-bold text-[#721D35]">
            {featureId ? "Edit Feature" : "Add New Feature"}
          </h1>

          <p className="mt-1 text-sm text-[#866F74]">
            {featureId
              ? "Update your existing feature details."
              : "Create a new membership feature."}
          </p>
        </div>

        <div className="rounded-xl border border-[#E9DDE0] bg-white p-6 shadow-sm md:p-8">

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="mb-2 block text-sm font-medium text-[#541629]">
                Feature Name *
              </label>

              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                placeholder="Enter feature name"
                className="w-full rounded-lg border border-[#E9DDE0] bg-white px-4 py-3 text-sm outline-none focus:border-[#721D35] focus:ring-2 focus:ring-[#721D35]/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#541629]">
                Description
              </label>

              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                placeholder="Enter feature description"
                className="w-full rounded-lg border border-[#E9DDE0] bg-white px-4 py-3 text-sm outline-none focus:border-[#721D35]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#541629]">
                Category
              </label>

              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as Feature["category"],
                  })
                }
                className="w-full rounded-lg border border-[#E9DDE0] bg-white px-4 py-3 text-sm outline-none focus:border-[#721D35]"
              >
                <option value="equipment">Equipment</option>
                <option value="training">Training</option>
                <option value="facility">Facility</option>
                <option value="service">Service</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#541629]">
                Status
              </label>

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as Feature["status"],
                  })
                }
                className="w-full rounded-lg border border-[#E9DDE0] bg-white px-4 py-3 text-sm outline-none focus:border-[#721D35]"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[#E9DDE0] pt-6 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => router.push("/admin/features")}
                className="rounded-lg border border-[#E9DDE0] px-6 py-3 text-sm font-medium text-[#866F74] hover:bg-[#F3E5E9]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="rounded-lg bg-[#721D35] px-6 py-3 text-sm font-medium text-white hover:bg-[#541629] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving
                  ? "Saving..."
                  : featureId
                    ? "Update Feature"
                    : "Save Feature"}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
