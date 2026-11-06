"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { apiFetch } from "@/lib/api";

type Data = Record<string, unknown>;
type ApiResponse = {
  success?: boolean;
  message?: string;
  trainer?: Data;
  trainerDetails?: Data;
};

function display(value: unknown): string {
  if (value === null || value === undefined || value === "") return "Not provided";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") {
    const record = value as Data;
    if (record.name) return String(record.name);
    return "Not provided";
  }
  return String(value);
}

function date(value: unknown): string {
  if (!value) return "Not provided";
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? display(value) : parsed.toLocaleString();
}

function Detail({ label, value, wide = false }: { label: string; value: unknown; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 break-words text-sm text-gray-900">{display(value)}</dd>
    </div>
  );
}

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [trainer, setTrainer] = useState<Data | null>(null);
  const [details, setDetails] = useState<Data>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const result = await apiFetch(`/api/admin/trainers/${id}/dashboard`);
        const data = result.data as ApiResponse;
        if (!result.ok || !data.trainer) throw new Error(data.message || "Could not load trainer details.");
        if (!cancelled) {
          setTrainer(data.trainer);
          setDetails(data.trainerDetails || {});
        }
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : "Could not load trainer details.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [id]);

  return (
    <AdminShell>
      <main className="mx-auto max-w-5xl p-4 sm:p-8">
        <button onClick={() => router.push("/admin/trainers")} className="mb-5 text-sm font-semibold text-[#800020] hover:underline">
          ← Back to trainers
        </button>
        {loading ? <p className="text-gray-600">Loading trainer details…</p> : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-800">{error}</div>
        ) : trainer ? (
          <>
            <header className="mb-6 rounded-2xl bg-[#800020] p-6 text-white">
              <p className="text-sm text-white/75">Trainer profile</p>
              <h1 className="mt-1 text-3xl font-bold">{display(trainer.name)}</h1>
              <p className="mt-2 text-sm text-white/85">{display(trainer.specialization || details.specialization)}</p>
            </header>

            <section className="mb-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-bold text-gray-900">Trainer account</h2>
              <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                <Detail label="Name" value={trainer.name} />
                <Detail label="Email" value={trainer.email} />
                <Detail label="Phone" value={trainer.phone} />
                <Detail label="Status" value={trainer.status} />
                <Detail label="Profile photo" value={trainer.photo} wide />
                <Detail label="Account created" value={date(trainer.createdAt)} />
                <Detail label="Last updated" value={date(trainer.updatedAt)} />
              </dl>
            </section>

            <section className="mb-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-bold text-gray-900">Trainer details</h2>
              <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                <Detail label="Specialization" value={details.specialization} />
                <Detail label="Experience (years)" value={details.experience} />
                <Detail label="Member limit" value={details.memberLimit} />
                <Detail label="Bio" value={details.bio} wide />
                <Detail label="Message" value={details.message} wide />
                <Detail label="Rejection reason" value={details.rejectReason} wide />
                <Detail label="Trainer record created" value={date(details.createdAt)} />
                <Detail label="Trainer record updated" value={date(details.updatedAt)} />
              </dl>
            </section>
          </>
        ) : null}
      </main>
    </AdminShell>
  );
}
