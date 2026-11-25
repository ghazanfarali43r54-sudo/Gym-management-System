import { useEffect, useState } from "react";
import {
  isValidEmail,
  isValidPersonName,
  phoneError,
} from "@/lib/formValidation";

/* ================= TYPES ================= */

export type FormState = {
  role: "member" | "trainer";
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
  gender: string;
  dateOfBirth: string;
  street: string;
  city: string;
  country: string;
  emergencyName: string;
  emergencyRelationship: string;
  emergencyPhone: string;
  experience: string;
  specialization: string;
  bio: string;
  message: string;
  membershipPlanIds: string[];
};

export type MembershipPlan = {
  _id: string;
  name: string;
  price: number;
  description?: string;
};

export type FormErrors = Partial<Record<keyof FormState, string>>;

/* ================= INITIAL STATE ================= */

export const createEmptyForm = (): FormState => ({
  role: "member",
  name: "",
  email: "",
  phone: "",
  password: "",
  confirm: "",
  gender: "",
  dateOfBirth: "",
  street: "",
  city: "",
  country: "",
  emergencyName: "",
  emergencyRelationship: "",
  emergencyPhone: "",
  experience: "",
  specialization: "",
  bio: "",
  message: "",
  membershipPlanIds: [],
});

/* ================= VALIDATION ================= */

export function validateRegistration(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!isValidPersonName(form.name)) {
    errors.name =
      "Enter a valid name using letters, spaces, apostrophes, or hyphens.";
  }

  if (!isValidEmail(form.email)) {
    errors.email = "Enter a valid email address, such as name@example.com.";
  }

  const phoneValidationError = phoneError(form.phone);

  if (phoneValidationError) {
    errors.phone = phoneValidationError;
  }

  if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
  } else if (form.password.length > 72) {
    errors.password = "Password must be 72 characters or fewer";
  }

  if (form.confirm !== form.password) {
    errors.confirm = "Passwords do not match";
  }

  // Trainer-specific validation
  if (form.role === "trainer") {
    if (!form.experience.trim()) {
      errors.experience = "Please enter your professional experience.";
    } else if (form.experience.trim().length > 80) {
      errors.experience = "Experience must be 80 characters or fewer.";
    }

    if (!form.specialization.trim()) {
      errors.specialization = "Please enter your specialization.";
    } else if (form.specialization.trim().length > 120) {
      errors.specialization = "Specialization must be 120 characters or fewer.";
    }

    if (!form.bio.trim()) {
      errors.bio = "Please write a short professional bio.";
    } else if (form.bio.trim().length < 20) {
      errors.bio = "Bio must be at least 20 characters.";
    } else if (form.bio.trim().length > 500) {
      errors.bio = "Bio must be 500 characters or fewer.";
    }
  }

  return errors;
}

/* ================= REGISTRATION HOOK ================= */

export function useRegistrationForm() {
  const [form, setForm] = useState<FormState>(createEmptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [today, setToday] = useState("");

  useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setToday(new Date().toISOString().slice(0, 10));
}, []);

  // Update any form field
  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  // Reset form to initial state
  function resetForm() {
    setForm(createEmptyForm());
    setSubmitted(false);
  }

  // Validate current form
  const errors = validateRegistration(form);

  // Show errors only after submission attempt
  function getFieldError(key: keyof FormState) {
    return submitted ? errors[key] : undefined;
  }

  return {
    form,
    setForm,
    updateField,
    resetForm,
    submitted,
    setSubmitted,
    errors,
    getFieldError,
    today,
  };
}
