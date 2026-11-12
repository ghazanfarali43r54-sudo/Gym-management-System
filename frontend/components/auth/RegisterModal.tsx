"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { API_URL } from "@/lib/api";
import {
  isValidEmail,
  isValidPersonName,
  phoneError,
} from "@/lib/formValidation";

/* ================= TYPES ================= */

type FormState = {
  role: "member" | "trainer";
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
  gender: string;
  dateOfBirth: string;
  street: string;
  city: string;
  country: string;
  emergencyName: string;
  emergencyRelationship: string;
  emergencyPhone: string;

  experience: string;
  specialization: string;
  bio: string;
  message: string;
  membershipPlanIds: string[];
};

type MembershipPlan = { _id: string; name: string; price: number; description?: string };

const emptyForm: FormState = {
  role: "member",
  name: "",
  email: "",
  phone: "",
  password: "",
  confirm: "",
  gender: "",
  dateOfBirth: "",
  street: "",
  city: "",
  country: "",
  emergencyName: "",
  emergencyRelationship: "",
  emergencyPhone: "",

  experience: "",
  specialization: "",
  message: "",
  membershipPlanIds: [],
  bio: "",
};

const inputCls =
  "w-full min-w-0 rounded-xl bg-white px-4 py-3 text-sm text-[#800020] ring-1 ring-[#800020]/15 outline-none transition placeholder:text-[#800020]/35 focus:ring-2 focus:ring-[#800020]";

const PHOTO_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_PHOTO_BYTES = 2 * 1024 * 1024;

/* ================= VALIDATION ================= */

function validate(form: FormState) {
  const errors: Partial<Record<keyof FormState, string>> = {};

  if (!isValidPersonName(form.name)) {
    errors.name =
      "Enter a valid name using letters, spaces, apostrophes, or hyphens.";
  }

  if (!isValidEmail(form.email)) {
    errors.email = "Enter a valid email address, such as name@example.com.";
  }

  const phoneValidationError = phoneError(form.phone);
  if (phoneValidationError) {
    errors.phone = phoneValidationError;
  }

  if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
  } else if (form.password.length > 72) {
    errors.password = "Password must be 72 characters or fewer";
  }

  if (form.confirm !== form.password) {
    errors.confirm = "Passwords Does not match";
  }

  if (form.role === "trainer") {
    if (!form.experience.trim()) {
      errors.experience = "Please enter your professional experience.";
    } else if (form.experience.trim().length > 80) {
      errors.experience = "Experience must be 80 characters or fewer.";
    }

    if (!form.specialization.trim()) {
      errors.specialization = "Please enter your specialization.";
    } else if (form.specialization.trim().length > 120) {
      errors.specialization = "Specialization must be 120 characters or fewer.";
    }

    if (!form.bio.trim()) {
      errors.bio = "Please write a short professional bio.";
    } else if (form.bio.trim().length < 20) {
      errors.bio = "Bio must be at least 20 characters.";
    } else if (form.bio.trim().length > 500) {
      errors.bio = "Bio must be 500 characters or fewer.";
    }
  }

  return errors;
}

/* ================= FIELD ================= */

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 w-full">
      <label className="mb-2 block text-sm font-bold text-[#800020]">
        {label}
        {required && <span className="ml-1 text-rose-600">*</span>}
      </label>

      {children}

      {error && (
        <p className="mt-1.5 text-xs font-semibold text-rose-700">{error}</p>
      )}
    </div>
  );
}

/* ================= COMPONENT ================= */

export default function RegisterModal({
  open = true,
  onClose,
  onSuccess,
  onSwitchToLogin,
}: {
  open?: boolean;
  onClose?: () => void;
  onSuccess: (requestId: string, email: string) => void;
  onSwitchToLogin?: () => void;
}) {
  const [form, setForm] = useState<FormState>(emptyForm);

  const [photo, setPhoto] = useState("");
  const [photoError, setPhotoError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [loadingLists, setLoadingLists] = useState(false);
  const [listError, setListError] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [today, setToday] = useState("");
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);

  useEffect(() => {
    setToday(new Date().toISOString().slice(0, 10));
  }, []);

  const errors = validate(form);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setPhoto("");
    setPhotoError("");
    setSubmitted(false);
    setServerError("");
    setShowPassword(false);
    setShowConfirm(false);
  }

  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();

    async function loadData() {
      try {
        setLoadingLists(true);
        setListError("");
        const response = await fetch(`${API_URL}/api/public/membership-plans`, { signal: controller.signal });
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body.message || "Could not load membership plans.");
        setMembershipPlans(Array.isArray(body.data) ? body.data : []);
      } catch (error) {
        if (controller.signal.aborted) return;
        setListError(error instanceof Error ? error.message : "Could not load membership plans.");
        console.error(error);
      } finally {
        if (!controller.signal.aborted) {
          setLoadingLists(false);
        }
      }
    }

    void loadData();

    return () => controller.abort();
  }, [open]);

  /* ================= PHOTO UPLOAD ================= */

  async function handlePhoto(file?: File) {
    if (!file) return;

    setPhotoError("");

    if (!PHOTO_TYPES.includes(file.type)) {
      setPhotoError("Sirf PNG, JPG ya WEBP photo upload karein.");
      return;
    }

    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError("Photo 2 MB se chhoti honi chahiye.");
      return;
    }

    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");

      canvas.width = 256;
      canvas.height = 256;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        bitmap.close();
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

      bitmap.close();

      setPhoto(canvas.toDataURL("image/jpeg", 0.85));
    } catch (error) {
      console.error(error);
      setPhotoError("Photo upload nahi ho saki.");
    }
  }

  /* ================= SUBMIT ================= */

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitted(true);
    setServerError("");

    if (Object.keys(errors).length > 0) {
      return;
    }

    setSending(true);

    try {
      const response = await fetch(`${API_URL}/api/public/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: form.role,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
          experience: form.role === "trainer" ? form.experience.trim() : "",

          specialization:
            form.role === "trainer" ? form.specialization.trim() : "",
          bio: form.role === "trainer" ? form.bio.trim() : "",

          message: form.message.trim(),
          photo,
          membershipPlanIds: form.role === "member" ? form.membershipPlanIds : [],
          ...(form.role === "member" ? {
            gender: form.gender,
            dateOfBirth: form.dateOfBirth || null,
            address: { street: form.street.trim(), city: form.city.trim(), country: form.country.trim() },
            emergencyContact: { name: form.emergencyName.trim(), relationship: form.emergencyRelationship.trim(), phone: form.emergencyPhone.trim() },
          } : {}),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setServerError(
          data.message || "Registration request send nahi ho saki."
        );
        return;
      }

      const email = form.email.trim();
      const requestId = data.request?.id ?? "";

      resetForm();
      onSuccess(requestId, email);
    } catch (error) {
      console.error(error);
      setServerError("Server se connect nahi ho saka.");
    } finally {
      setSending(false);
    }
  }

  if (!open) return null;

  const err = (key: keyof FormState) => (submitted ? errors[key] : undefined);

  const initial = form.name.trim().charAt(0).toUpperCase();

  /* ================= FULL WIDTH PAGE ================= */

  return (
    <main className="relative min-h-screen w-full max-w-none overflow-x-hidden bg-[#faf9f7]">
      {/* FULL WIDTH PAGE WRAPPER */}

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

        {/* FULL WIDTH FORM CARD */}

        <div className="w-full max-w-none overflow-hidden rounded-2xl bg-white shadow-xl shadow-[#800020]/5 ring-1 ring-[#800020]/10">
          {/* CARD HEADER */}

          <div className="w-full border-b border-[#800020]/10 bg-[#800020] px-5 py-5 text-white sm:px-8 lg:px-10">
            <h2 className="text-lg font-bold">Registration Details</h2>

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
                      set("role", role);
                      set("experience", "");
                    }}
                    className={`rounded-2xl border px-4 py-4 text-sm font-bold transition ${
                      form.role === role
                        ? "border-[#800020] bg-[#800020] text-white shadow-lg shadow-[#800020]/15"
                        : "border-[#800020]/15 bg-[#faf9f7] text-[#800020] hover:border-[#800020]/50"
                    }`}
                  >
                    {role === "member" ? "Join as Member" : "Join as Trainer"}
                  </button>
                ))}
              </div>
            </section>

            {/* PROFILE PHOTO */}

            <section className="w-full rounded-2xl bg-[#faf7f2] p-5 ring-1 ring-[#800020]/10 sm:p-6">
              <div className="mb-4">
                <h3 className="font-bold text-[#800020]">Profile Picture</h3>
                <p className="mt-1 text-xs text-[#800020]/55">
                  Upload a clear profile photo (optional).
                </p>
              </div>

              <div className="flex w-full flex-col items-center gap-5 sm:flex-row">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[#800020]/30 bg-white text-3xl font-bold text-[#800020]/50">
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initial || "?"
                  )}
                </div>

                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(event) => {
                      void handlePhoto(event.target.files?.[0]);
                      event.target.value = "";
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#800020] ring-1 ring-[#800020]/20 transition hover:bg-[#800020]/5"
                  >
                    Upload Photo
                  </button>

                  <p className="mt-2 text-xs text-[#800020]/50">
                    PNG, JPG or WEBP. Maximum size 2 MB.
                  </p>

                  {photo && (
                    <button
                      type="button"
                      onClick={() => setPhoto("")}
                      className="mt-2 text-xs font-bold text-rose-700 underline"
                    >
                      Remove photo
                    </button>
                  )}

                  {photoError && (
                    <p className="mt-2 text-xs font-semibold text-rose-700">
                      {photoError}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* PERSONAL INFORMATION */}

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
                <Field label="Full Name" required error={err("name")}>
                  <input className={inputCls} placeholder="Enter your full name" autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} />
                </Field>

                <Field label="Phone Number" required error={err("phone")}>
                  <input className={inputCls} placeholder="03001234567" autoComplete="tel" inputMode="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                </Field>

                <Field label="Email Address" required error={err("email")}>
                  <input type="email" className={inputCls} placeholder="example@email.com" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
                </Field>

                <Field label="Password" required error={err("password")}>
                  <div className="relative w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      maxLength={72}
                      className={`${inputCls} pr-16`}
                      placeholder="Minimum 6 characters"
                      autoComplete="new-password"
                      value={form.password}
                      onChange={(e) => set("password", e.target.value)}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#800020]"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </Field>

                <Field label="Confirm Password" required error={err("confirm")}>
                  <div className="relative w-full">
                    <input
                      type={showConfirm ? "text" : "password"}
                      maxLength={72}
                      className={`${inputCls} pr-16`}
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      value={form.confirm}
                      onChange={(e) => set("confirm", e.target.value)}
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#800020]"
                    >
                      {showConfirm ? "Hide" : "Show"}
                    </button>
                  </div>
                </Field >
              </div>
            </section>

            {form.role === "member" && (
              <section className="w-full rounded-2xl bg-[#faf7f2] p-5 ring-1 ring-[#800020]/10 sm:p-6">
                <div className="mb-5"><h3 className="font-extrabold text-[#800020]">Member Information</h3><p className="mt-1 text-xs text-[#800020]/55">Personal details and optional emergency contact.</p></div>
                <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Date of Birth"><input type="date" max={today || undefined} className={inputCls} value={form.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} /></Field>
                  <Field label="Gender"><select className={inputCls} value={form.gender} onChange={(e) => set("gender", e.target.value)}><option value="">Select gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></Field>
                  <div className="sm:col-span-2"><h4 className="font-bold text-[#800020]">Address</h4></div>
                  <Field label="Street"><input maxLength={150} className={inputCls} value={form.street} onChange={(e) => set("street", e.target.value)} /></Field>
                  <Field label="City"><input maxLength={100} className={inputCls} value={form.city} onChange={(e) => set("city", e.target.value)} /></Field>
                  <Field label="Country"><input maxLength={100} className={inputCls} value={form.country} onChange={(e) => set("country", e.target.value)} /></Field>
                  <div className="sm:col-span-2 border-t border-[#800020]/10 pt-4"><h4 className="font-bold text-[#800020]">Emergency Contact</h4><p className="mt-1 text-xs text-[#800020]/55">If you add one field, complete all three.</p></div>
                  <Field label="Contact Name"><input maxLength={60} className={inputCls} value={form.emergencyName} onChange={(e) => set("emergencyName", e.target.value)} /></Field>
                  <Field label="Relationship"><input maxLength={50} className={inputCls} value={form.emergencyRelationship} onChange={(e) => set("emergencyRelationship", e.target.value)} /></Field>
                  <Field label="Contact Phone"><input type="tel" maxLength={15} className={inputCls} value={form.emergencyPhone} onChange={(e) => set("emergencyPhone", e.target.value)} /></Field>
                  <div className="sm:col-span-2 border-t border-[#800020]/10 pt-4">
                    <h4 className="font-bold text-[#800020]">Membership Plans <span className="font-normal">(optional, select any)</span></h4>
                    {loadingLists ? <p className="mt-2 text-sm text-[#800020]/60">Loading plans...</p> : membershipPlans.length === 0 ? <p className="mt-2 text-sm text-[#800020]/60">No active plans available.</p> : (
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {membershipPlans.map((plan) => (
                          <label key={plan._id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#800020]/15 bg-white p-3">
                            <input type="checkbox" checked={form.membershipPlanIds.includes(plan._id)} onChange={(event) => set("membershipPlanIds", event.target.checked ? [...form.membershipPlanIds, plan._id] : form.membershipPlanIds.filter((id) => id !== plan._id))} className="mt-1 accent-[#800020]" />
                            <span><span className="block text-sm font-bold text-[#800020]">{plan.name}</span><span className="text-xs text-[#800020]/60">PKR {plan.price}{plan.description ? ` · ${plan.description}` : ""}</span></span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* MEMBERSHIP / TRAINER INFORMATION */}

            <section className="w-full rounded-2xl bg-[#faf7f2] p-5 ring-1 ring-[#800020]/10 sm:p-6">
              <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
                {form.role === "trainer" && (
                  <Field label="Professional Experience" required error={err("experience")}>
                    <input className={inputCls} placeholder="e.g. 3 years" type="number" value={form.experience} onChange={(e) => set("experience", e.target.value)} />
                  </Field>
                )}
                {form.role === "trainer" && (
                  <>
                    <Field label="Specialization" required error={err("specialization")}>
                      <input className={inputCls} placeholder="e.g. Weight Training, Yoga, Cardio" value={form.specialization} onChange={(e) => set("specialization", e.target.value)} />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="Professional Bio" required error={err("bio")}>
                        <textarea rows={4} maxLength={500} className={`${inputCls} resize-y`} placeholder="Tell us about yourself, your fitness journey, professional experience, certifications, achievements, and training approach..." value={form.bio} onChange={(e) => set("bio", e.target.value)} />
                        <div className="mt-1 flex justify-between"><p className="text-xs text-[#800020]/50">Introduce yourself to gym members.</p><p className="text-xs text-[#800020]/50">{form.bio.length}/500</p></div>
                      </Field>
                    </div>
                  </>
                )}
              </div>

              {listError && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
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
            </section>

            {/* MESSAGE */}

            <section className="w-full">
              <Field label="Message for admin">
                <textarea
                  rows={4}
                  maxLength={300}
                  className={`${inputCls} resize-y`}
                  placeholder="Write any additional information..."
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
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
                  {sending ? "Sending Request..." : "Submit Registration"}
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
