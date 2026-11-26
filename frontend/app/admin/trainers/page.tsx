import { Suspense } from "react";
import TrainersPageContent from "@/components/admin/trainers/TrainersPageContent";

export default function TrainersPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading trainers...</div>}>
      <TrainersPageContent />
    </Suspense>
  );
}