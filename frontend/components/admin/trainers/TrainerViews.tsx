
"use client";

import TrainerIcon from "@/components/admin/trainers/TrainerIcon";

type TrainerViewsProps = {
  gymName: string;
  totalTrainers: number;
  activeCount: number;
  inactiveCount: number;
  openAddModal: () => void;
};

export default function TrainerViews({
  gymName,
  totalTrainers,
  activeCount,
  inactiveCount,
  openAddModal,
}: TrainerViewsProps) {
  return (
    <>
      {/* HEADER */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#800020]">
            {gymName}
          </p>

          <h1 className="text-3xl font-bold text-[#2b2022]">
            Trainers Management
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your gym trainers, profiles and activity.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#800020] px-5 py-3 font-semibold text-white shadow-md transition hover:bg-[#650019]"
        >
          <TrainerIcon name="plus" />
          Add New Trainer
        </button>
      </div>

      {/* STATS */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#eee7e4] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Trainers</p>
              <h2 className="mt-2 text-3xl font-bold text-[#800020]">
                {totalTrainers}
              </h2>
            </div>

            <div className="rounded-xl bg-[#f7e9ed] p-3 text-[#800020]">
              <TrainerIcon name="users" className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#eee7e4] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Trainers</p>
              <h2 className="mt-2 text-3xl font-bold text-green-700">
                {activeCount}
              </h2>
            </div>

            <div className="rounded-xl bg-green-50 p-3 text-green-700">
              <TrainerIcon name="check" className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#eee7e4] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Inactive Trainers</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-600">
                {inactiveCount}
              </h2>
            </div>

            <div className="rounded-xl bg-gray-100 p-3 text-gray-600">
              <TrainerIcon name="inactive" className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
