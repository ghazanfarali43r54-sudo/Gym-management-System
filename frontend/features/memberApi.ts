import axios, { type Method } from "axios";
import axiosClient from "@/lib/axios";

// 1. TYPES — Data ka blueprint

export type MemberStatus = "Active" | "Inactive" | "Pending";

export type TrainerOption = {
  _id: string;
  name: string;
  email?: string;
  status?: "active" | "inactive";
  assignedMemberCount?: number;
  assignedCount?: number;
  memberLimit?: number;
  isFull?: boolean;
};

export type MembershipPlanOption = {
  _id: string;
  name: string;
  price: number;
  description?: string;
  status?: "active" | "inactive";
};

export type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: MemberStatus;
  assignedTrainerId?: string;
  assignedTrainerName?: string;
  gender: string;
  dateOfBirth: string;
  address: { street: string; city: string; country: string };
  emergencyContact: { name: string; relationship: string; phone: string };
  photo: string;
  membershipPlans: MembershipPlanOption[];
  measurementCount: number;
};

export type MemberForm = {
  name: string;
  email: string;
  phone: string;
  password: string;
  status: MemberStatus;
  gender: string;
  dateOfBirth: string;
  street: string;
  city: string;
  country: string;
  emergencyName: string;
  emergencyRelationship: string;
  emergencyPhone: string;
  confirmPassword: string;
};

export const emptyMemberForm: MemberForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  status: "Active",
  gender: "",
  dateOfBirth: "",
  street: "",
  city: "",
  country: "",
  emergencyName: "",
  emergencyRelationship: "",
  emergencyPhone: "",
  confirmPassword: "",
};

// 2. NORMALIZE — Backend data ko saaf karna

type ApiRecord = Record<string, unknown>;

function asRecord(value: unknown): ApiRecord | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as ApiRecord)
    : null;
}

function asText(value: unknown, fallback = ""): string {
  return value === undefined || value === null ? fallback : String(value);
}

export function getArray<T>(response: unknown, key: string): T[] {
  const responseRecord = asRecord(response);
  const data = responseRecord?.data ?? response;

  if (Array.isArray(data)) return data as T[];

  const dataRecord = asRecord(data);
  const keyedValue = dataRecord?.[key];
  if (Array.isArray(keyedValue)) return keyedValue as T[];

  const nestedData = dataRecord?.data;
  if (Array.isArray(nestedData)) return nestedData as T[];

  const nestedRecord = asRecord(nestedData);
  const nestedKeyedValue = nestedRecord?.[key];
  if (Array.isArray(nestedKeyedValue)) return nestedKeyedValue as T[];

  return [];
}

export function normalizeStatus(status: unknown): MemberStatus {
  const value = asText(status).toLowerCase();

  if (value === "active") return "Active";
  if (value === "inactive") return "Inactive";

  return "Pending";
}

export function normalizeMembershipPlans(value: unknown): MembershipPlanOption[] {
  if (!Array.isArray(value)) return [];

  return value.map((item): MembershipPlanOption => {
    if (typeof item === "string") {
      return { _id: item, name: "Membership plan", price: 0 };
    }

    const plan = asRecord(item) ?? {};
    const status = plan.status === "active" || plan.status === "inactive"
      ? plan.status
      : undefined;

    return {
      _id: asText(plan._id ?? plan.id),
      name: asText(plan.name, "Membership plan"),
      price: typeof plan.price === "number" ? plan.price : Number(plan.price ?? 0),
      description: typeof plan.description === "string" ? plan.description : undefined,
      status,
    };
  });
}

export function normalizeMember(value: unknown): Member {
  const item = asRecord(value) ?? {};
  const assignedTrainerValue = item.assignedTrainer ?? item.trainer;
  const assignedTrainer = asRecord(assignedTrainerValue);
  const assignedTrainerId =
    typeof assignedTrainerValue === "string"
      ? assignedTrainerValue
      : asText(
          assignedTrainer?._id ??
            assignedTrainer?.id ??
            item.assignedTrainerId
        );
  const assignedTrainerName =
    asText(assignedTrainer?.name ?? assignedTrainer?.fullName) ||
    asText(item.assignedTrainerName ?? item.trainerName);
  const address = asRecord(item.address);
  const emergencyContact = asRecord(item.emergencyContact);

  return {
    id: asText(item._id ?? item.id),
    name: asText(item.name ?? item.fullName, "Unnamed Member"),
    email: asText(item.email),
    phone: asText(item.phone ?? item.phoneNumber),
    status: normalizeStatus(item.status),
    assignedTrainerId,
    assignedTrainerName,
    gender: asText(item.gender),
    dateOfBirth: item.dateOfBirth ? asText(item.dateOfBirth).slice(0, 10) : "",
    address: {
      street: asText(address?.street),
      city: asText(address?.city),
      country: asText(address?.country),
    },
    emergencyContact: {
      name: asText(emergencyContact?.name),
      relationship: asText(emergencyContact?.relationship),
      phone: asText(emergencyContact?.phone),
    },
    photo: asText(item.photo),
    membershipPlans: normalizeMembershipPlans(item.membershipPlans),
    measurementCount: Number(item.measurementCount ?? 0),
  };
}

// 3. HELPERS — UI ke chhote kaam status color

export function statusClass(status: MemberStatus) {
  if (status === "Active") return "bg-green-100 text-green-700";
  if (status === "Inactive") return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-700";
}

export function mapMemberApiErrors(errors: Record<string, unknown>) {
  const fieldMap: Record<string, string> = {
    "address.street": "street",
    "address.city": "city",
    "address.country": "country",
    "emergencyContact.name": "emergencyName",
    "emergencyContact.relationship": "emergencyRelationship",
    "emergencyContact.phone": "emergencyPhone",
    membershipPlans: "membershipPlanIds",
    membershipPlanIds: "membershipPlanIds",
    assignedTrainer: "assignedTrainerId",
    assignedTrainerId: "assignedTrainerId",
  };

  return Object.fromEntries(
    Object.entries(errors)
      .filter((entry): entry is [string, string] => typeof entry[1] === "string")
      .map(([field, message]) => [fieldMap[field] ?? field, message])
  );
}

export function buildEditMemberForm(member: Member): MemberForm {
  return {
    name: member.name,
    email: member.email,
    phone: member.phone,
    password: "",
    status: member.status,
    gender: member.gender,
    dateOfBirth: member.dateOfBirth,
    street: member.address.street || "",
    city: member.address.city || "",
    country: member.address.country || "",
    emergencyName: member.emergencyContact.name || "",
    emergencyRelationship: member.emergencyContact.relationship || "",
    emergencyPhone: member.emergencyContact.phone || "",
    confirmPassword: "",
  };
}

// 4. PAYLOAD — Form data ko backend ke liye ready karna

type MemberPayloadInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
  status: string;
  assignedTrainerId: string;
  gender: string;
  dateOfBirth: string;
  street: string;
  city: string;
  country: string;
  emergencyName: string;
  emergencyRelationship: string;
  emergencyPhone: string;
  membershipPlanIds: string[];
  photo: string;
};

// Common fields used by both create and update
const getCommonMemberPayload = (data: MemberPayloadInput) => ({
  name: data.name.trim(),
  email: data.email.trim(),
  phone: data.phone.trim(),
  status: data.status.toLowerCase(),
  assignedTrainerId: data.assignedTrainerId || null,
  gender: data.gender || "",
  dateOfBirth: data.dateOfBirth || null,
  address: {
    street: data.street.trim(),
    city: data.city.trim(),
    country: data.country.trim(),
  },
  emergencyContact: {
    name: data.emergencyName.trim(),
    relationship: data.emergencyRelationship.trim(),
    phone: data.emergencyPhone.trim(),
  },
  membershipPlanIds: data.membershipPlanIds,
  photo: data.photo,
});

// Payload for creating a member
export const buildCreateMemberPayload = (data: MemberPayloadInput) => ({
  ...getCommonMemberPayload(data),
  password: data.password,
  role: "member",
  message: "",
});

// Payload for updating a member
export const buildUpdateMemberPayload = (data: MemberPayloadInput) => ({
  ...getCommonMemberPayload(data),
  ...(data.password ? { password: data.password } : {}),
});

// 5. API CALLS — Backend se baat karna

type MemberPayload = Record<string, unknown>;

type RequestOptions = {
  method?: Method;
  data?: unknown;
};

async function requestMemberApi(path: string, options: RequestOptions = {}) {
  try {
    const response = await axiosClient.request({
      url: path,
      method: options.method ?? "GET",
      data: options.data,
    });

    return { ok: true, status: response.status, data: response.data || {} };
  } catch (error: unknown) {
    if (!axios.isAxiosError(error) || !error.response) throw error;
    return {
      ok: false,
      status: error.response.status,
      data: error.response.data || {},
    };
  }
}

export const listMembers = () =>
  requestMemberApi("/api/admin/requests?role=member&status=all");

export const listMemberTrainers = () => requestMemberApi("/api/admin/trainers");

export const listMembershipPlans = () =>
  requestMemberApi("/api/public/membership-plans");

export const deleteMember = (memberId: string) =>
  requestMemberApi(`/api/admin/requests/${encodeURIComponent(memberId)}`, {
    method: "DELETE",
  });

export const changeMemberStatus = (memberId: string, status: MemberStatus) =>
  requestMemberApi(`/api/admin/requests/${encodeURIComponent(memberId)}`, {
    method: "PATCH",
    data: { status: status.toLowerCase() },
  });

export const listMemberMeasurements = (memberId: string) =>
  requestMemberApi(`/api/body-measurements/member/${encodeURIComponent(memberId)}`);

export const listMemberAssessments = (memberId: string) =>
  requestMemberApi(`/api/fitness-assessments/member/${encodeURIComponent(memberId)}`);

export const saveMemberMeasurement = (
  memberId: string,
  recordId: string | null,
  data: Record<string, unknown>
) => requestMemberApi(
  recordId
    ? `/api/body-measurements/${encodeURIComponent(recordId)}`
    : `/api/body-measurements/member/${encodeURIComponent(memberId)}`,
  { method: recordId ? "PUT" : "POST", data }
);

export const saveMemberAssessment = (
  memberId: string,
  recordId: string | null,
  data: Record<string, unknown>
) => requestMemberApi(
  recordId
    ? `/api/fitness-assessments/${encodeURIComponent(recordId)}`
    : `/api/fitness-assessments/member/${encodeURIComponent(memberId)}`,
  { method: recordId ? "PUT" : "POST", data }
);

export const deleteMemberFitnessRecord = (
  recordId: string,
  type: "measurements" | "assessments"
) => requestMemberApi(
  `${type === "measurements" ? "/api/body-measurements" : "/api/fitness-assessments"}/${encodeURIComponent(recordId)}`,
  { method: "DELETE" }
);

export const getMemberFitnessComparison = (memberId: string) =>
  requestMemberApi(`/api/body-measurements/member/${encodeURIComponent(memberId)}/comparison`);

export const getMemberDashboard = () => requestMemberApi("/api/auth/me");

// Create a new member
export const createMember = (payload: MemberPayload) => {
  return requestMemberApi("/api/admin/requests", {
    method: "POST",
    data: payload,
  });
};

// Update an existing member
export const updateMember = (
  memberId: string,
  payload: MemberPayload
) => {
  return requestMemberApi(`/api/admin/requests/${encodeURIComponent(memberId)}`, {
    method: "PATCH",
    data: payload,
  });
};

// 6. SPECIAL FETCH — Ek member ki details

export async function getMemberById(memberId: string): Promise<Member | null> {
  const response = await listMembers();
  if (!response.ok) {
    throw new Error(response.data?.message || "Unable to load member details.");
  }

  const member = getArray<unknown>(response, "requests")
    .map(normalizeMember)
    .find((item) => item.id === memberId);

  return member ?? null;
}