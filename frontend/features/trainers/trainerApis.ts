
import { apiFetch } from "@/lib/api";

import type {
  ApiResponse,
  ApiTrainer,
  Trainer,
} from "@/types/trainer.types";

// Convert backend trainer data into frontend Trainer type.
function mapTrainer(item: ApiTrainer): Trainer {
  return {
    id: item._id,
    name: item.name || "",
    email: item.email || "",
    phone: item.phone || "",
    photo: item.photo || "",
    gender: item.gender || "",
    dateOfBirth: item.dateOfBirth
      ? String(item.dateOfBirth).slice(0, 10)
      : "",
    address: {
      street: item.address?.street || "",
      city: item.address?.city || "",
      country: item.address?.country || "",
    },
    specialization: item.specialization || "",
    experience: Number(item.experience ?? 0),
    status: item.status === "active" ? "Active" : "Inactive",
    memberLimit: Number(item.memberLimit ?? 20),
    assignedMemberCount: Number(item.assignedMemberCount ?? 0),
  };
}

// GET ALL TRAINERS
export async function getTrainers(): Promise<Trainer[]> {
  const result = await apiFetch("/api/admin/trainers");

  const data = result.data as ApiResponse;

  if (!result.ok) {
    throw new Error(data.message || "Failed to load trainers");
  }

  return (data.trainers || []).map(mapTrainer);
}

// ADD / UPDATE TRAINER
export async function saveTrainer(
  id: string | null,
  payload: FormData | Record<string, unknown>
): Promise<void> {
  const isFormData = payload instanceof FormData;

  const result = await apiFetch(
    id ? `/api/admin/trainers/${id}` : "/api/admin/trainers",
    {
      method: id ? "PUT" : "POST",
      body: isFormData ? payload : JSON.stringify(payload),
    }
  );

  if (!result.ok) {
    throw new Error(
      result.data?.message || "Unable to save trainer"
    );
  }
}

// DELETE TRAINER
export async function deleteTrainer(id: string): Promise<void> {
  const result = await apiFetch(`/api/admin/trainers/${id}`, {
    method: "DELETE",
  });

  if (!result.ok) {
    throw new Error(
      result.data?.message || "Unable to delete trainer"
    );
  }
}

// UPDATE TRAINER STATUS
export async function updateTrainerStatus(
  id: string,
  status: "active" | "inactive"
): Promise<void> {
  const result = await apiFetch(`/api/admin/trainers/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });

  if (!result.ok) {
    throw new Error(
      result.data?.message || "Unable to update trainer status"
    );
  }
}
