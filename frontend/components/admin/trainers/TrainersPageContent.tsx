"use client";

import AdminShell from "@/components/admin/AdminShell";
import { useSettings } from "@/lib/SettingsContext";
import TrainerIcon from "@/components/admin/trainers/TrainerIcon";
import TrainerForms from "@/components/admin/trainers/TrainerForms";
import TrainerLists from "@/components/admin/trainers/TrainerLists";
import TrainerViews from "@/components/admin/trainers/TrainerViews";
import { useTrainerPage } from "@/hooks/trainerhooks/useTrainerPage";

// PAGE CONTENT

export default function TrainersPageContent() {
  const { settings } = useSettings();

  const gymName = settings?.general?.gymName?.trim() || "GymFitness";

  const {
    trainers,
    loading,
    saving,
    errorMessage,

    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredTrainers,
    activeCount,
    inactiveCount,

    modalOpen,
    editingTrainer,
    form,
    deleteTrainer,
    setDeleteTrainer,

    openTrainerDashboard,
    openAddModal,
    openEditModal,
    closeModal,
    handleSubmit,
    confirmDelete,
    toggleStatus,
    handleChange,

    // NEW PROPERTIES
    photo,
    photoError,
    handlePhoto,
    removePhoto,
    today,
    updateField,
    fieldError,
  } = useTrainerPage();

  return (
    <AdminShell>
      {!modalOpen && (
        <div className="min-h-screen w-full min-w-0 max-w-none overflow-x-hidden bg-[#f8f6f2] px-0 py-6 text-[#292323]">
          <div>
            {/* HEADER */}

            <TrainerViews
              gymName={gymName}
              totalTrainers={trainers.length}
              activeCount={activeCount}
              inactiveCount={inactiveCount}
              openAddModal={openAddModal}
            />

            {/* ERROR MESSAGE */}

            {errorMessage && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            {/* TRAINERS LIST */}

            <TrainerLists
              trainers={trainers}
              filteredTrainers={filteredTrainers}
              loading={loading}
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              openTrainerDashboard={openTrainerDashboard}
              openEditModal={openEditModal}
              toggleStatus={toggleStatus}
              setDeleteTrainer={(trainer) => setDeleteTrainer(trainer)}
            />
          </div>
        </div>
      )}

      {/* Dashboard Add/Edit form */}

      {/* ADD / UPDATE TRAINER FORM */}

      {modalOpen && (
        <TrainerForms
          form={form}
          editingTrainer={Boolean(editingTrainer)}
          saving={saving}
          errorMessage={errorMessage}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          closeModal={closeModal}
          // Shared form props
          photo={photo}
          photoError={photoError}
          handlePhoto={handlePhoto}
          removePhoto={removePhoto}
          today={today}
          updateField={updateField}
          fieldError={fieldError}
        />
      )}
      {/* DELETE CONFIRMATION */}

      {deleteTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <TrainerIcon name="trash" className="h-6 w-6" />
            </div>

            <h2 className="text-xl font-bold text-gray-800">Delete Trainer?</h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                {deleteTrainer.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setDeleteTrainer(null)}
                disabled={saving}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={saving}
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {saving ? "Deleting..." : "Delete Trainer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
