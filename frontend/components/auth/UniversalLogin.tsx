"use client";

import Link from "next/link";
import { useSettings } from "@/lib/SettingsContext";
import { useAuthLogin } from "@/hooks/authHooks";

function MailIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
      >
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="m3 3 18 18" />
      <path d="M10.6 6.2A10.7 10.7 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3.1 3.8" />
      <path d="M6.6 6.8C4 8.4 2.5 12 2.5 12s3.5 6 9.5 6c1.1 0 2.1-.2 3-.5" />
    </svg>
  );
}

function LoginIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M14 4h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="M12 3 19 6v5c0 4.5-3 8.1-7 10-4-1.9-7-5.5-7-10V6l7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function DumbbellIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-6 w-6"
    >
      <path d="M6 4v16M18 4v16M3 8v8M21 8v8M6 12h12" />
    </svg>
  );
}

export default function UniversalLogin() {
  const { settings } = useSettings();

  // Login states and functionality from custom hook
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    remember,
    setRemember,
    loading,
    error,
    handleSubmit,
  } = useAuthLogin();

  const gymName = settings.general.gymName || "GymMaster Pro";

  return (
    <main className="min-h-screen bg-[#faf9f7] px-4 py-8 text-[#4b4b4b] sm:px-6">
      {/* TOP RIGHT PORTAL */}

      <div className="fixed right-5 top-5 z-10 sm:right-8 sm:top-7">
        <div className="flex items-center gap-2 rounded-full border border-[#e8e4df] bg-white px-4 py-2.5 text-sm font-medium text-[#555] shadow-sm">
          <ShieldIcon />
          <span>Gym Fitness Portal</span>
        </div>
      </div>

      {/* MAIN */}

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[700px] items-center justify-center">
        <div className="w-full max-w-[610px]">
          {/* BRAND */}

          <div className="mb-8 text-center sm:mb-9">
            <div className="mb-5 flex items-center justify-center gap-4">
              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[20px] bg-[#913d4c] text-white shadow-lg shadow-[#913d4c]/15">
                <DumbbellIcon />
              </div>

              <div className="text-left">
                <h1 className="text-[30px] font-extrabold tracking-tight text-[#2d2d2d] sm:text-[34px]">
                  {gymName}
                </h1>

                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#777]">
                  GYM & FITNESS MANAGEMENT SYSTEM
                </p>
              </div>
            </div>

            <h2 className="mt-7 text-[38px] font-extrabold tracking-tight text-[#7f3847] sm:text-[42px]">
              Welcome back
            </h2>

            <p className="mt-2 text-base text-[#777]">
              Sign in to your account
            </p>
          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-[24px] border border-[#e7e3de] bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.04)] sm:p-8"
          >
            {/* ERROR */}

            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
              >
                {error}
              </div>
            )}

            {/* EMAIL */}

            <div className="mb-5">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#555]"
              >
                Email
              </label>

              <div className="flex h-[60px] items-center rounded-2xl border border-[#dedbd7] bg-[#fbfbfa] px-5 transition focus-within:border-[#913d4c] focus-within:ring-4 focus-within:ring-[#913d4c]/10">
                <span className="mr-4 text-[#777]">
                  <MailIcon />
                </span>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="h-full w-full bg-transparent text-[16px] text-[#333] outline-none placeholder:text-[#a5a5a5]"
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div className="mb-5">
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-[#555]"
              >
                Password
              </label>

              <div className="flex h-[60px] items-center rounded-2xl border border-[#dedbd7] bg-[#fbfbfa] px-5 transition focus-within:border-[#913d4c] focus-within:ring-4 focus-within:ring-[#913d4c]/10">
                <span className="mr-4 text-[#777]">
                  <LockIcon />
                </span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="h-full w-full bg-transparent text-[16px] text-[#333] outline-none placeholder:text-[#a5a5a5]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="ml-3 shrink-0 text-[#888] transition hover:text-[#913d4c]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* REMEMBER / FORGOT */}

            <div className="mb-6 flex items-center justify-between gap-4">
              <label
                htmlFor="remember"
                className="flex cursor-pointer items-center gap-2.5 text-sm text-[#555]"
              >
                <input
                  id="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="h-5 w-5 accent-[#913d4c]"
                />

                <span>Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[#555] transition hover:text-[#913d4c]"
              >
                Forgot password?
              </Link>
            </div>

            {/* SIGN IN */}

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="flex h-[60px] w-full items-center justify-center gap-3 rounded-2xl bg-[#913d4c] text-[17px] font-bold text-white shadow-lg shadow-[#913d4c]/15 transition hover:bg-[#7e3442] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LoginIcon />

              {loading ? "Signing in..." : "Sign In"}
            </button>

            {/* SECURITY */}

            <div className="mt-7 flex items-center justify-center gap-2 text-sm text-[#777]">
              <LockIcon />

              <span>Secure login – Your data is protected</span>
            </div>

            {/* CREATE ACCOUNT */}

            <div className="mt-7 border-t border-[#eeeae6] pt-6 text-center">
              <p className="text-sm text-[#777]">Don&apos;t have an account?</p>

              <Link
                href="/register"
                className="mt-1 inline-block font-bold text-[#913d4c] transition hover:underline"
              >
                Create Account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
