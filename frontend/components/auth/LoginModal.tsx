"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { API_URL } from "@/lib/api";
import type { MemberUser } from "@/lib/memberAuth";

function Icon({ children, className = "h-5 w-5" }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

const inputCls =
  "w-full rounded-xl bg-white px-4 py-3 text-sm text-[#800020] ring-1 ring-[#800020]/15 outline-none transition placeholder:text-[#800020]/35 focus:ring-2 focus:ring-[#800020]";

export default function LoginModal({
  open,
  onClose,
  onSuccess,
  onSwitchToRegister,
  defaultEmail = "",
  approved = false,
}: {
  open: boolean;
  onClose: () => void;
   onSuccess: (token: string, user: MemberUser, redirectTo: string) => void;
  onSwitchToRegister?: () => void;
  defaultEmail?: string;
  approved?: boolean; // true ho to "request manzoor ho gayi" ka hara box dikhta hai
}) {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  // Popup khule to form taza kar do
const resetForm = () => {
  setEmail(defaultEmail);
  setPassword("");
  setError("");
  setShow(false);
};

  // Esc se band ho, aur peeche ka page scroll na kare
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !sending && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, sending, onClose]);

  if (!open) return null;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Sahi email likho");
      return;
    }
    if (!password) {
      setError("Password likho");
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || "Login nahi ho saka. Dobara try karo.");
        return;
      }

          onSuccess(data.token, data.user, data.redirectTo || "/");
      onClose();
    } catch {
      setError("Server se connect nahi ho paya.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={() => !sending && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white shadow-2xl"
      >
        {/* header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#800020]/10 px-6 py-5 sm:px-8">
          <div>
            <h2 id="login-title" className="text-xl font-extrabold text-[#800020]">
             Login
            </h2>
            <p className="text-sm text-[#800020]/60">Login your Account</p>
          </div>
          <button
            onClick={onClose}
            disabled={sending}
            aria-label="Close"
            className="rounded-xl p-2 text-[#800020]/70 transition hover:bg-[#800020]/10 hover:text-[#800020]"
          >
            <Icon>
              <path d="M6 6l12 12M18 6 6 18" />
            </Icon>
          </button>
        </div>

        <form onSubmit={submit} noValidate className="space-y-5 px-6 py-6 sm:px-8">
          {approved && (
            <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              Your request approved,Now login your account
            </p>
          )}

          <div>
            <label className="mb-2 block text-sm font-bold text-[#800020]">Email</label>
            <input
              type="email"
              className={inputCls}
              placeholder="ali@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-[#800020]">Password</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                className={`${inputCls} pr-12`}
                placeholder="Your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#800020]/60 hover:text-[#800020]"
              >
                <Icon className="h-[18px] w-[18px]">
                  {show ? (
                    <>
                      <path d="M3 3l18 18M10.6 6a9.5 9.5 0 0 1 1.4-.1c6.5 0 10 6.1 10 6.1a17 17 0 0 1-3.2 3.8M6.6 7.3A16 16 0 0 0 2 12s3.5 6.5 10 6.5a9.7 9.7 0 0 0 4-.9" />
                      <path d="M9.9 10a3 3 0 0 0 4.1 4.1" />
                    </>
                  ) : (
                    <>
                      <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </Icon>
              </button>
            </div>
          </div>

          {error && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}

          <button
            type="submit"
            disabled={sending}
            className="w-full rounded-xl bg-[#800020] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#800020]/25 transition hover:bg-[#5e0018] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? "Logging in..." : "Log In"}
          </button>

          {onSwitchToRegister && (
            <p className="text-center text-sm text-[#800020]/70">
              New here?{" "}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="font-bold text-[#800020] underline underline-offset-2"
              >
                Request access
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}