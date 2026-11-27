
"use client";

import type { FormEvent, ChangeEvent } from "react";
import type { TrainerForm, TrainerStatus } from "@/types/trainer.types";

import PersonPhotoUpload from "@/components/shared/forms/PersonPhotoUpload";
import PersonBasicFields from "@/components/shared/forms/PersonBasicFields";
import PersonAddressFields from "@/components/shared/forms/PersonAddressFields";

type TrainerFormsProps = {
  form: TrainerForm;
  editingTrainer: boolean;
  saving: boolean;
  errorMessage: string;

  photo: string;
  photoError: string;
  fieldError: (field: string) => string | undefined;
  today: string;

  handlePhoto: (file?: File) => void;
  removePhoto: () => void;

  updateField: (field: string, value: string) => void;

  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;

  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  closeModal: () => void;
};

export default function TrainerForms({
  form,
  editingTrainer,
  saving,
  errorMessage,
  photo,
  photoError,
  fieldError,
  today,
  handlePhoto,
  removePhoto,
  updateField,
  handleChange,
  handleSubmit,
  closeModal,
}: TrainerFormsProps) {
  

return (
  <section className="min-h-screen bg-[#f8f6f2] px-4 py-6 text-[#292323] sm:px-6 lg:px-8">
    <div className="mx-auto max-w-4xl">

      {/* HEADER */}

      <div className="mb-6 flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-6 py-5">
        <div>
          <h2 className="text-xl font-bold text-[#302326]">
            {editingTrainer ? "Edit Trainer" : "Add New Trainer"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {editingTrainer
              ? "Update trainer information."
              : "Enter details to register a new trainer."}
          </p>
        </div>

        <button
          type="button"
          onClick={closeModal}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
        >
          Back to Trainers
        </button>
      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
      >

        {/* ERROR MESSAGE */}

        {errorMessage && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {/* PHOTO UPLOAD */}

        <PersonPhotoUpload
          photo={photo}
          name={form.name}
          editing={editingTrainer}
          personType="Trainer"
          photoError={photoError}
          fieldError={fieldError}
          onPhoto={(file) => {
            void handlePhoto(file);
          }}
          onRemove={removePhoto}
        />

        {/* ALL FORM FIELDS */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* BASIC FIELDS */}

          <PersonBasicFields
            form={form}
            editing={editingTrainer}
            today={today}
            fieldError={fieldError}
            updateField={updateField}
          />

          {/* ADDRESS FIELDS */}

          <PersonAddressFields
            form={form}
            fieldError={fieldError}
            updateField={updateField}
          />

          {/* SPECIALIZATION */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Specialization
            </label>

            <input
              type="text"
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              placeholder="e.g. Weight Training"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#800020]"
            />
          </div>

          {/* EXPERIENCE */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Experience (Years)
            </label>

            <input
              type="number"
              name="experience"
              min="0"
              value={form.experience}
              onChange={handleChange}
              placeholder="e.g. 3"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#800020]"
            />
          </div>

          {/* ACCOUNT STATUS */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Account Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#800020]"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* MEMBER LIMIT */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Member Assignment Limit *
            </label>

            <input
              type="number"
              name="memberLimit"
              min="1"
              step="1"
              inputMode="numeric"
              value={form.memberLimit}
              onChange={handleChange}
              required
              placeholder="Enter maximum members"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#800020]"
            />

            <p className="mt-1 text-xs text-gray-500">
              Maximum number of members this trainer can manage.
              Default capacity is 20 members.
            </p>
          </div>

        </div>

        {/* BUTTONS */}

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={closeModal}
            className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#800020] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#650019] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : editingTrainer
                ? "Update Trainer"
                : "Add Trainer"}
          </button>

        </div>
      </form>
    </div>
  </section>
);


}
