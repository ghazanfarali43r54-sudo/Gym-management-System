
"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Props = {
  memberId: string;
  initialTab?: Tab;
  openInitialForm?: boolean;
  formOnly?: boolean;
  onSaved?: () => void;
  onCancel?: () => void;
};

type Measurement = {
  _id: string;
  measuredAt: string;
  weight?: number;
  weightUnit?: "kg" | "lbs";
  height?: number;
  measurementUnit?: "cm" | "inch";
  bmi?: number | null;
  bodyFatPercentage?: number;
  bodyFatMethod?: string;
  muscleMass?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  leftArm?: number;
  rightArm?: number;
  leftThigh?: number;
  rightThigh?: number;
  neck?: number;
  progressPhotos?: {
    front?: string;
    side?: string;
    back?: string;
  };
  notes?: string;
  recordedBy?: { name?: string; role?: string };
};

type Assessment = {
  _id: string;
  assessmentDate: string;
  assessmentType: "initial" | "monthly" | "final";
  fitnessLevel?: string;
  fitnessScore?: number;
  goals?: string[];
  strengthLevel?: string;
  cardioLevel?: string;
  flexibilityLevel?: string;
  enduranceLevel?: string;
  tests?: { _id?: string; testName: string; result: number; unit?: string }[];
  physicalLimitations?: string;
  observations?: string;
  recommendations?: string;
  nextAssessmentDate?: string | null;
  recordedBy?: { name?: string; role?: string };
  trainerId?: { name?: string } | null;
};

type MeasurementForm = {
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

type AssessmentForm = {
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

type Tab = "measurements" | "assessments" | "comparison";

const inputClass =
  "w-full rounded-xl border border-[#e7dcd6] bg-white px-3 py-2.5 text-sm text-[#342323] outline-none focus:border-[#641d32]";

const labelClass = "mb-1.5 block text-xs font-semibold text-[#6f5b55]";

const emptyMeasurement: MeasurementForm = {
  measuredAt: new Date().toISOString().slice(0, 10),
  weight: "",
  weightUnit: "kg",
  height: "",
  measurementUnit: "cm",
  bodyFatPercentage: "",
  bodyFatMethod: "",
  muscleMass: "",
  chest: "",
  waist: "",
  hips: "",
  leftArm: "",
  rightArm: "",
  leftThigh: "",
  rightThigh: "",
  neck: "",
  frontPhoto: "",
  sidePhoto: "",
  backPhoto: "",
  notes: "",
};

const emptyAssessment: AssessmentForm = {
  assessmentDate: new Date().toISOString().slice(0, 10),
  assessmentType: "initial",
  fitnessLevel: "beginner",
  fitnessScore: "",
  goals: "",
  strengthLevel: "average",
  cardioLevel: "average",
  flexibilityLevel: "average",
  enduranceLevel: "average",
  tests: "",
  physicalLimitations: "",
  observations: "",
  recommendations: "",
  nextAssessmentDate: "",
};

function dateValue(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function displayDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString();
}

function numberOrUndefined(value: string) {
  if (value.trim() === "") return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function measurementToForm(item: Measurement): MeasurementForm {
  return {
    measuredAt: dateValue(item.measuredAt),
    weight: item.weight?.toString() ?? "",
    weightUnit: item.weightUnit || "kg",
    height: item.height?.toString() ?? "",
    measurementUnit: item.measurementUnit || "cm",
    bodyFatPercentage: item.bodyFatPercentage?.toString() ?? "",
    bodyFatMethod: item.bodyFatMethod || "",
    muscleMass: item.muscleMass?.toString() ?? "",
    chest: item.chest?.toString() ?? "",
    waist: item.waist?.toString() ?? "",
    hips: item.hips?.toString() ?? "",
    leftArm: item.leftArm?.toString() ?? "",
    rightArm: item.rightArm?.toString() ?? "",
    leftThigh: item.leftThigh?.toString() ?? "",
    rightThigh: item.rightThigh?.toString() ?? "",
    neck: item.neck?.toString() ?? "",
    frontPhoto: item.progressPhotos?.front || "",
    sidePhoto: item.progressPhotos?.side || "",
    backPhoto: item.progressPhotos?.back || "",
    notes: item.notes || "",
  };
}

function assessmentToForm(item: Assessment): AssessmentForm {
  return {
    assessmentDate: dateValue(item.assessmentDate),
    assessmentType: item.assessmentType || "initial",
    fitnessLevel: item.fitnessLevel || "beginner",
    fitnessScore: item.fitnessScore?.toString() ?? "",
    goals: (item.goals || []).join("\n"),
    strengthLevel: item.strengthLevel || "average",
    cardioLevel: item.cardioLevel || "average",
    flexibilityLevel: item.flexibilityLevel || "average",
    enduranceLevel: item.enduranceLevel || "average",
    tests: (item.tests || [])
      .map((test) => `${test.testName} | ${test.result} | ${test.unit || ""}`)
      .join("\n"),
    physicalLimitations: item.physicalLimitations || "",
    observations: item.observations || "",
    recommendations: item.recommendations || "",
    nextAssessmentDate: dateValue(item.nextAssessmentDate),
  };
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  min,
  max,
  step,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  min?: string;
  max?: string;
  step?: string;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className={inputClass}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; description?: string }[];
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} title={option.description}>
            {option.label}
          </option>
        ))}
      </select>
      {options.find((option) => option.value === value)?.description && (
        <p className="mt-1 text-xs text-muted-foreground">
          {options.find((option) => option.value === value)?.description}
        </p>
      )}
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <textarea
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

export default function MemberFitnessRecords({
  memberId,
  initialTab = "measurements",
  openInitialForm = false,
  formOnly = false,
  onSaved,
  onCancel,
}: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>(initialTab);

  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(openInitialForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const updateProfileUrl = (nextTab?: Tab, recordId?: string) => {
    if (formOnly) return;
    const params = new URLSearchParams({ member: memberId });
    if (nextTab) {
      params.set("fitness", nextTab === "measurements" ? "body-measurement" : "fitness-assessment");
      if (recordId) params.set("record", recordId);
    }
    router.push(`/admin/members?${params.toString()}`);
  };

  const [measurementForm, setMeasurementForm] =
    useState<MeasurementForm>(emptyMeasurement);

  const [assessmentForm, setAssessmentForm] =
    useState<AssessmentForm>(emptyAssessment);

  const loadRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [measurementResponse, assessmentResponse] = await Promise.all([
        apiFetch(`/api/body-measurements/member/${memberId}`),
        apiFetch(`/api/fitness-assessments/member/${memberId}`),
      ]);

      if (!measurementResponse.ok) {
        throw new Error(
          measurementResponse.data?.message ||
            "Unable to load body measurements."
        );
      }

      if (!assessmentResponse.ok) {
        throw new Error(
          assessmentResponse.data?.message ||
            "Unable to load fitness assessments."
        );
      }

      setMeasurements(
        Array.isArray(measurementResponse.data?.measurements)
          ? measurementResponse.data.measurements
          : []
      );

      setAssessments(
        Array.isArray(assessmentResponse.data?.assessments)
          ? assessmentResponse.data.assessments
          : []
      );
    } catch (err: any) {
      console.error("Member fitness records error:", err);
      setError(err?.message || "Unable to load member fitness records.");
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const openAddForm = () => {
    setEditingId(null);
    setError("");
    setSuccess("");

    if (tab === "measurements") {
      setMeasurementForm({
        ...emptyMeasurement,
        measuredAt: new Date().toISOString().slice(0, 10),
      });
    } else {
      setAssessmentForm({
        ...emptyAssessment,
        assessmentDate: new Date().toISOString().slice(0, 10),
      });
    }

    setShowForm(true);
    updateProfileUrl(tab);
  };

  const openMeasurementEdit = (item: Measurement) => {
    setEditingId(item._id);
    setMeasurementForm(measurementToForm(item));
    setError("");
    setSuccess("");
    setShowForm(true);
    updateProfileUrl("measurements", item._id);
  };

  const openAssessmentEdit = (item: Assessment) => {
    setEditingId(item._id);
    setAssessmentForm(assessmentToForm(item));
    setError("");
    setSuccess("");
    setShowForm(true);
    updateProfileUrl("assessments", item._id);
  };

  const closeForm = () => {
    if (saving) return;
    if (formOnly && onCancel) {
      onCancel();
      return;
    }
    setShowForm(false);
    setEditingId(null);
    setError("");
    updateProfileUrl();
  };

  const updateMeasurement = (
    field: keyof MeasurementForm,
    value: string
  ) => {
    setMeasurementForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateAssessment = (
    field: keyof AssessmentForm,
    value: string
  ) => {
    setAssessmentForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const saveMeasurement = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!measurementForm.measuredAt) {
      setError("Please select the measurement date.");
      return;
    }

    const numericFields = [
      "weight",
      "height",
      "bodyFatPercentage",
      "muscleMass",
      "chest",
      "waist",
      "hips",
      "leftArm",
      "rightArm",
      "leftThigh",
      "rightThigh",
      "neck",
    ] as const;

    const hasMeasurementDetails =
      numericFields.some((field) => measurementForm[field].trim() !== "") ||
      Boolean(
        measurementForm.frontPhoto.trim() ||
          measurementForm.sidePhoto.trim() ||
          measurementForm.backPhoto.trim() ||
          measurementForm.notes.trim()
      );

    if (!hasMeasurementDetails) {
      setError("Enter at least one measurement, progress photo URL, or note before saving.");
      return;
    }

    for (const field of numericFields) {
      const value = measurementForm[field];
      if (value.trim() !== "" && (!Number.isFinite(Number(value)) || Number(value) < 0)) {
        setError(`${field} must be a valid non-negative number.`);
        return;
      }
    }

    if (
      measurementForm.bodyFatPercentage !== "" &&
      Number(measurementForm.bodyFatPercentage) > 100
    ) {
      setError("Body fat percentage cannot exceed 100.");
      return;
    }

    const payload: Record<string, any> = {
      measuredAt: measurementForm.measuredAt,
      weightUnit: measurementForm.weightUnit,
      measurementUnit: measurementForm.measurementUnit,
      bodyFatMethod: measurementForm.bodyFatMethod || undefined,
      progressPhotos: {
        front: measurementForm.frontPhoto.trim(),
        side: measurementForm.sidePhoto.trim(),
        back: measurementForm.backPhoto.trim(),
      },
      notes: measurementForm.notes.trim(),
    };

    numericFields.forEach((field) => {
      const value = numberOrUndefined(measurementForm[field]);
      if (value !== undefined) payload[field] = value;
    });

    try {
      setSaving(true);

      const response = editingId
        ? await apiFetch(`/api/body-measurements/${editingId}`, {
            method: "PUT",
            body: JSON.stringify(payload),
          })
        : await apiFetch(`/api/body-measurements/member/${memberId}`, {
            method: "POST",
            body: JSON.stringify(payload),
          });

      if (!response.ok) {
        throw new Error(
          response.data?.message || "Unable to save body measurement."
        );
      }

      setShowForm(false);
      setEditingId(null);
      updateProfileUrl();
      setSuccess(
        editingId
          ? "Body measurement updated successfully."
          : "Body measurement added successfully."
      );

      await loadRecords();
      onSaved?.();
    } catch (err: any) {
      setError(err?.message || "Unable to save body measurement.");
    } finally {
      setSaving(false);
    }
  };

  const saveAssessment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!assessmentForm.assessmentDate) {
      setError("Please select the assessment date.");
      return;
    }

    if (
      assessmentForm.fitnessScore !== "" &&
      (!Number.isFinite(Number(assessmentForm.fitnessScore)) ||
        Number(assessmentForm.fitnessScore) < 0 ||
        Number(assessmentForm.fitnessScore) > 100)
    ) {
      setError("Fitness score must be between 0 and 100.");
      return;
    }

    const tests = assessmentForm.tests
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [testName, result, unit = ""] = line
          .split("|")
          .map((part) => part.trim());

        return {
          testName,
          result: Number(result),
          unit,
        };
      });

    const hasAssessmentDetails = Boolean(
      assessmentForm.fitnessScore.trim() ||
        assessmentForm.goals.trim() ||
        tests.length ||
        assessmentForm.physicalLimitations.trim() ||
        assessmentForm.observations.trim() ||
        assessmentForm.recommendations.trim() ||
        assessmentForm.strengthLevel !== "average" ||
        assessmentForm.cardioLevel !== "average" ||
        assessmentForm.flexibilityLevel !== "average" ||
        assessmentForm.enduranceLevel !== "average" ||
        assessmentForm.fitnessLevel !== "beginner" ||
        assessmentForm.assessmentType !== "initial"
    );

    if (!hasAssessmentDetails) {
      setError("Enter at least one fitness assessment detail before saving.");
      return;
    }

    if (
      tests.some(
        (test) =>
          !test.testName ||
          !Number.isFinite(test.result) ||
          test.result < 0
      )
    ) {
      setError(
        "Fitness tests must use this format: Test name | Result | Unit. Result must be a valid non-negative number."
      );
      return;
    }

    const payload = {
      assessmentDate: assessmentForm.assessmentDate,
      assessmentType: assessmentForm.assessmentType,
      fitnessLevel: assessmentForm.fitnessLevel,
      fitnessScore: numberOrUndefined(assessmentForm.fitnessScore),
      goals: assessmentForm.goals
        .split("\n")
        .map((goal) => goal.trim())
        .filter(Boolean),
      strengthLevel: assessmentForm.strengthLevel,
      cardioLevel: assessmentForm.cardioLevel,
      flexibilityLevel: assessmentForm.flexibilityLevel,
      enduranceLevel: assessmentForm.enduranceLevel,
      tests,
      physicalLimitations: assessmentForm.physicalLimitations.trim(),
      observations: assessmentForm.observations.trim(),
      recommendations: assessmentForm.recommendations.trim(),
      nextAssessmentDate: assessmentForm.nextAssessmentDate || null,
    };

    try {
      setSaving(true);

      const response = editingId
        ? await apiFetch(`/api/fitness-assessments/${editingId}`, {
            method: "PUT",
            body: JSON.stringify(payload),
          })
        : await apiFetch(`/api/fitness-assessments/member/${memberId}`, {
            method: "POST",
            body: JSON.stringify(payload),
          });

      if (!response.ok) {
        throw new Error(
          response.data?.message || "Unable to save fitness assessment."
        );
      }

      setShowForm(false);
      setEditingId(null);
      updateProfileUrl();
      setSuccess(
        editingId
          ? "Fitness assessment updated successfully."
          : "Fitness assessment added successfully."
      );

      await loadRecords();
      onSaved?.();
    } catch (err: any) {
      setError(err?.message || "Unable to save fitness assessment.");
    } finally {
      setSaving(false);
    }
  };

  const deleteRecord = async (id: string, type: Tab) => {
    const label =
      type === "measurements" ? "this body measurement" : "this fitness assessment";

    if (!window.confirm(`Are you sure you want to delete ${label}?`)) return;

    setError("");
    setSuccess("");

    try {
      const endpoint =
        type === "measurements"
          ? `/api/body-measurements/${id}`
          : `/api/fitness-assessments/${id}`;

      const response = await apiFetch(endpoint, { method: "DELETE" });

      if (!response.ok) {
        throw new Error(response.data?.message || "Unable to delete record.");
      }

      setSuccess("Record deleted successfully.");
      await loadRecords();
    } catch (err: any) {
      setError(err?.message || "Unable to delete record.");
    }
  };

  return (
    <section className="space-y-5 rounded-2xl border border-[#eadfd9] bg-white p-4 shadow-sm sm:p-6">
      {!formOnly && <div>
        <h2 className="text-xl font-bold text-[#4b1725]">
          Fitness & Body Progress
        </h2>
        <p className="mt-1 text-sm text-[#8b7771]">
          View and manage this member&apos;s measurement history and fitness assessments.
        </p>
      </div>}

      {!formOnly && <div className="flex flex-wrap items-center gap-2 border-b border-[#eee5e0] pb-3">
        <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setTab("measurements");
            setShowForm(false);
            updateProfileUrl();
            setError("");
            setSuccess("");
          }}
          className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            tab === "measurements"
              ? "bg-[#641d32] text-white"
              : "bg-[#faf6f2] text-[#6f5b55] hover:bg-[#f3eae5]"
          }`}
        >
          Body Measurements ({measurements.length})
        </button>

        <button
          type="button"
          onClick={() => {
            setTab("assessments");
            setShowForm(false);
            updateProfileUrl();
            setError("");
            setSuccess("");
          }}
          className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            tab === "assessments"
              ? "bg-[#641d32] text-white"
              : "bg-[#faf6f2] text-[#6f5b55] hover:bg-[#f3eae5]"
          }`}
        >
          Fitness Assessments ({assessments.length})
        </button>
        </div>
        <button
          type="button"
          onClick={() => {
            router.push(`/admin/members/${encodeURIComponent(memberId)}/fitness/comparison`);
          }}
          className={`ml-auto rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            tab === "comparison"
              ? "bg-[#641d32] text-white"
              : "bg-[#faf6f2] text-[#6f5b55] hover:bg-[#f3eae5]"
          }`}
        >
          Comparison
        </button>
      </div>}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!formOnly && success && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {loading ? (
        <div className="py-10 text-center text-sm text-[#8b7771]">
          Loading fitness records...
        </div>
      ) : (
        <>
          {!formOnly && !showForm && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={openAddForm}
                className="rounded-xl bg-[#641d32] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4b1725]"
              >
                + Add {tab === "measurements" ? "Measurement" : "Assessment"}
              </button>
            </div>
          )}

          {showForm && tab === "measurements" && (
            <form
              onSubmit={saveMeasurement}
              className="space-y-5 rounded-xl border border-[#eadfd9] bg-[#fffdfa] p-4 sm:p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-[#4b1725]">
                  {editingId ? "Edit Body Measurement" : "New Body Measurement"}
                </h3>
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="text-2xl text-[#8b7771]"
                >
                  ×
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field
                  label="Measurement Date"
                  type="date"
                  value={measurementForm.measuredAt}
                  onChange={(v) => updateMeasurement("measuredAt", v)}
                />
                <Field
                  label="Weight"
                  type="number"
                  min="0"
                  step="0.01"
                  value={measurementForm.weight}
                  onChange={(v) => updateMeasurement("weight", v)}
                />
                <SelectField
                  label="Weight Unit"
                  value={measurementForm.weightUnit}
                  onChange={(v) => updateMeasurement("weightUnit", v)}
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
                  value={measurementForm.height}
                  onChange={(v) => updateMeasurement("height", v)}
                />
                <SelectField
                  label="Height / Measurement Unit"
                  value={measurementForm.measurementUnit}
                  onChange={(v) => updateMeasurement("measurementUnit", v)}
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
                  value={measurementForm.bodyFatPercentage}
                  onChange={(v) => updateMeasurement("bodyFatPercentage", v)}
                />
                <SelectField
                  label="Body Fat Method"
                  value={measurementForm.bodyFatMethod}
                  onChange={(v) => updateMeasurement("bodyFatMethod", v)}
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
                  value={measurementForm.muscleMass}
                  onChange={(v) => updateMeasurement("muscleMass", v)}
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
                  ] as [keyof MeasurementForm, string][]
                ).map(([field, label]) => (
                  <Field
                    key={field}
                    label={`${label} (${measurementForm.measurementUnit})`}
                    type="number"
                    min="0"
                    step="0.1"
                    value={measurementForm[field]}
                    onChange={(v) => updateMeasurement(field, v)}
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
                    value={measurementForm.frontPhoto}
                    onChange={(v) => updateMeasurement("frontPhoto", v)}
                    placeholder="https://..."
                  />
                  <Field
                    label="Side Photo URL"
                    value={measurementForm.sidePhoto}
                    onChange={(v) => updateMeasurement("sidePhoto", v)}
                    placeholder="https://..."
                  />
                  <Field
                    label="Back Photo URL"
                    value={measurementForm.backPhoto}
                    onChange={(v) => updateMeasurement("backPhoto", v)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <TextAreaField
                label="Notes"
                value={measurementForm.notes}
                onChange={(v) => updateMeasurement("notes", v)}
                placeholder="Additional measurement notes..."
              />

              <div className="flex flex-wrap justify-end gap-2 border-t border-[#eadfd9] pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-[#e7dcd6] px-5 py-2.5 text-sm font-semibold text-[#6f5b55]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#641d32] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {saving ? "Saving..." : editingId ? "Update Measurement" : "Save Measurement"}
                </button>
              </div>
            </form>
          )}

          {showForm && tab === "assessments" && (
            <form
              onSubmit={saveAssessment}
              className="space-y-5 rounded-xl border border-[#eadfd9] bg-[#fffdfa] p-4 sm:p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-[#4b1725]">
                  {editingId ? "Edit Fitness Assessment" : "New Fitness Assessment"}
                </h3>
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="text-2xl text-[#8b7771]"
                >
                  ×
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field
                  label="Assessment Date"
                  type="date"
                  value={assessmentForm.assessmentDate}
                  onChange={(v) => updateAssessment("assessmentDate", v)}
                />
                <SelectField
                  label="Assessment Type"
                  value={assessmentForm.assessmentType}
                  onChange={(v) => updateAssessment("assessmentType", v)}
                  options={[
                    { value: "initial", label: "Initial" },
                    { value: "monthly", label: "Monthly" },
                    { value: "final", label: "Final" },
                  ]}
                />
                <SelectField
                  label="Fitness Level"
                  value={assessmentForm.fitnessLevel}
                  onChange={(v) => updateAssessment("fitnessLevel", v)}
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
                  value={assessmentForm.fitnessScore}
                  onChange={(v) => updateAssessment("fitnessScore", v)}
                />

                {(
                  [
                    ["strengthLevel", "Strength"],
                    ["cardioLevel", "Cardio"],
                    ["flexibilityLevel", "Flexibility"],
                    ["enduranceLevel", "Endurance"],
                  ] as [keyof AssessmentForm, string][]
                ).map(([field, label]) => (
                  <SelectField
                    key={field}
                    label={`${label} Level`}
                    value={assessmentForm[field]}
                    onChange={(v) => updateAssessment(field, v)}
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
                  value={assessmentForm.nextAssessmentDate}
                  onChange={(v) => updateAssessment("nextAssessmentDate", v)}
                />
              </div>

              <TextAreaField
                label="Fitness Goals (one goal per line)"
                value={assessmentForm.goals}
                onChange={(v) => updateAssessment("goals", v)}
                placeholder={"Lose weight\nImprove stamina\nBuild strength"}
              />

              <TextAreaField
                label="Fitness Tests"
                value={assessmentForm.tests}
                onChange={(v) => updateAssessment("tests", v)}
                placeholder={"Push-ups | 22 | reps\nRunning | 1.5 | km"}
              />
              <p className="-mt-3 text-xs text-[#8b7771]">
                Enter one test per line using: Test name | Result | Unit
              </p>

              <TextAreaField
                label="Physical Limitations"
                value={assessmentForm.physicalLimitations}
                onChange={(v) => updateAssessment("physicalLimitations", v)}
              />
              <TextAreaField
                label="Observations"
                value={assessmentForm.observations}
                onChange={(v) => updateAssessment("observations", v)}
              />
              <TextAreaField
                label="Recommendations"
                value={assessmentForm.recommendations}
                onChange={(v) => updateAssessment("recommendations", v)}
              />

              <div className="flex flex-wrap justify-end gap-2 border-t border-[#eadfd9] pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-[#e7dcd6] px-5 py-2.5 text-sm font-semibold text-[#6f5b55]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#641d32] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {saving ? "Saving..." : editingId ? "Update Assessment" : "Save Assessment"}
                </button>
              </div>
            </form>
          )}

          {!formOnly && !showForm && tab === "measurements" && (
            measurements.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#d9c9c1] p-8 text-center">
                <p className="font-semibold text-[#4b1725]">
                  No body measurements yet
                </p>
                <p className="mt-1 text-sm text-[#8b7771]">
                  Add the first measurement to start tracking progress.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {measurements.map((item) => (
                  <article
                    key={item._id}
                    className="rounded-xl border border-[#eadfd9] p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-[#4b1725]">
                          Measurement — {displayDate(item.measuredAt)}
                        </h3>
                        <p className="mt-1 text-xs text-[#8b7771]">
                          Recorded by: {item.recordedBy?.name || "—"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openMeasurementEdit(item)}
                          className="rounded-lg border border-[#e7dcd6] px-3 py-1.5 text-xs font-semibold text-[#641d32]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteRecord(item._id, "measurements")}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        ["Weight", item.weight != null ? `${item.weight} ${item.weightUnit || "kg"}` : "—"],
                        ["Height", item.height != null ? `${item.height} ${item.measurementUnit || "cm"}` : "—"],
                        ["BMI", item.bmi != null ? item.bmi.toString() : "—"],
                        ["Body Fat", item.bodyFatPercentage != null ? `${item.bodyFatPercentage}%` : "—"],
                        ["Muscle Mass", item.muscleMass != null ? item.muscleMass.toString() : "—"],
                        ["Chest", item.chest != null ? `${item.chest} ${item.measurementUnit || "cm"}` : "—"],
                        ["Waist", item.waist != null ? `${item.waist} ${item.measurementUnit || "cm"}` : "—"],
                        ["Hips", item.hips != null ? `${item.hips} ${item.measurementUnit || "cm"}` : "—"],
                        ["Left Arm", item.leftArm != null ? `${item.leftArm} ${item.measurementUnit || "cm"}` : "—"],
                        ["Right Arm", item.rightArm != null ? `${item.rightArm} ${item.measurementUnit || "cm"}` : "—"],
                        ["Left Thigh", item.leftThigh != null ? `${item.leftThigh} ${item.measurementUnit || "cm"}` : "—"],
                        ["Right Thigh", item.rightThigh != null ? `${item.rightThigh} ${item.measurementUnit || "cm"}` : "—"],
                        ["Neck", item.neck != null ? `${item.neck} ${item.measurementUnit || "cm"}` : "—"],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-lg bg-[#faf6f2] p-3">
                          <p className="text-xs text-[#8b7771]">{label}</p>
                          <p className="mt-1 font-semibold text-[#4b1725]">{value}</p>
                        </div>
                      ))}
                    </div>

                    {item.notes && (
                      <p className="mt-3 whitespace-pre-wrap text-sm text-[#6f5b55]">
                        <strong>Notes:</strong> {item.notes}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )
          )}

          {!formOnly && !showForm && tab === "assessments" && (
            assessments.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#d9c9c1] p-8 text-center">
                <p className="font-semibold text-[#4b1725]">
                  No fitness assessments yet
                </p>
                <p className="mt-1 text-sm text-[#8b7771]">
                  Add an assessment to track fitness development.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {assessments.map((item) => (
                  <article
                    key={item._id}
                    className="rounded-xl border border-[#eadfd9] p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold capitalize text-[#4b1725]">
                          {item.assessmentType} Assessment — {displayDate(item.assessmentDate)}
                        </h3>
                        <p className="mt-1 text-xs text-[#8b7771]">
                          Recorded by: {item.recordedBy?.name || "—"}
                          {item.trainerId?.name ? ` · Trainer: ${item.trainerId.name}` : ""}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openAssessmentEdit(item)}
                          className="rounded-lg border border-[#e7dcd6] px-3 py-1.5 text-xs font-semibold text-[#641d32]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteRecord(item._id, "assessments")}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {[
                        ["Fitness Level", item.fitnessLevel || "—"],
                        ["Fitness Score", item.fitnessScore != null ? `${item.fitnessScore}/100` : "—"],
                        ["Strength", item.strengthLevel || "—"],
                        ["Cardio", item.cardioLevel || "—"],
                        ["Flexibility", item.flexibilityLevel || "—"],
                        ["Endurance", item.enduranceLevel || "—"],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-lg bg-[#faf6f2] p-3">
                          <p className="text-xs text-[#8b7771]">{label}</p>
                          <p className="mt-1 font-semibold capitalize text-[#4b1725]">{value}</p>
                        </div>
                      ))}
                    </div>

                    {item.goals?.length ? (
                      <div className="mt-4">
                        <p className="text-xs font-semibold uppercase text-[#8b7771]">
                          Goals
                        </p>
                        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-[#6f5b55]">
                          {item.goals.map((goal, index) => (
                            <li key={`${goal}-${index}`}>{goal}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {item.tests?.length ? (
                      <div className="mt-4">
                        <p className="text-xs font-semibold uppercase text-[#8b7771]">
                          Fitness Tests
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {item.tests.map((test) => (
                            <span
                              key={test._id || test.testName}
                              className="rounded-lg bg-[#faf6f2] px-3 py-2 text-xs text-[#4b1725]"
                            >
                              {test.testName}: {test.result} {test.unit}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {item.physicalLimitations && (
                      <p className="mt-3 whitespace-pre-wrap text-sm text-[#6f5b55]">
                        <strong>Physical Limitations:</strong> {item.physicalLimitations}
                      </p>
                    )}
                    {item.observations && (
                      <p className="mt-3 whitespace-pre-wrap text-sm text-[#6f5b55]">
                        <strong>Observations:</strong> {item.observations}
                      </p>
                    )}
                    {item.recommendations && (
                      <p className="mt-3 whitespace-pre-wrap text-sm text-[#6f5b55]">
                        <strong>Recommendations:</strong> {item.recommendations}
                      </p>
                    )}
                    {item.nextAssessmentDate && (
                      <p className="mt-3 text-xs text-[#8b7771]">
                        Next assessment: {displayDate(item.nextAssessmentDate)}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )
          )}
        </>
      )}
    </section>
  );
}
