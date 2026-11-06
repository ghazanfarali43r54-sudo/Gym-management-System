"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";
import { clearSession, getSession, type MemberUser } from "@/lib/memberAuth";

export default function RolePlaceholder({ role }: { role: "member" | "trainer" }) {
  const router = useRouter();
  const [user, setUser] = useState<MemberUser | null>(null);

  // Page khulte hi server se poocho: yeh banda kaun hai aur kahan ka hai?
  useEffect(() => {
    async function check() {
      const session = getSession();
      if (!session) {
        router.replace("/");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${session.token}` },
        });
        if (!res.ok) {
          clearSession();
          router.replace("/");
          return;
        }

        const data = await res.json();
        if (data.user.role !== role) {
          // galat dashboard: server ke bataye sahi dashboard par bhej do
          router.replace(data.user.dashboardPath || "/");
          return;
        }
        setUser(data.user);
      } catch {
        router.replace("/");
      }
    }
    check();
  }, [role, router]);

  function logout() {
    clearSession();
    router.replace("/");
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf7f2]">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#800020]/20 border-t-[#800020]" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf7f2] p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-lg ring-1 ring-[#800020]/10">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#800020] text-2xl font-bold text-white">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <h1 className="mt-4 text-2xl font-extrabold text-[#800020]">Welcome, {user.name}</h1>
        <p className="mt-1 text-sm capitalize text-[#800020]/65">{role} dashboard</p>
        <p className="mt-4 rounded-2xl bg-[#faf7f2] px-4 py-3 text-sm text-[#800020]/75">
          Aap ka dashboard jald yahan hoga.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex-1 rounded-xl px-4 py-2.5 text-sm font-bold text-[#800020] ring-1 ring-[#800020]/20 hover:bg-[#800020]/5"
          >
            Home
          </button>
          <button
            onClick={logout}
            className="flex-1 rounded-xl bg-[#800020] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#5e0018]"
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}