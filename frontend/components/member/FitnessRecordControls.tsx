type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  min?: string;
  max?: string;
  step?: string;
};

type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; description?: string }[];
};

type TextAreaFieldProps = Pick<FieldProps, "label" | "value" | "onChange" | "placeholder">;

const inputClass =
  "w-full rounded-xl border border-[#e7dcd6] bg-white px-3 py-2.5 text-sm text-[#342323] outline-none focus:border-[#641d32]";
const labelClass = "mb-1.5 block text-xs font-semibold text-[#6f5b55]";

export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  min,
  max,
  step,
}: FieldProps) {
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

export function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  const selectedDescription = options.find((option) => option.value === value)?.description;

  return (
    <div>
      <label className={labelClass}>{label}</label>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>
        {options.map((option) => (
          <option key={option.value} value={option.value} title={option.description}>
            {option.label}
          </option>
        ))}
      </select>
      {selectedDescription && <p className="mt-1 text-xs text-muted-foreground">{selectedDescription}</p>}
    </div>
  );
}

export function TextAreaField({ label, value, onChange, placeholder }: TextAreaFieldProps) {
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

type FormHeaderProps = {
  title: string;
  saving: boolean;
  onClose: () => void;
};

type FormActionsProps = {
  saving: boolean;
  submitLabel: string;
  onCancel: () => void;
};

export function FitnessRecordFormHeader({ title, saving, onClose }: FormHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h3 className="font-bold text-[#4b1725]">{title}</h3>
      <button
        type="button"
        onClick={onClose}
        disabled={saving}
        className="text-2xl text-[#8b7771]"
        aria-label="Close form"
      >
        × 
      </button>
    </div>
  );
}

export function FitnessRecordFormActions({ saving, submitLabel, onCancel }: FormActionsProps) {
  return (
    <div className="flex flex-wrap justify-end gap-2 border-t border-[#eadfd9] pt-4">
      <button
        type="button"
        onClick={onCancel}
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
        {saving ? "Saving..." : submitLabel}
      </button>
    </div>
  );
}

export type FitnessRecordTab = "measurements" | "assessments" | "comparison";

type TabsProps = {
  activeTab: FitnessRecordTab;
  measurementCount: number;
  assessmentCount: number;
  onChange: (tab: Exclude<FitnessRecordTab, "comparison">) => void;
  onCompare: () => void;
};

const tabClass = (active: boolean) =>
  `rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
    active
      ? "bg-[#641d32] text-white"
      : "bg-[#faf6f2] text-[#6f5b55] hover:bg-[#f3eae5]"
  }`;

export function FitnessRecordTabs({
  activeTab,
  measurementCount,
  assessmentCount,
  onChange,
  onCompare,
}: TabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-[#eee5e0] pb-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => onChange("measurements")} className={tabClass(activeTab === "measurements")}>
          Body Measurements ({measurementCount})
        </button>
        <button type="button" onClick={() => onChange("assessments")} className={tabClass(activeTab === "assessments")}>
          Fitness Assessments ({assessmentCount})
        </button>
      </div>
      <button type="button" onClick={onCompare} className={`${tabClass(activeTab === "comparison")} ml-auto`}>
        Comparison
      </button>
    </div>
  );
}
