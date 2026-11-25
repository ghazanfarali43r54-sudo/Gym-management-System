
"use client";

import Field from "./Field";
import type { FormState } from "@/hooks/registration/registerHooks";

type PersonalInformationProps = {
  form: FormState;
  updateField: <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => void;
  getFieldError: (field: keyof FormState) => string | undefined;
  showPassword: boolean;
  onTogglePassword: () => void;
  showConfirm: boolean;
  onToggleConfirm: () => void;
};

export default function PersonalInformation({
  form,
  updateField,
  getFieldError,
  showPassword,
  onTogglePassword,
  showConfirm,
  onToggleConfirm,
}: PersonalInformationProps) {
  const inputCls =
    "w-full min-w-0 rounded-xl bg-white px-4 py-3 text-sm text-[#800020] ring-1 ring-[#800020]/15 outline-none transition placeholder:text-[#800020]/35 focus:ring-2 focus:ring-[#800020]/30";

  return (
    <section className="w-full">
      <div className="mb-5">
        <h3 className="text-base font-extrabold text-[#800020]">
          Personal Information
        </h3>
        <p className="mt-1 text-xs text-[#800020]/55">
          Enter your basic contact details.
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Full Name" required error={getFieldError("name")}>
          <input
            className={inputCls}
            placeholder="Enter your full name"
            autoComplete="name"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
          />
        </Field>

        <Field label="Phone Number" required error={getFieldError("phone")}>
          <input
            className={inputCls}
            placeholder="03001234567"
            autoComplete="tel"
            inputMode="tel"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
          />
        </Field>

        <Field label="Email Address" required error={getFieldError("email")}>
          <input
            type="email"
            className={inputCls}
            placeholder="example@email.com"
            autoComplete="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
          />
        </Field>

        <Field label="Password" required error={getFieldError("password")}>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              maxLength={72}
              className={`${inputCls} pr-16`}
              placeholder="Minimum 6 characters"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
            />

            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#800020]"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </Field>

        <Field
          label="Confirm Password"
          required
          error={getFieldError("confirm")}
        >
          <div className="relative w-full">
            <input
              type={showConfirm ? "text" : "password"}
              maxLength={72}
              className={`${inputCls} pr-16`}
              placeholder="Confirm your password"
              autoComplete="new-password"
              value={form.confirm}
              onChange={(e) => updateField("confirm", e.target.value)}
            />

            <button
              type="button"
              onClick={onToggleConfirm}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#800020]"
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>
        </Field>
      </div>
    </section>
  );
}
