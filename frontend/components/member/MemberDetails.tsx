import MemberFitnessRecords from "./MemberFitnessRecords";
import { statusClass, type Member } from "@/features/memberApi";

type MemberDetailsProps = {
  member: Member;
  onEdit: () => void;
};

export default function MemberDetails({ member, onEdit }: MemberDetailsProps) {
  const initials = member.name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen space-y-6 bg-[#f8f6f2] p-4 text-[#342323] sm:p-6">
      <div className="flex flex-wrap items-center justify-end gap-">
        <button
          type="button"
          onClick={onEdit}
          className="rounded-xl bg-[#641d32]   px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4b1725]"
        >
          Edit Member
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#eadfd9] bg-white shadow-sm">
        <div className="h-2 bg-[#641d32]" />

        <div className="p-5 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#641d32] text-2xl font-bold text-white shadow-sm">
              {initials || "M"}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-[#4b1725] sm:text-3xl">
                  {member.name}
                </h1>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                    member.status
                  )}`}
                >
                  {member.status}
                </span>
              </div>

              <div className="mt-3 flex flex-col gap-2 text-sm text-[#8b7771] sm:flex-row sm:flex-wrap sm:gap-5">
                <span className="flex items-center gap-2 break-all">
                  <span aria-hidden="true">✉</span>
                  {member.email || "No email provided"}
                </span>

                <span className="flex items-center gap-2">
                  <span aria-hidden="true">☎</span>
                  {member.phone || "No phone provided"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-[#eadfd9] bg-white shadow-sm">
          <div className="border-b border-[#eee5e0] px-5 py-4">
            <h2 className="font-bold text-[#4b1725]">Personal Information</h2>
            <p className="mt-1 text-xs text-[#8b7771]">
              Member&apos;s basic contact details.
            </p>
          </div>

          <div className="space-y-5 p-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#a18f88]">
                Full Name
              </p>
              <p className="mt-1 font-semibold text-[#4b1725]">
                {member.name || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#a18f88]">
                Email Address
              </p>
              <p className="mt-1 break-all font-medium text-[#6f5b55]">
                {member.email || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#a18f88]">
                Phone Number
              </p>
              <p className="mt-1 font-medium text-[#6f5b55]">
                {member.phone || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#a18f88]">
                Membership Plans
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {member.membershipPlans.length ? (
                  member.membershipPlans.map((plan) => (
                    <span
                      key={plan._id}
                      className="rounded-full bg-[#f3eae5] px-3 py-1 text-xs font-semibold text-[#641d32]"
                    >
                      {plan.name}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-[#8b7771]">
                    No plans assigned
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#a18f88]">
                Assigned Trainer
              </p>
              <p className="mt-1 font-semibold text-[#641d32]">
                {member.assignedTrainerName || "No trainer assigned"}
              </p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#eadfd9] bg-white shadow-sm">
          <div className="space-y-5 p-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#a18f88]">
                Membership Status
              </p>
              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                  member.status
                )}`}
              >
                {member.status}
              </span>
            </div>
          </div>
        </section>
      </div>

      {member.status === "Active" ? (
        <MemberFitnessRecords memberId={member.id} />
      ) : (
        <section className="rounded-2xl border border-[#eadfd9] bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#4b1725]">Fitness records unavailable</h2>
          <p className="mt-1 text-sm text-[#8b7771]">
            Fitness records are available after this membership request is approved.
          </p>
        </section>
      )}
    </div>
  );
}
