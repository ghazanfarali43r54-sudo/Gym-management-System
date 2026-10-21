import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Trainer Dashboard | GymMaster Pro",
};

export default function TrainerDashboard() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf7f2] p-6">
      <section className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-[0_2px_16px_rgba(128,0,32,0.08)] ring-1 ring-[#800020]/10">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#800020] text-2xl font-extrabold text-white shadow-lg shadow-[#800020]/25">
          C
        </span>
        <h1 className="mt-6 text-2xl font-extrabold text-[#800020]">Trainer Dashboard</h1>
        <p className="mt-2 text-sm text-[#800020]/65">
          Welcome, Coach! Yeh placeholder page hai — yahan aapke members, schedule aur sessions ka
          data aayega.
        </p>
        <Link
          href="/trainer/login"
          className="mt-6 inline-block rounded-xl bg-[#800020] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#800020]/25 transition hover:bg-[#5e0018]"
        >
          Back to Login
        </Link>
      </section>
    </main>
  );
}