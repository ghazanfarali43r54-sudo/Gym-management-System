
"use client";

import { useMemberForm } from "@/hooks/memberHooks";

import PersonPhotoUpload from "@/components/shared/forms/PersonPhotoUpload";
import PersonBasicFields from "@/components/shared/forms/PersonBasicFields";
import PersonAddressFields from "@/components/shared/forms/PersonAddressFields";

import type {
  Member,
  MemberForm,
  MembershipPlanOption,
  TrainerOption,
} from "@/features/memberApi";

type MemberFormViewProps = {
  member: Member | null;
  trainers: TrainerOption[];
  membershipPlans: MembershipPlanOption[];
  trainersLoading: boolean;
  onClose: () => void;
  onSaved: () => Promise<void>;
};

export default function MemberFormView({
  member,
  trainers,
  membershipPlans,
  trainersLoading,
  onClose,
  onSaved,
}: MemberFormViewProps) {
  const { state, actions } = useMemberForm({ member, onSaved });

  const {
    editingMember,
    form,
    membershipPlanIds,
    trainerId,
    photo,
    photoError,
    error,
    fieldErrors,
    submitting,
    today,
  } = state;

  const {
    handleSubmit,
    updateField,
    handlePhoto,
    removePhoto,
    toggleMembershipPlan,
    changeTrainer,
  } = actions;

  const fieldError = (field: string) =>
    fieldErrors[field] ? (
      <p className="mt-1 text-xs text-red-700" role="alert">
        {fieldErrors[field]}
      </p>
    ) : null;

  return (
    <section className="min-h-screen space-y-6 bg-[#f8f6f2] p-4 text-[#342323] sm:p-6">
      <div className="mx-auto w-full max-w-7xl">
        <div className="rounded-2xl border border-[#eadfd9] bg-white p-5 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Reusable Profile Photo */}
            <PersonPhotoUpload
              photo={photo}
              name={form.name}
              editing={Boolean(editingMember)}
              personType="Member"
              photoError={photoError}
              fieldError={fieldError}
              onPhoto={(file) => {
                void handlePhoto(file);
              }}
              onRemove={removePhoto}
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
              {/* Reusable Basic Information */}
              <PersonBasicFields
                form={form}
                editing={Boolean(editingMember)}
                today={today}
                fieldError={fieldError}
                updateField={(field, value) =>
                  updateField(field as keyof MemberForm, value)
                }
              />

              {/* Reusable Address */}
              <PersonAddressFields
                form={form}
                fieldError={fieldError}
                updateField={(field, value) =>
                  updateField(field as keyof MemberForm, value)
                }
              />

              {/* Member-specific Emergency Contact */}
              <div className="md:col-span-2 border-t border-[#eadfd9] pt-4">
                <h3 className="font-semibold text-[#4b1725]">
                  Emergency Contact{" "}
                  <span className="font-normal text-[#9b8982]">
                    (complete all fields if provided)
                  </span>
                </h3>
              </div>

              {(
                [
                  ["emergencyName", "Name"],
                  ["emergencyRelationship", "Relationship"],
                  ["emergencyPhone", "Phone"],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <label className="mb-2 block text-sm font-semibold text-[#4b1725]">
                    {label}
                  </label>

                  <input
                    type={key === "emergencyPhone" ? "tel" : "text"}
                    value={form[key]}
                    onChange={(event) =>
                      updateField(key, event.target.value)
                    }
                    maxLength={
                      key === "emergencyName"
                        ? 60
                        : key === "emergencyRelationship"
                        ? 50
                        : 15
                    }
                    className="w-full rounded-xl border border-[#e7dcd6] bg-white px-4 py-3 text-sm outline-none focus:border-[#641d32]"
                  />

                  {fieldError(key)}
                </div>
              ))}

              {/* Member-specific Membership Plans */}
              <div className="md:col-span-2 border-t border-[#eadfd9] pt-4">
                <h3 className="font-semibold text-[#4b1725]">
                  Membership Plans{" "}
                  <span className="font-normal text-[#9b8982]">
                    (Optional, select any active plans)
                  </span>
                </h3>

                {(() => {
                  const currentInactivePlans =
                    editingMember?.membershipPlans.filter(
                      (plan) =>
                        plan.status === "inactive" &&
                        !membershipPlans.some(
                          (active) => active._id === plan._id
                        )
                    ) || [];

                  const visiblePlans = [
                    ...membershipPlans,
                    ...currentInactivePlans,
                  ];

                  return visiblePlans.length === 0 ? (
                    <p className="mt-2 text-sm text-[#8b7771]">
                      No active plans available.
                    </p>
                  ) : (
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {visiblePlans.map((plan) => (
                        <label
                          key={plan._id}
                          className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#e7dcd6] p-3"
                        >
                          <input
                            type="checkbox"
                            checked={membershipPlanIds.includes(plan._id)}
                            disabled={
                              plan.status === "inactive" &&
                              !membershipPlanIds.includes(plan._id)
                            }
                            onChange={(event) =>
                              toggleMembershipPlan(
                                plan._id,
                                event.target.checked
                              )
                            }
                            className="mt-1 accent-[#641d32]"
                          />

                          <span>
                            <span className="block text-sm font-semibold text-[#4b1725]">
                              {plan.name}
                            </span>

                            <span className="text-xs text-[#8b7771]">
                              {plan.status === "inactive"
                                ? "Inactive · currently assigned"
                                : `PKR ${plan.price}${
                                    plan.description
                                      ? ` · ${plan.description}`
                                      : ""
                                  }`}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  );
                })()}

                {fieldError("membershipPlanIds")}
              </div>

              {/* Member-specific Trainer Assignment */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#4b1725]">
                  Assign Trainer
                  <span className="ml-2 font-normal text-[#9b8982]">
                    (Optional)
                  </span>
                </label>

                <select
                  value={trainerId}
                  onChange={(event) => changeTrainer(event.target.value)}
                  disabled={trainersLoading}
                  className="w-full rounded-xl border border-[#e7dcd6] bg-white px-4 py-3 text-sm outline-none focus:border-[#641d32] disabled:opacity-60"
                >
                  <option value="">
                    {trainersLoading
                      ? "Loading trainers..."
                      : "No trainer assigned"}
                  </option>

                  {trainers.map((trainer) => {
                    const count =
                      trainer.assignedMemberCount ??
                      trainer.assignedCount ??
                      0;

                    const limit = trainer.memberLimit ?? 20;

                    const isFull =
                      trainer.isFull === true || count >= limit;

                    const isCurrent =
                      editingMember?.assignedTrainerId === trainer._id;

                    const isInactive = trainer.status === "inactive";

                    return (
                      <option
                        key={trainer._id}
                        value={trainer._id}
                        disabled={
                          (isFull && !isCurrent) ||
                          (isInactive && !isCurrent)
                        }
                      >
                        {trainer.name} ({count}/{limit} members)
                        {isFull ? " - Full" : ""}
                        {isInactive ? " - Inactive" : ""}
                      </option>
                    );
                  })}
                </select>

                {fieldError("assignedTrainerId")}

                <p className="mt-2 text-xs text-[#8b7771]">
                  {editingMember
                    ? "Select a trainer or leave empty to remove the current assignment."
                    : "You can leave this empty. The member will be created without an assigned trainer."}
                </p>
              </div>

              {/* Member Status */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#4b1725]">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(event) =>
                    updateField("status", event.target.value)
                  }
                  className="w-full rounded-xl border border-[#e7dcd6] bg-white px-4 py-3 text-sm outline-none focus:border-[#641d32]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>

                {fieldError("status")}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-[#eadfd9] pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-[#e7dcd6] px-6 py-3 text-sm font-semibold text-[#6f5b55] hover:bg-[#f7f0ec]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-[#641d32] px-8 py-3 text-sm font-semibold text-white hover:bg-[#4b1725] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Saving..."
                  : editingMember
                  ? "Update Member"
                  : "Create Member"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
