
"use client";

import { useEffect, useState } from "react";
import { loadMembershipPlans } from "@/features/register/registerService";
import type { MembershipPlan } from "@/hooks/registration/registerHooks";

export function useMembershipPlans(open: boolean) {
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [listError, setListError] = useState("");

  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();

    async function loadData() {
      try {
        setLoadingLists(true);
        setListError("");

        const plans = await loadMembershipPlans(controller.signal);

        setMembershipPlans(plans);
      } catch (error) {
        if (controller.signal.aborted) return;

        setListError(
          error instanceof Error
            ? error.message
            : "Could not load membership plans."
        );

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

  return {
    membershipPlans,
    loadingLists,
    listError,
  };
}
