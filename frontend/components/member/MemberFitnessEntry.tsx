"use client";

import { useParams, useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import MemberFitnessRecords from "./MemberFitnessRecords";
import MemberFitnessComparison from "./MemberFitnessComparison";
import { useMemberFitnessEntry } from "@/hooks/memberHooks";
type FitnessRecordType = "body-measurement" | "fitness-assessment";
type FitnessRouteType = FitnessRecordType | "comparison";

export default function MemberFitnessEntry() {
  const params = useParams<{ memberId: string; recordType: string }>();
  const router = useRouter();
  const memberId = params.memberId;
  const recordType = params.recordType as FitnessRouteType;
  const { member, loading, error } = useMemberFitnessEntry(memberId);

  const isComparison = recordType === "comparison";
  const isMeasurement = recordType === "body-measurement";
  const isAssessment = recordType === "fitness-assessment";
  const validType = isMeasurement || isAssessment || isComparison;

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
        {!loading && member && (isMeasurement || isAssessment) ? (
          <MemberFitnessRecords
            memberId={member.id}
            initialTab={isMeasurement ? "measurements" : "assessments"}
            openInitialForm
            formOnly
            onSaved={() => router.push(`/admin/members?member=${encodeURIComponent(member.id)}`)}
            onCancel={() => router.push("/admin/members")}
          />
        ) : null}
        {!validType && <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">Invalid fitness record type.</div>}
      </main>
    </AdminShell>
  );
}
