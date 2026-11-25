
"use client";

import Field from "./Field";

import type { FormState } from "@/hooks/registration/registerHooks";

type TrainerRegisterFormProps = {
  form: FormState;
  updateField: <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => void;
  getFieldError: (field: keyof FormState) => string | undefined;
};

export default function TrainerRegisterForm({
  form,
  updateField,
  getFieldError,
}: TrainerRegisterFormProps) {
  const inputCls =
    "w-full min-w-0 rounded-xl bg-white px-4 py-3 text-sm text-[#800020] ring-1 ring-[#800020]/15 outline-none transition placeholder:text-[#800020]/35 focus:ring-2 focus:ring-[#800020]/30";

  return (
    <section className="w-full rounded-2xl bg-[#faf7f2] p-5 ring-1 ring-[#800020]/10 sm:p-6">
      <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Professional Experience"
          required
          error={getFieldError("experience")}
        >
          <input
            className={inputCls}
            placeholder="e.g. 3 years"
            type="number"
            value={form.experience}
            onChange={(e) =>
              updateField("experience", e.target.value)
            }
          />
        </Field>

        <Field
          label="Specialization"
          required
          error={getFieldError("specialization")}
        >
          <input
            className={inputCls}
            placeholder="e.g. Weight Training, Yoga, Cardio"
            value={form.specialization}
            onChange={(e) =>
              updateField("specialization", e.target.value)
            }
          />
        </Field>

        <div className="sm:col-span-2">
          <Field
            label="Professional Bio"
            required
            error={getFieldError("bio")}
          >
            <textarea
              rows={4}
              maxLength={500}
              className={`${inputCls} resize-y`}
              placeholder="Tell us about yourself, your fitness journey, professional experience, certifications, achievements, and training approach..."
              value={form.bio}
              onChange={(e) =>
                updateField("bio", e.target.value)
              }
            />

            <div className="mt-1 flex justify-between">
              <p className="text-xs text-[#800020]/50">
                Introduce yourself to gym members.
              </p>

              <p className="text-xs text-[#800020]/50">
                {form.bio.length}/500
              </p>
            </div>
          </Field>
        </div>
      </div>
    </section>
  );
}
