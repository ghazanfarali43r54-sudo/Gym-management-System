import { Suspense } from "react";
import AdminShell from "@/components/admin/AdminShell";
import TrainerDashboardClient from "./TrainerDashboardClient";

export default function Page() {
  return (
    <AdminShell>
      <Suspense fallback={<div className="p-6">Loading trainer dashboard...</div>}>
        <TrainerDashboardClient />
      </Suspense>
    </AdminShell>
  );
}
