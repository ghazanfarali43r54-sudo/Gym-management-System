import Image from "next/image";
import { Play, Users, Dumbbell, Activity, ShieldCheck } from "lucide-react";

const BG_IMAGE = "/images/jym.jpng.png";

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






// import Image from "next/image";
// import Link from "next/link";
// import { Yellowtail } from "next/font/google";
// import type { ReactNode } from "react";

// const script = Yellowtail({ subsets: ["latin"], weight: "400" });

// const icon = {
//   viewBox: "0 0 24 24",
//   fill: "none",
//   stroke: "currentColor",
//   strokeWidth: 1.8,
//   strokeLinecap: "round" as const,
//   strokeLinejoin: "round" as const,
//   "aria-hidden": true,
// };

// const stats = [
//   { value: "454+", label: "Partner Venues" },
//   { value: "8", label: "Service Types" },
//   { value: "1", label: "Membership" },
// ];

// /* floating chips around the photo (positions are % of the circle box) */
// const chips: { label: string; className: string; icon: ReactNode }[] = [
//   {
//     label: "Fitness Centers",
//     className: "left-[6%] top-[4%]",
//     icon: <path d="M3 10v4M6.5 7v10M17.5 7v10M21 10v4M6.5 12h11" />,
//   },
//   {
//     label: "Swimming Pools & Sauna",
//     className: "right-[-4%] top-[12%]",
//     icon: <path d="M3 8c2-2 4 2 6 0s4 2 6 0 4 2 6 0M3 13c2-2 4 2 6 0s4 2 6 0 4 2 6 0M3 18c2-2 4 2 6 0s4 2 6 0 4 2 6 0" />,
//   },
//   {
//     label: "Diet Plans",
//     className: "left-[-8%] top-[38%]",
//     icon: (
//       <>
//         <path d="M4 12h16a8 8 0 0 1-16 0Z" />
//         <path d="M8 12c0-3 2-5 4-5s4 2 4 5" />
//       </>
//     ),
//   },
//   {
//     label: "Physiotherapy",
//     className: "right-[-4%] top-[60%]",
//     icon: (
//       <>
//         <circle cx="12" cy="5" r="2" />
//         <path d="M12 8v6l-3 5M12 14l4 5M8 11h8" />
//       </>
//     ),
//   },
//   {
//     label: "Mental Health Consultations",
//     className: "left-[-2%] top-[67%]",
//     icon: (
//       <>
//         <path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a3 3 0 0 0-3-1Z" />
//         <path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1" />
//       </>
//     ),
//   },
//   {
//     label: "Paddle and Sports",
//     className: "left-1/2 -translate-x-1/2 bottom-[-3%]",
//     icon: (
//       <>
//         <circle cx="12" cy="12" r="9" />
//         <path d="M3 12c4 0 6-3 9-9M21 12c-4 0-6 3-9 9M6 19c2-4 7-7 13-7" />
//       </>
//     ),
//   },
// ];

// export default function Hero() {
//   return (
//     <section className="relative w-full overflow-hidden bg-gradient-to-br from-white via-white to-[#fdeeee]">
//       <div className="mx-auto grid max-w-[1500px] items-center gap-12 px-6 pb-10 pt-8 lg:grid-cols-[1.1fr_1fr] lg:px-12">
//         {/* ================= LEFT ================= */}
//         <div>
//           <span className="inline-flex items-center gap-2.5 rounded-full bg-[#b52a2d]/10 px-5 py-3 text-sm font-bold uppercase tracking-wide text-[#b52a2d]">
//             <span className="h-2 w-2 rounded-full bg-[#b52a2d]" />
//             Pakistan&apos;s #1 Wellness Network
//           </span>

//           <h1 className="mt-8 text-6xl font-extrabold uppercase leading-[0.98] tracking-tight text-[#14141f] sm:text-7xl xl:text-[104px]">
//             One App
//             <br />
//             For All Your
//             <br />
//             <span
//               className={`${script.className} -mr-2 text-[1.15em] font-normal normal-case text-[#b52a2d]`}
//             >
//               wellness
//             </span>{" "}
//             Needs<span className="text-[#b52a2d]">.</span>
//           </h1>

//           <p className="mt-8 max-w-xl text-xl leading-relaxed text-slate-500">
//             Access 454+ Gyms, Studios, Pools, Padel, Cricket, Snooker, Badminton
//             and Health Services in Pakistan.
//           </p>

//           {/* buttons */}
//           <div className="mt-10 flex flex-wrap items-center gap-6">
//             <Link
//               href="/app"
//               className="flex items-center gap-3 rounded-2xl bg-[#b52a2d] px-9 py-5 text-lg font-semibold text-white shadow-lg shadow-[#b52a2d]/25 transition hover:bg-[#9a2124]"
//             >
//               <svg {...icon} strokeWidth={2} className="h-5 w-5">
//                 <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />
//               </svg>
//               Download App
//             </Link>

//             <button className="flex items-center gap-4 text-lg font-semibold text-[#14141f]">
//               <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#b52a2d]/10 text-[#b52a2d] transition hover:bg-[#b52a2d]/20">
//                 <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden>
//                   <path d="M8 5v14l11-7L8 5Z" />
//                 </svg>
//               </span>
//               Watch Video
//             </button>
//           </div>

//           {/* stats */}
//           <div className="mt-14 flex items-center">
//             {stats.map((s, i) => (
//               <div
//                 key={s.label}
//                 className={`pr-10 ${i > 0 ? "border-l border-slate-200 pl-10" : ""}`}
//               >
//                 <p className="text-5xl font-bold text-[#14141f]">{s.value}</p>
//                 <p className="mt-1 text-sm uppercase tracking-wider text-slate-500">
//                   {s.label}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ================= RIGHT ================= */}
//         <div className="relative mx-auto w-full max-w-[640px]">
//           {/* circle photo */}
//           <div className="relative aspect-square w-full overflow-hidden rounded-full border-[14px] border-slate-200/80 bg-slate-100 shadow-xl">
//             <Image
//               src="/images/jym.png"
//               alt="Member checking the Gym Passport app at the gym"
//               fill
//               priority
//               sizes="(min-width: 1024px) 40vw, 90vw"
//               className="object-cover"
//             />
//           </div>

//           {/* floating chips */}
//           {chips.map((c) => (
//             <div
//               key={c.label}
//               className={`absolute flex items-center gap-3 whitespace-nowrap rounded-2xl bg-white px-5 py-3.5 text-base font-medium text-[#14141f] shadow-lg ring-1 ring-black/5 ${c.className}`}
//             >
//               <svg {...icon} className="h-6 w-6 shrink-0">
//                 {c.icon}
//               </svg>
//               {c.label}
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }