"use client";

import { Suspense } from "react";
import AdminShell from "@/components/admin/AdminShell";
import MemberDetails from "@/components/member/MemberDetails";
import MemberFormView from "@/components/member/MemberFormView";
import MemberList from "@/components/member/MemberList";
import MemberFitnessEntry from "@/components/member/MemberFitnessEntry";
import { useAdminMembers } from "@/hooks/memberHooks";
import { useSettings } from "@/lib/SettingsContext";

function MembersPageContent() {
  const { settings } = useSettings();
  const gymName = settings?.general?.gymName || "Gym Management";
  const memberPage = useAdminMembers();
  const selectedMember = memberPage.selectedMember;

  return (
    <AdminShell>
      {memberPage.showModal ? null : selectedMember ? (
        <MemberDetails
          member={selectedMember}
          onEdit={() => memberPage.openEditModal(selectedMember)}
          onOpenFitnessEntry={(type) =>
            memberPage.openFitnessEntry(selectedMember, type)
          }
          onEditFitnessEntry={(type, recordId) =>
            memberPage.openFitnessEntry(selectedMember, type, recordId)
          }
        />
      ) : (
        <MemberList
          gymName={gymName}
          members={memberPage.members}
          loading={memberPage.loading}
          error={memberPage.error}
          onAddMember={memberPage.openAddModal}
          onSelectMember={memberPage.selectMember}
          onEditMember={memberPage.openEditModal}
          onOpenFitnessEntry={memberPage.openFitnessEntry}
          onToggleStatus={memberPage.toggleStatus}
          onDeleteMember={memberPage.confirmDelete}
        />
      )}

      {memberPage.showModal && (
        <MemberFormView
          key={memberPage.editingMember?.id ?? "new-member"}
          member={memberPage.editingMember}
          trainers={memberPage.trainers}
          membershipPlans={memberPage.membershipPlans}
          trainersLoading={memberPage.trainersLoading}
          onClose={memberPage.closeModal}
          onSaved={memberPage.handleMemberSaved}
        />
      )}
    </AdminShell>
  );
}

// Fitness entry page ka content (Suspense ke saath)
function FitnessEntryPageContent() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8f6f2] p-6 text-sm text-[#8b7771]">
          Loading fitness record…
        </div>
      }
    >
      <MemberFitnessEntry />
    </Suspense>
  );
}

export default function MembersPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading members...</div>}>
      <MembersPageContent />
    </Suspense>
  );
}

export { FitnessEntryPageContent };
