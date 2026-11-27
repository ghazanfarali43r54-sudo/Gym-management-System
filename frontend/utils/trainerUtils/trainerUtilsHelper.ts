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
  password: "",
  confirmPassword: "",
  gender: "",
  dateOfBirth: "",
  street: "",
  city: "",
  country: "",
  specialization: "",
  experience: "",
  status: "Active",
  memberLimit: "20",
};

export function buildTrainerForm(trainer: Trainer): TrainerForm {
  return {
    name: trainer.name,
    email: trainer.email,
    phone: trainer.phone,
    password: "",
    confirmPassword: "",
    gender: trainer.gender || "",
    dateOfBirth: trainer.dateOfBirth || "",
    street: trainer.address?.street || "",
    city: trainer.address?.city || "",
    country: trainer.address?.country || "",
    specialization: trainer.specialization,
    experience: String(trainer.experience || ""),
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
  if (phoneMessage) return phoneMessage;

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

  // Password validation
  if (!isEditing && form.password.length < 6) {
    return "Password must be at least 6 characters.";
  }

  if (form.password && form.password.length < 6) {
    return "Password must be at least 6 characters.";
  }

  if (!isEditing || form.password) {
    if (form.password !== form.confirmPassword) {
      return "Password and confirm password do not match.";
    }
  }

  return null;
}

// Trainer payload builder
export function buildTrainerPayload(
  form: TrainerForm,
  selectedPhoto: File | null,
  photoRemoved: boolean
): FormData {
  const payload = new FormData();

  payload.append("name", form.name.trim());
  payload.append("email", form.email.trim().toLowerCase());
  payload.append("phone", form.phone.trim());

  if (form.password.trim()) {
    payload.append("password", form.password);
  }

  payload.append("gender", form.gender);
  payload.append("dateOfBirth", form.dateOfBirth);

  payload.append(
    "address",
    JSON.stringify({
      street: form.street.trim(),
      city: form.city.trim(),
      country: form.country.trim(),
    })
  );

  payload.append("specialization", form.specialization.trim());
  payload.append("experience", String(Number(form.experience)));
  payload.append("status", form.status.toLowerCase());
  payload.append("memberLimit", String(Number(form.memberLimit)));

  if (selectedPhoto) {
    payload.append("photo", selectedPhoto);
  }

  if (photoRemoved) {
    payload.append("removePhoto", "true");
  }

  return payload;
}
