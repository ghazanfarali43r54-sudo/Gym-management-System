
"use client";

import { useState, type FormEvent } from "react";

import type {
  FormState,
} from "@/hooks/registration/registerHooks";

import {
  validateRegistration,
} from "@/hooks/registration/registerHooks";

import {
  processRegistrationPhoto,
  buildRegistrationPayload,
} from "@/features/register/registerUtils";

import {
  registerUser,
} from "@/features/register/registerService";

/* ================= TYPES ================= */

type UseRegistrationSubmitProps = {
  form: FormState;
  setSubmitted: (value: boolean) => void;
  resetRegistrationForm: () => void;
  onSuccess: (requestId: string, email: string) => void;
};

/* ================= HOOK ================= */

export function useRegistrationSubmit({
  form,
  setSubmitted,
  resetRegistrationForm,
  onSuccess,
}: UseRegistrationSubmitProps) {
  const [photo, setPhoto] = useState("");
  const [photoError, setPhotoError] = useState("");

  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState("");

  /* ================= RESET SUBMIT STATE ================= */

  function resetSubmitState() {
    setPhoto("");
    setPhotoError("");
    setServerError("");
  }

  /* ================= PHOTO HANDLING ================= */

  async function handlePhoto(file?: File) {
    if (!file) return;

    setPhotoError("");

    try {
      const processedPhoto = await processRegistrationPhoto(file);
      setPhoto(processedPhoto);
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "Image cannot be uploaded";

      setPhotoError(message);
    }
  }

  /* ================= FORM SUBMISSION ================= */

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitted(true);
    setServerError("");

    // Validate the latest form values directly.
    const currentErrors = validateRegistration(form);

    if (Object.keys(currentErrors).length > 0) {
      return;
    }

    setSending(true);

    try {
      const payload = buildRegistrationPayload(form, photo);

      const result = await registerUser(payload);

      const email = form.email.trim();

      resetRegistrationForm();
      resetSubmitState();

      onSuccess(result.requestId, email);
    } catch (error) {
      console.error(error);

      setServerError(
        error instanceof TypeError
          ? "Cannot connect to Server."
          : error instanceof Error
            ? error.message
            : "Registration request cannot be sent."
      );
    } finally {
      setSending(false);
    }
  }

  return {
    photo,
    setPhoto,
    photoError,
    setPhotoError,

    sending,
    serverError,

    handlePhoto,
    submit,
    resetSubmitState,
  };
}
