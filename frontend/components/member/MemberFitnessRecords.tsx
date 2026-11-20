"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteMemberFitnessRecord,
  listMemberAssessments,
  listMemberMeasurements,
  saveMemberAssessment,
  saveMemberMeasurement,
} from "@/features/memberApi";
import {
  FitnessRecordTabs,
  type FitnessRecordTab,
} from "./FitnessRecordControls";
import MemberMeasurementForm, {
  type MeasurementFormValues,
} from "./MemberMeasurementForm";
import MemberAssessmentForm, {
  type AssessmentFormValues,
} from "./MemberAssessmentForm";
import {
  AssessmentRecordList,
  MeasurementRecordList,
  type FitnessAssessment,
  type MeasurementRecord,
} from "./FitnessRecordLists";

type Props = {
  memberId: string;
  initialTab?: FitnessRecordTab;
  openInitialForm?: boolean;
  formOnly?: boolean;
  onSaved?: () => void;
  onCancel?: () => void;
  onAdd?: (tab: Exclude<FitnessRecordTab, "comparison">) => void;
  onEdit?: (
    type: "body-measurement" | "fitness-assessment",
    recordId: string
  ) => void;
  editRecordId?: string | null;
};

const emptyMeasurement: MeasurementFormValues = {
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

const emptyAssessment: AssessmentFormValues = {
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

function numberOrUndefined(value: string) {
  if (value.trim() === "") return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function measurementToForm(item: MeasurementRecord): MeasurementFormValues {
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

function assessmentToForm(item: FitnessAssessment): AssessmentFormValues {
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

export default function MemberFitnessRecords({
  memberId,
  initialTab = "measurements",
  openInitialForm = false,
  formOnly = false,
  onSaved,
  onCancel,
  onAdd,
  onEdit,
  editRecordId,
}: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<FitnessRecordTab>(initialTab);

  const [measurements, setMeasurements] = useState<MeasurementRecord[]>([]);
  const [assessments, setAssessments] = useState<FitnessAssessment[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(openInitialForm && !editRecordId);
  const [editingId, setEditingId] = useState<string | null>(null);

  const updateProfileUrl = (nextTab?: FitnessRecordTab, recordId?: string) => {
    if (formOnly) return;
    const params = new URLSearchParams({ member: memberId });
    if (nextTab) {
      params.set(
        "fitness",
        nextTab === "measurements" ? "body-measurement" : "fitness-assessment"
      );
      if (recordId) params.set("record", recordId);
    }
    router.push(`/admin/members?${params.toString()}`);
  };

  const [measurementForm, setMeasurementForm] =
    useState<MeasurementFormValues>(emptyMeasurement);

  const [assessmentForm, setAssessmentForm] =
    useState<AssessmentFormValues>(emptyAssessment);

  const loadRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [measurementResponse, assessmentResponse] = await Promise.all([
        listMemberMeasurements(memberId),
        listMemberAssessments(memberId),
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

      const nextMeasurements: MeasurementRecord[] = Array.isArray(
        measurementResponse.data?.measurements
      )
        ? measurementResponse.data.measurements
        : [];

      const nextAssessments: FitnessAssessment[] = Array.isArray(
        assessmentResponse.data?.assessments
      )
        ? assessmentResponse.data.assessments
        : [];

      setMeasurements(nextMeasurements);
      setAssessments(nextAssessments);
      if (editRecordId && initialTab === "measurements") {
        const record = nextMeasurements.find(
          (item) => item._id === editRecordId
        );

        if (record) {
          setEditingId(record._id);
          setMeasurementForm(measurementToForm(record));
          setShowForm(true);
        } else {
          setError("Body measurement record not found.");
        }
      }

      if (editRecordId && initialTab === "assessments") {
        const record = nextAssessments.find(
          (item) => item._id === editRecordId
        );

        if (record) {
          setEditingId(record._id);
          setAssessmentForm(assessmentToForm(record));
          setShowForm(true);
        } else {
          setError("Fitness assessment record not found.");
        }
      }
    } catch (err: unknown) {
      console.error("Member fitness records error:", err);
      setError(errorMessage(err, "Unable to load member fitness records."));
    } finally {
      setLoading(false);
    }
}, [memberId, editRecordId, initialTab]);

  useEffect(() => {
    // The async loader updates state after its requests resolve.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRecords();
  }, [loadRecords]);

  const openAddForm = () => {
    if (onAdd && tab !== "comparison") {
      onAdd(tab);
      return;
    }

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

  const openMeasurementEdit = (item: MeasurementRecord) => {
    if (onEdit) {
      onEdit("body-measurement", item._id);
      return;
    }
    setEditingId(item._id);
    setMeasurementForm(measurementToForm(item));
    setError("");
    setSuccess("");
    setShowForm(true);
    updateProfileUrl("measurements", item._id);
  };

  const openAssessmentEdit = (item: FitnessAssessment) => {
    if (onEdit) {
      onEdit("fitness-assessment", item._id);
      return;
    }
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
    field: keyof MeasurementFormValues,
    value: string
  ) => {
    setMeasurementForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateAssessment = (
    field: keyof AssessmentFormValues,
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
      setError(
        "Enter at least one measurement, progress photo URL, or note before saving."
      );
      return;
    }

    for (const field of numericFields) {
      const value = measurementForm[field];
      if (
        value.trim() !== "" &&
        (!Number.isFinite(Number(value)) || Number(value) < 0)
      ) {
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

    const payload: Record<string, unknown> = {
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

      const response = await saveMemberMeasurement(
        memberId,
        editingId,
        payload
      );

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
    } catch (err: unknown) {
      setError(errorMessage(err, "Unable to save body measurement."));
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
          !test.testName || !Number.isFinite(test.result) || test.result < 0
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

      const response = await saveMemberAssessment(memberId, editingId, payload);

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
    } catch (err: unknown) {
      setError(errorMessage(err, "Unable to save fitness assessment."));
    } finally {
      setSaving(false);
    }
  };

  const deleteRecord = async (
    id: string,
    type: Exclude<FitnessRecordTab, "comparison">
  ) => {
    const label =
      type === "measurements"
        ? "this body measurement"
        : "this fitness assessment";

    if (!window.confirm(`Are you sure you want to delete ${label}?`)) return;

    setError("");
    setSuccess("");

    try {
      const response = await deleteMemberFitnessRecord(id, type);

      if (!response.ok) {
        throw new Error(response.data?.message || "Unable to delete record.");
      }

      setSuccess("Record deleted successfully.");
      await loadRecords();
    } catch (err: unknown) {
      setError(errorMessage(err, "Unable to delete record."));
    }
  };

  return (
    <section className="space-y-5 rounded-2xl border border-[#eadfd9] bg-white p-4 shadow-sm sm:p-6">
      {!formOnly && (
        <div>
          <h2 className="text-xl font-bold text-[#4b1725]">
            Fitness & Body Progress
          </h2>
          <p className="mt-1 text-sm text-[#8b7771]">
            View and manage this member&apos;s measurement history and fitness
            assessments.
          </p>
        </div>
      )}

      {!formOnly && (
        <FitnessRecordTabs
          activeTab={tab}
          measurementCount={measurements.length}
          assessmentCount={assessments.length}
          onChange={(nextTab) => {
            setTab(nextTab);
            setShowForm(false);
            updateProfileUrl();
            setError("");
            setSuccess("");
          }}
          onCompare={() =>
            router.push(
              `/admin/members/${encodeURIComponent(
                memberId
              )}/fitness/comparison`
            )
          }
        />
      )}

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
            <MemberMeasurementForm
              form={measurementForm}
              isEditing={editingId !== null}
              saving={saving}
              onChange={updateMeasurement}
              onSubmit={saveMeasurement}
              onClose={closeForm}
            />
          )}

          {showForm && tab === "assessments" && (
            <MemberAssessmentForm
              form={assessmentForm}
              isEditing={editingId !== null}
              saving={saving}
              onChange={updateAssessment}
              onSubmit={saveAssessment}
              onClose={closeForm}
            />
          )}

          {!formOnly && !showForm && tab === "measurements" && (
            <MeasurementRecordList
              records={measurements}
              onEdit={openMeasurementEdit}
              onDelete={(recordId) => deleteRecord(recordId, "measurements")}
            />
          )}

          {!formOnly && !showForm && tab === "assessments" && (
            <AssessmentRecordList
              records={assessments}
              onEdit={openAssessmentEdit}
              onDelete={(recordId) => deleteRecord(recordId, "assessments")}
            />
          )}
        </>
      )}
    </section>
  );
}
