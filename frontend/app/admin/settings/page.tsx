"use client";

import { useEffect, useState, type ReactNode } from "react";
import AdminShell, {
  Icon,
  type IconName,
} from "@/components/admin/AdminShell";
import { apiFetch } from "@/lib/api";

/* ================= TYPES ================= */

type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

type TimeSession = {
  enabled: boolean;
  open: string;
  close: string;
};

type Day = {
  isOpen: boolean;

  morning: TimeSession;

  evening: TimeSession;
};

type SettingsData = {
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

  businessHours: Record<DayKey, Day>;

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

  payment: {
    methods: string[];
    taxPercent: number;
    invoicePrefix: string;
  };
};

type SectionKey = keyof SettingsData;

/* ================= STATIC DATA ================= */

const tabs: {
  key: SectionKey;
  label: string;
  desc: string;
  icon: IconName;
}[] = [
  {
    key: "general",
    label: "General",
    desc: "Gym profile & contact",
    icon: "building",
  },
  {
    key: "businessHours",
    label: "Business Hours",
    desc: "Morning & evening timings",
    icon: "schedule",
  },
  {
    key: "membership",
    label: "Membership Rules",
    desc: "Fees, grace & freeze",
    icon: "plans",
  },
  {
    key: "notifications",
    label: "Notifications",
    desc: "Alerts & reminders",
    icon: "bell",
  },
  {
    key: "payment",
    label: "Payment",
    desc: "Methods, tax & invoices",
    icon: "payments",
  },
];

const days: {
  key: DayKey;
  label: string;
}[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

const currencies = [
  "PKR",
  "USD",
  "AED",
  "SAR",
  "GBP",
];

const timezones = [
  "Asia/Karachi",
  "Asia/Dubai",
  "Asia/Riyadh",
  "Europe/London",
  "America/New_York",
];

const paymentMethods: {
  key: string;
  label: string;
}[] = [
  {
    key: "cash",
    label: "Cash",
  },
  {
    key: "jazzcash",
    label: "JazzCash",
  },
  {
    key: "easypaisa",
    label: "Easypaisa",
  },
  {
    key: "bank_transfer",
    label: "Bank Transfer",
  },
  {
    key: "card",
    label: "Card",
  },
];

/* ================= SMALL FORM PIECES ================= */

const inputCls =
  "w-full rounded-xl bg-white px-4 py-3 text-sm text-[#800020] ring-1 ring-[#800020]/15 outline-none transition placeholder:text-[#800020]/35 focus:ring-2 focus:ring-[#800020] disabled:cursor-not-allowed disabled:opacity-50";

function Field({
  label,
  hint,
  className = "",
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-bold text-[#800020]">
        {label}
      </span>

      {children}

      {hint && (
        <span className="mt-1.5 block text-xs text-[#800020]/55">
          {hint}
        </span>
      )}
    </label>
  );
}

function NumInput({
  value,
  onChange,
  disabled,
  min = 0,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
}) {
  return (
    <input
      type="number"
      min={min}
      max={max}
      disabled={disabled}
      value={Number.isNaN(value) ? "" : value}
      onChange={(e) =>
        onChange(
          e.target.value === ""
            ? 0
            : Number(e.target.value)
        )
      }
      className={inputCls}
    />
  );
}

function Toggle({
  checked,
  onChange,
  title,
  desc,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  title: string;
  desc?: string;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-2xl bg-[#faf7f2] p-4 ring-1 ring-[#800020]/10 ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <div>
        <p className="text-sm font-bold text-[#800020]">
          {title}
        </p>

        {desc && (
          <p className="text-xs text-[#800020]/60">
            {desc}
          </p>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          checked
            ? "bg-[#800020]"
            : "bg-[#800020]/20"
        }`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${
            checked
              ? "left-[22px]"
              : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

/* ================= GENERAL ================= */

function GeneralForm({
  data,
  set,
}: {
  data: SettingsData["general"];
  set: (
    v: Partial<SettingsData["general"]>
  ) => void;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Gym name">
        <input
          className={inputCls}
          value={data.gymName}
          onChange={(e) =>
            set({
              gymName: e.target.value,
            })
          }
        />
      </Field>

      <Field label="Tagline">
        <input
          className={inputCls}
          value={data.tagline}
          onChange={(e) =>
            set({
              tagline: e.target.value,
            })
          }
        />
      </Field>

      <Field label="Email">
        <input
          type="email"
          className={inputCls}
          placeholder="info@yourgym.com"
          value={data.email}
          onChange={(e) =>
            set({
              email: e.target.value,
            })
          }
        />
      </Field>

      <Field label="Phone">
        <input
          className={inputCls}
          placeholder="+92 300 1234567"
          value={data.phone}
          onChange={(e) =>
            set({
              phone: e.target.value,
            })
          }
        />
      </Field>

      <Field label="City">
        <input
          className={inputCls}
          value={data.city}
          onChange={(e) =>
            set({
              city: e.target.value,
            })
          }
        />
      </Field>

      <Field label="Currency">
        <select
          className={inputCls}
          value={data.currency}
          onChange={(e) =>
            set({
              currency: e.target.value,
            })
          }
        >
          {currencies.map((c) => (
            <option
              key={c}
              value={c}
            >
              {c}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Timezone">
        <select
          className={inputCls}
          value={data.timezone}
          onChange={(e) =>
            set({
              timezone: e.target.value,
            })
          }
        >
          {timezones.map((t) => (
            <option
              key={t}
              value={t}
            >
              {t}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Address"
        className="sm:col-span-2"
      >
        <textarea
          rows={3}
          className={inputCls}
          placeholder="Street, area"
          value={data.address}
          onChange={(e) =>
            set({
              address: e.target.value,
            })
          }
        />
      </Field>
    </div>
  );
}

/* ================= BUSINESS HOURS ================= */

function HoursForm({
  data,
  set,
}: {
  data: SettingsData["businessHours"];
  set: (
    v: Partial<SettingsData["businessHours"]>
  ) => void;
}) {
  function setDay(
    key: DayKey,
    values: Partial<Day>
  ) {
    set({
      [key]: {
        ...data[key],
        ...values,
      },
    } as Partial<SettingsData["businessHours"]>);
  }

  function setSession(
    dayKey: DayKey,
    sessionKey: "morning" | "evening",
    values: Partial<TimeSession>
  ) {
    const currentDay = data[dayKey];

    setDay(dayKey, {
      [sessionKey]: {
        ...currentDay[sessionKey],
        ...values,
      },
    } as Partial<Day>);
  }

  return (
    <div className="space-y-4">
      {/* Information */}
      <div className="rounded-2xl bg-[#800020]/5 p-4 ring-1 ring-[#800020]/10">
        <p className="text-sm font-bold text-[#800020]">
          Gym Sessions
        </p>

        <p className="mt-1 text-xs leading-5 text-[#800020]/65">
          Har din ke liye morning aur evening
          timings alag set kar sakte hain.
          Kisi session ko band karna ho to uska
          switch off kar dein.
        </p>
      </div>

      {days.map((d) => {
        const day = data[d.key];

        return (
          <div
            key={d.key}
            className="overflow-hidden rounded-2xl bg-[#faf7f2] ring-1 ring-[#800020]/10"
          >
            {/* Day Header */}

            <div className="flex flex-wrap items-center gap-4 border-b border-[#800020]/10 p-4">
              <button
                type="button"
                role="switch"
                aria-checked={day.isOpen}
                onClick={() =>
                  setDay(d.key, {
                    isOpen: !day.isOpen,
                  })
                }
                className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                  day.isOpen
                    ? "bg-[#800020]"
                    : "bg-[#800020]/20"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${
                    day.isOpen
                      ? "left-[22px]"
                      : "left-0.5"
                  }`}
                />
              </button>

              <div>
                <p className="text-sm font-bold text-[#800020]">
                  {d.label}
                </p>

                <p className="text-xs text-[#800020]/55">
                  {day.isOpen
                    ? "Gym open"
                    : "Gym closed"}
                </p>
              </div>

              <span
                className={`ml-auto rounded-full px-3 py-1 text-xs font-bold ${
                  day.isOpen
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-[#800020]/10 text-[#800020]"
                }`}
              >
                {day.isOpen
                  ? "Open"
                  : "Closed"}
              </span>
            </div>

            {/* Sessions */}

            {day.isOpen && (
              <div className="grid gap-3 p-4 xl:grid-cols-2">
                {/* Morning */}

                <div
                  className={`rounded-2xl bg-white p-4 ring-1 transition ${
                    day.morning.enabled
                      ? "ring-[#800020]/15"
                      : "opacity-60 ring-[#800020]/5"
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-[#800020]">
                        Morning
                      </p>

                      <p className="text-xs text-[#800020]/55">
                        Morning session
                      </p>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={
                        day.morning.enabled
                      }
                      onClick={() =>
                        setSession(
                          d.key,
                          "morning",
                          {
                            enabled:
                              !day.morning
                                .enabled,
                          }
                        )
                      }
                      className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                        day.morning.enabled
                          ? "bg-[#800020]"
                          : "bg-[#800020]/20"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${
                          day.morning.enabled
                            ? "left-[22px]"
                            : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="time"
                      disabled={
                        !day.morning.enabled
                      }
                      value={day.morning.open}
                      onChange={(e) =>
                        setSession(
                          d.key,
                          "morning",
                          {
                            open: e.target.value,
                          }
                        )
                      }
                      className={`${inputCls} min-w-[130px] flex-1`}
                    />

                    <span className="text-xs font-semibold text-[#800020]/50">
                      to
                    </span>

                    <input
                      type="time"
                      disabled={
                        !day.morning.enabled
                      }
                      value={day.morning.close}
                      onChange={(e) =>
                        setSession(
                          d.key,
                          "morning",
                          {
                            close:
                              e.target.value,
                          }
                        )
                      }
                      className={`${inputCls} min-w-[130px] flex-1`}
                    />
                  </div>
                </div>

                {/* Evening */}

                <div
                  className={`rounded-2xl bg-white p-4 ring-1 transition ${
                    day.evening.enabled
                      ? "ring-[#800020]/15"
                      : "opacity-60 ring-[#800020]/5"
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-[#800020]">
                        Evening
                      </p>

                      <p className="text-xs text-[#800020]/55">
                        Evening session
                      </p>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={
                        day.evening.enabled
                      }
                      onClick={() =>
                        setSession(
                          d.key,
                          "evening",
                          {
                            enabled:
                              !day.evening
                                .enabled,
                          }
                        )
                      }
                      className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                        day.evening.enabled
                          ? "bg-[#800020]"
                          : "bg-[#800020]/20"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${
                          day.evening.enabled
                            ? "left-[22px]"
                            : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="time"
                      disabled={
                        !day.evening.enabled
                      }
                      value={day.evening.open}
                      onChange={(e) =>
                        setSession(
                          d.key,
                          "evening",
                          {
                            open: e.target.value,
                          }
                        )
                      }
                      className={`${inputCls} min-w-[130px] flex-1`}
                    />

                    <span className="text-xs font-semibold text-[#800020]/50">
                      to
                    </span>

                    <input
                      type="time"
                      disabled={
                        !day.evening.enabled
                      }
                      value={day.evening.close}
                      onChange={(e) =>
                        setSession(
                          d.key,
                          "evening",
                          {
                            close:
                              e.target.value,
                          }
                        )
                      }
                      className={`${inputCls} min-w-[130px] flex-1`}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ================= MEMBERSHIP ================= */

function MembershipForm({
  data,
  set,
  currency,
}: {
  data: SettingsData["membership"];
  set: (
    v: Partial<SettingsData["membership"]>
  ) => void;
  currency: string;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label={`Joining fee (${currency})`}
          hint="Naye member se ek baar liya jata hai"
        >
          <NumInput
            value={data.joiningFee}
            onChange={(v) =>
              set({
                joiningFee: v,
              })
            }
          />
        </Field>

        <Field
          label={`Late fee (${currency})`}
          hint="Grace period ke baad lagne wali fee"
        >
          <NumInput
            value={data.lateFee}
            onChange={(v) =>
              set({
                lateFee: v,
              })
            }
          />
        </Field>

        <Field
          label="Grace period (days)"
          hint="0 se 30 din"
        >
          <NumInput
            value={data.gracePeriodDays}
            max={30}
            onChange={(v) =>
              set({
                gracePeriodDays: v,
              })
            }
          />
        </Field>

        <Field
          label="Max freeze days"
          hint="Freeze allowed ho tabhi kaam karta hai"
        >
          <NumInput
            value={data.maxFreezeDays}
            max={365}
            disabled={!data.allowFreeze}
            onChange={(v) =>
              set({
                maxFreezeDays: v,
              })
            }
          />
        </Field>
      </div>

      <div className="space-y-3">
        <Toggle
          title="Allow membership freeze"
          desc="Member apni membership kuch din ke liye rok sakta hai"
          checked={data.allowFreeze}
          onChange={(v) =>
            set({
              allowFreeze: v,
            })
          }
        />

        <Toggle
          title="Auto-expire memberships"
          desc="Grace period khatam hote hi membership apne aap expire ho jaye"
          checked={data.autoExpire}
          onChange={(v) =>
            set({
              autoExpire: v,
            })
          }
        />
      </div>
    </div>
  );
}

/* ================= NOTIFICATIONS ================= */

function NotificationsForm({
  data,
  set,
}: {
  data: SettingsData["notifications"];
  set: (
    v: Partial<
      SettingsData["notifications"]
    >
  ) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Toggle
          title="New member alert"
          desc="Naya member judne par notification"
          checked={data.newMemberAlert}
          onChange={(v) =>
            set({
              newMemberAlert: v,
            })
          }
        />

        <Toggle
          title="Payment alert"
          desc="Payment milne par notification"
          checked={data.paymentAlert}
          onChange={(v) =>
            set({
              paymentAlert: v,
            })
          }
        />

        <Toggle
          title="Expiry reminder"
          desc="Membership khatam hone se pehle yaad dilana"
          checked={data.expiryReminder}
          onChange={(v) =>
            set({
              expiryReminder: v,
            })
          }
        />
      </div>

      <Field
        label="Remind before (days)"
        hint="1 se 60 din"
        className="max-w-xs"
      >
        <NumInput
          value={data.expiryReminderDays}
          min={1}
          max={60}
          disabled={!data.expiryReminder}
          onChange={(v) =>
            set({
              expiryReminderDays: v,
            })
          }
        />
      </Field>
    </div>
  );
}

/* ================= PAYMENT ================= */

function PaymentForm({
  data,
  set,
}: {
  data: SettingsData["payment"];
  set: (
    v: Partial<SettingsData["payment"]>
  ) => void;
}) {
  function toggleMethod(key: string) {
    const has = data.methods.includes(key);

    set({
      methods: has
        ? data.methods.filter(
            (m) => m !== key
          )
        : [...data.methods, key],
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-sm font-bold text-[#800020]">
          Accepted payment methods
        </p>

        <div className="flex flex-wrap gap-3">
          {paymentMethods.map((m) => {
            const on =
              data.methods.includes(m.key);

            return (
              <button
                key={m.key}
                type="button"
                onClick={() =>
                  toggleMethod(m.key)
                }
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  on
                    ? "bg-[#800020] text-white shadow-md shadow-[#800020]/25"
                    : "bg-[#faf7f2] text-[#800020] ring-1 ring-[#800020]/15 hover:bg-[#800020]/10"
                }`}
              >
                {on && (
                  <Icon
                    name="check"
                    className="h-4 w-4"
                  />
                )}

                {m.label}
              </button>
            );
          })}
        </div>

        {data.methods.length === 0 && (
          <p className="mt-2 text-xs font-semibold text-rose-700">
            Kam az kam ek payment method
            chuno.
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Tax (%)"
          hint="0 se 100"
        >
          <NumInput
            value={data.taxPercent}
            max={100}
            onChange={(v) =>
              set({
                taxPercent: v,
              })
            }
          />
        </Field>

        <Field
          label="Invoice prefix"
          hint="Jaise INV-0001 me INV (max 10 letters)"
        >
          <input
            className={inputCls}
            maxLength={10}
            value={data.invoicePrefix}
            onChange={(e) =>
              set({
                invoicePrefix:
                  e.target.value.toUpperCase(),
              })
            }
          />
        </Field>
      </div>
    </div>
  );
}

/* ================= PAGE ================= */

export default function SettingsPage() {
  const [settings, setSettings] =
    useState<SettingsData | null>(null);

  const [draft, setDraft] =
    useState<SettingsData | null>(null);

  const [active, setActive] =
    useState<SectionKey>("general");

  const [loading, setLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [notice, setNotice] =
    useState<{
      type: "success" | "error";
      text: string;
    } | null>(null);

  /* ================= LOAD ================= */

  async function load() {
    setLoading(true);
    setLoadError("");

    try {
      const { ok, data } =
        await apiFetch("/api/settings");

      if (!ok) {
        setLoadError(
          data.message ||
            "Settings load nahi ho sakin"
        );

        return;
      }

      setSettings(data.settings);
      setDraft(data.settings);
    } catch {
      setLoadError(
        "Server se connect nahi ho paya."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================= NOTICE ================= */

  function notify(
    type: "success" | "error",
    text: string
  ) {
    setNotice({
      type,
      text,
    });

    setTimeout(
      () => setNotice(null),
      3500
    );
  }

  /* ================= PATCH ================= */

  function patch<K extends SectionKey>(
    section: K,
    values: Partial<SettingsData[K]>
  ) {
    setDraft((d) =>
      d
        ? ({
            ...d,

            [section]: {
              ...d[section],
              ...values,
            },
          } as SettingsData)
        : d
    );
  }

  /* ================= DIRTY ================= */

  function isDirty(
    section: SectionKey
  ) {
    if (!settings || !draft) {
      return false;
    }

    return (
      JSON.stringify(settings[section]) !==
      JSON.stringify(draft[section])
    );
  }

  /* ================= RESET ================= */

  function reset() {
    if (!settings) return;

    setDraft((d) =>
      d
        ? ({
            ...d,

            [active]:
              settings[active],
          } as SettingsData)
        : d
    );
  }

  /* ================= SAVE ================= */

  async function save() {
    if (!draft) return;

    /* Payment validation */

    if (
      active === "payment" &&
      draft.payment.methods.length === 0
    ) {
      notify(
        "error",
        "Kam az kam ek payment method chuno."
      );

      return;
    }

    /* Business hours frontend validation */

    if (active === "businessHours") {
      for (const item of days) {
        const day =
          draft.businessHours[item.key];

        if (!day.isOpen) {
          continue;
        }

        if (
          !day.morning.enabled &&
          !day.evening.enabled
        ) {
          notify(
            "error",
            `${item.label}: kam az kam ek session enable karein.`
          );

          return;
        }

        if (
          day.morning.enabled &&
          day.morning.open >=
            day.morning.close
        ) {
          notify(
            "error",
            `${item.label}: morning closing time opening time ke baad hona chahiye.`
          );

          return;
        }

        if (
          day.evening.enabled &&
          day.evening.open >=
            day.evening.close
        ) {
          notify(
            "error",
            `${item.label}: evening closing time opening time ke baad hona chahiye.`
          );

          return;
        }

        if (
          day.morning.enabled &&
          day.evening.enabled
        ) {
          const overlap =
            day.morning.open <
              day.evening.close &&
            day.evening.open <
              day.morning.close;

          if (overlap) {
            notify(
              "error",
              `${item.label}: morning aur evening timings overlap nahi kar sakti.`
            );

            return;
          }
        }
      }
    }

    setSaving(true);

    try {
      const { ok, data } =
        await apiFetch(
          `/api/settings/${active}`,
          {
            method: "PUT",

            body: JSON.stringify(
              draft[active]
            ),
          }
        );

      if (!ok) {
        notify(
          "error",
          data.message ||
            "Save nahi ho saka"
        );

        return;
      }

      setSettings(data.settings);

      setDraft((d) =>
        d
          ? ({
              ...d,

              [active]:
                data.settings[active],
            } as SettingsData)
          : d
      );

      notify(
        "success",
        "Settings saved successfully"
      );
    } catch {
      notify(
        "error",
        "Server se connect nahi ho paya."
      );
    } finally {
      setSaving(false);
    }
  }

  const activeTab =
    tabs.find(
      (t) => t.key === active
    )!;

  const dirty =
    isDirty(active);

  /* ================= UI ================= */

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* HEADER */}

        <section className="rounded-3xl bg-gradient-to-br from-white to-[#f8ece8] p-5 shadow-[0_2px_16px_rgba(128,0,32,0.06)] ring-1 ring-[#800020]/5 sm:p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#800020] text-white shadow-lg shadow-[#800020]/25">
              <Icon
                name="settings"
                className="h-6 w-6"
              />
            </span>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#800020]/60">
                System
              </p>

              <h1 className="text-2xl font-extrabold text-[#800020] sm:text-3xl">
                Settings
              </h1>

              <p className="text-sm text-[#800020]/65">
                Apne gym ki profile,
                business hours, rules,
                alerts aur payments yahan
                se manage karo.
              </p>
            </div>
          </div>
        </section>

        {/* LOADING */}

        {loading && (
          <div className="flex items-center justify-center gap-3 rounded-3xl bg-white p-12 text-[#800020] ring-1 ring-[#800020]/5">
            <span className="h-6 w-6 animate-spin rounded-full border-[3px] border-[#800020]/20 border-t-[#800020]" />

            <span className="text-sm font-semibold">
              Loading settings...
            </span>
          </div>
        )}

        {/* ERROR */}

        {!loading && loadError && (
          <div className="rounded-3xl bg-white p-10 text-center ring-1 ring-[#800020]/5">
            <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#800020]/10 text-[#800020]">
              <Icon name="alert" />
            </span>

            <p className="font-bold text-[#800020]">
              {loadError}
            </p>

            <button
              onClick={load}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#800020] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#5e0018]"
            >
              <Icon
                name="refresh"
                className="h-4 w-4"
              />

              Try again
            </button>
          </div>
        )}

        {/* CONTENT */}

        {!loading &&
          !loadError &&
          draft && (
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              {/* TABS */}

              <nav className="flex gap-2 overflow-x-auto rounded-3xl bg-white p-3 shadow-[0_2px_16px_rgba(128,0,32,0.06)] ring-1 ring-[#800020]/5 lg:flex-col lg:overflow-visible">
                {tabs.map((t) => {
                  const on =
                    t.key === active;

                  return (
                    <button
                      key={t.key}
                      onClick={() =>
                        setActive(t.key)
                      }
                      className={`flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                        on
                          ? "bg-[#800020] text-white shadow-md shadow-[#800020]/25"
                          : "text-[#800020] hover:bg-[#800020]/10"
                      }`}
                    >
                      <Icon
                        name={t.icon}
                        className="h-5 w-5 shrink-0"
                      />

                      <span className="min-w-0">
                        <span className="block whitespace-nowrap text-sm font-bold">
                          {t.label}
                        </span>

                        <span
                          className={`hidden text-xs lg:block ${
                            on
                              ? "text-white/75"
                              : "text-[#800020]/55"
                          }`}
                        >
                          {t.desc}
                        </span>
                      </span>

                      {isDirty(
                        t.key
                      ) && (
                        <span
                          title="Unsaved changes"
                          className={`ml-auto h-2.5 w-2.5 shrink-0 rounded-full ${
                            on
                              ? "bg-white"
                              : "bg-[#c0405a]"
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* FORM CARD */}

              <section className="rounded-3xl bg-white p-5 shadow-[0_2px_16px_rgba(128,0,32,0.06)] ring-1 ring-[#800020]/5 sm:p-6">
                {/* FORM HEADER */}

                <div className="mb-6 flex items-center gap-3.5 border-b border-[#800020]/10 pb-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#800020]/10 text-[#800020]">
                    <Icon
                      name={
                        activeTab.icon
                      }
                    />
                  </span>

                  <div>
                    <h2 className="text-lg font-bold text-[#800020]">
                      {
                        activeTab.label
                      }
                    </h2>

                    <p className="text-sm text-[#800020]/60">
                      {
                        activeTab.desc
                      }
                    </p>
                  </div>
                </div>

                {/* NOTICE */}

                {notice && (
                  <div
                    className={`mb-5 flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-semibold ${
                      notice.type ===
                      "success"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    <Icon
                      name={
                        notice.type ===
                        "success"
                          ? "check"
                          : "alert"
                      }
                      className="h-[18px] w-[18px]"
                    />

                    {notice.text}
                  </div>
                )}

                {/* GENERAL */}

                {active ===
                  "general" && (
                  <GeneralForm
                    data={
                      draft.general
                    }
                    set={(v) =>
                      patch(
                        "general",
                        v
                      )
                    }
                  />
                )}

                {/* BUSINESS HOURS */}

                {active ===
                  "businessHours" && (
                  <HoursForm
                    data={
                      draft.businessHours
                    }
                    set={(v) =>
                      patch(
                        "businessHours",
                        v
                      )
                    }
                  />
                )}

                {/* MEMBERSHIP */}

                {active ===
                  "membership" && (
                  <MembershipForm
                    data={
                      draft.membership
                    }
                    currency={
                      draft.general
                        .currency
                    }
                    set={(v) =>
                      patch(
                        "membership",
                        v
                      )
                    }
                  />
                )}

                {/* NOTIFICATIONS */}

                {active ===
                  "notifications" && (
                  <NotificationsForm
                    data={
                      draft.notifications
                    }
                    set={(v) =>
                      patch(
                        "notifications",
                        v
                      )
                    }
                  />
                )}

                {/* PAYMENT */}

                {active ===
                  "payment" && (
                  <PaymentForm
                    data={
                      draft.payment
                    }
                    set={(v) =>
                      patch(
                        "payment",
                        v
                      )
                    }
                  />
                )}

                {/* BUTTONS */}

                <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-[#800020]/10 pt-5">
                  {dirty && (
                    <span className="mr-auto text-xs font-semibold text-[#c0405a]">
                      Unsaved changes
                    </span>
                  )}

                  <button
                    onClick={reset}
                    disabled={
                      !dirty ||
                      saving
                    }
                    className="rounded-xl px-5 py-3 text-sm font-semibold text-[#800020] ring-1 ring-[#800020]/20 transition hover:bg-[#800020]/5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Reset
                  </button>

                  <button
                    onClick={save}
                    disabled={
                      !dirty ||
                      saving
                    }
                    className="flex items-center gap-2 rounded-xl bg-[#800020] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#800020]/25 transition hover:bg-[#5e0018] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Icon
                      name="save"
                      className="h-[18px] w-[18px]"
                    />

                    {saving
                      ? "Saving..."
                      : "Save changes"}
                  </button>
                </div>
              </section>
            </div>
          )}
      </div>
    </AdminShell>
  );
}