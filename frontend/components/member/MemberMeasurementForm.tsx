import type { FormEvent } from "react";
import { Field, SelectField, TextAreaField, FitnessRecordFormActions, FitnessRecordFormHeader } from "./FitnessRecordControls";

export type MeasurementFormValues = {
  measuredAt: string;
  weight: string;
  weightUnit: string;
  height: string;
  measurementUnit: string;
  bodyFatPercentage: string;
  bodyFatMethod: string;
  muscleMass: string;
  chest: string;
  waist: string;
  hips: string;
  leftArm: string;
  rightArm: string;
  leftThigh: string;
  rightThigh: string;
  neck: string;
  frontPhoto: string;
  sidePhoto: string;
  backPhoto: string;
  notes: string;
};

type Props = {
  form: MeasurementFormValues;
  isEditing: boolean;
  saving: boolean;
  onChange: (field: keyof MeasurementFormValues, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function MemberMeasurementForm({
  form,
  isEditing,
  saving,
  onChange,
  onSubmit,
  onClose,
}: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-xl border border-[#eadfd9] bg-[#fffdfa] p-4 sm:p-5"
    >
      <FitnessRecordFormHeader
        title={isEditing ? "Edit Body Measurement" : "New Body Measurement"}
        saving={saving}
        onClose={onClose}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field
          label="Measurement Date"
          type="date"
          value={form.measuredAt}
          onChange={(v) => onChange("measuredAt", v)}
        />
        <Field
          label="Weight"
          type="number"
          min="0"
          step="0.01"
          value={form.weight}
          onChange={(v) => onChange("weight", v)}
        />
        <SelectField
          label="Weight Unit"
          value={form.weightUnit}
          onChange={(v) => onChange("weightUnit", v)}
          options={[
            { value: "kg", label: "Kilograms (kg)" },
            { value: "lbs", label: "Pounds (lbs)" },
          ]}
        />
        <Field
          label="Height"
          type="number"
          min="0"
          step="0.01"
          value={form.height}
          onChange={(v) => onChange("height", v)}
        />
        <SelectField
          label="Height / Measurement Unit"
          value={form.measurementUnit}
          onChange={(v) => onChange("measurementUnit", v)}
          options={[
            { value: "cm", label: "Centimeters (cm)" },
            { value: "inch", label: "Inches" },
          ]}
        />
        <Field
          label="Body Fat (%)"
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={form.bodyFatPercentage}
          onChange={(v) => onChange("bodyFatPercentage", v)}
        />
        <SelectField
          label="Body Fat Method"
          value={form.bodyFatMethod}
          onChange={(v) => onChange("bodyFatMethod", v)}
          options={[
            { value: "", label: "Not specified" },
            { value: "smart_scale", label: "Smart Scale", description: "A connected scale estimates body fat using sensors; results can vary with hydration." },
            { value: "skinfold", label: "Skinfold", description: "A trained person measures skinfold thickness with calipers to estimate body fat." },
            { value: "dexa", label: "DEXA", description: "A low-dose scan estimates body composition, including fat, muscle, and bone." },
            {
              value: "bioelectrical_impedance",
              label: "Bioelectrical Impedance",
              description: "A device sends a weak electrical signal through the body to estimate body composition; hydration affects results.",
            },
            { value: "other", label: "Other", description: "Use a different method not listed here." },
          ]}
        />
        <Field
          label="Muscle Mass (grams)"
          type="number"
          min="0"
          step="0.1"
          value={form.muscleMass}
          onChange={(v) => onChange("muscleMass", v)}
        />

        {(
          [
            ["chest", "Chest"],
            ["waist", "Waist"],
            ["hips", "Hips"],
            ["leftArm", "Left Arm"],
            ["rightArm", "Right Arm"],
            ["leftThigh", "Left Thigh"],
            ["rightThigh", "Right Thigh"],
            ["neck", "Neck"],
          ] as [keyof MeasurementFormValues, string][]
        ).map(([field, label]) => (
          <Field
            key={field}
            label={`${label} (${form.measurementUnit})`}
            type="number"
            min="0"
            step="0.1"
            value={form[field]}
            onChange={(v) => onChange(field, v)}
          />
        ))}
      </div>

      <div className="border-t border-[#eadfd9] pt-4">
        <h4 className="mb-3 font-semibold text-[#4b1725]">
          Progress Photo URLs
        </h4>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            label="Front Photo URL"
            value={form.frontPhoto}
            onChange={(v) => onChange("frontPhoto", v)}
            placeholder="https://..."
          />
          <Field
            label="Side Photo URL"
            value={form.sidePhoto}
            onChange={(v) => onChange("sidePhoto", v)}
            placeholder="https://..."
          />
          <Field
            label="Back Photo URL"
            value={form.backPhoto}
            onChange={(v) => onChange("backPhoto", v)}
            placeholder="https://..."
          />
        </div>
      </div>

      <TextAreaField
        label="Notes"
        value={form.notes}
        onChange={(v) => onChange("notes", v)}
        placeholder="Additional measurement notes..."
      />

      <FitnessRecordFormActions
        saving={saving}
        submitLabel={isEditing ? "Update Measurement" : "Save Measurement"}
        onCancel={onClose}
      />
    </form>
  );
}
