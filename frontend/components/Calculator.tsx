"use client";

import { useMemo, useState } from "react";

/* ---------- BMI categories ---------- */

const categories = [
  { label: "Underweight", range: "< 18.5", color: "#4f7be8" },
  { label: "Normal weight", range: "18.5–24.9", color: "#5cc16b" },
  { label: "Overweight", range: "25.0–29.9", color: "#e8a43a" },
  { label: "Obese Type 1", range: "30.0–34.9", color: "#e8793a" },
  { label: "Obese Type 2", range: "35.0–39.9", color: "#dd5050" },
  { label: "Obese Type 3", range: "≥ 40.0", color: "#7a2020" },
];

// bar ke 6 barabar hisson ke start/end BMI
const bounds = [15, 18.5, 25, 30, 35, 40, 50];
const scaleLabels = ["15", "18.5", "25", "30", "35", "40+"];

function getCategoryIndex(bmi: number) {
  if (bmi < 18.5) return 0;
  if (bmi < 25) return 1;
  if (bmi < 30) return 2;
  if (bmi < 35) return 3;
  if (bmi < 40) return 4;
  return 5;
}

// marker ki position (0 se 1), har hissa barabar chauda hai
function getPosition(bmi: number) {
  const i = getCategoryIndex(bmi);
  const lo = bounds[i];
  const hi = bounds[i + 1];
  const frac = Math.min(Math.max((bmi - lo) / (hi - lo), 0), 1);
  return (i + frac) / 6;
}

/* ---------- small pieces ---------- */

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function NumberField({
  label,
  unit,
  value,
  onChange,
  autoFocus,
}: {
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  autoFocus?: boolean;
}) {
  function step(delta: number) {
    const n = parseFloat(value);
    const next = (Number.isNaN(n) ? 0 : n) + delta;
    onChange(String(Math.max(next, 0)));
  }

  return (
    <div>
      <label className="mb-3 block text-lg font-semibold text-slate-900">
        {label} <span className="font-normal text-slate-500">({unit})</span>
      </label>

      <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-5 py-4 transition focus-within:border-[#b52a2d] focus-within:ring-2 focus-within:ring-[#b52a2d]">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          value={value}
          autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-xl text-slate-900 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />

        <div className="flex flex-col text-slate-600">
          <button
            type="button"
            onClick={() => step(1)}
            aria-label={`Increase ${label}`}
            className="rounded p-0.5 hover:text-black"
          >
            <svg {...iconProps} className="h-3.5 w-3.5">
              <path d="m6 15 6-6 6 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label={`Decrease ${label}`}
            className="rounded p-0.5 hover:text-black"
          >
            <svg {...iconProps} className="h-3.5 w-3.5">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- section ---------- */

export default function Calculator() {
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("70");

  const bmi = useMemo(() => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (!h || !w || h <= 0 || w <= 0) return null;
    return w / (h * h);
  }, [height, weight]);

  const activeIndex = bmi === null ? -1 : getCategoryIndex(bmi);
  const active = activeIndex >= 0 ? categories[activeIndex] : null;
  const position = bmi === null ? 0 : getPosition(bmi);

  return (
    <section className="w-full bg-white px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* heading */}
        <div className="text-center">
          <span className="inline-block rounded-full bg-[#b52a2d]/10 px-6 py-3 text-base font-semibold text-[#b52a2d]">
            Health Check
          </span>

          <h2 className="mt-8 text-4xl font-extrabold text-slate-900 sm:text-5xl lg:text-6xl">
            Know Your <span className="text-[#b52a2d]">Body Mass Index</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-500">
            Check where you stand and set the right fitness goals with our quick
            BMI calculator.
          </p>
        </div>

        {/* cards */}
        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {/* ===== left: inputs ===== */}
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-8 shadow-sm sm:p-10">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#b52a2d]/10 text-[#b52a2d]">
                <svg {...iconProps} className="h-6 w-6">
                  <path d="M4 17a8 8 0 1 1 16 0" />
                  <path d="m12 17 3-5" />
                </svg>
              </span>
              <div>
                <h3 className="text-xl font-bold text-slate-900">BMI calculator</h3>
                <p className="text-slate-500">Check your health range</p>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <NumberField label="Height" unit="cm" value={height} onChange={setHeight} />
              <NumberField label="Weight" unit="kg" value={weight} onChange={setWeight} />
            </div>
          </div>

          {/* ===== right: result ===== */}
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg text-slate-500">Your BMI</p>
                <p className="mt-1 flex items-end gap-2">
                  <span className="text-6xl font-extrabold text-slate-900">
                    {bmi === null ? "--" : bmi.toFixed(1)}
                  </span>
                  <span className="pb-2 text-lg text-slate-500">kg/m²</span>
                </p>
              </div>

              {active && (
                <span className="rounded-full bg-[#b52a2d]/10 px-5 py-3 text-base font-semibold text-[#b52a2d]">
                  {active.label}
                </span>
              )}
            </div>

            {/* colour bar */}
            <div className="mt-8">
              <div className="relative">
                <div className="flex h-4 overflow-hidden rounded-full">
                  {categories.map((c) => (
                    <span
                      key={c.label}
                      className="h-full flex-1"
                      style={{ backgroundColor: c.color }}
                    />
                  ))}
                </div>

                {bmi !== null && (
                  <span
                    className="absolute -top-1.5 h-7 w-2 -translate-x-1/2 rounded-full bg-slate-900 transition-all duration-500"
                    style={{ left: `${position * 100}%` }}
                  />
                )}
              </div>

              {/* scale labels */}
              <div className="mt-3 flex text-sm text-slate-500">
                {scaleLabels.map((l) => (
                  <span key={l} className="flex-1">
                    {l}
                  </span>
                ))}
              </div>
            </div>

            {/* legend */}
            <ul className="mt-8 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {categories.map((c, i) => (
                <li
                  key={c.label}
                  className={`flex items-center gap-3 rounded-full px-3 py-2.5 transition ${
                    i === activeIndex ? "bg-slate-100" : ""
                  }`}
                >
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  <span
                    className={`text-base ${
                      i === activeIndex ? "font-semibold text-slate-900" : "text-slate-800"
                    }`}
                  >
                    {c.label}
                  </span>
                  <span className="ml-auto text-sm text-slate-500">{c.range}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}