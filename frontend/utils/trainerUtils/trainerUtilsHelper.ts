
import type { Trainer, TrainerForm } from "@/types/trainer.types";

import {
  isValidPersonName,
  isValidEmail,
  phoneError,
} from "@/lib/formValidation";

// Default trainer form
export const emptyTrainerForm: TrainerForm = {
  name: "",
  email: "",
  phone: "",
  specialization: "",
  experience: "",
  password: "",
  status: "Active",
  memberLimit: "20",
};


export function buildTrainerForm(trainer: Trainer): TrainerForm {
  return {
    name: trainer.name,
    email: trainer.email,
    phone: trainer.phone,
    specialization: trainer.specialization,
    experience: String(trainer.experience || ""),
    password: "",
    status: trainer.status,
    memberLimit: String(trainer.memberLimit ?? 20),
  };
}

// Trainer initials
export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

// Trainer form validation
export function validateTrainerForm(
  form: TrainerForm,
  isEditing: boolean
): string | null {
  if (!isValidPersonName(form.name)) {
    return "Enter a valid trainer name.";
  }

  if (!isValidEmail(form.email)) {
    return "Enter a valid email address.";
  }

  const phoneMessage = phoneError(form.phone, false);

  if (phoneMessage) {
    return phoneMessage;
  }

  if (
    form.experience.trim() !== "" &&
    (!Number.isFinite(Number(form.experience)) ||
      Number(form.experience) < 0)
  ) {
    return "Experience must be a zero or positive number of years.";
  }

  const memberLimit = Number(form.memberLimit);

  if (!Number.isSafeInteger(memberLimit) || memberLimit < 1) {
    return "Member limit must be a positive whole number.";
  }

  if (!isEditing && form.password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return null;
}

// Trainer payload builder
export function buildTrainerPayload(
  form: TrainerForm
): Record<string, unknown> {
  return {
    name: form.name.trim(),
    email: form.email.trim().toLowerCase(),
    phone: form.phone.trim(),
    specialization: form.specialization.trim(),
    experience: Number(form.experience),
    status: form.status.toLowerCase(),
    memberLimit: Number(form.memberLimit),
    ...(form.password.trim() && {
      password: form.password,
    }),
  };
}
