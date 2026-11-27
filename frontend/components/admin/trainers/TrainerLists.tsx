
"use client";

import Image from "next/image";
import TrainerIcon from "@/components/admin/trainers/TrainerIcon";
import type { Trainer, TrainerStatus } from "@/types/trainer.types";
import { initials } from "@/utils/trainerUtils/trainerUtilsHelper";

/* =========================================================
   TYPES
========================================================= */

type TrainerListsProps = {
  trainers: Trainer[];
  filteredTrainers: Trainer[];
  loading: boolean;

  search: string;
  setSearch: (value: string) => void;

  statusFilter: "All" | TrainerStatus;
  setStatusFilter: (value: "All" | TrainerStatus) => void;

  openTrainerDashboard: (id: string) => void;
  openEditModal: (trainer: Trainer) => void;
  toggleStatus: (trainer: Trainer) => void;
  setDeleteTrainer: (trainer: Trainer) => void;
};

/* =========================================================
   COMPONENT
========================================================= */

export default function TrainerLists({
  trainers,
  filteredTrainers,
  loading,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  openTrainerDashboard,
  openEditModal,
  toggleStatus,
  setDeleteTrainer,
}: TrainerListsProps) {
  return (
    <div className="overflow-visible rounded-2xl border border-[#eee7e4] bg-white shadow-sm">
      {/* HEADER / SEARCH / FILTER */}

      <div className="border-b border-[#eee7e4] p-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-xl font-bold text-[#302326]">
              All Trainers
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View and manage all registered trainers.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* SEARCH */}

            <div className="relative">
              <TrainerIcon
                name="search"
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search trainers..."
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#800020] sm:w-64"
              />
            </div>

            {/* FILTER */}

            <div className="relative">
              <TrainerIcon
                name="filter"
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
              />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "All" | TrainerStatus
                  )
                }
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-9 text-sm outline-none focus:border-[#800020] sm:w-40"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <TrainerIcon
                name="chevronDown"
                className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* LOADING / EMPTY / LIST */}

      {loading ? (
        <div className="p-12 text-center text-gray-500">
          Loading trainers...
        </div>
      ) : filteredTrainers.length === 0 ? (
        <div className="p-12 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#f7e9ed] text-[#800020]">
            <TrainerIcon name="trainer" className="h-7 w-7" />
          </div>

          <h3 className="font-semibold text-gray-800">
            No trainers found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Add a trainer or change your search filters.
          </p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE */}

          <div className="hidden w-full max-w-full overflow-visible md:block">
            <table className="w-full table-fixed text-left">
              <thead className="bg-[#faf8f6] text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-3 py-4 font-semibold">Trainer</th>
                  <th className="px-3 py-4 font-semibold">Contact</th>
                  <th className="px-3 py-4 font-semibold">
                    Specialization
                  </th>
                  <th className="px-3 py-4 font-semibold">
                    Experience
                  </th>
                  <th className="px-3 py-4 font-semibold">
                    Member Capacity
                  </th>
                  <th className="px-3 py-4 font-semibold">Status</th>
                  <th className="px-3 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredTrainers.map((trainer, index) => (
                  <tr
                    key={trainer.id}
                    onClick={() => openTrainerDashboard(trainer.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openTrainerDashboard(trainer.id);
                      }
                    }}
                    tabIndex={0}
                    role="link"
                    aria-label={`Open ${trainer.name}'s dashboard`}
                    className="cursor-pointer transition hover:bg-[#f9edf0] focus:bg-[#f9edf0] focus:outline-none"
                  >
                    {/* TRAINER */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f4e5e9] font-bold text-[#800020]">
                          {trainer.photo ? (
                            <Image
                              src={trainer.photo}
                              alt={`${trainer.name} profile`}
                              width={44}
                              height={44}
                              unoptimized
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            initials(trainer.name)
                          )}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-800">
                            {trainer.name}
                          </p>

                          <p className="text-xs text-gray-400">
                            Trainer
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* CONTACT */}

                    <td className="px-6 py-4">
                      <div className="space-y-1 text-sm">
                        <p className="flex items-center gap-2 text-gray-700">
                          <TrainerIcon
                            name="mail"
                            className="h-3.5 w-3.5 text-gray-400"
                          />
                          {trainer.email}
                        </p>

                        <p className="flex items-center gap-2 text-gray-500">
                          <TrainerIcon
                            name="phone"
                            className="h-3.5 w-3.5 text-gray-400"
                          />
                          {trainer.phone || "Not provided"}
                        </p>
                      </div>
                    </td>

                    {/* SPECIALIZATION */}

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {trainer.specialization || "General Fitness"}
                    </td>

                    {/* EXPERIENCE */}

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {trainer.experience} years
                    </td>

                    {/* MEMBER CAPACITY */}

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-800">
                          {trainer.assignedMemberCount} /{" "}
                          {trainer.memberLimit}
                        </p>

                        <p
                          className={`text-xs font-medium ${
                            trainer.assignedMemberCount >=
                            trainer.memberLimit
                              ? "text-red-600"
                              : "text-green-700"
                          }`}
                        >
                          {trainer.assignedMemberCount >=
                          trainer.memberLimit
                            ? "Capacity Full"
                            : `${
                                trainer.memberLimit -
                                trainer.assignedMemberCount
                              } slots available`}
                        </p>
                      </div>
                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          trainer.status === "Active"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {trainer.status}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td
                      className="px-6 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <details className="group relative flex justify-end">
                        <summary
                          aria-label={`Actions for ${trainer.name}`}
                          title="Trainer actions"
                          className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-gray-200 text-xl leading-none text-gray-600 transition hover:border-[#800020] hover:bg-[#f9edf0] hover:text-[#800020] [&::-webkit-details-marker]:hidden"
                        >
                          ⋮
                        </summary>

                        <div
                          className={`absolute right-0 z-20 min-w-40 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg ${
                            index === filteredTrainers.length - 1
                              ? "bottom-11"
                              : "top-11"
                          }`}
                        >
                          <button
                            onClick={() => openEditModal(trainer)}
                            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-[#f9edf0]"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => toggleStatus(trainer)}
                            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            {trainer.status === "Active"
                              ? "Deactivate"
                              : "Activate"}
                          </button>

                          <button
                            onClick={() => setDeleteTrainer(trainer)}
                            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}

          <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
            {filteredTrainers.map((trainer, index) => (
              <div
                key={trainer.id}
                onClick={() => openTrainerDashboard(trainer.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openTrainerDashboard(trainer.id);
                  }
                }}
                tabIndex={0}
                role="link"
                aria-label={`Open ${trainer.name}'s dashboard`}
                className="cursor-pointer rounded-xl border border-gray-100 p-4 transition hover:border-[#e5c4ce] hover:bg-[#fdf9fa] focus:outline-none focus:ring-2 focus:ring-[#800020]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f4e5e9] font-bold text-[#800020]">
                      {trainer.photo ? (
                        <Image
                          src={trainer.photo}
                          alt={`${trainer.name} profile`}
                          width={48}
                          height={48}
                          unoptimized
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initials(trainer.name)
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-800">
                        {trainer.name}
                      </h3>

                      <p className="text-xs text-gray-500">
                        {trainer.specialization || "General Fitness"}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      trainer.status === "Active"
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {trainer.status}
                  </span>
                </div>

                {/* CONTACT DETAILS */}

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2 break-all">
                    <TrainerIcon
                      name="mail"
                      className="h-4 w-4 shrink-0"
                    />
                    {trainer.email}
                  </p>

                  <p className="flex items-center gap-2">
                    <TrainerIcon
                      name="phone"
                      className="h-4 w-4 shrink-0"
                    />
                    {trainer.phone || "Not provided"}
                  </p>

                  <p className="flex items-center gap-2">
                    <TrainerIcon
                      name="briefcase"
                      className="h-4 w-4 shrink-0"
                    />
                    {trainer.experience} years experience
                  </p>
                </div>

                {/* MEMBER CAPACITY */}

                <div className="mt-4 rounded-xl border border-[#eee7e4] bg-[#faf8f6] p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Member Capacity
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-800">
                      {trainer.assignedMemberCount} /{" "}
                      {trainer.memberLimit} Members
                    </span>

                    <span
                      className={`text-xs font-semibold ${
                        trainer.assignedMemberCount >=
                        trainer.memberLimit
                          ? "text-red-600"
                          : "text-green-700"
                      }`}
                    >
                      {trainer.assignedMemberCount >=
                      trainer.memberLimit
                        ? "Full"
                        : `${
                            trainer.memberLimit -
                            trainer.assignedMemberCount
                          } Available`}
                    </span>
                  </div>
                </div>

                {/* MOBILE ACTIONS */}

                <div
                  className="mt-4 flex justify-end border-t border-gray-100 pt-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <details className="group relative">
                    <summary
                      aria-label={`Actions for ${trainer.name}`}
                      title="Trainer actions"
                      className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-gray-200 text-xl leading-none text-gray-600 transition hover:border-[#800020] hover:bg-[#f9edf0] hover:text-[#800020] [&::-webkit-details-marker]:hidden"
                    >
                      ⋮
                    </summary>

                    <div
                      className={`absolute right-0 z-20 min-w-40 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg ${
                        index === filteredTrainers.length - 1
                          ? "bottom-11"
                          : "top-11"
                      }`}
                    >
                      <button
                        onClick={() => openEditModal(trainer)}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-[#f9edf0]"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => toggleStatus(trainer)}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        {trainer.status === "Active"
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                      <button
                        onClick={() => setDeleteTrainer(trainer)}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </details>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* FOOTER */}

      {!loading && filteredTrainers.length > 0 && (
        <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-500">
          Showing {filteredTrainers.length} of {trainers.length} trainers
        </div>
      )}
    </div>
  );
}
