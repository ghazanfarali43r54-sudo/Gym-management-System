"use client";

import Image from "next/image";
import { useMemberForm } from "@/hooks/memberHooks";
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
          <div className="mx-auto w-full max-w-5xl">
            {/* Form header */}
            <div className="mb-6 flex items-center justify-between rounded-2xl border border-[#eadfd9] bg-white px-5 py-5 sm:px-8">
              <div>
                <h2 className="text-xl font-bold text-[#4b1725] sm:text-2xl">
                  {editingMember ? "Edit Member" : "Add New Member"}
                </h2>
                <p className="mt-1 text-xs text-[#8b7771] sm:text-sm">
                  {editingMember
                    ? "Update the member details below."
                    : "Enter member details and optionally assign plans or a trainer."}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-3 py-2 text-2xl text-[#8b7771] hover:bg-[#f3eae5]"
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            {/* Scrollable form area */}
            <div className="rounded-2xl border border-[#eadfd9] bg-white p-5 shadow-sm sm:p-8">
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="mb-6 rounded-xl border border-[#e7dcd6] bg-[#fffdfa] p-4">
                  <h3 className="text-sm font-semibold text-[#4b1725]">
                    Profile Picture{" "}
                    <span className="font-normal text-[#8b7771]">
                      (Optional)
                    </span>
                  </h3>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#f3eae5] text-xl font-bold text-[#641d32]">
                      {photo ? (
                        <Image
                          src={photo}
                          alt="Member profile preview"
                          width={64}
                          height={64}
                          unoptimized
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        form.name.trim().charAt(0).toUpperCase() || "M"
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(event) => {
                          void handlePhoto(event.target.files?.[0]);
                          event.target.value = "";
                        }}
                        className="block text-sm"
                      />
                      <p className="mt-1 text-xs text-[#8b7771]">
                        PNG, JPG or WEBP, maximum 2 MB.
                      </p>
                      {photo && (
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="mt-1 text-xs font-semibold text-[#641d32] underline"
                        >
                          Remove photo
                        </button>
                      )}
                      {photoError && (
                        <p className="mt-1 text-xs text-red-700">
                          {photoError}
                        </p>
                      )}
                      {fieldError("photo")}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#4b1725]">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={(event) =>
                        updateField("name", event.target.value)
                      }
                      placeholder="Enter full name"
                      className="w-full rounded-xl border border-[#e7dcd6] bg-white px-4 py-3 text-sm outline-none focus:border-[#641d32]"
                    />
                    {fieldError("name")}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#4b1725]">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      placeholder="Enter email address"
                      className="w-full rounded-xl border border-[#e7dcd6] bg-white px-4 py-3 text-sm outline-none focus:border-[#641d32]"
                    />
                    {fieldError("email")}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#4b1725]">
                      Phone Number *
                    </label>
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
                      className="w-full rounded-xl border border-[#e7dcd6] bg-white px-4 py-3 text-sm outline-none focus:border-[#641d32]"
                    />
                    {fieldError("phone")}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#4b1725]">
                      Password {editingMember ? "(Optional)" : "*"}
                    </label>
                    <input
                      required={!editingMember}
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
                        editingMember
                          ? "Leave blank to keep current password"
                          : "At least 6 characters"
                      }
                      className="w-full rounded-xl border border-[#e7dcd6] bg-white px-4 py-3 text-sm outline-none focus:border-[#641d32]"
                    />
                    {fieldError("password")}
                  </div>

                  {!editingMember && (
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#4b1725]">
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
                        className="w-full rounded-xl border border-[#e7dcd6] bg-white px-4 py-3 text-sm outline-none focus:border-[#641d32]"
                      />
                      {fieldError("confirmPassword")}
                    </div>
                  )}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#4b1725]">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={form.dateOfBirth}
                      max={today || undefined}
                      onChange={(event) =>
                        updateField("dateOfBirth", event.target.value)
                      }
                      className="w-full rounded-xl border border-[#e7dcd6] bg-white px-4 py-3 text-sm outline-none focus:border-[#641d32]"
                    />
                    {fieldError("dateOfBirth")}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#4b1725]">
                      Gender
                    </label>
                    <select
                      value={form.gender}
                      onChange={(event) =>
                        updateField("gender", event.target.value)
                      }
                      className="w-full rounded-xl border border-[#e7dcd6] bg-white px-4 py-3 text-sm outline-none focus:border-[#641d32]"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {fieldError("gender")}
                  </div>
                  <div className="md:col-span-2 border-t border-[#eadfd9] pt-4">
                    <h3 className="font-semibold text-[#4b1725]">Address</h3>
                  </div>
                  {[
                    ["street", "Street"],
                    ["city", "City"],
                    ["country", "Country"],
                  ].map(([key, label]) => (
                    <div key={key}>
                      <label className="mb-2 block text-sm font-semibold text-[#4b1725]">
                        {label}
                      </label>
                      <input
                        value={form[key as keyof MemberForm] as string}
                        onChange={(event) =>
                          updateField(
                            key as keyof MemberForm,
                            event.target.value
                          )
                        }
                        maxLength={key === "street" ? 150 : 100}
                        className="w-full rounded-xl border border-[#e7dcd6] bg-white px-4 py-3 text-sm outline-none focus:border-[#641d32]"
                      />
                      {fieldError(key)}
                    </div>
                  ))}
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

                  {/* Optional Trainer Assignment */}
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

                  {/* Status */}
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

                {/* Bottom actions */}
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
