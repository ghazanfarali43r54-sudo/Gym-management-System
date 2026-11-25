"use client";

import Field from "./Field";

import type {
  FormState,
  MembershipPlan,
} from "@/hooks/registration/registerHooks";

type MemberRegisterFormProps = {
  form: FormState;
  updateField: <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => void;
  getFieldError: (field: keyof FormState) => string | undefined;
  today: string;
  membershipPlans: MembershipPlan[];
  loadingLists: boolean;
};

export default function MemberRegisterForm({
  form,
  updateField,
  getFieldError,
  today,
  membershipPlans,
  loadingLists,
}: MemberRegisterFormProps) {
  const inputCls =
    "w-full min-w-0 rounded-xl bg-white px-4 py-3 text-sm text-[#800020] ring-1 ring-[#800020]/15 outline-none transition placeholder:text-[#800020]/35 focus:ring-2 focus:ring-[#800020]/30";

  return (
    <section className="w-full rounded-2xl bg-[#faf7f2] p-5 ring-1 ring-[#800020]/10 sm:p-6">
      <div className="mb-5">
        <h3 className="font-extrabold text-[#800020]">
          Member Information
        </h3>

        <p className="mt-1 text-xs text-[#800020]/55">
          Personal details and optional emergency contact.
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Date of Birth">
          <input
            type="date"
            max={today || undefined}
            className={inputCls}
            value={form.dateOfBirth}
            onChange={(e) =>
              updateField("dateOfBirth", e.target.value)
            }
          />
        </Field>

        <Field label="Gender">
          <select
            className={inputCls}
            value={form.gender}
            onChange={(e) =>
              updateField("gender", e.target.value)
            }
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </Field>

        <div className="sm:col-span-2">
          <h4 className="font-bold text-[#800020]">
            Address
          </h4>
        </div>

        <Field label="Street">
          <input
            maxLength={150}
            className={inputCls}
            value={form.street}
            onChange={(e) =>
              updateField("street", e.target.value)
            }
          />
        </Field>

        <Field label="City">
          <input
            maxLength={100}
            className={inputCls}
            value={form.city}
            onChange={(e) =>
              updateField("city", e.target.value)
            }
          />
        </Field>

        <Field label="Country">
          <input
            maxLength={100}
            className={inputCls}
            value={form.country}
            onChange={(e) =>
              updateField("country", e.target.value)
            }
          />
        </Field>

        <div className="sm:col-span-2 border-t border-[#800020]/10 pt-4">
          <h4 className="font-bold text-[#800020]">
            Emergency Contact
          </h4>

          <p className="mt-1 text-xs text-[#800020]/55">
            If you add one field, complete all three.
          </p>
        </div>

        <Field label="Contact Name">
          <input
            maxLength={60}
            className={inputCls}
            value={form.emergencyName}
            onChange={(e) =>
              updateField("emergencyName", e.target.value)
            }
          />
        </Field>

        <Field label="Relationship">
          <input
            maxLength={50}
            className={inputCls}
            value={form.emergencyRelationship}
            onChange={(e) =>
              updateField("emergencyRelationship", e.target.value)
            }
          />
        </Field>

        <Field label="Contact Phone">
          <input
            type="tel"
            maxLength={15}
            className={inputCls}
            value={form.emergencyPhone}
            onChange={(e) =>
              updateField("emergencyPhone", e.target.value)
            }
          />
        </Field>

        <div className="sm:col-span-2 border-t border-[#800020]/10 pt-4">
          <h4 className="font-bold text-[#800020]">
            Membership Plans{" "}
            <span className="font-normal">
              (optional, select any)
            </span>
          </h4>

          {loadingLists ? (
            <p className="mt-2 text-sm text-[#800020]/60">
              Loading plans...
            </p>
          ) : membershipPlans.length === 0 ? (
            <p className="mt-2 text-sm text-[#800020]/60">
              No active plans available.
            </p>
          ) : (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {membershipPlans.map((plan) => (
                <label
                  key={plan._id}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#800020]/15 bg-white p-3"
                >
                  <input
                    type="checkbox"
                    checked={form.membershipPlanIds.includes(
                      plan._id
                    )}
                    onChange={(event) =>
                      updateField(
                        "membershipPlanIds",
                        event.target.checked
                          ? [
                              ...form.membershipPlanIds,
                              plan._id,
                            ]
                          : form.membershipPlanIds.filter(
                              (id) => id !== plan._id
                            )
                      )
                    }
                    className="mt-1 accent-[#800020]"
                  />

                  <span>
                    <span className="block text-sm font-bold text-[#800020]">
                      {plan.name}
                    </span>

                    <span className="text-xs text-[#800020]/60">
                      PKR {plan.price}
                      {plan.description
                        ? ` · ${plan.description}`
                        : ""}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}