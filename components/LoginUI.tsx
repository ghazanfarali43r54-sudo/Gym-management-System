// "use client";

// import Link from "next/link";
// import { useState, type ReactNode, type FormEvent } from "react";

// /* ================= ICONS ================= */

// function Icon({ className = "h-5 w-5", children }: { className?: string; children: ReactNode }) {
//   return (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth={1.8}
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className={className}
//       aria-hidden
//     >
//       {children}
//     </svg>
//   );
// }

// const UsersIcon = () => (
//   <Icon>
//     <circle cx="9" cy="8" r="3.5" />
//     <path d="M2.5 20c0-3.5 3-5.5 6.5-5.5S15.5 16.5 15.5 20" />
//     <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c2 .7 3.5 2.3 3.5 5.2" />
//   </Icon>
// );
// const CalendarIcon = () => (
//   <Icon>
//     <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
//     <path d="M8 3v4M16 3v4M3.5 10h17M8 14.5h2M13 14.5h3" />
//   </Icon>
// );
// const DumbbellIcon = ({ className }: { className?: string }) => (
//   <Icon className={className}>
//     <path d="M3 10v4M6.5 7v10M17.5 7v10M21 10v4M6.5 12h11" />
//   </Icon>
// );
// const ChartIcon = () => (
//   <Icon>
//     <path d="M3 20h18M5 16l4-5 4 3 6-8" />
//     <path d="M15 6h4v4" />
//   </Icon>
// );
// const ClipboardIcon = () => (
//   <Icon>
//     <rect x="5" y="4" width="14" height="17" rx="2.5" />
//     <path d="M9 4V3h6v1M9 11h6M9 15h4" />
//   </Icon>
// );
// const ShieldIcon = ({ className }: { className?: string }) => (
//   <Icon className={className}>
//     <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" />
//     <path d="m9 12 2 2 4-4" />
//   </Icon>
// );
// const MailIcon = () => (
//   <Icon>
//     <rect x="3" y="5" width="18" height="14" rx="2.5" />
//     <path d="m3.5 7.5 8.5 6 8.5-6" />
//   </Icon>
// );
// const LockIcon = ({ className }: { className?: string }) => (
//   <Icon className={className}>
//     <rect x="5" y="11" width="14" height="9.5" rx="2.5" />
//     <path d="M8 11V8a4 4 0 0 1 8 0v3" />
//   </Icon>
// );
// const EyeIcon = () => (
//   <Icon>
//     <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z" />
//     <circle cx="12" cy="12" r="3" />
//   </Icon>
// );
// const EyeOffIcon = () => (
//   <Icon>
//     <path d="M3 3l18 18M10.6 6a9.5 9.5 0 0 1 1.4-.1c6.5 0 10 6.1 10 6.1a17 17 0 0 1-3.2 3.8M6.6 7.3A16 16 0 0 0 2 12s3.5 6.5 10 6.5a9.7 9.7 0 0 0 4-.9" />
//     <path d="M9.9 10a3 3 0 0 0 4.1 4.1" />
//   </Icon>
// );
// const SignInIcon = () => (
//   <Icon>
//     <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M10 8l4 4-4 4M14 12H3" />
//   </Icon>
// );

// /* ================= CONTENT (admin / trainer) ================= */

// export type Role = "admin" | "trainer";

// const content = {
//   admin: {
//     badge: "Admin Portal",
//     subtitle: "Sign in to your admin account",
//     headTop: "Manage Your Gym",
//     headAccent: "with Confidence",
//     desc: "Track members, manage trainers, handle memberships, and grow your fitness business — all in one powerful admin panel.",
//     features: [
//       { icon: <UsersIcon />, title: "Member Management", desc: "Add, track and manage members" },
//       { icon: <CalendarIcon />, title: "Membership Plans", desc: "Subscriptions, renewals & payments" },
//       { icon: <DumbbellIcon />, title: "Trainer Management", desc: "Assign trainers & track performance" },
//       { icon: <ChartIcon />, title: "Attendance & Check-ins", desc: "Daily attendance and workouts" },
//       { icon: <ClipboardIcon />, title: "Class Schedule", desc: "Manage gym classes & sessions" },
//     ],
//     user: "Admin",
//     userRole: "Gym Admin",
//     menu: ["Dashboard", "Members", "Memberships", "Trainers", "Attendance", "Classes", "Payments", "Reports", "Settings"],
//     welcome: "Welcome back, Admin! Here's what's happening at your gym.",
//     stats: [
//       { label: "Total Members", value: "248", change: "+12%", color: "bg-blue-500" },
//       { label: "Active Memberships", value: "196", change: "+8%", color: "bg-purple-500" },
//       { label: "Today Check-ins", value: "112", change: "+15%", color: "bg-green-500" },
//       { label: "Total Revenue", value: "$2,480", change: "+10%", color: "bg-orange-400" },
//     ],
//     chartTitle: "Membership Growth",
//     listTitle: "Recent Members",
//     people: [
//       { name: "John Carter", meta: "12 Aug 2025" },
//       { name: "Sarah Miller", meta: "12 Aug 2025" },
//       { name: "David Wilson", meta: "11 Aug 2025" },
//       { name: "Emily Davis", meta: "11 Aug 2025" },
//     ],
//     phone: {
//       greeting: "Hello, Admin",
//       tiles: [
//         { label: "Total Members", value: "248" },
//         { label: "Check-ins", value: "112" },
//         { label: "Classes Today", value: "5" },
//         { label: "Revenue", value: "$2,480" },
//       ],
//       listTitle: "Recent Check-ins",
//       rows: [
//         { name: "John Carter", time: "08:12 AM" },
//         { name: "Sarah Miller", time: "08:05 AM" },
//         { name: "David Wilson", time: "07:50 AM" },
//       ],
//     },
//     switchText: "Are you a trainer?",
//     switchLabel: "Trainer login",
//     switchHref: "/trainer/login",
//   },
//   trainer: {
//     badge: "Trainer Portal",
//     subtitle: "Sign in to your trainer account",
//     headTop: "Train Your Members",
//     headAccent: "with Confidence",
//     desc: "View your assigned members, manage your sessions, track progress, and keep every workout on schedule — all in one place.",
//     features: [
//       { icon: <UsersIcon />, title: "My Members", desc: "See members assigned to you" },
//       { icon: <CalendarIcon />, title: "My Schedule", desc: "Upcoming classes & sessions" },
//       { icon: <DumbbellIcon />, title: "Workout Plans", desc: "Create and update training plans" },
//       { icon: <ChartIcon />, title: "Member Progress", desc: "Track results and attendance" },
//       { icon: <ClipboardIcon />, title: "Session Notes", desc: "Keep notes for every session" },
//     ],
//     user: "Coach",
//     userRole: "Trainer",
//     menu: ["Dashboard", "My Members", "Schedule", "Workouts", "Progress", "Sessions", "Messages", "Reports", "Settings"],
//     welcome: "Welcome back, Coach! Here's your day at a glance.",
//     stats: [
//       { label: "My Members", value: "48", change: "+5%", color: "bg-blue-500" },
//       { label: "Sessions Today", value: "6", change: "+2%", color: "bg-purple-500" },
//       { label: "Check-ins", value: "32", change: "+9%", color: "bg-green-500" },
//       { label: "Avg Progress", value: "87%", change: "+4%", color: "bg-orange-400" },
//     ],
//     chartTitle: "Member Progress",
//     listTitle: "My Members",
//     people: [
//       { name: "Ali Raza", meta: "Weight loss" },
//       { name: "Sara Khan", meta: "Strength" },
//       { name: "Hamza Ali", meta: "Cardio" },
//       { name: "Ayesha Noor", meta: "Yoga" },
//     ],
//     phone: {
//       greeting: "Hello, Coach",
//       tiles: [
//         { label: "My Members", value: "48" },
//         { label: "Sessions", value: "6" },
//         { label: "Check-ins", value: "32" },
//         { label: "Progress", value: "87%" },
//       ],
//       listTitle: "Upcoming Sessions",
//       rows: [
//         { name: "Ali Raza", time: "08:00 AM" },
//         { name: "Sara Khan", time: "09:30 AM" },
//         { name: "Hamza Ali", time: "11:00 AM" },
//       ],
//     },
//     switchText: "Are you an admin?",
//     switchLabel: "Admin login",
//     switchHref: "/admin/login",
//   },
// };

// type Content = (typeof content)[Role];

// const avatarColors = ["bg-blue-500", "bg-pink-500", "bg-emerald-500", "bg-amber-500"];

// function Avatar({ name, index, size = "h-4 w-4 text-[6px]" }: { name: string; index: number; size?: string }) {
//   return (
//     <span
//       className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${size} ${
//         avatarColors[index % avatarColors.length]
//       }`}
//     >
//       {name.charAt(0)}
//     </span>
//   );
// }

// /* ================= LAPTOP MOCKUP ================= */

// function Laptop({ c }: { c: Content }) {
//   return (
//     <div className="w-[440px]">
//       <div className="rounded-t-2xl border-[6px] border-b-0 border-slate-700 bg-slate-900 shadow-2xl shadow-blue-900/60">
//         <div className="flex h-[262px] overflow-hidden rounded-t-md bg-slate-50 text-slate-800">
//           {/* sidebar */}
//           <aside className="w-[80px] shrink-0 bg-[#0b1f6b] p-2 text-white">
//             <div className="mb-2 flex items-center gap-1 text-[7px] font-bold">
//               <span className="flex h-3.5 w-3.5 items-center justify-center rounded bg-blue-500">
//                 <DumbbellIcon className="h-2 w-2" />
//               </span>
//               <span>
//                 GymMaster <span className="text-blue-300">Pro</span>
//               </span>
//             </div>
//             <ul className="space-y-0.5 text-[7px]">
//               {c.menu.map((m, i) => (
//                 <li
//                   key={m}
//                   className={`rounded px-1.5 py-1 ${i === 0 ? "bg-blue-500 font-semibold" : "text-blue-100/80"}`}
//                 >
//                   {m}
//                 </li>
//               ))}
//             </ul>
//           </aside>

//           {/* main */}
//           <div className="flex-1 overflow-hidden p-2.5">
//             <div className="mb-2 flex items-center justify-between">
//               <div className="w-32 rounded-full bg-white px-2 py-1 text-[6px] text-slate-400 shadow-sm">
//                 Search members, trainers, classes...
//               </div>
//               <div className="flex items-center gap-1">
//                 <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[6px] font-bold text-white">
//                   {c.user.charAt(0)}
//                 </span>
//                 <span className="text-[6px] leading-tight">
//                   <b className="block">{c.user}</b>
//                   <span className="text-slate-400">{c.userRole}</span>
//                 </span>
//               </div>
//             </div>

//             <h4 className="text-[11px] font-bold">Dashboard</h4>
//             <p className="mb-1.5 text-[6px] text-slate-500">{c.welcome}</p>

//             {/* stat cards */}
//             <div className="grid grid-cols-4 gap-1.5">
//               {c.stats.map((s) => (
//                 <div key={s.label} className="rounded-md bg-white p-1.5 shadow-sm">
//                   <span className={`block h-3.5 w-3.5 rounded ${s.color}`} />
//                   <p className="mt-1 text-[5.5px] text-slate-500">{s.label}</p>
//                   <p className="text-[11px] font-bold leading-tight">{s.value}</p>
//                   <p className="text-[5.5px] font-semibold text-green-500">▲ {s.change}</p>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-2 grid grid-cols-[1.5fr_1fr] gap-1.5">
//               {/* chart */}
//               <div className="rounded-md bg-white p-1.5 shadow-sm">
//                 <p className="text-[6.5px] font-bold">{c.chartTitle}</p>
//                 <svg viewBox="0 0 200 90" className="mt-1 h-[78px] w-full">
//                   <defs>
//                     <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
//                       <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
//                     </linearGradient>
//                   </defs>
//                   {[15, 35, 55, 75].map((y) => (
//                     <line key={y} x1="0" x2="200" y1={y} y2={y} stroke="#e2e8f0" strokeWidth="0.6" />
//                   ))}
//                   <path
//                     d="M10 70 L30 62 L45 66 L60 50 L75 44 L90 52 L105 40 L125 35 L145 38 L165 26 L185 18 L185 85 L10 85 Z"
//                     fill="url(#areaFill)"
//                   />
//                   <polyline
//                     points="10,70 30,62 45,66 60,50 75,44 90,52 105,40 125,35 145,38 165,26 185,18"
//                     fill="none"
//                     stroke="#2563eb"
//                     strokeWidth="1.6"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//               </div>

//               {/* list */}
//               <div className="rounded-md bg-white p-1.5 shadow-sm">
//                 <p className="mb-1 text-[6.5px] font-bold">{c.listTitle}</p>
//                 <ul className="space-y-1">
//                   {c.people.map((p, i) => (
//                     <li key={p.name} className="flex items-center gap-1">
//                       <Avatar name={p.name} index={i} />
//                       <span className="flex-1 text-[5.5px] font-semibold leading-tight">{p.name}</span>
//                       <span className="text-[5px] text-slate-400">{p.meta}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* base */}
//       <div className="-mx-4 h-2.5 rounded-b-2xl bg-gradient-to-b from-slate-300 to-slate-600 shadow-lg" />
//     </div>
//   );
// }

// /* ================= PHONE MOCKUP ================= */

// function Phone({ c }: { c: Content }) {
//   return (
//     <div className="w-[132px] rounded-[26px] border-[5px] border-slate-800 bg-[#081455] p-2.5 text-white shadow-2xl shadow-black/60">
//       <div className="mx-auto mb-1.5 h-1 w-10 rounded-full bg-slate-700" />
//       <div className="mb-1 flex items-center gap-1 text-[6px] font-bold">
//         <span className="flex h-3 w-3 items-center justify-center rounded bg-blue-500">
//           <DumbbellIcon className="h-2 w-2" />
//         </span>
//         GymMaster <span className="text-blue-300">Pro</span>
//       </div>
//       <p className="text-[10px] font-bold">{c.phone.greeting}</p>
//       <p className="mb-1.5 text-[6px] text-blue-200">Today Overview</p>

//       <div className="grid grid-cols-2 gap-1">
//         {c.phone.tiles.map((t, i) => (
//           <div key={t.label} className="rounded-md bg-white/10 p-1">
//             <span className={`block h-2.5 w-2.5 rounded ${["bg-blue-500", "bg-green-500", "bg-orange-400", "bg-purple-500"][i]}`} />
//             <p className="mt-0.5 text-[5px] text-blue-200">{t.label}</p>
//             <p className="text-[9px] font-bold leading-tight">{t.value}</p>
//           </div>
//         ))}
//       </div>

//       <p className="mb-1 mt-2 text-[6.5px] font-bold">{c.phone.listTitle}</p>
//       <ul className="space-y-1.5 pb-2">
//         {c.phone.rows.map((r, i) => (
//           <li key={r.name} className="flex items-center gap-1">
//             <Avatar name={r.name} index={i} size="h-4 w-4 text-[6px]" />
//             <span className="flex-1 text-[6px] font-semibold">{r.name}</span>
//             <span className="text-[5px] text-blue-200">{r.time}</span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// /* ================= FORM FIELD ================= */

// function Field({
//   label,
//   icon,
//   right,
//   children,
// }: {
//   label: string;
//   icon: ReactNode;
//   right?: ReactNode;
//   children: ReactNode;
// }) {
//   return (
//     <label className="flex items-center gap-4 rounded-2xl bg-white px-4 py-3.5 shadow-sm ring-1 ring-slate-100 focus-within:ring-2 focus-within:ring-blue-500">
//       <span className="flex h-9 w-9 shrink-0 items-center justify-center text-blue-600">{icon}</span>
//       <span className="flex-1">
//         <span className="block text-sm font-semibold text-slate-800">{label}</span>
//         {children}
//       </span>
//       {right}
//     </label>
//   );
// }

// /* ================= PAGE ================= */

// export default function LoginUI({ role }: { role: Role }) {
//   const c = content[role];
//   const [showPassword, setShowPassword] = useState(false);

//   const handleSubmit = (e: FormEvent) => e.preventDefault(); // abhi koi logic nahi

//   return (
//     <main className="grid min-h-screen w-full bg-white lg:grid-cols-2">
//       {/* ================= LEFT PANEL ================= */}
//       <section
//         className="relative hidden min-h-[760px] overflow-hidden text-white lg:block"
//         style={{
//           background:
//             "radial-gradient(circle at 75% 25%, rgba(37,99,235,0.45), transparent 45%), radial-gradient(circle at 15% 85%, rgba(29,78,216,0.35), transparent 40%), linear-gradient(160deg, #06103a, #0a1d66 55%, #050b2a)",
//         }}
//       >
//         {/* ---- background gym decoration (no images) ---- */}
//         <div aria-hidden className="pointer-events-none absolute inset-0">
//           {/* light bars */}
//           <div className="absolute left-[58%] top-0 h-[45%] w-1.5 bg-blue-300/40 blur-sm" />
//           <div className="absolute left-[44%] top-[6%] h-[30%] w-1 bg-blue-300/30 blur-sm" />
//           {/* sign */}
//           <div className="absolute right-8 top-[72px] -rotate-6 text-right text-[26px] font-extrabold leading-[1.05] tracking-wide text-blue-300/30 xl:text-[32px]">
//             STRONGER
//             <br />
//             HEALTHIER
//             <br />
//             HAPPIER
//             <DumbbellIcon className="ml-auto mt-3 h-10 w-10 text-blue-300/30" />
//           </div>
//           {/* weight plates / dumbbells in the dark */}
//           <div className="absolute right-[18%] top-[44%] h-14 w-14 rounded-full bg-black/50 blur-[2px]" />
//           <div className="absolute right-[8%] top-[46%] h-16 w-16 rounded-full bg-black/60 blur-[2px]" />
//           <div className="absolute right-[30%] top-[52%] h-12 w-12 rounded-full bg-black/40 blur-[3px]" />
//           {/* floor */}
//           <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#030818] to-transparent" />
//         </div>

//         {/* ---- text content ---- */}
//         <div className="relative z-10 p-10 xl:p-12">
//           <div className="flex items-center gap-3">
//             <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600">
//               <DumbbellIcon className="h-6 w-6" />
//             </span>
//             <span>
//               <span className="block text-2xl font-bold leading-tight">
//                 GymMaster <span className="text-blue-400">Pro</span>
//               </span>
//               <span className="block text-[10px] font-medium tracking-[0.2em] text-slate-300">
//                 GYM &amp; FITNESS MANAGEMENT SYSTEM
//               </span>
//             </span>
//           </div>

//           <h1 className="mt-10 text-4xl font-bold leading-tight xl:text-5xl">
//             {c.headTop}
//             <br />
//             <span className="text-blue-500">{c.headAccent}</span>
//           </h1>

//           <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-200 xl:text-base">{c.desc}</p>

//           <ul className="mt-7 space-y-4">
//             {c.features.map((f) => (
//               <li key={f.title} className="flex items-center gap-4">
//                 <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-blue-400/30 bg-blue-950/70 text-blue-300">
//                   {f.icon}
//                 </span>
//                 <span>
//                   <span className="block text-sm font-semibold">{f.title}</span>
//                   <span className="block text-xs text-slate-300">{f.desc}</span>
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* ---- bottle (decor) ---- */}
//         <div aria-hidden className="absolute bottom-16 left-0 z-0">
//           <div className="mx-auto h-3 w-9 rounded-t-md bg-slate-700" />
//           <div className="flex h-28 w-[58px] items-center justify-center rounded-t-2xl rounded-b-lg bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900">
//             <DumbbellIcon className="h-5 w-5 text-slate-300" />
//           </div>
//         </div>

//         {/* ---- dumbbell plate (decor) ---- */}
//         <div
//           aria-hidden
//           className="absolute -right-10 bottom-[70px] z-0 h-28 w-28 rounded-full bg-gradient-to-br from-slate-800 to-black"
//         />

//         {/* ---- phone ---- */}
//         <div className="absolute bottom-[60px] left-[18%] z-10 origin-bottom-left lg:scale-[0.8] xl:scale-100">
//           <Phone c={c} />
//         </div>

//         {/* ---- laptop ---- */}
//         <div className="absolute bottom-10 right-8 z-[5] origin-bottom-right lg:scale-[0.72] xl:scale-90 2xl:scale-100">
//           <Laptop c={c} />
//         </div>

//         {/* ---- secure card ---- */}
//         <div className="absolute bottom-6 left-12 z-20 flex items-center gap-4 rounded-2xl border border-blue-400/30 bg-blue-950/70 px-5 py-3.5 backdrop-blur">
//           <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
//             <ShieldIcon />
//           </span>
//           <span>
//             <span className="block text-sm font-semibold">Secure &amp; Reliable</span>
//             <span className="block text-xs text-slate-300">Your gym data is always protected</span>
//           </span>
//         </div>
//       </section>

//       {/* ================= RIGHT PANEL ================= */}
//       <section className="relative flex items-center justify-center bg-gradient-to-br from-white via-blue-50/60 to-blue-100/60 px-6 py-16">
//         <div className="absolute right-6 top-6 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-md">
//           <ShieldIcon className="h-4 w-4 text-blue-600" />
//           {c.badge}
//         </div>

//         <div className="w-full max-w-md">
//           <div className="flex items-center justify-center gap-3">
//             <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
//               <DumbbellIcon className="h-7 w-7" />
//             </span>
//             <span>
//               <span className="block text-2xl font-bold leading-tight text-slate-900">
//                 GymMaster <span className="text-blue-500">Pro</span>
//               </span>
//               <span className="block text-[10px] font-medium tracking-[0.2em] text-slate-400">
//                 GYM &amp; FITNESS MANAGEMENT SYSTEM
//               </span>
//             </span>
//           </div>

//           <div className="mt-12 text-center">
//             <h2 className="text-4xl font-bold text-[#0b1a4a]">Welcome back</h2>
//             <p className="mt-3 text-slate-500">{c.subtitle}</p>
//           </div>

//           <form onSubmit={handleSubmit} className="mt-10 space-y-5">
//             <Field label="Email address" icon={<MailIcon />}>
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="mt-0.5 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
//               />
//             </Field>

//             <Field
//               label="Password"
//               icon={<LockIcon />}
//               right={
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword((s) => !s)}
//                   aria-label={showPassword ? "Hide password" : "Show password"}
//                   className="text-slate-400 hover:text-slate-600"
//                 >
//                   {showPassword ? <EyeOffIcon /> : <EyeIcon />}
//                 </button>
//               }
//             >
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter your password"
//                 className="mt-0.5 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
//               />
//             </Field>

//             <div className="flex items-center justify-between text-sm">
//               <label className="flex cursor-pointer items-center gap-2.5 text-slate-700">
//                 <input type="checkbox" defaultChecked className="h-[18px] w-[18px] rounded accent-blue-600" />
//                 Remember me
//               </label>
//               <Link href="#" className="font-medium text-blue-600 hover:underline">
//                 Forgot password?
//               </Link>
//             </div>

//             <button
//               type="submit"
//               className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-base font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700"
//             >
//               <SignInIcon />
//               Sign In
//             </button>

//             <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
//               <LockIcon className="h-3.5 w-3.5" />
//               Secure login – Your data is protected
//             </p>
//           </form>

//           <p className="mt-8 text-center text-sm text-slate-500">
//             {c.switchText}{" "}
//             <Link href={c.switchHref} className="font-medium text-blue-600 hover:underline">
//               {c.switchLabel}
//             </Link>
//           </p>
//         </div>
//       </section>
//     </main>
//   );
// }



"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode, type FormEvent } from "react";


/* ================= ICONS ================= */

function Icon({ className = "h-5 w-5", children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

const UsersIcon = () => (
  <Icon>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20c0-3.5 3-5.5 6.5-5.5S15.5 16.5 15.5 20" />
    <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c2 .7 3.5 2.3 3.5 5.2" />
  </Icon>
);
const CalendarIcon = () => (
  <Icon>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M8 3v4M16 3v4M3.5 10h17M8 14.5h2M13 14.5h3" />
  </Icon>
);
const DumbbellIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <path d="M3 10v4M6.5 7v10M17.5 7v10M21 10v4M6.5 12h11" />
  </Icon>
);
const ChartIcon = () => (
  <Icon>
    <path d="M3 20h18M5 16l4-5 4 3 6-8" />
    <path d="M15 6h4v4" />
  </Icon>
);
const ClipboardIcon = () => (
  <Icon>
    <rect x="5" y="4" width="14" height="17" rx="2.5" />
    <path d="M9 4V3h6v1M9 11h6M9 15h4" />
  </Icon>
);
const ShieldIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
);
const MailIcon = () => (
  <Icon>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m3.5 7.5 8.5 6 8.5-6" />
  </Icon>
);
const LockIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <rect x="5" y="11" width="14" height="9.5" rx="2.5" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Icon>
);
const EyeIcon = () => (
  <Icon>
    <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);
const EyeOffIcon = () => (
  <Icon>
    <path d="M3 3l18 18M10.6 6a9.5 9.5 0 0 1 1.4-.1c6.5 0 10 6.1 10 6.1a17 17 0 0 1-3.2 3.8M6.6 7.3A16 16 0 0 0 2 12s3.5 6.5 10 6.5a9.7 9.7 0 0 0 4-.9" />
    <path d="M9.9 10a3 3 0 0 0 4.1 4.1" />
  </Icon>
);
const SignInIcon = () => (
  <Icon>
    <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M10 8l4 4-4 4M14 12H3" />
  </Icon>
);

/* ================= CONTENT (admin / trainer) ================= */

export type Role = "admin" | "trainer";

const content = {
  admin: {
    badge: "Admin Portal",
    subtitle: "Sign in to your admin account",
    headTop: "Manage Your Gym",
    headAccent: "with Confidence",
    desc: "Track members, manage trainers, handle memberships, and grow your fitness business — all in one powerful admin panel.",
    features: [
      { icon: <UsersIcon />, title: "Member Management", desc: "Add, track and manage members" },
      { icon: <CalendarIcon />, title: "Membership Plans", desc: "Subscriptions, renewals & payments" },
      { icon: <DumbbellIcon />, title: "Trainer Management", desc: "Assign trainers & track performance" },
      { icon: <ChartIcon />, title: "Attendance & Check-ins", desc: "Daily attendance and workouts" },
      { icon: <ClipboardIcon />, title: "Class Schedule", desc: "Manage gym classes & sessions" },
    ],
    user: "Admin",
    userRole: "Gym Admin",
    menu: ["Dashboard", "Members", "Memberships", "Trainers", "Attendance", "Classes", "Payments", "Reports", "Settings"],
    welcome: "Welcome back, Admin! Here's what's happening at your gym.",
    stats: [
      { label: "Total Members", value: "248", change: "+12%", color: "bg-[#800020]" },
      { label: "Active Memberships", value: "196", change: "+8%", color: "bg-rose-400" },
      { label: "Today Check-ins", value: "112", change: "+15%", color: "bg-emerald-500" },
      { label: "Total Revenue", value: "$2,480", change: "+10%", color: "bg-amber-500" },
    ],
    chartTitle: "Membership Growth",
    listTitle: "Recent Members",
    people: [
      { name: "John Carter", meta: "12 Aug 2025" },
      { name: "Sarah Miller", meta: "12 Aug 2025" },
      { name: "David Wilson", meta: "11 Aug 2025" },
      { name: "Emily Davis", meta: "11 Aug 2025" },
    ],
    phone: {
      greeting: "Hello, Admin",
      tiles: [
        { label: "Total Members", value: "248" },
        { label: "Check-ins", value: "112" },
        { label: "Classes Today", value: "5" },
        { label: "Revenue", value: "$2,480" },
      ],
      listTitle: "Recent Check-ins",
      rows: [
        { name: "John Carter", time: "08:12 AM" },
        { name: "Sarah Miller", time: "08:05 AM" },
        { name: "David Wilson", time: "07:50 AM" },
      ],
    },
    switchText: "Are you a trainer?",
    switchLabel: "Trainer login",
    switchHref: "/trainer/login",
    dashboardHref: "/admin/dashboard",
  },
  trainer: {
    badge: "Trainer Portal",
    subtitle: "Sign in to your trainer account",
    headTop: "Train Your Members",
    headAccent: "with Confidence",
    desc: "View your assigned members, manage your sessions, track progress, and keep every workout on schedule — all in one place.",
    features: [
      { icon: <UsersIcon />, title: "My Members", desc: "See members assigned to you" },
      { icon: <CalendarIcon />, title: "My Schedule", desc: "Upcoming classes & sessions" },
      { icon: <DumbbellIcon />, title: "Workout Plans", desc: "Create and update training plans" },
      { icon: <ChartIcon />, title: "Member Progress", desc: "Track results and attendance" },
      { icon: <ClipboardIcon />, title: "Session Notes", desc: "Keep notes for every session" },
    ],
    user: "Coach",
    userRole: "Trainer",
    menu: ["Dashboard", "My Members", "Schedule", "Workouts", "Progress", "Sessions", "Messages", "Reports", "Settings"],
    welcome: "Welcome back, Coach! Here's your day at a glance.",
    stats: [
      { label: "My Members", value: "48", change: "+5%", color: "bg-[#800020]" },
      { label: "Sessions Today", value: "6", change: "+2%", color: "bg-rose-400" },
      { label: "Check-ins", value: "32", change: "+9%", color: "bg-emerald-500" },
      { label: "Avg Progress", value: "87%", change: "+4%", color: "bg-amber-500" },
    ],
    chartTitle: "Member Progress",
    listTitle: "My Members",
    people: [
      { name: "Ali Raza", meta: "Weight loss" },
      { name: "Sara Khan", meta: "Strength" },
      { name: "Hamza Ali", meta: "Cardio" },
      { name: "Ayesha Noor", meta: "Yoga" },
    ],
    phone: {
      greeting: "Hello, Coach",
      tiles: [
        { label: "My Members", value: "48" },
        { label: "Sessions", value: "6" },
        { label: "Check-ins", value: "32" },
        { label: "Progress", value: "87%" },
      ],
      listTitle: "Upcoming Sessions",
      rows: [
        { name: "Ali Raza", time: "08:00 AM" },
        { name: "Sara Khan", time: "09:30 AM" },
        { name: "Hamza Ali", time: "11:00 AM" },
      ],
    },
    switchText: "Are you an admin?",
    switchLabel: "Admin login",
    switchHref: "/admin/login",
    dashboardHref: "/trainer/dashboard",
  },
};

type Content = (typeof content)[Role];

const avatarColors = ["bg-[#800020]", "bg-rose-400", "bg-amber-500", "bg-emerald-600"];

function Avatar({ name, index, size = "h-4 w-4 text-[6px]" }: { name: string; index: number; size?: string }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${size} ${
        avatarColors[index % avatarColors.length]
      }`}
    >
      {name.charAt(0)}
    </span>
  );
}

/* ================= LAPTOP MOCKUP ================= */

function Laptop({ c }: { c: Content }) {
  return (
    <div className="w-[440px]">
      <div className="rounded-t-2xl border-[6px] border-b-0 border-neutral-800 bg-neutral-900 shadow-2xl shadow-black/60">
        <div className="flex h-[262px] overflow-hidden rounded-t-md bg-[#faf7f2] text-neutral-800">
          {/* sidebar */}
          <aside className="w-[80px] shrink-0 bg-[#800020] p-2 text-white">
            <div className="mb-2 flex items-center gap-1 text-[7px] font-bold">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded bg-white text-[#800020]">
                <DumbbellIcon className="h-2 w-2" />
              </span>
              <span>
                GymMaster <span className="text-rose-200">Pro</span>
              </span>
            </div>
            <ul className="space-y-0.5 text-[7px]">
              {c.menu.map((m, i) => (
                <li
                  key={m}
                  className={`rounded px-1.5 py-1 ${i === 0 ? "bg-white font-semibold text-[#800020]" : "text-rose-100/85"}`}
                >
                  {m}
                </li>
              ))}
            </ul>
          </aside>

          {/* main */}
          <div className="flex-1 overflow-hidden p-2.5">
            <div className="mb-2 flex items-center justify-between">
              <div className="w-32 rounded-full bg-white px-2 py-1 text-[6px] text-neutral-400 shadow-sm">
                Search members, trainers, classes...
              </div>
              <div className="flex items-center gap-1">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#800020] text-[6px] font-bold text-white">
                  {c.user.charAt(0)}
                </span>
                <span className="text-[6px] leading-tight">
                  <b className="block">{c.user}</b>
                  <span className="text-neutral-400">{c.userRole}</span>
                </span>
              </div>
            </div>

            <h4 className="text-[11px] font-bold text-[#800020]">Dashboard</h4>
            <p className="mb-1.5 text-[6px] text-neutral-500">{c.welcome}</p>

            {/* stat cards */}
            <div className="grid grid-cols-4 gap-1.5">
              {c.stats.map((s) => (
                <div key={s.label} className="rounded-md bg-white p-1.5 shadow-sm">
                  <span className={`block h-3.5 w-3.5 rounded ${s.color}`} />
                  <p className="mt-1 text-[5.5px] text-neutral-500">{s.label}</p>
                  <p className="text-[11px] font-bold leading-tight">{s.value}</p>
                  <p className="text-[5.5px] font-semibold text-emerald-600">▲ {s.change}</p>
                </div>
              ))}
            </div>

            <div className="mt-2 grid grid-cols-[1.5fr_1fr] gap-1.5">
              {/* chart */}
              <div className="rounded-md bg-white p-1.5 shadow-sm">
                <p className="text-[6.5px] font-bold">{c.chartTitle}</p>
                <svg viewBox="0 0 200 90" className="mt-1 h-[78px] w-full">
                  <defs>
                    <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#800020" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#800020" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[15, 35, 55, 75].map((y) => (
                    <line key={y} x1="0" x2="200" y1={y} y2={y} stroke="#eadfd8" strokeWidth="0.6" />
                  ))}
                  <path
                    d="M10 70 L30 62 L45 66 L60 50 L75 44 L90 52 L105 40 L125 35 L145 38 L165 26 L185 18 L185 85 L10 85 Z"
                    fill="url(#areaFill)"
                  />
                  <polyline
                    points="10,70 30,62 45,66 60,50 75,44 90,52 105,40 125,35 145,38 165,26 185,18"
                    fill="none"
                    stroke="#800020"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* list */}
              <div className="rounded-md bg-white p-1.5 shadow-sm">
                <p className="mb-1 text-[6.5px] font-bold">{c.listTitle}</p>
                <ul className="space-y-1">
                  {c.people.map((p, i) => (
                    <li key={p.name} className="flex items-center gap-1">
                      <Avatar name={p.name} index={i} />
                      <span className="flex-1 text-[5.5px] font-semibold leading-tight">{p.name}</span>
                      <span className="text-[5px] text-neutral-400">{p.meta}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* base */}
      <div className="-mx-4 h-2.5 rounded-b-2xl bg-gradient-to-b from-neutral-300 to-neutral-600 shadow-lg" />
    </div>
  );
}

/* ================= PHONE MOCKUP ================= */

function Phone({ c }: { c: Content }) {
  return (
    <div className="w-[132px] rounded-[26px] border-[5px] border-neutral-900 bg-[#3a0711] p-2.5 text-white shadow-2xl shadow-black/60">
      <div className="mx-auto mb-1.5 h-1 w-10 rounded-full bg-neutral-700" />
      <div className="mb-1 flex items-center gap-1 text-[6px] font-bold">
        <span className="flex h-3 w-3 items-center justify-center rounded bg-white text-[#800020]">
          <DumbbellIcon className="h-2 w-2" />
        </span>
        GymMaster <span className="text-rose-200">Pro</span>
      </div>
      <p className="text-[10px] font-bold">{c.phone.greeting}</p>
      <p className="mb-1.5 text-[6px] text-rose-200">Today Overview</p>

      <div className="grid grid-cols-2 gap-1">
        {c.phone.tiles.map((t, i) => (
          <div key={t.label} className="rounded-md bg-white/10 p-1">
            <span
              className={`block h-2.5 w-2.5 rounded ${
                ["bg-rose-400", "bg-emerald-500", "bg-amber-500", "bg-white"][i]
              }`}
            />
            <p className="mt-0.5 text-[5px] text-rose-200">{t.label}</p>
            <p className="text-[9px] font-bold leading-tight">{t.value}</p>
          </div>
        ))}
      </div>

      <p className="mb-1 mt-2 text-[6.5px] font-bold">{c.phone.listTitle}</p>
      <ul className="space-y-1.5 pb-2">
        {c.phone.rows.map((r, i) => (
          <li key={r.name} className="flex items-center gap-1">
            <Avatar name={r.name} index={i} size="h-4 w-4 text-[6px]" />
            <span className="flex-1 text-[6px] font-semibold">{r.name}</span>
            <span className="text-[5px] text-rose-200">{r.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ================= FORM FIELD ================= */

function Field({
  label,
  icon,
  right,
  children,
}: {
  label: string;
  icon: ReactNode;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="flex items-center gap-4 rounded-2xl bg-white px-4 py-3.5 shadow-sm ring-1 ring-[#800020]/10 focus-within:ring-2 focus-within:ring-[#800020]">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[#800020]">{icon}</span>
      <span className="flex-1">
        <span className="block text-sm font-semibold text-neutral-900">{label}</span>
        {children}
      </span>
      {right}
    </label>
  );
}

/* ================= PAGE ================= */

export default function LoginUI({ role }: { role: Role }) {
  const router = useRouter();
  const c = content[role];

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    // abhi sirf admin ka backend bana hai
    if (role !== "admin") {
      setError("Trainer login abhi tayar nahi hai.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // "Remember me" ho to localStorage (band karne par bhi rahega),
      // warna sessionStorage (tab band hote hi chala jayega)
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem("token", data.token);
      storage.setItem("user", JSON.stringify(data.user));

      router.push("/admin/dashboard");
    } catch (err) {
      console.log("Login error:", err);
      setError("Server se connect nahi ho paya. Backend chal raha hai?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen w-full bg-[#faf7f2] lg:grid-cols-2">
      {/* ================= LEFT PANEL ================= */}
      <section
        className="relative hidden min-h-[760px] overflow-hidden text-white lg:block"
        style={{
          background:
            "radial-gradient(circle at 75% 25%, rgba(190,60,80,0.45), transparent 45%), radial-gradient(circle at 15% 85%, rgba(150,30,55,0.35), transparent 40%), linear-gradient(160deg, #2a0510, #5e0018 55%, #1c030a)",
        }}
      >
        {/* ---- background gym decoration (no images) ---- */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {/* light bars */}
          <div className="absolute left-[58%] top-0 h-[45%] w-1.5 bg-rose-200/40 blur-sm" />
          <div className="absolute left-[44%] top-[6%] h-[30%] w-1 bg-rose-200/30 blur-sm" />
          {/* sign */}
          <div className="absolute right-8 top-[72px] -rotate-6 text-right text-[26px] font-extrabold leading-[1.05] tracking-wide text-rose-200/30 xl:text-[32px]">
            STRONGER
            <br />
            HEALTHIER
            <br />
            HAPPIER
            <DumbbellIcon className="ml-auto mt-3 h-10 w-10 text-rose-200/30" />
          </div>
          {/* weight plates / dumbbells in the dark */}
          <div className="absolute right-[18%] top-[44%] h-14 w-14 rounded-full bg-black/50 blur-[2px]" />
          <div className="absolute right-[8%] top-[46%] h-16 w-16 rounded-full bg-black/60 blur-[2px]" />
          <div className="absolute right-[30%] top-[52%] h-12 w-12 rounded-full bg-black/40 blur-[3px]" />
          {/* floor */}
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#14020a] to-transparent" />
        </div>

        {/* ---- text content ---- */}
        <div className="relative z-10 p-10 xl:p-12">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#faf7f2] text-[#800020]">
              <DumbbellIcon className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-2xl font-bold leading-tight">
                GymMaster <span className="text-rose-300">Pro</span>
              </span>
              <span className="block text-[10px] font-medium tracking-[0.2em] text-rose-100/80">
                GYM &amp; FITNESS MANAGEMENT SYSTEM
              </span>
            </span>
          </div>

          <h1 className="mt-10 text-4xl font-bold leading-tight xl:text-5xl">
            {c.headTop}
            <br />
            <span className="text-rose-300">{c.headAccent}</span>
          </h1>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-rose-50/90 xl:text-base">{c.desc}</p>

          <ul className="mt-7 space-y-4">
            {c.features.map((f) => (
              <li key={f.title} className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-rose-300/30 bg-[#3a0711]/70 text-rose-200">
                  {f.icon}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{f.title}</span>
                  <span className="block text-xs text-rose-100/75">{f.desc}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ---- bottle (decor) ---- */}
        <div aria-hidden className="absolute bottom-16 left-0 z-0">
          <div className="mx-auto h-3 w-9 rounded-t-md bg-neutral-700" />
          <div className="flex h-28 w-[58px] items-center justify-center rounded-t-2xl rounded-b-lg bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900">
            <DumbbellIcon className="h-5 w-5 text-neutral-300" />
          </div>
        </div>

        {/* ---- dumbbell plate (decor) ---- */}
        <div
          aria-hidden
          className="absolute -right-10 bottom-[70px] z-0 h-28 w-28 rounded-full bg-gradient-to-br from-neutral-800 to-black"
        />

        {/* ---- phone ---- */}
        <div className="absolute bottom-[60px] left-[18%] z-10 origin-bottom-left lg:scale-[0.8] xl:scale-100">
          <Phone c={c} />
        </div>

        {/* ---- laptop ---- */}
        <div className="absolute bottom-10 right-8 z-[5] origin-bottom-right lg:scale-[0.72] xl:scale-90 2xl:scale-100">
          <Laptop c={c} />
        </div>

        {/* ---- secure card ---- */}
        <div className="absolute bottom-6 left-12 z-20 flex items-center gap-4 rounded-2xl border border-rose-300/30 bg-[#3a0711]/70 px-5 py-3.5 backdrop-blur">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#800020] text-white">
            <ShieldIcon />
          </span>
          <span>
            <span className="block text-sm font-semibold">Secure &amp; Reliable</span>
            <span className="block text-xs text-rose-100/75">Your gym data is always protected</span>
          </span>
        </div>
      </section>

      {/* ================= RIGHT PANEL ================= */}
      <section className="relative flex items-center justify-center bg-gradient-to-br from-[#faf7f2] via-[#f7efe8] to-[#f1e4dc] px-6 py-16">
        <div className="absolute right-6 top-6 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 shadow-md">
          <ShieldIcon className="h-4 w-4 text-[#800020]" />
          {c.badge}
        </div>

        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#800020] text-white shadow-lg shadow-[#800020]/30">
              <DumbbellIcon className="h-7 w-7" />
            </span>
            <span>
              <span className="block text-2xl font-bold leading-tight text-neutral-900">
                GymMaster <span className="text-[#800020]">Pro</span>
              </span>
              <span className="block text-[10px] font-medium tracking-[0.2em] text-neutral-500">
                GYM &amp; FITNESS MANAGEMENT SYSTEM
              </span>
            </span>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-4xl font-bold text-[#800020]">Welcome back</h2>
            <p className="mt-3 text-neutral-600">{c.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            <Field label="Email address" icon={<MailIcon />}>
              <input
              value={email} onChange={(e) => setEmail(e.target.value)}required autoComplete="email"
                type="email"
                placeholder="Enter your email"
                className="mt-0.5 w-full bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
              />
            </Field>

            <Field
              label="Password"
              icon={<LockIcon />}
              right={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-neutral-400 hover:text-[#800020]"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
            >
              <input
              value={password}onChange={(e) => setPassword(e.target.value)}required  autoComplete="current-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="mt-0.5 w-full bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
              />
            </Field>

            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2.5 text-neutral-700">
                <input type="checkbox" checked={remember}
               onChange={(e) => setRemember(e.target.checked)} className="h-[18px] w-[18px] rounded accent-[#800020]" />
                Remember me
              </label>
              <Link href="#" className="font-medium text-[#800020] hover:underline">
                Forgot password?
              </Link>
            </div>

           {error && (
  <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
    {error}
  </p>
)}

     <button
  type="submit"
  disabled={loading}
  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#800020] py-4 text-base font-semibold text-white shadow-lg shadow-[#800020]/30 transition hover:bg-[#5e0018] disabled:cursor-not-allowed disabled:opacity-70"
>
  <SignInIcon />
  {loading ? "Signing in..." : "Sign In"}
</button>

            <p className="flex items-center justify-center gap-1.5 text-xs text-neutral-600">
              <LockIcon className="h-3.5 w-3.5" />
              Secure login – Your data is protected
            </p>
          </form>

          <p className="mt-8 text-center text-sm text-neutral-600">
            {c.switchText}{" "}
            <Link href={c.switchHref} className="font-medium text-[#800020] hover:underline">
              {c.switchLabel}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}