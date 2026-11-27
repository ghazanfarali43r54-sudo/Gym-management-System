
"use client";

import type { ReactNode } from "react";

export type PersonBasicFormValues = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  gender: string;
};

type PersonBasicFieldsProps = {
  form: PersonBasicFormValues;
  editing: boolean;
  today?: string;
  fieldError: (field: string) => ReactNode;
  updateField: (
    field: keyof PersonBasicFormValues,
    value: string
  ) => void;
};

export default function PersonBasicFields({
  form,
  editing,
  today,
  fieldError,
  updateField,
}: PersonBasicFieldsProps) {
  const inputClass =
    "w-full rounded-xl border border-[#e7dcd6] bg-white px-4 py-3 text-sm outline-none focus:border-[#641d32]";

  const labelClass =
    "mb-2 block text-sm font-semibold text-[#4b1725]";

  return (
    <>
      {/* Full Name */}
      <div>
        <label className={labelClass}>Full Name *</label>
        <input
          required
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={(event) =>
            updateField("name", event.target.value)
          }
          placeholder="Enter full name"
          className={inputClass}
        />
        {fieldError("name")}
      </div>

      {/* Email */}
      <div>
        <label className={labelClass}>Email Address *</label>
        <input
          required
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(event) =>
            updateField("email", event.target.value)
          }
          placeholder="Enter email address"
          className={inputClass}
        />
        {fieldError("email")}
      </div>

      {/* Phone */}
      <div>
        <label className={labelClass}>Phone Number *</label>
        <input
          required
          type="tel"
          inputMode="numeric"
          maxLength={15}
          autoComplete="tel"
          value={form.phone}
          onChange={(event) =>
            updateField("phone", event.target.value)
          }
          placeholder="Enter phone number"
          className={inputClass}
        />
        {fieldError("phone")}
      </div>

      {/* Password */}
      <div>
        <label className={labelClass}>
          Password {editing ? "(Optional)" : "*"}
        </label>
        <input
          required={!editing}
          type="password"
          minLength={6}
          maxLength={72}
          autoComplete="new-password"
          name="password"
          value={form.password}
          onChange={(event) =>
            updateField("password", event.target.value)
          }
          placeholder={
            editing
              ? "Leave blank to keep current password"
              : "At least 6 characters"
          }
          className={inputClass}
        />
        {fieldError("password")}
      </div>

      {/* Confirm Password */}
      {!editing && (
        <div>
          <label className={labelClass}>
            Confirm Password *
          </label>
          <input
            required
            type="password"
            minLength={6}
            maxLength={72}
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(event) =>
              updateField("confirmPassword", event.target.value)
            }
            placeholder="Confirm password"
            className={inputClass}
          />
          {fieldError("confirmPassword")}
        </div>
      )}

      {/* Date of Birth */}
      <div>
        <label className={labelClass}>Date of Birth</label>
        <input
          type="date"
          value={form.dateOfBirth}
          max={today || undefined}
          onChange={(event) =>
            updateField("dateOfBirth", event.target.value)
          }
          className={inputClass}
        />
        {fieldError("dateOfBirth")}
      </div>

      {/* Gender */}
      <div>
        <label className={labelClass}>Gender</label>
        <select
          value={form.gender}
          onChange={(event) =>
            updateField("gender", event.target.value)
          }
          className={inputClass}
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {fieldError("gender")}
      </div>
    </>
  );
}
