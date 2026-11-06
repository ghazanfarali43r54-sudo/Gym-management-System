
"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Users,
  Crown,
  Dumbbell,
  Star,
  Gem,
  Plus,
  Eye,
  Pencil,
  Trash2,
  CalendarDays,
  Wallet,
  X,
  Check,
  ChevronDown,
  UserRound,
  SlidersHorizontal,
} from "lucide-react";


type Member = {
  id: number;
  name: string;
  email: string;
  phone: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Expired";
};

 

const initialMembers: Member[] = [
  {
    id: 1,
    name: "Ahmed Khan",
    email: "ahmed@gmail.com",
    phone: "0301-1234567",
    startDate: "2026-10-01",
    endDate: "2027-04-01",
    status: "Active",
  },
  {
    id: 2,
    name: "Sara Ahmed",
    email: "sara@gmail.com",
    phone: "0302-2345678",
    startDate: "2026-09-15",
    endDate: "2026-12-15",
    status: "Active",
  },
  {
    id: 3,
    name: "Usman Ali",
    email: "usman@gmail.com",
    phone: "0303-3456789",
    startDate: "2026-10-05",
    endDate: "2026-11-05",
    status: "Active",
  },
  {
    id: 4,
    name: "Ayesha Khan",
    email: "ayesha@gmail.com",
    phone: "0304-4567890",
    startDate: "2026-03-01",
    endDate: "2026-09-01",
    status: "Expired",
  },
  {
    id: 5,
    name: "Bilal Hussain",
    email: "bilal@gmail.com",
    phone: "0305-5678901",
    startDate: "2026-06-01",
    endDate: "2027-06-01",
    status: "Active",
  },
  {
    id: 6,
    name: "Fatima Noor",
    email: "fatima@gmail.com",
    phone: "0306-6789012",
    startDate: "2026-08-20",
    endDate: "2026-11-20",
    status: "Active",
  },
  {
    id: 7,
    name: "Hamza Raza",
    email: "hamza@gmail.com",
    phone: "0307-7890123",
    startDate: "2026-10-10",
    endDate: "2026-11-10",
    status: "Active",
  },
  {
    id: 8,
    name: "Zainab Ali",
    email: "zainab@gmail.com",
    phone: "0308-8901234",
    startDate: "2026-07-01",
    endDate: "2027-01-01",
    status: "Active",
  },
  {
    id: 9,
    name: "Salman Tariq",
    email: "salman@gmail.com",
    phone: "0309-9012345",
    startDate: "2026-01-01",
    endDate: "2026-04-01",
    status: "Expired",
  },
  {
    id: 10,
    name: "Hira Farooq",
    email: "hira@gmail.com",
    phone: "0310-0123456",
    startDate: "2026-09-01",
    endDate: "2027-09-01",
    status: "Active",
  },
];

const formatDate = (date: string) =>
  new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatPrice = (price: number) =>
  "Rs. " + price.toLocaleString("en-PK");

export default function MembershipPage() {
  const [members, setMembers] = useState(initialMembers);
  const [selectedPlan, setSelectedPlan] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [newPlanName, setNewPlanName] = useState("");
  const [newPlanPrice, setNewPlanPrice] = useState("");
  const [newPlanDuration, setNewPlanDuration] = useState("1 Month");

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesPlan =
        selectedPlan === "All" || member.plan === selectedPlan;

      const term = search.toLowerCase();
      const matchesSearch =
        member.name.toLowerCase().includes(term) ||
        member.email.toLowerCase().includes(term) ||
        member.phone.includes(term);

      return matchesPlan && matchesSearch;
    });
  }, [members, selectedPlan, search]);

  const activeCount = members.filter((m) => m.status === "Active").length;
  const expiredCount = members.filter((m) => m.status === "Expired").length;

  function deleteMember(id: number) {
    if (window.confirm("Are you sure you want to delete this member?")) {
      setMembers((current) => current.filter((m) => m.id !== id));
    }
  }

  function saveMember() {
    if (!editingMember) return;

    setMembers((current) =>
      current.map((m) =>
        m.id === editingMember.id ? editingMember : m
      )
    );
    setEditingMember(null);
  }

  function addPlan(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newPlanName.trim() || Number(newPlanPrice) <= 0) return;

    alert(
      `Plan "${newPlanName}" details captured. Connect your backend to save custom plans permanently.`
    );
    setNewPlanName("");
    setNewPlanPrice("");
    setShowAddPlan(false);
  }

  return (
    <main className="min-h-screen bg-[#F8F5F0] p-4 text-[#352126] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-7">

        {/* Header */}
        <header className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#8B6670]">
              <span>Dashboard</span>
              <span>/</span>
              <span className="text-[#721D35]">Membership</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#541629] sm:text-4xl">
              Membership Management
            </h1>
            <p className="mt-2 text-sm text-[#866F74] sm:text-base">
              Manage membership plans and keep track of your gym members.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EADDE0] text-[#721D35]">
              <UserRound size={21} />
            </div>
            <div>
              <p className="font-semibold text-[#541629]">Admin</p>
              <p className="text-xs text-[#8B6670]">Gym Administrator</p>
            </div>
          </div>
        </header>

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={<Users size={21} />}
            title="Total Members"
            value={members.length}
            detail="Registered members"
          />
          <StatCard
            icon={<Check size={21} />}
            title="Active Members"
            value={activeCount}
            detail="Currently active"
          />
          <StatCard
            icon={<CalendarDays size={21} />}
            title="Expired Membership"
            value={expiredCount}
            detail="Need renewal"
          />
        </section>

        {/* Plans heading */}
        <section className="space-y-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-[#541629]">
                Membership Plans
              </h2>
              <p className="mt-1 text-sm text-[#866F74]">
                Select a plan to view its registered members.
              </p>
            </div>
            <button
              onClick={() => setShowAddPlan(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#721D35] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#541629]"
            >
              <Plus size={18} />
              Add New Plan
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const count = members.filter(
                (m) => m.plan === plan.name
              ).length;
              const isSelected = selectedPlan === plan.name;

              return (
                <article
                  key={plan.name}
                  className={`relative flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md ${
                    isSelected
                      ? "border-[#721D35] ring-2 ring-[#721D35]/15"
                      : plan.color
                  }`}
                >
                  {plan.name === "Premium" && (
                    <span className="absolute right-4 top-4 rounded-full bg-[#F3E5E9] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#721D35]">
                      Popular
                    </span>
                  )}

                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3E5E9] text-[#721D35]">
                    <Icon size={25} />
                  </div>

                  <h3 className="text-xl font-bold text-[#541629]">
                    {plan.name} Plan
                  </h3>
                  <p className="mt-1 text-sm text-[#947B80]">
                    {plan.description}
                  </p>

                  <div className="mt-5 flex items-baseline gap-2">
                    <span className="text-3xl font-bold tracking-tight text-[#541629]">
                      {formatPrice(plan.price)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#947B80]">
                    {plan.duration}
                  </p>

                  <div className="my-5 h-px bg-[#F0E5E5]" />

                  <ul className="flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-[#735C62]"
                      >
                        <Check
                          size={17}
                          className="mt-0.5 shrink-0 text-[#721D35]"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 rounded-xl bg-[#FAF5F5] p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#866F74]">
                        Enrolled Members
                      </span>
                      <span className="font-bold text-[#721D35]">{count}</span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setSelectedPlan(isSelected ? "All" : plan.name)
                    }
                    className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isSelected
                        ? "border border-[#721D35] bg-white text-[#721D35]"
                        : "bg-[#721D35] text-white hover:bg-[#541629]"
                    }`}
                  >
                    {isSelected ? "Clear Plan Filter" : "View Members"}
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        {/* Members Table */}
        <section className="overflow-hidden rounded-2xl border border-[#E9DDE0] bg-white shadow-sm">
          <div className="border-b border-[#F0E5E5] p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3E5E9] text-[#721D35]">
                  <Users size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#541629]">
                    Registered Members
                  </h2>
                  <p className="mt-1 text-sm text-[#947B80]">
                    {selectedPlan === "All"
                      ? "All members and their selected plans"
                      : `${selectedPlan} plan members`}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 sm:min-w-[240px]">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A18B90]"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search members..."
                    className="w-full rounded-xl border border-[#E9DDE0] bg-[#FDFBFA] py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-[#AD999E] focus:border-[#721D35] focus:ring-2 focus:ring-[#721D35]/10"
                  />
                </div>

                <div className="relative">
                  <SlidersHorizontal
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#721D35]"
                  />
                  <select
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-[#E9DDE0] bg-[#FDFBFA] py-3 pl-9 pr-9 text-sm font-medium outline-none focus:border-[#721D35] sm:min-w-[160px]"
                  >
                    <option value="All">All Plans</option>
                    {plans.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#947B80]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead>
                <tr className="bg-[#FAF5F5] text-xs uppercase tracking-wider text-[#896C74]">
                  <th className="px-5 py-4 font-semibold">Member</th>
                  <th className="px-5 py-4 font-semibold">Contact</th>
                  <th className="px-5 py-4 font-semibold">Plan</th>
                  <th className="px-5 py-4 font-semibold">Start Date</th>
                  <th className="px-5 py-4 font-semibold">End Date</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F1E8E9]">
                {filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="transition hover:bg-[#FDF9F8]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F0E0E5] font-bold text-[#721D35]">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-[#541629]">
                            {member.name}
                          </p>
                          <p className="mt-1 text-xs text-[#A18B90]">
                            ID: MEM-{String(member.id).padStart(4, "0")}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-[#634A51]">{member.email}</p>
                      <p className="mt-1 text-xs text-[#A18B90]">
                        {member.phone}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-lg px-3 py-1.5 text-xs font-semibold ${
                          member.plan === "VIP"
                            ? "bg-amber-100 text-amber-800"
                            : member.plan === "Premium"
                              ? "bg-[#721D35] text-white"
                              : member.plan === "Standard"
                                ? "bg-rose-100 text-[#721D35]"
                                : "bg-stone-100 text-stone-700"
                        }`}
                      >
                        {member.plan}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-[#735C62]">
                      {formatDate(member.startDate)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-[#735C62]">
                      {formatDate(member.endDate)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          member.status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            member.status === "Active"
                              ? "bg-emerald-500"
                              : "bg-red-500"
                          }`}
                        />
                        {member.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          title="View member"
                          onClick={() => setSelectedMember(member)}
                          className="rounded-lg border border-[#E9DDE0] p-2 text-[#721D35] transition hover:bg-[#F3E5E9]"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          title="Edit member"
                          onClick={() => setEditingMember({ ...member })}
                          className="rounded-lg border border-[#E9DDE0] p-2 text-[#721D35] transition hover:bg-[#F3E5E9]"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          title="Delete member"
                          onClick={() => deleteMember(member.id)}
                          className="rounded-lg border border-red-100 p-2 text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredMembers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center">
                      <Users
                        size={35}
                        className="mx-auto mb-3 text-[#C7AFB5]"
                      />
                      <p className="font-semibold text-[#541629]">
                        No members found
                      </p>
                      <p className="mt-1 text-sm text-[#947B80]">
                        Try another search or select a different plan.
                      </p>
                      <button
                        onClick={() => {
                          setSearch("");
                          setSelectedPlan("All");
                        }}
                        className="mt-4 text-sm font-semibold text-[#721D35] underline"
                      >
                        Clear filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col justify-between gap-3 border-t border-[#F0E5E5] bg-[#FDFBFA] px-5 py-4 sm:flex-row sm:items-center">
            <p className="text-sm text-[#947B80]">
              Showing <span className="font-semibold text-[#541629]">{filteredMembers.length}</span> of{" "}
              <span className="font-semibold text-[#541629]">{members.length}</span> members
            </p>
            <button
              onClick={() => {
                setSelectedPlan("All");
                setSearch("");
              }}
              className="text-sm font-semibold text-[#721D35] hover:underline"
            >
              Reset filters
            </button>
          </div>
        </section>

        <footer className="pb-3 text-center text-xs text-[#A18B90]">
          Gym Management System · Membership Administration
        </footer>
      </div>

      {/* View Member Modal */}
      {selectedMember && (
        <Modal title="Member Details" onClose={() => setSelectedMember(null)}>
          <div className="mb-5 flex items-center gap-4 rounded-xl bg-[#FAF5F5] p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#721D35] text-lg font-bold text-white">
              {selectedMember.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#541629]">
                {selectedMember.name}
              </h3>
              <p className="text-sm text-[#947B80]">
                MEM-{String(selectedMember.id).padStart(4, "0")}
              </p>
            </div>
          </div>
          <div className="space-y-4 text-sm">
            <Detail label="Email" value={selectedMember.email} />
            <Detail label="Phone" value={selectedMember.phone} />
            <Detail label="Membership Plan" value={selectedMember.plan} />
            <Detail label="Start Date" value={formatDate(selectedMember.startDate)} />
            <Detail label="End Date" value={formatDate(selectedMember.endDate)} />
            <Detail label="Status" value={selectedMember.status} />
          </div>
        </Modal>
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <Modal title="Edit Member" onClose={() => setEditingMember(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveMember();
            }}
            className="space-y-4"
          >
            <Field label="Full Name">
              <input
                required
                value={editingMember.name}
                onChange={(e) =>
                  setEditingMember({ ...editingMember, name: e.target.value })
                }
                className={inputClass}
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                required
                value={editingMember.email}
                onChange={(e) =>
                  setEditingMember({ ...editingMember, email: e.target.value })
                }
                className={inputClass}
              />
            </Field>
            <Field label="Phone">
              <input
                required
                value={editingMember.phone}
                onChange={(e) =>
                  setEditingMember({ ...editingMember, phone: e.target.value })
                }
                className={inputClass}
              />
            </Field>
            <Field label="Membership Plan">
              <select
                value={editingMember.plan}
                onChange={(e) =>
                  setEditingMember({
                    ...editingMember,
                    plan: e.target.value as PlanName,
                  })
                }
                className={inputClass}
              >
                {plans.map((p) => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select
                value={editingMember.status}
                onChange={(e) =>
                  setEditingMember({
                    ...editingMember,
                    status: e.target.value as Member["status"],
                  })
                }
                className={inputClass}
              >
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
              </select>
            </Field>
            <button
              type="submit"
              className="w-full rounded-xl bg-[#721D35] px-4 py-3 font-semibold text-white hover:bg-[#541629]"
            >
              Save Changes
            </button>
          </form>
        </Modal>
      )}

      {/* Add Plan Modal */}
      {showAddPlan && (
        <Modal title="Add New Plan" onClose={() => setShowAddPlan(false)}>
          <form onSubmit={addPlan} className="space-y-4">
            <Field label="Plan Name">
              <input
                required
                value={newPlanName}
                onChange={(e) => setNewPlanName(e.target.value)}
                placeholder="e.g. Student Plan"
                className={inputClass}
              />
            </Field>
            <Field label="Price (PKR)">
              <input
                required
                type="number"
                min="1"
                value={newPlanPrice}
                onChange={(e) => setNewPlanPrice(e.target.value)}
                placeholder="5000"
                className={inputClass}
              />
            </Field>
            <Field label="Duration">
              <select
                value={newPlanDuration}
                onChange={(e) => setNewPlanDuration(e.target.value)}
                className={inputClass}
              >
                <option>1 Month</option>
                <option>3 Months</option>
                <option>6 Months</option>
                <option>12 Months</option>
              </select>
            </Field>
            <button
              type="submit"
              className="w-full rounded-xl bg-[#721D35] px-4 py-3 font-semibold text-white hover:bg-[#541629]"
            >
              Save Plan Details
            </button>
            <p className="text-xs text-[#947B80]">
              Permanent plan creation requires backend integration.
            </p>
          </form>
        </Modal>
      )}
    </main>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#E9DDE0] bg-white px-4 py-3 text-sm text-[#541629] outline-none focus:border-[#721D35] focus:ring-2 focus:ring-[#721D35]/10";

function StatCard({
  icon,
  title,
  value,
  detail,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  detail: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#E9DDE0] bg-white p-5 shadow-sm">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F3E5E9] text-[#721D35]">
        {icon}
      </div>
      <div>
        <p className="text-sm text-[#947B80]">{title}</p>
        <p className="mt-1 text-2xl font-bold text-[#541629]">{value}</p>
        <p className="mt-1 text-xs text-[#A18B90]">{detail}</p>
      </div>
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#291018]/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-[#E9DDE0] bg-[#FDFBFA] p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#541629]">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-[#721D35] hover:bg-[#F3E5E9]"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-[#634A51]">{label}</span>
      {children}
    </label>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#F0E5E5] pb-3">
      <span className="text-[#947B80]">{label}</span>
      <span className="text-right font-semibold text-[#541629]">{value}</span>
    </div>
  );
}
