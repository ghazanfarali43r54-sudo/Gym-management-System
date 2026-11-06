import Image from "next/image";
import type { ReactNode } from "react";

type Pillar = {
  title: string;
  desc: string;
  image: string;
  icon: ReactNode;
  className: string;
  big?: boolean;
};

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const pillars: Pillar[] = [
  {
    title: "Physical Health",
    desc: "454+ Gyms, Studios, Pools, Padel, Cricket, Snooker & Badminton",
    image: "/images/runing.png",
    big: true,
    className: "lg:row-span-2 min-h-[460px] lg:min-h-[640px]",
    icon: (
      <svg {...iconProps} className="h-7 w-7">
        <path d="M3 10v4M6.5 7v10M17.5 7v10M21 10v4M6.5 12h11" />
      </svg>
    ),
  },
  {
    title: "Mental Health",
    desc: "Psychologist consultations & support",
    image: "/images/mind.png",
    className: "min-h-[320px]",
    icon: (
      <svg {...iconProps} className="h-6 w-6">
        <path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a3 3 0 0 0-3-1Z" />
        <path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1" />
        <path d="M9 9h1M14 9h1M9 14h1M14 14h1" />
      </svg>
    ),
  },
  {
    title: "Nutritional Health",
    desc: "Dietitian consultations & diet plans",
    image: "/images/food.png",
    className: "min-h-[320px]",
    icon: (
      <svg {...iconProps} className="h-6 w-6">
        <path d="M12 8c-2-1.5-6-1.5-7 2-1 3.5 1 9 4 10 1.2.4 2-.5 3-.5s1.8.9 3 .5c3-1 5-6.5 4-10-1-3.5-5-3.5-7-2Z" />
        <path d="M12 8c0-2 1-3.5 3-4" />
      </svg>
    ),
  },
];

function PillarCard({ p }: { p: Pillar }) {
  return (
    <article
      className={`group relative overflow-hidden rounded-[28px] bg-slate-800 ${p.className}`}
    >
      <Image
        src={p.image}
        alt={p.title}
        fill
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* dark gradient for readable text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />

      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
        <span
          className={`mb-5 flex items-center justify-center rounded-2xl bg-[#b52a2d] text-white ${
            p.big ? "h-[72px] w-[72px]" : "h-14 w-14"
          }`}
        >
          {p.icon}
        </span>

        <h3
          className={`font-bold text-white ${
            p.big ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"
          }`}
        >
          {p.title}
        </h3>
        <p
          className={`mt-2 text-white/85 ${
            p.big ? "text-lg sm:text-xl" : "text-base sm:text-lg"
          }`}
        >
          {p.desc}
        </p>
      </div>
    </article>
  );
}

export default function Membership() {
  return (
    <section className="w-full bg-white py-16">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-12">
        {/* heading */}
        <div className="max-w-3xl">
          <h2 className="text-4xl font-extrabold leading-[1.1] text-slate-900 sm:text-5xl lg:text-6xl">
            More Than Just a{" "}
            <span className="text-[#b52a2d]">Gym Membership</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-500 sm:text-xl">
            including Physical and Mental Health. Our Platform connects you with
            all the pillars of complete wellbeing.
          </p>
        </div>

        {/* cards */}
        <div className="mt-14 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:grid-rows-2">
          {pillars.map((p) => (
            <PillarCard key={p.title} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}