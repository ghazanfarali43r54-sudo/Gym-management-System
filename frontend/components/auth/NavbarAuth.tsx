
"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { API_URL } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  clearRequest,
  clearSession,
  AUTH_CHANGE_EVENT,
  getSavedRequest,
  getSession,
  saveRequest,
  saveMember,
  type MemberUser,
  type SavedRequest,
} from "@/lib/memberAuth";
import RegisterModal from "./RegisterModal";
import LoginModal from "./LoginModal";

type View =
  | "loading"
  | "guest"
  | "pending"
  | "approved"
  | "rejected"
  | "member";

type ModalName =
  | "none"
  | "register"
  | "login"
  | "pendingInfo"
  | "rejectedInfo";

type RequestStatus = "pending" | "active" | "rejected" | "gone" | "error";

// Server se registration request ka status check karein
async function fetchStatus(id: string): Promise<RequestStatus> {
  try {
    const res = await fetch(`${API_URL}/api/public/register/${id}/status`);

    if (res.status === 404) return "gone";
    if (!res.ok) return "error";

    const data = await res.json();
    return ["pending", "active", "rejected"].includes(data.status)
      ? data.status
      : "error";
  } catch {
    return "error";
  }
}

// Popup ko body mein render karne ke liye
function Portal({ children }: { children: ReactNode }) {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
}

// Information popup
function InfoModal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl"
      >
        <h3 className="text-lg font-extrabold text-[#800020]">{title}</h3>
        <div className="mt-2 text-sm text-[#800020]/70">{children}</div>
      </div>
    </div>
  );
}

// Main Navbar Authentication
export default function NavbarAuth() {
  const router = useRouter();

  const [view, setView] = useState<View>("loading");
  const [member, setMember] = useState<MemberUser | null>(null);
  const [saved, setSaved] = useState<SavedRequest | null>(null);
  const [modal, setModal] = useState<ModalName>("none");
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");

  const refreshStatus = useCallback(async (req: SavedRequest) => {
    const status = await fetchStatus(req.id);

    if (status === "gone") {
      clearRequest();
      setSaved(null);
      setView("guest");
    } else if (status === "pending") {
      setView("pending");
    } else if (status === "active") {
      setView("approved");
    } else if (status === "rejected") {
      setView("rejected");
    } else if (status === "error") {
      // A failed status check must not leave the navbar stuck on its loader.
      setView("guest");
    }
  }, []);

  // IMPORTANT: Public Navbar sirf Member/Trainer session check karega.
  // Admin session ko bilkul touch nahi karega.
  useEffect(() => {
    let cancelled = false;

    async function init() {
      const session = getSession();
      const currentMember = session && session.user.role.toLowerCase() !== "admin" ? session : null;

      if (currentMember) {
        try {
          const res = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${currentMember.token}`,
            },
          });

          if (res.status === 401) {
            clearSession();
          } else {
            if (!cancelled) {
              setMember(currentMember.user);
              setView("member");
            }
            return;
          }
        } catch {
          // Server unavailable ho to existing member login show karein
          if (!cancelled) {
            setMember(currentMember.user);
            setView("member");
          }
          return;
        }
      }

      const req = getSavedRequest();

      if (req) {
        if (!cancelled) setSaved(req);
        await refreshStatus(req);
      } else {
        if (!cancelled) setView("guest");
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [refreshStatus]);

  // Login flows can update browser storage without reloading this component.
  useEffect(() => {
    const refresh = () => {
      const session = getSession();
      if (session && session.user.role.toLowerCase() !== "admin") {
        setMember(session.user);
        setView("member");
      } else {
        setMember(null);
        setView("guest");
      }
    };
    window.addEventListener(AUTH_CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  // Pending request status check
  useEffect(() => {
    if (view !== "pending" || !saved) return;

    const check = () => refreshStatus(saved);
    const timer = setInterval(check, 20000);

    window.addEventListener("focus", check);

    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", check);
    };
  }, [view, saved, refreshStatus]);

  // Toast automatically hide
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(""), 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Button action
  function handleButton() {
    if (view === "loading" || view === "guest") {
      router.push("/login");
    } else if (view === "pending") {
      setModal("pendingInfo");
    } else if (view === "approved") {
      setModal("login");
    } else if (view === "rejected") {
      setModal("rejectedInfo");
    }
  }

  // Registration success
  function handleRegistered(id: string, email: string) {
    const req = { id, email };

    saveRequest(req);
    setSaved(req);
    setView("pending");
    setToast("Request bhej di gayi! Admin jald aap se rabta karega.");
  }

  // Member/Trainer login success
  function handleLoggedIn(
    token: string,
    user: MemberUser,
    redirectTo: string
  ) {
    const full = {
      ...user,
      dashboardPath: redirectTo,
    };

    // Sirf Member/Trainer ka session save hoga
    saveMember(token, full);

    clearRequest();
    setSaved(null);
    setMember(full);
    setView("member");
    setModal("none");

    router.push(redirectTo);
  }

  // Sirf Member/Trainer logout
  function logout() {
    clearSession();

    setMember(null);
    setMenuOpen(false);

    const req = getSavedRequest();
    setSaved(req);

    setView(req ? "pending" : "guest");

    if (req) {
      refreshStatus(req);
    }
  }

  // Apply again
  function applyAgain() {
    clearRequest();
    setSaved(null);
    setView("guest");
    setModal("register");
  }

  const base =
    "rounded-lg px-5 py-2.5 text-base font-semibold transition";

  let button: ReactNode;

  if (view === "member" && member) {
    button = (
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2.5 rounded-lg py-1.5 pl-1.5 pr-3 ring-1 ring-[#800020]/20 transition hover:bg-[#800020]/5"
        >
          {member.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={member.photo}
              alt=""
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#800020] text-sm font-bold text-white">
              {member.name.charAt(0).toUpperCase()}
            </span>
          )}

          <span className="text-sm font-semibold text-[#800020]">
            {member.name.split(" ")[0]}
          </span>
        </button>

        {menuOpen && (
          <>
            <Portal>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
                aria-hidden
              />
            </Portal>

            <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-[#800020]/10">
              <div className="border-b border-[#800020]/10 px-3 py-2.5">
                <p className="text-sm font-bold text-[#800020]">
                  {member.name}
                </p>
                <p className="truncate text-xs text-[#800020]/60">
                  {member.email}
                </p>
              </div>

              {member.dashboardPath && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    router.push(member.dashboardPath as string);
                  }}
                  className="mt-1 w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-[#800020] transition hover:bg-[#800020]/10"
                >
                  My Dashboard
                </button>
              )}

              <button
                onClick={logout}
                className="mt-1 w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-[#800020] transition hover:bg-[#800020] hover:text-white"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    );
  } else if (view === "pending") {
    button = (
      <button
        onClick={handleButton}
        className={`${base} flex items-center gap-2 bg-amber-100 text-amber-800 ring-1 ring-amber-300 hover:bg-amber-200`}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-70" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
        </span>
        Request Pending
      </button>
    );
  } else if (view === "approved") {
    button = (
      <button
        onClick={handleButton}
        className={`${base} bg-emerald-600 text-white hover:bg-emerald-700`}
      >
        Approved — Log in
      </button>
    );
  } else if (view === "rejected") {
    button = (
      <button
        onClick={handleButton}
        className={`${base} bg-rose-50 text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100`}
      >
        Request Rejected
      </button>
    );
  } else {
    button = (
      <button
        onClick={handleButton}
        className={`${base} bg-[#800020] text-white hover:bg-[#5e0018]`}
      >
        Login
      </button>
    );
  }

  return (
    <>
      {button}

      <Portal>
        <RegisterModal
          open={modal === "register"}
          onClose={() => setModal("none")}
          onSuccess={handleRegistered}
          onSwitchToLogin={() => setModal("login")}
        />

        <LoginModal
          open={modal === "login"}
          onClose={() => setModal("none")}
          onSuccess={handleLoggedIn}
          onSwitchToRegister={() => setModal("register")}
          defaultEmail={saved?.email ?? ""}
          approved={view === "approved"}
        />

        {modal === "pendingInfo" && (
          <InfoModal
            title="Request Pending"
            onClose={() => setModal("none")}
          >
            <p>
              Aap ki request admin ke paas pahunch gayi hai. Wo jald aap se
              rabta karega.
            </p>
            <p className="mt-2">
              Manzoor hote hi yahan "Log in" ka button aa jayega.
            </p>
            <button
              onClick={() => setModal("none")}
              className="mt-5 w-full rounded-xl bg-[#800020] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#5e0018]"
            >
              OK
            </button>
          </InfoModal>
        )}

        {modal === "rejectedInfo" && (
          <InfoModal
            title="Request Rejected"
            onClose={() => setModal("none")}
          >
            <p>
              Aap ki request manzoor nahi hui. Zyada jaanne ke liye gym se
              rabta karo, ya nayi request bhej do.
            </p>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setModal("none")}
                className="flex-1 rounded-xl px-4 py-2.5 text-sm font-bold text-[#800020] ring-1 ring-[#800020]/20 hover:bg-[#800020]/5"
              >
                Close
              </button>

              <button
                onClick={applyAgain}
                className="flex-1 rounded-xl bg-[#800020] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#5e0018]"
              >
                Apply again
              </button>
            </div>
          </InfoModal>
        )}

        {toast && (
          <div
            role="status"
            className="fixed right-4 top-4 z-[80] max-w-xs rounded-2xl bg-[#800020] px-5 py-3.5 text-sm font-semibold text-white shadow-2xl"
          >
            {toast}
          </div>
        )}
      </Portal>
    </>
  );
}
