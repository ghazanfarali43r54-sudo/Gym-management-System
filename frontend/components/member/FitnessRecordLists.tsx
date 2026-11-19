export type MeasurementRecord = {
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
  progressPhotos?: { front?: string; side?: string; back?: string };
  notes?: string;
  recordedBy?: { name?: string; role?: string };
};

export type FitnessAssessment = {
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

function displayDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString();
}

type MeasurementRecordListProps = {
  records: MeasurementRecord[];
  onEdit: (record: MeasurementRecord) => void;
  onDelete: (recordId: string) => void;
};

export function MeasurementRecordList({ records, onEdit, onDelete }: MeasurementRecordListProps) {
  if (records.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#d9c9c1] p-8 text-center">
        <p className="font-semibold text-[#4b1725]">No body measurements yet</p>
        <p className="mt-1 text-sm text-[#8b7771]">Add the first measurement to start tracking progress.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((item) => (
        <article key={item._id} className="rounded-xl border border-[#eadfd9] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-[#4b1725]">Measurement — {displayDate(item.measuredAt)}</h3>
              <p className="mt-1 text-xs text-[#8b7771]">Recorded by: {item.recordedBy?.name || "—"}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => onEdit(item)} className="rounded-lg border border-[#e7dcd6] px-3 py-1.5 text-xs font-semibold text-[#641d32]">Edit</button>
              <button type="button" onClick={() => onDelete(item._id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600">Delete</button>
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
          {item.notes && <p className="mt-3 whitespace-pre-wrap text-sm text-[#6f5b55]"><strong>Notes:</strong> {item.notes}</p>}
        </article>
      ))}
    </div>
  );
}

type AssessmentRecordListProps = {
  records: FitnessAssessment[];
  onEdit: (record: FitnessAssessment) => void;
  onDelete: (recordId: string) => void;
};

export function AssessmentRecordList({ records, onEdit, onDelete }: AssessmentRecordListProps) {
  if (records.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#d9c9c1] p-8 text-center">
        <p className="font-semibold text-[#4b1725]">No fitness assessments yet</p>
        <p className="mt-1 text-sm text-[#8b7771]">Add an assessment to track fitness development.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((item) => (
        <article key={item._id} className="rounded-xl border border-[#eadfd9] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-bold capitalize text-[#4b1725]">{item.assessmentType} Assessment — {displayDate(item.assessmentDate)}</h3>
              <p className="mt-1 text-xs text-[#8b7771]">
                Recorded by: {item.recordedBy?.name || "—"}
                {item.trainerId?.name ? ` · Trainer: ${item.trainerId.name}` : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => onEdit(item)} className="rounded-lg border border-[#e7dcd6] px-3 py-1.5 text-xs font-semibold text-[#641d32]">Edit</button>
              <button type="button" onClick={() => onDelete(item._id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600">Delete</button>
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
              <p className="text-xs font-semibold uppercase text-[#8b7771]">Goals</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-[#6f5b55]">
                {item.goals.map((goal, index) => <li key={`${goal}-${index}`}>{goal}</li>)}
              </ul>
            </div>
          ) : null}
          {item.tests?.length ? (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-[#8b7771]">Fitness Tests</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {item.tests.map((test) => (
                  <span key={test._id || test.testName} className="rounded-lg bg-[#faf6f2] px-3 py-2 text-xs text-[#4b1725]">
                    {test.testName}: {test.result} {test.unit}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          {item.physicalLimitations && <p className="mt-3 whitespace-pre-wrap text-sm text-[#6f5b55]"><strong>Physical Limitations:</strong> {item.physicalLimitations}</p>}
          {item.observations && <p className="mt-3 whitespace-pre-wrap text-sm text-[#6f5b55]"><strong>Observations:</strong> {item.observations}</p>}
          {item.recommendations && <p className="mt-3 whitespace-pre-wrap text-sm text-[#6f5b55]"><strong>Recommendations:</strong> {item.recommendations}</p>}
          {item.nextAssessmentDate && <p className="mt-3 text-xs text-[#8b7771]">Next assessment: {displayDate(item.nextAssessmentDate)}</p>}
        </article>
      ))}
    </div>
  );
}
