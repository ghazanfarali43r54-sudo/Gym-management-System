"use client";

import { useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

type Props = {
  token: string;
};

export default function ResetPasswordForm({ token }: Props) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("Both password fields are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await apiFetch(`/api/auth/reset-password/${token}`, {
        method: "POST",
        body: JSON.stringify({
          password,
          confirmPassword,
        }),
      });

      if (!response.ok) {
        setError(response.data?.message || "Unable to reset password.");
        return;
      }

      setSuccess(response.data?.message || "Password reset successful.");

      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800">Reset Password</h1>

        <p className="mt-2 text-sm text-gray-600">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              New Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              minLength={6}
              required
              disabled={submitting || Boolean(success)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              minLength={6}
              required
              disabled={submitting || Boolean(success)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-rose-500"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {success && (
            <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {success}
              <Link
                href="/login"
                className="mt-3 block font-semibold underline"
              >
                Go to Login
              </Link>
            </div>
          )}

          {!success && (
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-[#913d4c] px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Updating..." : "Reset Password"}
            </button>
          )}
        </form>

        {!success && (
          <Link
            href="/login"
            className="mt-5 block text-center text-sm text-gray-600 hover:underline"
          >
            Back to Login
          </Link>
        )}
      </div>
    </div>
  );
}
