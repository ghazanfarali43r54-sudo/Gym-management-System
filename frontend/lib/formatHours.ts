import type { DayKey, Day } from "@/lib/SettingsContext";

const DAYS: DayKey[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const SHORT: Record<DayKey, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

// "14:30" -> "2:30 PM"
function to12h(t: string) {
  if (!t || typeof t !== "string" || !t.includes(":")) return "";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

// Format a single day's hours based on morning/evening sessions
function formatDay(day: Day): string {
  if (!day.isOpen) return "Closed";

  const parts: string[] = [];

  if (day.morning?.enabled) {
    parts.push(`${to12h(day.morning.open)} – ${to12h(day.morning.close)}`);
  }

  if (day.evening?.enabled) {
    parts.push(`${to12h(day.evening.open)} – ${to12h(day.evening.close)}`);
  }

  if (parts.length === 0) return "Closed";

  return parts.join(", ");
}

// Lagatar din jin ka waqt same ho unhe ek line me jod deta hai:
// [{ days: "Mon – Fri", time: "6:00 AM – 8:30 AM, 2:00 PM – 11:00 PM" }, { days: "Sun", time: "Closed" }]
export function formatHours(hours: Record<DayKey, Day>) {
  const rows: { start: DayKey; end: DayKey; time: string }[] = [];

  for (const d of DAYS) {
    const h = hours[d];
    const time = formatDay(h);
    const last = rows[rows.length - 1];
    if (last && last.time === time) last.end = d;
    else rows.push({ start: d, end: d, time });
  }

  return rows.map((r) => ({
    days: r.start === r.end ? SHORT[r.start] : `${SHORT[r.start]} – ${SHORT[r.end]}`,
    time: r.time,
  }));
}
