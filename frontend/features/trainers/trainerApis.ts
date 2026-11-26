
import { apiFetch } from "@/lib/api";
import type { ApiResponse, Trainer } from "@/types/trainer.types";

function mapTrainer(item: NonNullable<ApiResponse["trainers"]>[number]): Trainer {
  return {
    id: item._id,
    name: item.name || "",
    email: item.email || "",
    phone: item.phone || "",
    specialization: item.specialization || "",
    experience: item.experience || 0,
    status: item.status === "active" ? "Active" : "Inactive",
    memberLimit: Number(item.memberLimit ?? 20),
    assignedMemberCount: Number(item.assignedMemberCount ?? 0),
  };
}

export async function getTrainers(): Promise<Trainer[]> {
  const result = await apiFetch("/api/admin/trainers");
  const data = result.data as ApiResponse;

  if (!result.ok) {
    throw new Error(data.message || "Failed to load trainers");
  }

  return (data.trainers || []).map(mapTrainer);
}

export async function saveTrainer(
  id: string | null,
  payload: Record<string, unknown>
): Promise<void> {
  const result = await apiFetch(
    id ? `/api/admin/trainers/${id}` : "/api/admin/trainers",
    {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(payload),
    }
  );

  if (!result.ok) {
    throw new Error(result.data?.message || "Unable to save trainer");
  }
}

export async function deleteTrainer(id: string): Promise<void> {
  const result = await apiFetch(`/api/admin/trainers/${id}`, {
    method: "DELETE",
  });

  if (!result.ok) {
    throw new Error(result.data?.message || "Unable to delete trainer");
  }
}

export async function updateTrainerStatus(
  id: string,
  status: "active" | "inactive"
): Promise<void> {
  const result = await apiFetch(`/api/admin/trainers/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });

  if (!result.ok) {
    throw new Error(result.data?.message || "Unable to update status");
  }
}
