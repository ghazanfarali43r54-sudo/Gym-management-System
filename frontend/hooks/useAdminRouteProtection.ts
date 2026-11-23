"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApiFetch, clearAdminSession, getAdminToken } from "@/lib/api";

export function useAdminRouteProtection() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [connectError, setConnectError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkAdminAccess() {
      // Step 1: Check whether an admin token exists.
      if (!getAdminToken()) {
        router.replace("/login");
        return;
      }

      try {
        // Step 2: Verify the token with the backend.
        const { ok, data } = await adminApiFetch("/api/auth/me"); 
        // Step 3: Allow access only to admins.
        if (!ok || data?.user?.role?.toLowerCase() !== "admin") {
          clearAdminSession();
          router.replace("/login");
          return;
        }

        if (isMounted) {
          setChecking(false);
        }
      } catch {
        if (isMounted) {
          setConnectError(true);
          setChecking(false);
        }
      }
    }

    checkAdminAccess();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return { checking, connectError };
}
