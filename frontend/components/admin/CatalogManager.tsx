"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Icon } from "@/components/admin/AdminShell";
import { apiFetch } from "@/lib/api";
import { isValidPersonName, phoneError } from "@/lib/formValidation";

type Item = {
  _id: string;
  name: string;
  isActive: boolean;
  city?: string;
  phone?: string;
  address?: string;
  price?: number;
  durationDays?: number;
  description?: string;
};

type Field = {
  key: string;
  label: string;
  required?: boolean;
  number?: boolean;
  wide?: boolean;
  placeholder?: string;
};

const inputCls =
  "w-full rounded-xl bg-white px-4 py-3 text-sm text-[#800020] ring-1 ring-[#800020]/15 outline-none transition placeholder:text-[#800020]/35 focus:ring-2 focus:ring-[#800020]";

export default function AdminListManager({ kind }: { kind: Kind }) {
  const cfg = config[kind];

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [editing, setEditing] = useState<Item | "new" | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { ok, data } = await apiFetch(`/api/admin/${kind}`);
      if (!ok) {
        setError(data.message || "connot loaded");
        return;
      }
      setItems(data.items);
    } catch {
      setError("cannot connected to server.");
    } finally {
      setLoading(false);
    }
  }, [kind]);

  useEffect(() => {
    load();
  }, [load]);

  function notify(type: "success" | "error", text: string) {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 3500);
  }

  function openForm(item: Item | "new") {
    const values: Record<string, string> = {};
    cfg.fields.forEach((f) => {
      values[f.key] =
        item === "new"
          ? ""
          : String((item as unknown as Record<string, unknown>)[f.key] ?? "");
    });
    setForm(values);
    setFormError("");
    setEditing(item);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFormError("");

    // chhoti si jaanch (asli jaanch server par bhi hoti hai)
    const body: Record<string, string | number> = {};
    for (const f of cfg.fields) {
      const v = (form[f.key] ?? "").trim();
      if (f.required && !v) return setFormError(`${f.label} likho`);
      if (f.key === "name" && !isValidPersonName(v)) {
        return setFormError(
          `${f.label} must contain a valid name using letters, spaces, apostrophes, or hyphens.`
        );
      }
      if (f.key === "phone") {
        const validationError = phoneError(v, false);
        if (validationError) return setFormError(validationError);
      }
      if (f.number) {
        const n = Number(v);
        if (
          v === "" ||
          !Number.isFinite(n) ||
          n < 0 ||
          !/^\d+(\.\d+)?$/.test(v)
        )
          return setFormError(`${f.label} must be a correct positive number`);
        if (f.key === "durationDays" && (!Number.isInteger(n) || n < 1))
          return setFormError(
            "Duration must be a whole number of at least 1 day"
          );
        body[f.key] = n;
      } else {
        body[f.key] = v;
      }
    }

    setSaving(true);
    try {
      const isNew = editing === "new";
      const { ok, data } = await apiFetch(
        isNew
          ? `/api/admin/${kind}`
          : `/api/admin/${kind}/${(editing as Item)._id}`,
        {
          method: isNew ? "POST" : "PUT",
          body: JSON.stringify(body),
        }
      );
      if (!ok) {
        setFormError(data.message || "Save nahi ho saka");
        return;
      }
      setEditing(null);
      notify("success", data.message || "Saved");
      await load();
    } catch {
      setFormError("Server se connect nahi ho paya.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(item: Item) {
    const { ok, data } = await apiFetch(`/api/admin/${kind}/${item._id}`, {
      method: "PUT",
      body: JSON.stringify({ isActive: !item.isActive }),
    });
    notify(
      ok ? "success" : "error",
      ok
        ? `${item.name} ${item.isActive ? "deactivated" : "activated"}`
        : data.message
    );
    if (ok) load();
  }

  async function remove(item: Item) {
    setConfirmId("");
    const { ok, data } = await apiFetch(`/api/admin/${kind}/${item._id}`, {
      method: "DELETE",
    });
    notify(
      ok ? "success" : "error",
      data.message || (ok ? "Deleted" : "Cannot Deleted")
    );
    if (ok) load();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#800020]/70">
          Only Active {cfg.label.toLowerCase()}s can be show here :{" "}
          <b>{items.length}</b>
        </p>
        <button
          onClick={() => openForm("new")}
          className="rounded-xl bg-[#800020] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#800020]/25 transition hover:bg-[#5e0018]"
        >
          + Add {cfg.label}
        </button>
      </div>

      {notice && (
        <div
          className={`flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-semibold ${
            notice.type === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          <Icon
            name={notice.type === "success" ? "check" : "alert"}
            className="h-[18px] w-[18px]"
          />
          {notice.text}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-3 py-10 text-[#800020]">
          <span className="h-6 w-6 animate-spin rounded-full border-[3px] border-[#800020]/20 border-t-[#800020]" />
          <span className="text-sm font-semibold">Loading...</span>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl bg-rose-50 p-6 text-center text-sm font-semibold text-rose-700">
          {error}
          <button onClick={load} className="ml-3 underline">
            Try again
          </button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="rounded-2xl bg-[#faf7f2] p-10 text-center text-sm font-semibold text-[#800020]/70 ring-1 ring-[#800020]/10">
          Now no {cfg.label.toLowerCase()} yet. &quot;press {cfg.label}&quot; to
          Add
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item._id}
              className={`flex flex-col gap-4 rounded-2xl bg-[#faf7f2] p-4 ring-1 ring-[#800020]/10 sm:flex-row sm:items-center ${
                item.isActive ? "" : "opacity-70"
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="font-bold text-[#800020]">{item.name}</h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      item.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-[#800020]/70">
                  {details(item)}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2 text-sm font-semibold">
                <button
                  onClick={() => openForm(item)}
                  className="rounded-lg px-3.5 py-2 text-[#800020] ring-1 ring-[#800020]/20 hover:bg-[#800020]/5"
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleActive(item)}
                  className="rounded-lg px-3.5 py-2 text-[#800020] ring-1 ring-[#800020]/20 hover:bg-[#800020]/5"
                >
                  {item.isActive ? "Deactivate" : "Activate"}
                </button>
                {confirmId === item._id ? (
                  <>
                    <button
                      onClick={() => remove(item)}
                      className="rounded-lg bg-[#800020] px-3.5 py-2 text-white hover:bg-[#5e0018]"
                    >
                      Yes, delete
                    </button>
                    <button
                      onClick={() => setConfirmId("")}
                      className="px-2 py-2 text-[#800020]/70 hover:underline"
                    >
                      No
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setConfirmId(item._id)}
                    className="rounded-lg px-3.5 py-2 text-rose-700 ring-1 ring-rose-200 hover:bg-rose-50"
                  >
                    Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* add / edit popup */}
      {editing && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => !saving && setEditing(null)}
        >
          <form
            onSubmit={submit}
            noValidate
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <h3 className="text-xl font-extrabold text-[#800020]">
              {editing === "new" ? `Add ${cfg.label}` : `Edit ${cfg.label}`}
            </h3>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {cfg.fields.map((f) => (
                <div key={f.key} className={f.wide ? "sm:col-span-2" : ""}>
                  <label className="mb-2 block text-sm font-bold text-[#800020]">
                    {f.label}
                    {f.required && <span className="text-[#c0405a]"> *</span>}
                  </label>
                  <input
                    className={inputCls}
                    type={
                      f.number ? "number" : f.key === "phone" ? "tel" : "text"
                    }
                    inputMode={f.key === "phone" ? "numeric" : undefined}
                    maxLength={f.key === "phone" ? 15 : undefined}
                    autoComplete={f.key === "phone" ? "tel" : undefined}
                    min={f.number ? 0 : undefined}
                    placeholder={f.placeholder}
                    value={form[f.key] ?? ""}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, [f.key]: e.target.value }))
                    }
                  />
                </div>
              ))}
            </div>

            {formError && (
              <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {formError}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setEditing(null)}
                disabled={saving}
                className="flex-1 rounded-xl px-4 py-3 text-sm font-bold text-[#800020] ring-1 ring-[#800020]/20 hover:bg-[#800020]/5 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-xl bg-[#800020] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#800020]/25 hover:bg-[#5e0018] disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
