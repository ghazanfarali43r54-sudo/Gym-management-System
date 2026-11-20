import { Suspense } from "react";
import MemberFitnessEntry from "@/components/member/MemberFitnessEntry";

export default function FitnessEntryPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading fitness record...</div>}>
      <MemberFitnessEntry />
    </Suspense>
  );
}