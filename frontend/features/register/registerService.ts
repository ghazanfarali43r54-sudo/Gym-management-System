
//!Backend se communication.

import { API_URL } from "@/lib/api";
import type { MembershipPlan } from "@/hooks/registration/registerHooks";

/* ================= TYPES ================= */

export type RegistrationPayload = { //	API ko bheje jane wale data ka TypeScript type
  role: "member" | "trainer";
  name: string;
  email: string;
  phone: string;
  password: string;
  experience: string;
  specialization: string;
  bio: string;
  message: string;
  photo: string;
  membershipPlanIds: string[];
  gender?: string;
  dateOfBirth?: string | null;
  address?: {
    street: string;
    city: string;
    country: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
};

/* ================= LOAD MEMBERSHIP PLANS ================= */

export async function loadMembershipPlans(//Backend se membership plans fetch karna
  signal: AbortSignal
): Promise<MembershipPlan[]> {
  const response = await fetch(
    `${API_URL}/api/public/membership-plans`,
    { signal }
  );

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      body.message || "Could not load membership plans."
    );
  }

  return Array.isArray(body.data) ? body.data : [];
}

/* ================= REGISTER USER ================= */

export async function registerUser(payload: RegistrationPayload) {//	Registration request backend ko send karna
  const response = await fetch(`${API_URL}/api/public/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      body.message || "Registration request cannot be sent."
    );
  }

  return {
    requestId: body.request?.id ?? "",
  };
}
