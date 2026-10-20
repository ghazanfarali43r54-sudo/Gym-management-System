"use client";

import { useEffect, useState, type ReactNode } from "react";
import AdminShell, { Icon, type IconName } from "@/components/admin/AdminShell";
import { api } from "@/lib/api";

/* ---------- types ---------- */

type Section = "general" | "businessHours" | "membership" | "notifications" | "payment";

type Day = { isOpen: boolean; open: string; close: string };

type Settings = {
  general: {
    gymName: string;
    tagline: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    currency: string;
    timezone: string;
  };
  businessHours: Record<string, Day>;
  membership: {
    joiningFee: number;
    gracePeriodDays: number;
    lateFee: number;
    allowFreeze: boolean;
    maxFreezeDays: number;
    autoExpire: boolean;
  };
  notifications: {
    newMemberAlert: boolean;
    paymentAlert: boolean;
    expiryReminder: boolean;
    expiryReminderDays: number;
  };
  payment: { methods: string[]; taxPercent: number; invoicePrefix: string };
};

/* ---------- constants ---------- */

const tabs: { key: Section; label: string; icon: IconName }[] = [
  { key: "general", label: "General", icon: "building" },
  { key: "businessHours", label: "Business Hours", icon: "schedule" },
  { key: "membership", label: "Membership Rules", icon: "plans" },
  { key: "notifications", label: "Notifications", icon: "bell" },
  { key: "payment", label: "Payment", icon: "payments" },
];

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const currencies = ["PKR", "USD", "AED", "SAR", "GBP"];
const timezones = ["Asia/Karachi", "Asia/Dubai", "Asia/Riyadh", "Europe/London", "America/New_York"];
const methodOptions = ["cash", "card", "bank", "jazzcash", "easypaisa"];

const generalFields: { key: keyof Settings["general"]; label: string; type?: string }[] = [
  { key: "gymName", label: "Gym Name" },
  { key: "tagline", label: "Tagline" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone", type: "tel" },
  { key: "address", label: "Address" },
  { key: "city", label: "City" },
];

const inputCls =
  "w-full rounded-xl bg-white px-4 py-3 text-sm text-[#800020] ring-1 ring-[#800020]/15 outline-none placeholder:text-[#800020]/35 focus:ring-2 focus:ring-[#800020] disabled:opacity-50";

/* ---------- small pieces ---------- */

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-[#800020]/55">{hint}</span>}
    </label>
  );
}

function NumberInput({
  value,
  onChange,
  min = 0,
  max,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}) {
  return (
    <input
      type="number"
      min={min}
      max={max}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(Number(e.target.value))}
      className={inputCls}
    />
  );
}

function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl bg-[#faf7f2] p-4 text-left ring-1 ring-[#800020]/10"
    >
      <span>
        <span className="block font-semibold">{label}</span>
        {hint && <span className="block text-xs text-[#800020]/60">{hint}</span>}
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-[#800020]" : "bg-[#800020]/20"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}

/* ---------- page ---------- */

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [tab, setTab] = useState<Section>("general");
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  async function load() {
    try {
      const data = await api("/api/settings");
      setSettings(data.settings);
      setLoadError("");
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Settings load nahi hui");
    }
  }

  useEffect(() => {
    // load() ko microtask me call kiya taake effect ke andar synchronously
    // setState na ho (react-hooks/set-state-in-effect rule)
    queueMicrotask(load);
  }, []);

  function update<S extends Section>(section: S, patch: Partial<Settings[S]>) {
    setSettings((s) => (s ? ({ ...s, [section]: { ...s[section], ...patch } } as Settings) : s));
  }

  async function save() {
    if (!settings) return;
    setSaving(true);
    setMsg(null);
    try {
      const data = await api(`/api/settings/${tab}`, {
        method: "PUT",
        body: JSON.stringify(settings[tab]),
      });
      setSettings(data.settings);
      setMsg({ type: "ok", text: "Settings save ho gayi." });
    } catch (e) {
      setMsg({ type: "error", text: e instanceof Error ? e.message : "Save nahi ho saki" });
    } finally {
      setSaving(false);
    }
  }

  function renderTab(s: Settings) {
    switch (tab) {
      case "general":
        return (
          <div className="grid gap-5 sm:grid-cols-2">
            {generalFields.map((f) => (
              <Field key={f.key} label={f.label}>
                <input
                  type={f.type || "text"}
                  value={s.general[f.key]}
                  onChange={(e) => update("general", { [f.key]: e.target.value })}
                  className={inputCls}
                />
              </Field>
            ))}
            <Field label="Currency">
              <select
                value={s.general.currency}
                onChange={(e) => update("general", { currency: e.target.value })}
                className={inputCls}
              >
                {currencies.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Timezone">
              <select
                value={s.general.timezone}
                onChange={(e) => update("general", { timezone: e.target.value })}
                className={inputCls}
              >
                {timezones.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
          </div>
        );

      case "businessHours":
        return (
          <div className="space-y-3">
            {days.map((d) => {
              const h = s.businessHours[d];
              const setDay = (patch: Partial<Day>) => update("businessHours", { [d]: { ...h, ...patch } });
              return (
                <div
                  key={d}
                  className="flex flex-wrap items-center gap-4 rounded-2xl bg-[#faf7f2] p-4 ring-1 ring-[#800020]/10"
                >
                  <span className="w-28 font-semibold capitalize">{d}</span>
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={h.isOpen}
                      onChange={(e) => setDay({ isOpen: e.target.checked })}
                      className="h-5 w-5 accent-[#800020]"
                    />
                    Open
                  </label>
                  <div className="ml-auto flex items-center gap-2">
                    <input
                      type="time"
                      value={h.open}
                      disabled={!h.isOpen}
                      onChange={(e) => setDay({ open: e.target.value })}
                      className={`${inputCls} !w-auto`}
                    />
                    <span className="text-sm">to</span>
                    <input
                      type="time"
                      value={h.close}
                      disabled={!h.isOpen}
                      onChange={(e) => setDay({ close: e.target.value })}
                      className={`${inputCls} !w-auto`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        );

      case "membership": {
        const m = s.membership;
        return (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Joining Fee">
                <NumberInput value={m.joiningFee} onChange={(v) => update("membership", { joiningFee: v })} />
              </Field>
              <Field label="Late Fee">
                <NumberInput value={m.lateFee} onChange={(v) => update("membership", { lateFee: v })} />
              </Field>
              <Field label="Grace Period (days)" hint="Zyada se zyada 30 din">
                <NumberInput
                  max={30}
                  value={m.gracePeriodDays}
                  onChange={(v) => update("membership", { gracePeriodDays: v })}
                />
              </Field>
              <Field label="Max Freeze Days">
                <NumberInput
                  value={m.maxFreezeDays}
                  disabled={!m.allowFreeze}
                  onChange={(v) => update("membership", { maxFreezeDays: v })}
                />
              </Field>
            </div>
            <Toggle
              label="Allow Membership Freeze"
              hint="Members apni membership kuch din ke liye rok sakte hain"
              checked={m.allowFreeze}
              onChange={(v) => update("membership", { allowFreeze: v })}
            />
            <Toggle
              label="Auto Expire"
              hint="Membership ki date khatam hote hi khud expire ho jaye"
              checked={m.autoExpire}
              onChange={(v) => update("membership", { autoExpire: v })}
            />
          </div>
        );
      }

      case "notifications": {
        const n = s.notifications;
        return (
          <div className="space-y-4">
            <Toggle
              label="New Member Alert"
              hint="Naya member judne par alert"
              checked={n.newMemberAlert}
              onChange={(v) => update("notifications", { newMemberAlert: v })}
            />
            <Toggle
              label="Payment Alert"
              hint="Payment milne par alert"
              checked={n.paymentAlert}
              onChange={(v) => update("notifications", { paymentAlert: v })}
            />
            <Toggle
              label="Expiry Reminder"
              hint="Membership khatam hone se pehle yaad dihani"
              checked={n.expiryReminder}
              onChange={(v) => update("notifications", { expiryReminder: v })}
            />
            <div className="max-w-xs">
              <Field label="Reminder kitne din pehle">
                <NumberInput
                  value={n.expiryReminderDays}
                  disabled={!n.expiryReminder}
                  onChange={(v) => update("notifications", { expiryReminderDays: v })}
                />
              </Field>
            </div>
          </div>
        );
      }

      case "payment": {
        const p = s.payment;
        const toggleMethod = (m: string) =>
          update("payment", {
            methods: p.methods.includes(m) ? p.methods.filter((x) => x !== m) : [...p.methods, m],
          });
        return (
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-semibold">Payment Methods</p>
              <div className="flex flex-wrap gap-3">
                {methodOptions.map((m) => {
                  const on = p.methods.includes(m);
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => toggleMethod(m)}
                      className={`rounded-xl px-4 py-2.5 text-sm font-semibold capitalize ring-1 transition ${
                        on
                          ? "bg-[#800020] text-white ring-[#800020]"
                          : "bg-white text-[#800020] ring-[#800020]/20 hover:bg-[#800020]/5"
                      }`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Tax (%)">
                <NumberInput
                  max={100}
                  value={p.taxPercent}
                  onChange={(v) => update("payment", { taxPercent: v })}
                />
              </Field>
              <Field label="Invoice Prefix">
                <input
                  value={p.invoicePrefix}
                  onChange={(e) => update("payment", { invoicePrefix: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </div>
          </div>
        );
      }
    }
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* header */}
        <section className="rounded-3xl bg-gradient-to-br from-white to-[#f8ece8] p-6 shadow-[0_2px_16px_rgba(128,0,32,0.06)] ring-1 ring-[#800020]/5">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#800020] text-white shadow-lg shadow-[#800020]/25">
              <Icon name="settings" className="h-6 w-6" />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#800020]/60">System</p>
              <h1 className="text-2xl font-extrabold sm:text-3xl">Settings</h1>
              <p className="text-sm text-[#800020]/65">Gym ki information, timing, rules aur payment yahan se badlo.</p>
            </div>
          </div>
        </section>

        {loadError && (
          <div className="rounded-2xl bg-rose-50 p-5 text-sm font-medium text-rose-700">
            {loadError}{" "}
            <button onClick={load} className="font-bold underline">
              Dobara koshish karo
            </button>
          </div>
        )}

        {!settings && !loadError && <p className="text-sm text-[#800020]/60">Loading...</p>}

        {settings && (
          <>
            {/* tabs */}
            <div className="flex gap-2 overflow-x-auto rounded-2xl bg-white p-2 shadow-sm ring-1 ring-[#800020]/10">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => {
                    setTab(t.key);
                    setMsg(null);
                  }}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    tab === t.key ? "bg-[#800020] text-white shadow" : "text-[#800020] hover:bg-[#800020]/10"
                  }`}
                >
                  <Icon name={t.icon} className="h-4 w-4" />
                  {t.label}
                </button>
              ))}
            </div>

            {/* form */}
            <section className="rounded-3xl bg-white p-6 shadow-[0_2px_16px_rgba(128,0,32,0.06)] ring-1 ring-[#800020]/5">
              {renderTab(settings)}

              {msg && (
                <p
                  className={`mt-6 rounded-xl px-4 py-3 text-sm font-medium ${
                    msg.type === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {msg.text}
                </p>
              )}

              <div className="mt-6 flex justify-end border-t border-[#800020]/10 pt-6">
                <button
                  onClick={save}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[#800020] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-[#800020]/30 transition hover:bg-[#5e0018] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Icon name="check" className="h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </AdminShell>
  );
}