
"use client";

import Link from "next/link";
import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await apiFetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: normalizedEmail }),
      });

      if (!response.ok) {
        setError(
          response.data?.message || "Unable to send reset link."
        );
        return;
      }

      setSuccess(
        response.data?.message ||
        "If an account exists with this email, a reset link will be sent."
      );
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf9f7] px-4 py-8">
      <div className="w-full max-w-[480px] rounded-[24px] border border-[#e7e3de] bg-white p-7 shadow-lg sm:p-9">

        <div className="mb-7 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#913d4c] text-white">
            <span className="text-3xl">🔒</span>
          </div>

          <h1 className="text-3xl font-bold text-[#7f3847]">
            Forgot Password?
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#5b5a5a]">
            Enter your registered email address and we will send you a password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
            >
              {success}
            </div>
          )}

          <div className="mb-6">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-[#555]"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your registered email"
              autoComplete="email"
              className="h-[55px] w-full rounded-xl border border-[#dedbd7] bg-[#fbfbfa] px-4 text-sm text-[#333333] caret-[#913d4c] outline-none transition placeholder:text-[#a5a5a5] focus:border-[#913d4c] focus:ring-4 focus:ring-[#913d4c]/10"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-[55px] w-full rounded-xl bg-[#913d4c] font-bold text-white transition hover:bg-[#7e3442] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm font-semibold text-[#913d4c] hover:underline"
            >
              ← Back to Login
            </Link>
          </div>

        </form>
      </div>
    </main>
  );
}
