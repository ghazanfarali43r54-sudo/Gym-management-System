import type { FormEvent } from "react";
import { Field, SelectField, TextAreaField, FitnessRecordFormActions, FitnessRecordFormHeader } from "./FitnessRecordControls";

export type AssessmentFormValues = {
  assessmentDate: string;
  assessmentType: string;
  fitnessLevel: string;
  fitnessScore: string;
  goals: string;
  strengthLevel: string;
  cardioLevel: string;
  flexibilityLevel: string;
  enduranceLevel: string;
  tests: string;
  physicalLimitations: string;
  observations: string;
  recommendations: string;
  nextAssessmentDate: string;
};

type Props = {
  form: AssessmentFormValues;
  isEditing: boolean;
  saving: boolean;
  onChange: (field: keyof AssessmentFormValues, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function MemberAssessmentForm({
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
        title={isEditing ? "Edit Fitness Assessment" : "New Fitness Assessment"}
        saving={saving}
        onClose={onClose}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field
          label="Assessment Date"
          type="date"
          value={form.assessmentDate}
          onChange={(v) => onChange("assessmentDate", v)}
        />
        <SelectField
          label="Assessment Type"
          value={form.assessmentType}
          onChange={(v) => onChange("assessmentType", v)}
          options={[
            { value: "initial", label: "Initial" },
            { value: "monthly", label: "Monthly" },
            { value: "final", label: "Final" },
          ]}
        />
        <SelectField
          label="Fitness Level"
          value={form.fitnessLevel}
          onChange={(v) => onChange("fitnessLevel", v)}
          options={[
            { value: "beginner", label: "Beginner" },
            { value: "intermediate", label: "Intermediate" },
            { value: "advanced", label: "Advanced" },
          ]}
        />
        <Field
          label="Fitness Score (0–100)"
          type="number"
          min="0"
          max="100"
          value={form.fitnessScore}
          onChange={(v) => onChange("fitnessScore", v)}
        />

        {(
          [
            ["strengthLevel", "Strength"],
            ["cardioLevel", "Cardio"],
            ["flexibilityLevel", "Flexibility"],
            ["enduranceLevel", "Endurance"],
          ] as [keyof AssessmentFormValues, string][]
        ).map(([field, label]) => (
          <SelectField
            key={field}
            label={`${label} Level`}
            value={form[field]}
            onChange={(v) => onChange(field, v)}
            options={[
              { value: "poor", label: "Poor" },
              { value: "average", label: "Average" },
              { value: "good", label: "Good" },
              { value: "excellent", label: "Excellent" },
            ]}
          />
        ))}

        <Field
          label="Next Assessment Date"
          type="date"
          value={form.nextAssessmentDate}
          onChange={(v) => onChange("nextAssessmentDate", v)}
        />
      </div>

      <TextAreaField
        label="Fitness Goals (one goal per line)"
        value={form.goals}
        onChange={(v) => onChange("goals", v)}
        placeholder={"Lose weight\nImprove stamina\nBuild strength"}
      />

      <TextAreaField
        label="Fitness Tests"
        value={form.tests}
        onChange={(v) => onChange("tests", v)}
        placeholder={"Push-ups | 22 | reps\nRunning | 1.5 | km"}
      />
      <p className="-mt-3 text-xs text-[#8b7771]">
        Enter one test per line using: Test name | Result | Unit
      </p>

      <TextAreaField
        label="Physical Limitations"
        value={form.physicalLimitations}
        onChange={(v) => onChange("physicalLimitations", v)}
      />
      <TextAreaField
        label="Observations"
        value={form.observations}
        onChange={(v) => onChange("observations", v)}
      />
      <TextAreaField
        label="Recommendations"
        value={form.recommendations}
        onChange={(v) => onChange("recommendations", v)}
      />

      <FitnessRecordFormActions
        saving={saving}
        submitLabel={isEditing ? "Update Assessment" : "Save Assessment"}
        onCancel={onClose}
      />
    </form>
  );
}
