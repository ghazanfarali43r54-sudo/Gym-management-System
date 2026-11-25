
//!Data processing aur payload preparation.

import type { FormState } from "@/hooks/registration/registerHooks";
import type { RegistrationPayload } from "./registerService";
const PHOTO_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_PHOTO_BYTES = 2 * 1024 * 1024;

export async function processRegistrationPhoto(//	Photo validate, resize aur compress karna
  file: File
): Promise<string> {
  if (!PHOTO_TYPES.includes(file.type)) {
    throw new Error("Omly Uploaded PNG, JPG ya WEBP images");
  }

  if (file.size > MAX_PHOTO_BYTES) {
    throw new Error("Image size must be small from 2 MBs");
  }

  let bitmap: ImageBitmap | null = null;

  try {
    bitmap = await createImageBitmap(file);

    const canvas = document.createElement("canvas");

    canvas.width = 256;
    canvas.height = 256;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Canvas unavailable");
    }

    const side = Math.min(bitmap.width, bitmap.height);

    ctx.drawImage(
      bitmap,
      (bitmap.width - side) / 2,
      (bitmap.height - side) / 2,
      side,
      side,
      0,
      0,
      256,
      256
    );

    return canvas.toDataURL("image/jpeg", 0.85);
  } catch (error) {
    if (error instanceof Error && error.message === "Canvas unavailable") {
      throw error;
    }

    throw new Error("Image connot uploaded");
  } finally {
    bitmap?.close();
  }
}

//Registration payload function.
export function buildRegistrationPayload(//Form data ko API payload mein convert karna
  form: FormState,
  photo: string
): RegistrationPayload {
  return {
    role: form.role,
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    password: form.password,

    experience:
      form.role === "trainer" ? form.experience.trim() : "",

    specialization:
      form.role === "trainer" ? form.specialization.trim() : "",

    bio: form.role === "trainer" ? form.bio.trim() : "",

    message: form.message.trim(),
    photo,

    membershipPlanIds:
      form.role === "member" ? form.membershipPlanIds : [],

    ...(form.role === "member"
      ? {
          gender: form.gender,
          dateOfBirth: form.dateOfBirth || null,

          address: {
            street: form.street.trim(),
            city: form.city.trim(),
            country: form.country.trim(),
          },

          emergencyContact: {
            name: form.emergencyName.trim(),
            relationship: form.emergencyRelationship.trim(),
            phone: form.emergencyPhone.trim(),
          },
        }
      : {}),
  };
}
