
"use client";

import { useRef } from "react";

import Field from "@/components/auth/Registration/Field";
import ProfilePhoto from "@/components/auth/Registration/ProfilePhoto";
import PersonalInformation from "@/components/auth/Registration/PersonalInformation";
import MemberRegisterForm from "@/components/auth/Registration/MemberRegisterForm";
import TrainerRegisterForm from "@/components/auth/Registration/TrainerRegisterForm";

import { useRegistrationForm } from "@/hooks/registration/registerHooks";
import { useMembershipPlans } from "@/hooks/registration/useMembershipPlans";
import { useRegistrationSubmit } from "@/hooks/registration/useRegistrationSubmit";
import { useRegistrationVisibility } from "@/hooks/registration/useRegistrationVisibility";

// Constant for message textarea
const inputCls =
  "w-full min-w-0 rounded-xl bg-white px-4 py-3 text-sm text-[#800020] ring-1 ring-[#800020]/15 outline-none transition placeholder:text-[#800020]/35 focus:ring-2 focus:ring-[#800020]/30";

type RegisterModalProps = {
  open?: boolean;
  onClose?: () => void;
  onSuccess: (requestId: string, email: string) => void;
  onSwitchToLogin?: () => void;
};

export default function RegisterModal({
  open = true,
  onClose,
  onSuccess,
  onSwitchToLogin,
}: RegisterModalProps) {
  /* ================= FORM HOOK ================= */

  const {
    form,
    updateField,
    resetForm: resetRegistrationForm,
    setSubmitted,
    getFieldError,
    today,
  } = useRegistrationForm();

  /* ================= UI STATE ================= */

  const fileRef = useRef<HTMLInputElement>(null);

  const {
    showPassword,
    showConfirm,
    togglePassword,
    toggleConfirm,
    resetVisibility,
  } = useRegistrationVisibility();

  /* ================= MEMBERSHIP PLANS ================= */

  const { membershipPlans, loadingLists, listError } =
    useMembershipPlans(open);

  /* ================= REGISTRATION SUBMIT ================= */

  const {
    photo,
    setPhoto,
    photoError,
    serverError,
    sending,
    handlePhoto,
    submit,
    resetSubmitState,
  } = useRegistrationSubmit({
    form,
    setSubmitted,
    resetRegistrationForm,
    onSuccess: (requestId, email) => {
      resetVisibility();

      if (fileRef.current) {
        fileRef.current.value = "";
      }

      onSuccess(requestId, email);
    },
  });

  /* ================= RESET FORM ================= */

  function resetForm() {
    resetRegistrationForm();
    resetSubmitState();
    resetVisibility();

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }

  if (!open) return null;

  const initial = form.name.trim().charAt(0).toUpperCase();

  /* ================= RENDER ================= */

  return (
    <main className="relative min-h-screen w-full max-w-none overflow-x-hidden bg-[#faf9f7]">
      <div className="w-full max-w-none px-3 py-5 sm:px-5 lg:px-8 xl:px-10 lg:py-8">

        {/* HEADER */}

        <div className="mb-7 w-full text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#800020] text-white shadow-lg shadow-[#800020]/20">
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M6 7h12M6 12h12M6 17h12" />
              <path d="M3 5v14M21 5v14" />
            </svg>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#800020] sm:text-4xl">
            Join Our Gym
          </h1>

          <p className="mt-2 text-sm text-[#800020]/60 sm:text-base">
            Create your account and start your fitness journey.
          </p>
        </div>

        {/* FORM CARD */}

        <div className="w-full max-w-none overflow-hidden rounded-2xl bg-white shadow-xl shadow-[#800020]/5 ring-1 ring-[#800020]/10">

          {/* CARD HEADER */}

          <div className="w-full border-b border-[#800020]/10 bg-[#800020] px-5 py-5 text-white sm:px-8 lg:px-10">
            <h2 className="text-lg font-bold">
              Registration Details
            </h2>

            <p className="mt-1 text-sm text-white/70">
              Fill in your information to submit a registration request.
            </p>
          </div>

          <form
            onSubmit={submit}
            noValidate
            className="w-full space-y-7 px-4 py-6 sm:px-7 lg:px-10 xl:px-12 sm:py-9"
          >

            {/* ROLE SELECTOR */}

            <section className="w-full">
              <label className="mb-3 block text-sm font-bold text-[#800020]">
                I want to join as
              </label>

              <div className="grid w-full grid-cols-2 gap-3">
                {(["member", "trainer"] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      updateField("role", role);
                      updateField("experience", "");
                    }}
                    className={`rounded-2xl border px-4 py-4 text-sm font-bold transition ${
                      form.role === role
                        ? "border-[#800020] bg-[#800020] text-white shadow-lg shadow-[#800020]/15"
                        : "border-[#800020]/15 bg-[#faf9f7] text-[#800020] hover:border-[#800020]/50"
                    }`}
                  >
                    {role === "member"
                      ? "Join as Member"
                      : "Join as Trainer"}
                  </button>
                ))}
              </div>
            </section>

            {/* PROFILE PHOTO */}

            <ProfilePhoto
              photo={photo}
              initial={initial}
              photoError={photoError}
              fileRef={fileRef}
              onPhotoChange={(file) => void handlePhoto(file)}
              onRemovePhoto={() => setPhoto("")}
            />

            {/* PERSONAL INFORMATION */}

            <PersonalInformation
              form={form}
              updateField={updateField}
              getFieldError={getFieldError}
              showPassword={showPassword}
              onTogglePassword={togglePassword}
              showConfirm={showConfirm}
              onToggleConfirm={toggleConfirm}
            />

            {/* MEMBER INFORMATION */}

            {form.role === "member" && (
              <MemberRegisterForm
                form={form}
                updateField={updateField}
                getFieldError={getFieldError}
                today={today}
                membershipPlans={membershipPlans}
                loadingLists={loadingLists}
              />
            )}

            {/* TRAINER INFORMATION */}

            {form.role === "trainer" && (
              <TrainerRegisterForm
                form={form}
                updateField={updateField}
                getFieldError={getFieldError}
              />
            )}

            {/* MEMBERSHIP PLAN ERROR */}

            {listError && (
              <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
                <span>{listError}</span>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="font-bold underline"
                >
                  Reload page
                </button>
              </div>
            )}

            {/* MESSAGE */}

            <section className="w-full">
              <Field label="Message for admin">
                <textarea
                  rows={4}
                  maxLength={300}
                  className={`${inputCls} resize-y`}
                  placeholder="Write any additional information..."
                  value={form.message}
                  onChange={(event) =>
                    updateField("message", event.target.value)
                  }
                />
              </Field>
            </section>

            {/* SERVER ERROR */}

            {serverError && (
              <div className="w-full rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {serverError}
              </div>
            )}

            {/* FOOTER */}

            <div className="w-full border-t border-[#800020]/10 pt-6">
              <p className="mb-5 text-center text-xs leading-5 text-[#800020]/55">
                Your registration request will be reviewed by the gym
                administration. You will be contacted after approval.
              </p>

              <div className="flex w-full flex-col-reverse gap-3 sm:flex-row">
                {onClose && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!sending) {
                        resetForm();
                        onClose();
                      }
                    }}
                    disabled={sending}
                    className="flex-1 rounded-xl bg-[#faf7f2] px-5 py-3.5 text-sm font-bold text-[#800020] ring-1 ring-[#800020]/15 transition hover:bg-[#800020]/10 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="submit"
                  disabled={sending || loadingLists || Boolean(listError)}
                  className="flex-[1.5] rounded-xl bg-[#800020] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#800020]/20 transition hover:bg-[#5e0018] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending
                    ? "Sending Request..."
                    : "Submit Registration"}
                </button>
              </div>

              {onSwitchToLogin && (
                <p className="mt-6 text-center text-sm text-[#800020]/65">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="font-extrabold text-[#800020] underline underline-offset-4"
                  >
                    Login here
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-[#800020]/40">
          © Gym Management System. All rights reserved.
        </p>
      </div>
    </main>
  );
}
