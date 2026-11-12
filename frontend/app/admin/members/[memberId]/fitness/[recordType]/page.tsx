"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import MemberFitnessRecords from "@/components/admin/MemberFitnessRecords";
import MemberFitnessComparison from "@/components/admin/MemberFitnessComparison";
import { apiFetch } from "@/lib/api";

type MemberSummary = { id: string; name: string; email: string };
type RecordType = "body-measurement" | "fitness-assessment";

function rowsFrom(response: any): any[] {
  const data = response?.data ?? response;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.requests)) return data.requests;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.requests)) return data.data.requests;
  return [];
}

function MemberFitnessEntryContent() {
  const params = useParams<{ memberId: string; recordType: string }>();
  const router = useRouter();
  const memberId = params.memberId;
  const recordType = params.recordType as RecordType;
  const [member, setMember] = useState<MemberSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isComparison = recordType === "comparison";
  const validType = recordType === "body-measurement" || recordType === "fitness-assessment" || isComparison;

  useEffect(() => {
    let active = true;
    const loadMember = async () => {
      try {
        const response = await apiFetch("/api/admin/requests?role=member&status=all");
        if (!response.ok) throw new Error(response.data?.message || "Unable to load member details.");
        const selected = rowsFrom(response).find((item) => String(item._id ?? item.id) === memberId);
        if (!selected) throw new Error("Member not found.");
        if (active) setMember({
          id: String(selected._id ?? selected.id),
          name: selected.name ?? selected.fullName ?? "Unnamed Member",
          email: selected.email ?? "",
        });
      } catch (err: any) {
        if (active) setError(err?.message || "Unable to load member details.");
      } finally {
        if (active) setLoading(false);
      }
    };
    loadMember();
    return () => { active = false; };
  }, [memberId]);

  const isMeasurement = recordType === "body-measurement";
  const title = isMeasurement ? "Body Measurement" : "Fitness Assessment";

  return (
    <AdminShell>
      <main className="min-h-screen space-y-6 bg-[#f8f6f2] p-4 text-[#342323] sm:p-6">
        {!isComparison && <header className="rounded-2xl border border-[#eadfd9] bg-white p-5 shadow-sm sm:p-7">
          <h1 className="text-2xl font-bold text-[#4b1725]">{title}</h1>
          {loading ? <p className="mt-3 text-sm text-[#8b7771]">Loading member…</p> : member ? (
            <div className="mt-4 border-t border-[#eee5e0] pt-4">
              <p className="font-semibold text-[#4b1725]">{member.name}</p>
              <p className="mt-1 break-all text-sm text-[#8b7771]">{member.email || "No email provided"}</p>
            </div>
          ) : null}
        </header>}
        {error ? <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
        {!loading && member && isComparison ? <MemberFitnessComparison memberId={member.id} memberName={member.name} /> : null}
        {!loading && member && validType && !isComparison ? (
          <MemberFitnessRecords
            memberId={member.id}
            initialTab={isMeasurement ? "measurements" : "assessments"}
            openInitialForm
            formOnly
            onSaved={() => router.push(`/admin/members?member=${encodeURIComponent(member.id)}`)}
            onCancel={() => router.push("/admin/members")}
          />
        ) : null}
      </main>
    </AdminShell>
  );
}

export default function MemberFitnessEntryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f6f2] p-6 text-sm text-[#8b7771]">Loading fitness record…</div>}>
      <MemberFitnessEntryContent />
    </Suspense>
  );
}
