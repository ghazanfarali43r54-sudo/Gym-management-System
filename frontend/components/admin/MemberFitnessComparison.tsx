"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Props = { memberId: string; memberName: string };
type Snapshot = { measurement: Record<string, any> | null; assessment: Record<string, any> | null };
type ProgressMetric = { label: string; status: string; message?: string; previous?: number; current?: number; difference?: number; unit?: string };
type Comparison = { periods: { previous: string; current: string }; previous: Snapshot; current: Snapshot; report: ProgressMetric[] };
type Detail = { label: string; value: string; href?: string };

function formatDate(value?: string) {
  if (!value) return "Not recorded";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not recorded" : date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function monthLabel(value?: string) {
  if (!value) return "Month";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Month" : date.toLocaleDateString(undefined, { month: "long", year: "numeric", timeZone: "UTC" });
}

function detailsFor(snapshot: Snapshot): Detail[] {
  const m = snapshot.measurement;
  const a = snapshot.assessment;
  const measurementUnit = m?.measurementUnit || "cm";
  const weightUnit = m?.weightUnit || "kg";
  const details: Detail[] = [
    { label: "Measurement date", value: formatDate(m?.measuredAt) },
    { label: "Weight", value: m?.weight != null ? `${m.weight} ${weightUnit}` : "—" },
    { label: "Height", value: m?.height != null ? `${m.height} ${measurementUnit}` : "—" },
    { label: "BMI", value: m?.bmi != null ? String(m.bmi) : "—" },
    { label: "Body fat", value: m?.bodyFatPercentage != null ? `${m.bodyFatPercentage}%${m.bodyFatMethod ? ` · ${m.bodyFatMethod}` : ""}` : "—" },
    { label: "Muscle mass", value: m?.muscleMass != null ? `${m.muscleMass} ${weightUnit}` : "—" },
    ...([["Chest", "chest"], ["Waist", "waist"], ["Hips", "hips"], ["Left arm", "leftArm"], ["Right arm", "rightArm"], ["Left thigh", "leftThigh"], ["Right thigh", "rightThigh"], ["Neck", "neck"]] as const).map(([label, key]) => ({ label, value: m?.[key] != null ? `${m[key]} ${measurementUnit}` : "—" })),
    { label: "Measurement notes", value: m?.notes || "—" },
    { label: "Assessment date", value: formatDate(a?.assessmentDate) },
    { label: "Assessment type", value: a?.assessmentType || "—" },
    { label: "Fitness level", value: a?.fitnessLevel || "—" },
    { label: "Fitness score", value: a?.fitnessScore != null ? `${a.fitnessScore}/100` : "—" },
    { label: "Strength", value: a?.strengthLevel || "—" },
    { label: "Cardio", value: a?.cardioLevel || "—" },
    { label: "Flexibility", value: a?.flexibilityLevel || "—" },
    { label: "Endurance", value: a?.enduranceLevel || "—" },
    { label: "Goals", value: Array.isArray(a?.goals) && a.goals.length ? a.goals.join(", ") : "—" },
    { label: "Tests", value: Array.isArray(a?.tests) && a.tests.length ? a.tests.map((test: any) => `${test.testName}: ${test.result}${test.unit ? ` ${test.unit}` : ""}`).join("\n") : "—" },
    { label: "Physical limitations", value: a?.physicalLimitations || "—" },
    { label: "Observations", value: a?.observations || "—" },
    { label: "Recommendations", value: a?.recommendations || "—" },
    { label: "Next assessment", value: formatDate(a?.nextAssessmentDate) },
  ];
  for (const [label, key] of [["Front photo", "front"], ["Side photo", "side"], ["Back photo", "back"]] as const) {
    const href = m?.progressPhotos?.[key];
    details.splice(14, 0, { label, value: href ? "View progress photo" : "—", href });
  }
  return details;
}

function MonthColumn({ title, snapshot }: { title: string; snapshot: Snapshot }) {
  const hasRecords = snapshot.measurement || snapshot.assessment;
  return <section className="min-w-0 rounded-2xl border border-[#eadfd9] bg-white p-5 shadow-sm">
    <h2 className="text-lg font-bold text-[#4b1725]">{title}</h2>
    {!hasRecords ? <p className="mt-4 rounded-xl bg-[#f8f6f2] p-4 text-sm text-[#8b7771]">No measurements or assessment recorded for this month.</p> : <dl className="mt-4 divide-y divide-[#f1e9e5]">
      {detailsFor(snapshot).map(({ label, value, href }) => <div key={label} className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-3 py-2.5">
        <dt className="text-xs font-medium text-[#8b7771]">{label}</dt>
        <dd className="whitespace-pre-wrap break-words text-right text-sm font-medium text-[#342323]">{href ? <a className="text-[#7b2941] underline" href={href} target="_blank" rel="noreferrer">{value}</a> : value}</dd>
      </div>)}
    </dl>}
  </section>;
}

function ProgressColumn({ report }: { report: ProgressMetric[] }) {
  return <section className="min-w-0 rounded-2xl border border-[#eadfd9] bg-white p-5 shadow-sm">
    <h2 className="text-lg font-bold text-[#4b1725]">Calculated progress</h2>
    <p className="mt-1 text-xs text-[#8b7771]">Month-over-month changes from the recorded values</p>
    {!report.length ? <p className="mt-4 text-sm text-[#8b7771]">No progress metrics are available yet.</p> : <ul className="mt-4 divide-y divide-[#f1e9e5]">
      {report.map((item) => {
        const complete = item.status !== "insufficient_data" && item.previous != null && item.current != null;
        const delta = item.difference ?? 0;
        const statusLabel = item.status.replaceAll("_", " ");
        const color = item.status === "improved" ? "text-emerald-700 bg-emerald-50" : item.status === "unchanged" ? "text-slate-600 bg-slate-100" : item.status === "insufficient_data" ? "text-amber-800 bg-amber-50" : "text-orange-800 bg-orange-50";
        return <li key={item.label} className="py-3">
          <div className="flex items-center justify-between gap-2"><span className="text-sm font-semibold text-[#342323]">{item.label}</span><span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${color}`}>{statusLabel}</span></div>
          <p className="mt-1 text-sm text-[#6f5b55]">{complete ? `${item.previous}${item.unit ? ` ${item.unit}` : ""} → ${item.current}${item.unit ? ` ${item.unit}` : ""} (${delta > 0 ? "+" : ""}${delta}${item.unit ? ` ${item.unit}` : ""})` : item.message || "A record is missing for one or both months."}</p>
        </li>;
      })}
    </ul>}
    <p className="mt-4 rounded-xl bg-[#f8f6f2] p-3 text-xs leading-5 text-[#6f5b55]">Improvement reflects the metric direction: lower weight, BMI, body fat and waist, or higher muscle mass and fitness score. Other metrics are marked as changed.</p>
  </section>;
}

export default function MemberFitnessComparison({ memberId, memberName }: Props) {
  const [data, setData] = useState<Comparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiFetch(`/api/body-measurements/member/${encodeURIComponent(memberId)}/comparison`)
      .then((response) => {
        if (!response.ok) throw new Error(response.data?.message || "Unable to calculate monthly progress.");
        if (active) setData(response.data);
      })
      .catch((err) => { if (active) setError(err?.message || "Unable to calculate monthly progress."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [memberId]);

  return <main className="min-h-screen space-y-6 bg-[#f8f6f2] p-4 text-[#342323] sm:p-6">
    <header className="rounded-2xl border border-[#eadfd9] bg-white p-5 shadow-sm sm:p-7">
      <p className="text-sm font-semibold text-[#8b7771]">Fitness &amp; Body Progress</p>
      <h1 className="mt-1 text-2xl font-bold text-[#4b1725]">Monthly Comparison</h1>
      <p className="mt-2 text-sm text-[#6f5b55]">{memberName} · Latest measurement and assessment in each calendar month</p>
    </header>
    {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    {loading ? <div className="py-10 text-center text-sm text-[#8b7771]">Calculating monthly comparison…</div> : data && <div className="grid items-start gap-5 xl:grid-cols-3">
      <MonthColumn title={`Previous month · ${monthLabel(data.periods.previous)}`} snapshot={data.previous} />
      <MonthColumn title={`Current month · ${monthLabel(data.periods.current)}`} snapshot={data.current} />
      <ProgressColumn report={data.report || []} />
    </div>}
  </main>;
}
