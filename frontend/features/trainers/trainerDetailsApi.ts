import { apiFetch } from "@/lib/api";

import type {
  TrainerDetailsApiResponse,
} from "@/types/admin/trainerDetails";

export async function getTrainerDetails(id: string) {
  const result = await apiFetch(
    `/api/admin/trainers/${id}/dashboard`
  );

  const data = result.data as TrainerDetailsApiResponse;

  if (!result.ok) {
    throw new Error(
      data.message || "Could not load trainer details."
    );
  }

  if (!data.trainer) {
    throw new Error("Trainer data not found.");
  }

  return {
    trainer: data.trainer,
    details: data.trainerDetails ?? {},
  };
}
