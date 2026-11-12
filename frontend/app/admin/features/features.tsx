"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

interface Feature {
  _id: string;
  name: string;
  description: string;
  category: "equipment" | "training" | "facility" | "service";
  status: "active" | "inactive";
}

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "facility" as Feature["category"],
    status: "active" as Feature["status"],
  });

  const loadFeatures = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await adminApiFetch("/api/features/admin");
      if (result.ok && result.data?.success) {
        setFeatures(result.data.data || []);
        setError("");
      } else {
        setError(result.data?.message || "Could not load features.");
      }
    } catch {
      setError("Could not connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFeatures();
  }, [loadFeatures]);

  const filteredFeatures = features.filter((feature) => {
    const matchesSearch = feature.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || feature.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const activeCount = features.filter(
    (feature) => feature.status === "active"
  ).length;

  const openAddModal = () => {
    setEditingFeature(null);
    setFormData({
      name: "",
      description: "",
      category: "facility",
      status: "active",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (feature: Feature) => {
    setEditingFeature(feature);
    setFormData({
      name: feature.name,
      description: feature.description,
      category: feature.category,
      status: feature.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) return;

    setIsSaving(true);
    setError("");
    const result = await adminApiFetch(
      editingFeature ? `/api/features/${editingFeature._id}` : "/api/features",
      {
        method: editingFeature ? "PUT" : "POST",
        body: JSON.stringify({ ...formData, name: formData.name.trim() }),
      }
    );
    setIsSaving(false);
    if (!result.ok || !result.data?.success) {
      setError(result.data?.message || "Could not save feature.");
      return;
    }
    setIsModalOpen(false);
    await loadFeatures();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setError("");
    const result = await adminApiFetch(`/api/features/${deleteId}`, {
      method: "DELETE",
    });
    if (!result.ok || !result.data?.success) {
      setError(result.data?.message || "Could not delete feature.");
      return;
    }
    setDeleteId(null);
    await loadFeatures();
  };

  const toggleStatus = async (feature: Feature) => {
    setError("");
    const result = await adminApiFetch(`/api/features/${feature._id}`, {
      method: "PUT",
      body: JSON.stringify({
        status: feature.status === "active" ? "inactive" : "active",
      }),
    });
    if (!result.ok || !result.data?.success) {
      setError(result.data?.message || "Could not update feature status.");
      return;
    }
    await loadFeatures();
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] p-4 text-[#352126] md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#721D35]">
            Features Management
          </h1>
          <p className="mt-1 text-sm text-[#866F74]">
            Manage features available for membership plans.
          </p>
        </div>

        <button
          onClick={() => router.push("/admin/features/add")}
          className="rounded-lg bg-[#721D35] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#541629]"
        >
          + Add Feature
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#E9DDE0] bg-[#FFFFFF] p-5 shadow-sm">
          <p className="text-sm text-[#866F74]">Total Features</p>
          <h2 className="mt-2 text-2xl font-bold text-[#721D35]">
            {features.length}
          </h2>
        </div>

        <div className="rounded-xl border border-[#E9DDE0] bg-[#FFFFFF] p-5 shadow-sm">
          <p className="text-sm text-[#866F74]">Active Features</p>
          <h2 className="mt-2 text-2xl font-bold text-green-600">
            {activeCount}
          </h2>
        </div>

        <div className="rounded-xl border border-[#E9DDE0] bg-[#FFFFFF] p-5 shadow-sm">
          <p className="text-sm text-[#866F74]">Inactive Features</p>
          <h2 className="mt-2 text-2xl font-bold text-red-500">
            {features.length - activeCount}
          </h2>
        </div>
      </div>

      {/* Features Table */}
      <div className="overflow-hidden rounded-xl border border-[#E9DDE0] bg-[#FFFFFF] shadow-sm">
        <div className="flex flex-col gap-3 border-b border-[#E9DDE0] p-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-semibold text-[#541629]">All Features</h2>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Search features..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-[#E9DDE0] bg-[#FFFFFF] px-4 py-2 text-sm outline-none focus:border-[#721D35] focus:ring-2 focus:ring-[#721D35]/10"
            />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-[#E9DDE0] bg-[#FFFFFF] px-4 py-2 text-sm outline-none focus:border-[#721D35]"
            >
              <option value="all">All Categories</option>
              <option value="equipment">Equipment</option>
              <option value="training">Training</option>
              <option value="facility">Facility</option>
              <option value="service">Service</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F3E5E9] text-xs uppercase text-[#866F74]">
              <tr>
                <th className="px-6 py-4">Feature Name</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F0E5E5]">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-[#866F74]"
                  >
                    Loading features...
                  </td>
                </tr>
              ) : (
                filteredFeatures.map((feature) => (
                  <tr
                    key={feature._id}
                    className="transition hover:bg-[#FAF5F5]"
                  >
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-[#541629]">
                      {feature.name}
                    </td>

                    <td className="max-w-xs px-6 py-4 text-[#866F74]">
                      {feature.description || "-"}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-[#721D35]/10 px-3 py-1 text-xs font-medium capitalize text-[#721D35]">
                        {feature.category}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => void toggleStatus(feature)}
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                          feature.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {feature.status}
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() =>
                            router.push(`/admin/features/Edit/${feature._id}`)
                          }
                          className="font-medium text-[#721D35] hover:text-[#541629]"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => setDeleteId(feature._id)}
                          className="font-medium text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}

              {!isLoading && filteredFeatures.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-[#866F74]"
                  >
                    No features found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-[#E9DDE0] bg-[#FFFFFF] p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#721D35]">
                {editingFeature ? "Edit Feature" : "Add New Feature"}
              </h2>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xl text-[#A18B90] hover:text-[#721D35]"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#541629]">
                  Feature Name *
                </label>

                <input
                  type="text"
                  required
                  placeholder="Enter feature name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-[#E9DDE0] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#721D35] focus:ring-2 focus:ring-[#721D35]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#541629]">
                  Description
                </label>

                <textarea
                  rows={3}
                  placeholder="Enter feature description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-[#E9DDE0] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#721D35] focus:ring-2 focus:ring-[#721D35]/10"
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
                  className="w-full rounded-lg border border-[#E9DDE0] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#721D35]"
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
                  className="w-full rounded-lg border border-[#E9DDE0] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#721D35]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-[#E9DDE0] px-5 py-2.5 text-sm font-medium text-[#866F74] hover:bg-[#F3E5E9]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-lg bg-[#721D35] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#541629]"
                >
                  {isSaving
                    ? "Saving..."
                    : editingFeature
                    ? "Update Feature"
                    : "Save Feature"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl border border-[#E9DDE0] bg-[#FFFFFF] p-6 shadow-xl">
            <h2 className="text-lg font-bold text-[#721D35]">
              Delete Feature?
            </h2>

            <p className="mt-2 text-sm text-[#866F74]">
              Are you sure you want to delete this feature? This action cannot
              be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-lg border border-[#E9DDE0] px-4 py-2 text-sm text-[#866F74] hover:bg-[#F3E5E9]"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
