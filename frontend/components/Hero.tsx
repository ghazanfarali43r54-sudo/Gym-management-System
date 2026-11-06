import Image from "next/image";
import { Play, Users, Dumbbell, Activity, ShieldCheck } from "lucide-react";

const BG_IMAGE = "/images/jym.png";

const stats = [
  { icon: Users, value: "10K+", label: "Happy Members" },
  { icon: Dumbbell, value: "50+", label: "Expert Trainers" },
  { icon: Activity, value: "100+", label: "Daily Workouts" },
  { icon: ShieldCheck, value: "99%", label: "Satisfaction Rate" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#faf7f2] text-neutral-900">
      {/* Right side image */}
      <div className="absolute inset-y-0 right-0 w-full md:w-3/4">
        <Image
          src={BG_IMAGE}
          alt="FitLife hero"
          fill
          priority
          className="object-cover object-right"
        />
        {/* off-white fade from the left so the text stays readable */}
        <div className="absolute inset-0 bg-[#faf7f2]/60 md:bg-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#faf7f2] via-[#faf7f2]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#faf7f2] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-20 md:pt-28">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#800020]">
          Your fitness journey starts here
        </p>

        <h1 className="mt-4 text-5xl font-extrabold leading-tight text-[#800020] md:text-6xl">
          Stronger <br />
          Healthier <br />
          <span className="text-neutral-900">Happier</span>
        </h1>

        <p className="mt-5 max-w-md text-sm text-neutral-700">
          Join FitLife – the smart gym management system that helps you achieve
          your fitness goals with ease.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button className="rounded-full bg-[#800020] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#5e0018]">
            Get Started Free
          </button>
          <button className="flex items-center gap-3 text-sm font-medium text-[#800020]">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#800020]/40 bg-white/70">
              <Play size={16} fill="#800020" stroke="#800020" />
            </span>
            Watch Video
          </button>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 gap-6 border-t border-[#800020]/15 pt-8 md:grid-cols-4">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#800020]/10 text-[#800020]">
                <Icon size={20} />
              </span>
              <div>
                <p className="text-xl font-bold text-[#800020]">{value}</p>
                <p className="text-xs text-neutral-600">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}