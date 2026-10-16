"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState, type ReactNode } from "react";

/* =====================================================================
   ICONS (inline SVG, no package needed)
   ===================================================================== */

const paths = {
  dashboard: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </>
  ),
  members: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5" />
      <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c2 .7 3.5 2.3 3.5 5.2" />
    </>
  ),
  plans: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3 10h18M7 15h3" />
    </>
  ),
  attendance: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  trainers: <path d="M3 10v4M6.5 7v10M17.5 7v10M21 10v4M6.5 12h11" />,
  classes: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </>
  ),
  schedule: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  payments: (
    <>
      <path d="M3 7h15a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7Z" />
      <path d="M3 7l2-3h11" />
      <circle cx="16.5" cy="13.5" r="1" />
    </>
  ),
  reports: <path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1" />
    </>
  ),
  bell: (
    <>
      <path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4l2-2Z" />
      <path d="M10 21h4" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 11a8 8 0 1 0-2.3 6" />
      <path d="M20 5v6h-6" />
    </>
  ),
  chevDown: <path d="m6 9 6 6 6-6" />,
  chevRight: <path d="m9 6 6 6-6 6" />,
  collapse: <path d="m11 7-5 5 5 5M18 7l-5 5 5 5" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  plus: <path d="M12 5v14M5 12h14" />,
  flame: (
    <path d="M12 21c4 0 7-2.5 7-6.5 0-3-2-5-3-7-1 1.5-2 2-3 2 0-3-1-5-3-7-.5 4-4 6-4 11 0 4.5 3 7.5 6 7.5Z" />
  ),
  heart: <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" />,
  bolt: <path d="M13 3 5 13h6l-1 8 8-10h-6l1-8Z" />,
  userPlus: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5M19 8v6M16 11h6" />
    </>
  ),
  tag: (
    <>
      <path d="M3 12V4h8l10 10-8 8L3 12Z" />
      <circle cx="7.5" cy="8.5" r="1" />
    </>
  ),
  arrowUp: <path d="M12 19V5M6 11l6-6 6 6" />,
  arrowDown: <path d="M12 5v14M6 13l6 6 6-6" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r=".8" fill="currentColor" />
    </>
  ),
};

type IconName = keyof typeof paths;

function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
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
      {paths[name]}
    </svg>
  );
}

/* =====================================================================
   HELPERS
   ===================================================================== */

const fmt = (n: number) => n.toLocaleString("en-US");

type Pt = [number, number];

/** smooth (catmull-rom -> bezier) path through points */
function smooth(pts: Pt[]) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

/* =====================================================================
   DATA (dummy - replace with your API later)
   ===================================================================== */

const nav: { group: string; items: { label: string; href: string; icon: IconName }[] }[] = [
  {
    group: "Overview",
    items: [{ label: "Dashboard", href: "/admin/dashboard", icon: "dashboard" }],
  },
  {
    group: "Members",
    items: [
      { label: "Members", href: "/admin/members", icon: "members" },
      { label: "Memberships", href: "/admin/memberships", icon: "plans" },
      { label: "Attendance", href: "/admin/attendance", icon: "attendance" },
    ],
  },
  {
    group: "Training",
    items: [
      { label: "Trainers", href: "/admin/trainers", icon: "trainers" },
      { label: "Classes", href: "/admin/classes", icon: "classes" },
      { label: "Schedule", href: "/admin/schedule", icon: "schedule" },
    ],
  },
  {
    group: "Finance",
    items: [
      { label: "Payments", href: "/admin/payments", icon: "payments" },
      { label: "Reports", href: "/admin/reports", icon: "reports" },
    ],
  },
  {
    group: "System",
    items: [{ label: "Settings", href: "/admin/settings", icon: "settings" }],
  },
];

const periods = [
  { label: "Last 7 Days", k: 1 },
  { label: "Last 30 Days", k: 4.2 },
  { label: "Last 90 Days", k: 12.5 },
];

const revenueSets: Record<string, { labels: string[]; data: number[] }> = {
  "7D": {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    data: [22, 28, 25, 34, 31, 40, 38],
  },
  "30D": {
    labels: ["3", "6", "9", "12", "15", "18", "21", "24", "27", "30"],
    data: [120, 138, 131, 160, 152, 171, 165, 190, 184, 205],
  },
  "3M": {
    labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"],
    data: [150, 162, 158, 175, 190, 184, 201, 214, 208, 226, 240, 251],
  },
  "6M": {
    labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    data: [610, 655, 640, 720, 765, 812],
  },
  "1Y": {
    labels: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    data: [480, 520, 610, 585, 640, 600, 610, 655, 640, 720, 765, 812],
  },
};

const attendanceSets: Record<string, { labels: string[]; data: number[] }> = {
  Monthly: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    data: [2400, 3100, 2700, 3900, 5200, 3000, 3300, 4100, 5600, 4300],
  },
  Weekly: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    data: [420, 510, 480, 530, 610, 380, 290],
  },
};

const plans = [
  { name: "Monthly", value: 38, color: "#800020" },
  { name: "Quarterly", value: 24, color: "#c0405a" },
  { name: "Annual", value: 18, color: "#d4881f" },
  { name: "Student", value: 12, color: "#2f9e6a" },
  { name: "Corporate", value: 8, color: "#8a6d75" },
];

const topTrainers = [
  { name: "Hamza Ali", spec: "Strength & Conditioning", sessions: 128 },
  { name: "Sara Khan", spec: "Yoga & Pilates", sessions: 112 },
  { name: "Bilal Ahmed", spec: "CrossFit", sessions: 97 },
  { name: "Ayesha Noor", spec: "Zumba & Cardio", sessions: 84 },
  { name: "Usman Tariq", spec: "Boxing", sessions: 71 },
];

const payments = [
  { name: "Ali Raza", plan: "Annual Plan", amount: "Rs. 45,000", status: "Paid", time: "10 min ago" },
  { name: "Maryam Shah", plan: "Quarterly Plan", amount: "Rs. 15,000", status: "Paid", time: "42 min ago" },
  { name: "Zain Malik", plan: "Monthly Plan", amount: "Rs. 6,000", status: "Pending", time: "1h ago" },
  { name: "Hira Fatima", plan: "Student Plan", amount: "Rs. 4,000", status: "Paid", time: "2h ago" },
  { name: "Daniyal Khan", plan: "Corporate Plan", amount: "Rs. 28,000", status: "Failed", time: "3h ago" },
];

const classesToday = [
  { name: "Morning HIIT", trainer: "Hamza Ali", time: "06:30 AM", booked: 18, cap: 20 },
  { name: "Yoga Flow", trainer: "Sara Khan", time: "08:00 AM", booked: 12, cap: 15 },
  { name: "Strength Lab", trainer: "Bilal Ahmed", time: "10:30 AM", booked: 9, cap: 16 },
  { name: "Spin Class", trainer: "Usman Tariq", time: "05:30 PM", booked: 20, cap: 20 },
  { name: "Zumba Night", trainer: "Ayesha Noor", time: "07:00 PM", booked: 14, cap: 25 },
];

const activity: { icon: IconName; tone: string; title: string; desc: string; time: string }[] = [
  { icon: "userPlus", tone: "#2f9e6a", title: "New member joined", desc: "Ali Raza • Annual plan", time: "5m ago" },
  { icon: "payments", tone: "#800020", title: "Payment received", desc: "Maryam Shah • Rs. 15,000", time: "42m ago" },
  { icon: "attendance", tone: "#d4881f", title: "Check-in peak", desc: "86 members checked in this hour", time: "1h ago" },
  { icon: "trainers", tone: "#c0405a", title: "Trainer assigned", desc: "Bilal Ahmed → Zain Malik", time: "2h ago" },
  { icon: "tag", tone: "#8a6d75", title: "Plan updated", desc: "Student plan price changed", time: "5h ago" },
  { icon: "classes", tone: "#2f9e6a", title: "Class created", desc: "Zumba Night • 07:00 PM", time: "1d ago" },
];

const quickActions: { label: string; href: string; icon: IconName }[] = [
  { label: "Add Member", href: "/admin/members/new", icon: "userPlus" },
  { label: "Add Trainer", href: "/admin/trainers/new", icon: "trainers" },
  { label: "Create Plan", href: "/admin/memberships/new", icon: "plans" },
  { label: "Mark Attendance", href: "/admin/attendance", icon: "attendance" },
];

const avatarTones = ["#800020", "#c0405a", "#d4881f", "#2f9e6a", "#8a6d75"];

/* =====================================================================
   SMALL UI PIECES
   ===================================================================== */

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-3xl bg-white p-5 shadow-[0_2px_16px_rgba(128,0,32,0.06)] ring-1 ring-[#800020]/5 sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

function CardHead({
  icon,
  title,
  subtitle,
  right,
}: {
  icon: IconName;
  title: string;
  subtitle: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#800020]/10 pb-5">
      <div className="flex items-center gap-3.5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#800020]/10 text-[#800020]">
          <Icon name={icon} />
        </span>
        <div>
          <h3 className="text-base font-bold text-[#800020]">{title}</h3>
          <p className="text-sm text-[#800020]/60">{subtitle}</p>
        </div>
      </div>
      {right}
    </div>
  );
}

function Tabs({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex rounded-2xl bg-[#faf7f2] p-1 ring-1 ring-[#800020]/10">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`rounded-xl px-3.5 py-1.5 text-sm font-semibold transition ${
            o === value
              ? "bg-[#800020] text-white shadow"
              : "text-[#800020]/70 hover:text-[#800020]"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Avatar({ name, index, size = "h-10 w-10" }: { name: string; index: number; size?: string }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${size}`}
      style={{ backgroundColor: avatarTones[index % avatarTones.length] }}
    >
      {name.charAt(0)}
    </span>
  );
}

/* ---------- sparkline ---------- */

function Spark({ data, color }: { data: number[]; color: string }) {
  const id = useId().replace(/:/g, "");
  const W = 100;
  const H = 36;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts: Pt[] = data.map((v, i) => [
    (i * W) / (data.length - 1),
    H - 4 - ((v - min) / (max - min || 1)) * (H - 10),
  ]);
  const line = smooth(pts);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-9 w-24" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${W},${H} L0,${H} Z`} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- area / line chart with hover tooltip ---------- */

function AreaChart({
  data,
  labels,
  format,
}: {
  data: number[];
  labels: string[];
  format: (v: number) => string;
}) {
  const id = useId().replace(/:/g, "");
  const [hover, setHover] = useState<number | null>(null);

  const W = 640;
  const H = 260;
  const padL = 44;
  const padR = 16;
  const padT = 20;
  const padB = 30;

  const max = Math.max(...data) * 1.15;
  const x = (i: number) => padL + (i * (W - padL - padR)) / (data.length - 1);
  const y = (v: number) => padT + (1 - v / max) * (H - padT - padB);

  const pts: Pt[] = data.map((v, i) => [x(i), y(v)]);
  const line = smooth(pts);
  const area = `${line} L${x(data.length - 1)},${H - padB} L${x(0)},${H - padB} Z`;

  const peak = data.indexOf(Math.max(...data));
  const active = hover ?? peak;

  const tip = `${labels[active]}: ${format(data[active])}`;
  const tipW = tip.length * 6.6 + 18;
  const tipX = Math.min(Math.max(x(active) - tipW / 2, padL), W - padR - tipW);
  const tipY = Math.max(y(data[active]) - 42, 2);

  function onMove(e: React.MouseEvent<SVGSVGElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const idx = Math.round(((px - padL) / (W - padL - padR)) * (data.length - 1));
    setHover(Math.min(Math.max(idx, 0), data.length - 1));
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full select-none"
      onMouseMove={onMove}
      onMouseLeave={() => setHover(null)}
      role="img"
      aria-label="Chart"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#800020" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#800020" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* grid + y labels */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const yy = padT + (1 - t) * (H - padT - padB);
        return (
          <g key={t}>
            <line
              x1={padL}
              x2={W - padR}
              y1={yy}
              y2={yy}
              stroke="#800020"
              strokeOpacity="0.1"
              strokeDasharray="4 5"
            />
            <text x={padL - 8} y={yy + 4} textAnchor="end" fontSize="11" fill="#800020" fillOpacity="0.55">
              {fmt(Math.round(max * t))}
            </text>
          </g>
        );
      })}

      {/* x labels */}
      {labels.map((l, i) => (
        <text
          key={l + i}
          x={x(i)}
          y={H - 8}
          textAnchor="middle"
          fontSize="11"
          fontWeight={i === active ? 700 : 400}
          fill="#800020"
          fillOpacity={i === active ? 1 : 0.55}
        >
          {l}
        </text>
      ))}

      {/* active column highlight */}
      <rect
        x={x(active) - 14}
        y={padT}
        width="28"
        height={H - padT - padB}
        rx="10"
        fill="#800020"
        fillOpacity="0.06"
      />

      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke="#800020" strokeWidth="2.6" strokeLinecap="round" />

      {/* active point + tooltip */}
      <circle cx={x(active)} cy={y(data[active])} r="7" fill="#fff" stroke="#800020" strokeWidth="3" />
      <rect x={tipX} y={tipY} width={tipW} height="26" rx="8" fill="#800020" />
      <text x={tipX + tipW / 2} y={tipY + 17} textAnchor="middle" fontSize="11.5" fontWeight="600" fill="#fff">
        {tip}
      </text>
    </svg>
  );
}

/* ---------- donut ---------- */

function Donut({ children }: { children: ReactNode }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  let acc = 0;

  return (
    <div className="relative h-52 w-52 shrink-0">
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx="100" cy="100" r={r} fill="none" stroke="#800020" strokeOpacity="0.07" strokeWidth="24" />
        {plans.map((s) => {
          const len = (s.value / 100) * c;
          const dash = Math.max(len - 4, 0);
          const el = (
            <circle
              key={s.name}
              cx="100"
              cy="100"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="24"
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={-acc}
              strokeLinecap="butt"
            />
          );
          acc += len;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}

/* ---------- progress ring ---------- */

function Ring({
  value,
  size = 190,
  stroke = 16,
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#800020"
          strokeOpacity="0.1"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#800020"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}

/* =====================================================================
   SIDEBAR
   ===================================================================== */

function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();
  const hide = collapsed ? "lg:hidden" : "";

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col border-r border-[#800020]/10 bg-white transition-all duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:w-[88px]" : "lg:w-[272px]"}`}
      >
        {/* brand */}
        <div className="flex items-center justify-between gap-2 border-b border-[#800020]/10 px-5 py-5">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#800020] text-white shadow-md shadow-[#800020]/25">
              <Icon name="trainers" className="h-5 w-5" />
            </span>
            <span className={hide}>
              <span className="block text-base font-bold leading-tight text-[#800020]">GymMaster Pro</span>
              <span className="block text-[10px] font-semibold tracking-[0.2em] text-[#800020]/55">
                ADMIN PANEL
              </span>
            </span>
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Collapse sidebar"
            className={`hidden rounded-lg p-1.5 text-[#800020]/70 hover:bg-[#800020]/10 lg:block ${
              collapsed ? "lg:hidden" : ""
            }`}
          >
            <Icon name="collapse" className="h-5 w-5" />
          </button>
        </div>

        {/* nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              aria-label="Expand sidebar"
              className="mx-auto mb-4 hidden rounded-lg p-1.5 text-[#800020]/70 hover:bg-[#800020]/10 lg:block"
            >
              <Icon name="chevRight" className="h-5 w-5" />
            </button>
          )}

          {nav.map((g) => (
            <div key={g.group} className="mb-5">
              <p
                className={`mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#800020]/50 ${hide}`}
              >
                {g.group}
              </p>
              <ul className="space-y-1">
                {g.items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        title={item.label}
                        className={`flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-[15px] font-semibold transition ${
                          active
                            ? "bg-[#800020] text-white shadow-md shadow-[#800020]/25"
                            : "text-[#800020] hover:bg-[#800020]/10"
                        } ${collapsed ? "lg:justify-center" : ""}`}
                      >
                        <Icon name={item.icon} className="h-5 w-5 shrink-0" />
                        <span className={hide}>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className={`border-t border-[#800020]/10 px-5 py-4 text-center text-xs text-[#800020]/60 ${hide}`}>
          Powered by <b className="text-[#800020]">GymMaster Pro</b> v1.0
        </div>
      </aside>
    </>
  );
}

/* =====================================================================
   TOP BAR
   ===================================================================== */

function Topbar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[#800020]/10 bg-[#faf7f2]/85 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex flex-1 items-center gap-3">
        <button
          onClick={onMenu}
          aria-label="Open menu"
          className="rounded-xl bg-white p-2.5 text-[#800020] shadow-sm ring-1 ring-[#800020]/10 lg:hidden"
        >
          <Icon name="menu" />
        </button>

        <label className="hidden max-w-md flex-1 items-center gap-3 rounded-2xl bg-white px-4 py-2.5 shadow-sm ring-1 ring-[#800020]/10 focus-within:ring-2 focus-within:ring-[#800020] sm:flex">
          <Icon name="search" className="h-4 w-4 text-[#800020]/60" />
          <input
            type="text"
            placeholder="Search members, trainers, classes..."
            className="w-full bg-transparent text-sm text-[#800020] outline-none placeholder:text-[#800020]/40"
          />
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          aria-label="Notifications"
          className="relative rounded-xl bg-white p-2.5 text-[#800020] shadow-sm ring-1 ring-[#800020]/10 transition hover:bg-[#800020]/5"
        >
          <Icon name="bell" />
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#c0405a] ring-2 ring-white" />
        </button>

        <span className="hidden h-8 w-px bg-[#800020]/15 sm:block" />

        <button className="flex items-center gap-3 rounded-xl py-1 pl-1 pr-2 transition hover:bg-[#800020]/5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#800020] to-[#c0405a] text-sm font-bold text-white">
            A
          </span>
          <span className="hidden text-left leading-tight sm:block">
            <span className="block text-sm font-bold text-[#800020]">Admin</span>
            <span className="block text-xs text-[#800020]/60">Gym Admin</span>
          </span>
          <Icon name="chevDown" className="hidden h-4 w-4 text-[#800020]/60 sm:block" />
        </button>
      </div>
    </header>
  );
}

/* =====================================================================
   PAGE
   ===================================================================== */

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [periodIdx, setPeriodIdx] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [revTab, setRevTab] = useState("7D");
  const [attTab, setAttTab] = useState("Monthly");

  const k = periods[periodIdx].k;

  const stats = [
    {
      title: "Total Members",
      value: fmt(1248),
      change: "+12%",
      up: true,
      icon: "members" as IconName,
      color: "#800020",
      spark: [30, 34, 33, 40, 44, 43, 52],
    },
    {
      title: "Active Memberships",
      value: fmt(986),
      change: "+8%",
      up: true,
      icon: "plans" as IconName,
      color: "#c0405a",
      spark: [20, 22, 21, 26, 25, 30, 33],
    },
    {
      title: "Check-ins",
      value: fmt(Math.round(112 * k)),
      change: "+15%",
      up: true,
      icon: "attendance" as IconName,
      color: "#2f9e6a",
      spark: [12, 18, 14, 22, 19, 27, 30],
    },
    {
      title: "Revenue",
      value: `Rs. ${fmt(Math.round(184000 * k))}`,
      change: "+10%",
      up: true,
      icon: "payments" as IconName,
      color: "#d4881f",
      spark: [22, 28, 25, 34, 31, 40, 38],
    },
    {
      title: "Trainers",
      value: fmt(24),
      change: "+2",
      up: true,
      icon: "trainers" as IconName,
      color: "#8a5a64",
      spark: [20, 20, 21, 21, 22, 23, 24],
    },
    {
      title: "New Signups",
      value: fmt(Math.round(38 * k)),
      change: "-3%",
      up: false,
      icon: "userPlus" as IconName,
      color: "#b5485d",
      spark: [30, 28, 33, 29, 31, 27, 26],
    },
  ];

  const pulse = [
    { icon: "heart" as IconName, label: "Live Occupancy", value: "42", unit: "/ 80 inside", bar: 52 },
    { icon: "flame" as IconName, label: "Calories Burned", value: fmt(Math.round(128000)), unit: "Kcal today", bar: 74 },
    { icon: "bolt" as IconName, label: "Avg Session", value: "64", unit: "min per visit", bar: 63 },
  ];

  const rev = revenueSets[revTab];
  const revTotal = rev.data.reduce((a, b) => a + b, 0);
  const revAvg = Math.round(revTotal / rev.data.length);
  const att = attendanceSets[attTab];

  function refresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  }

  return (
    <div className="flex min-h-screen bg-[#faf7f2] text-[#800020]">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setMobileOpen(true)} />

        <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
          {/* ============ HEADER CARD ============ */}
          <Card className="bg-gradient-to-br from-white to-[#f8ece8]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#800020] text-white shadow-lg shadow-[#800020]/25">
                  <Icon name="dashboard" className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#800020]/60">
                    Gym Overview
                  </p>
                  <h1 className="text-2xl font-extrabold text-[#800020] sm:text-3xl">Dashboard</h1>
                  <p className="text-sm text-[#800020]/65">
                    Welcome back, Admin! Track members, trainers, revenue and attendance in one place.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold tracking-wider text-emerald-700 shadow-sm ring-1 ring-[#800020]/10">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  LIVE
                </span>

                <button
                  onClick={refresh}
                  aria-label="Refresh"
                  className="rounded-xl bg-white p-3 text-[#800020] shadow-sm ring-1 ring-[#800020]/10 transition hover:bg-[#800020]/5"
                >
                  <Icon name="refresh" className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
                </button>

                <label className="relative">
                  <select
                    value={periodIdx}
                    onChange={(e) => setPeriodIdx(Number(e.target.value))}
                    className="appearance-none rounded-xl bg-white py-3 pl-4 pr-10 text-sm font-semibold text-[#800020] shadow-sm ring-1 ring-[#800020]/10 outline-none focus:ring-2 focus:ring-[#800020]"
                  >
                    {periods.map((p, i) => (
                      <option key={p.label} value={i}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                  <Icon
                    name="chevDown"
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2"
                  />
                </label>
              </div>
            </div>
          </Card>

          {/* ============ STAT CARDS ============ */}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map((s) => (
              <div
                key={s.title}
                className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-[0_2px_16px_rgba(128,0,32,0.06)] ring-1 ring-[#800020]/5"
              >
                <span
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ background: `linear-gradient(90deg, ${s.color}, transparent)` }}
                />
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${s.color}1f`, color: s.color }}
                  >
                    <Icon name={s.icon} />
                  </span>
                  <p className="text-sm font-semibold text-[#800020]/70">{s.title}</p>
                </div>

                <div className="mt-5 flex items-end justify-between gap-3">
                  <p className="text-3xl font-extrabold text-[#800020]">{s.value}</p>
                  <Spark data={s.spark} color={s.color} />
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-[#800020]/10 pt-4 text-sm">
                  <span
                    className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                      s.up ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    <Icon name={s.up ? "arrowUp" : "arrowDown"} className="h-3 w-3" />
                    {s.change}
                  </span>
                  <span className="text-[#800020]/60">vs previous period</span>
                </div>
              </div>
            ))}
          </div>

          {/* ============ GYM PULSE ============ */}
          <div className="grid gap-5 md:grid-cols-3">
            {pulse.map((p) => (
              <Card key={p.label} className="!p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#800020] text-white">
                      <Icon name={p.icon} className="h-5 w-5" />
                    </span>
                    <p className="font-bold text-[#800020]">{p.label}</p>
                  </div>
                  <span className="text-xl leading-none text-[#800020]/40">⋮</span>
                </div>
                <p className="mt-5 text-3xl font-extrabold text-[#800020]">
                  {p.value}{" "}
                  <span className="text-sm font-medium text-[#800020]/60">{p.unit}</span>
                </p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#800020]/10">
                  <div className="h-full rounded-full bg-[#800020]" style={{ width: `${p.bar}%` }} />
                </div>
              </Card>
            ))}
          </div>

          {/* ============ REVENUE + DISTRIBUTION ============ */}
          <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
            <Card>
              <CardHead
                icon="payments"
                title="Revenue Overview"
                subtitle="Gym performance across the selected period"
                right={<Tabs options={["7D", "30D", "3M", "6M", "1Y"]} value={revTab} onChange={setRevTab} />}
              />

              <div className="mb-4 flex flex-wrap gap-3">
                <span className="rounded-2xl bg-[#faf7f2] px-4 py-2 text-sm ring-1 ring-[#800020]/10">
                  <span className="mr-2 text-xs font-bold tracking-wider text-[#800020]/60">REVENUE</span>
                  <b>Rs. {fmt(revTotal)}K</b>
                </span>
                <span className="rounded-2xl bg-[#faf7f2] px-4 py-2 text-sm ring-1 ring-[#800020]/10">
                  <span className="mr-2 text-xs font-bold tracking-wider text-[#800020]/60">AVERAGE</span>
                  <b>Rs. {fmt(revAvg)}K</b>
                </span>
                <span className="ml-auto rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                  {rev.data.length} reporting points
                </span>
              </div>

              <AreaChart data={rev.data} labels={rev.labels} format={(v) => `Rs. ${fmt(v)}K`} />
            </Card>

            <Card>
              <CardHead icon="tag" title="Membership Plans" subtitle="Members by plan type" />

              <div className="flex flex-col items-center gap-6 sm:flex-row xl:flex-col">
                <Donut>
                  <p className="text-3xl font-extrabold text-[#800020]">{fmt(1248)}</p>
                  <p className="text-sm text-[#800020]/60">Members</p>
                </Donut>

                <ul className="w-full space-y-4">
                  {plans.map((p) => (
                    <li key={p.name}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 font-semibold text-[#800020]">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                          {p.name}
                        </span>
                        <span className="font-bold">{p.value}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#800020]/10">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${p.value}%`, backgroundColor: p.color }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>

          {/* ============ ATTENDANCE + TARGET ============ */}
          <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
            <Card>
              <CardHead
                icon="attendance"
                title="Attendance Reports"
                subtitle="Member check-ins over time"
                right={<Tabs options={["Monthly", "Weekly"]} value={attTab} onChange={setAttTab} />}
              />
              <AreaChart data={att.data} labels={att.labels} format={(v) => `${fmt(v)} check-ins`} />
            </Card>

            <Card>
              <CardHead icon="target" title="Monthly Target" subtitle="Goal completion this month" />

              <div className="flex flex-col items-center">
                <Ring value={80}>
                  <p className="text-5xl font-extrabold text-[#800020]">80%</p>
                  <p className="text-sm text-[#800020]/60">completed</p>
                </Ring>

                <ul className="mt-6 grid w-full grid-cols-3 gap-2 text-center text-xs font-semibold text-[#800020]">
                  {[
                    { l: "Signups", v: "92%", c: "#800020" },
                    { l: "Renewals", v: "78%", c: "#c0405a" },
                    { l: "PT Sessions", v: "70%", c: "#d4881f" },
                  ].map((g) => (
                    <li key={g.l} className="rounded-2xl bg-[#faf7f2] px-2 py-3 ring-1 ring-[#800020]/10">
                      <span className="mx-auto mb-1.5 block h-2 w-2 rounded-full" style={{ backgroundColor: g.c }} />
                      <span className="block text-base font-extrabold">{g.v}</span>
                      {g.l}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>

          {/* ============ TOP TRAINERS + RECENT PAYMENTS ============ */}
          <div className="grid gap-5 lg:grid-cols-2">
            <Card>
              <CardHead
                icon="trainers"
                title="Top Trainers"
                subtitle="Ranked by sessions this month"
                right={
                  <Link
                    href="/admin/trainers"
                    className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold ring-1 ring-[#800020]/15 transition hover:bg-[#800020]/5"
                  >
                    View All <Icon name="chevRight" className="h-3.5 w-3.5" />
                  </Link>
                }
              />
              <ul className="space-y-5">
                {topTrainers.map((t, i) => (
                  <li key={t.name} className="flex items-center gap-4">
                    <span className="w-5 text-sm font-extrabold text-[#800020]/40">{i + 1}</span>
                    <Avatar name={t.name} index={i} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate font-bold text-[#800020]">{t.name}</p>
                        <p className="shrink-0 text-sm font-bold">{t.sessions}</p>
                      </div>
                      <p className="mb-1.5 truncate text-xs text-[#800020]/60">{t.spec}</p>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#800020]/10">
                        <div
                          className="h-full rounded-full bg-[#800020]"
                          style={{ width: `${(t.sessions / topTrainers[0].sessions) * 100}%` }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <CardHead
                icon="payments"
                title="Recent Payments"
                subtitle="Latest membership payments"
                right={
                  <Link
                    href="/admin/payments"
                    className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold ring-1 ring-[#800020]/15 transition hover:bg-[#800020]/5"
                  >
                    View All <Icon name="chevRight" className="h-3.5 w-3.5" />
                  </Link>
                }
              />
              <ul className="divide-y divide-[#800020]/10">
                {payments.map((p, i) => (
                  <li key={p.name} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                    <Avatar name={p.name} index={i + 1} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-[#800020]">{p.name}</p>
                      <p className="truncate text-xs text-[#800020]/60">
                        {p.plan} • {p.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{p.amount}</p>
                      <span
                        className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          p.status === "Paid"
                            ? "bg-emerald-50 text-emerald-700"
                            : p.status === "Pending"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* ============ CLASSES + ACTIVITY + QUICK ACTIONS ============ */}
          <div className="grid gap-5 xl:grid-cols-3">
            <Card>
              <CardHead icon="classes" title="Today's Classes" subtitle="Bookings and capacity" />
              <ul className="space-y-5">
                {classesToday.map((c) => {
                  const pct = Math.round((c.booked / c.cap) * 100);
                  const full = c.booked >= c.cap;
                  return (
                    <li key={c.name}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-[#800020]">{c.name}</p>
                          <p className="text-xs text-[#800020]/60">
                            {c.trainer} • {c.time}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                            full ? "bg-rose-50 text-rose-700" : "bg-[#800020]/10 text-[#800020]"
                          }`}
                        >
                          {full ? "Full" : `${c.booked}/${c.cap}`}
                        </span>
                      </div>
                      <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-[#800020]/10">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: full ? "#c0405a" : "#800020",
                          }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>

            <Card>
              <CardHead icon="bolt" title="Recent Activity" subtitle="Latest events across your gym" />
              <ul className="relative max-h-[420px] space-y-5 overflow-y-auto pr-1">
                {activity.map((a, i) => (
                  <li key={a.title + i} className="relative flex gap-4">
                    {i < activity.length - 1 && (
                      <span className="absolute left-5 top-11 h-[calc(100%-1rem)] w-px bg-[#800020]/15" />
                    )}
                    <span
                      className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${a.tone}1f`, color: a.tone }}
                    >
                      <Icon name={a.icon} className="h-[18px] w-[18px]" />
                    </span>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-bold text-[#800020]">{a.title}</p>
                        <span className="shrink-0 text-xs text-[#800020]/55">{a.time}</span>
                      </div>
                      <p className="text-sm text-[#800020]/65">{a.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

            <div className="space-y-5">
              <Card>
                <CardHead icon="bolt" title="Quick Actions" subtitle="Jump to frequent tasks" />
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((q) => (
                    <Link
                      key={q.label}
                      href={q.href}
                      className="group flex items-center justify-between gap-2 rounded-2xl bg-[#faf7f2] p-3.5 ring-1 ring-[#800020]/10 transition hover:bg-[#800020] hover:text-white"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#800020] shadow-sm">
                          <Icon name={q.icon} className="h-[18px] w-[18px]" />
                        </span>
                        <span className="text-sm font-bold leading-tight">{q.label}</span>
                      </span>
                      <Icon
                        name="chevRight"
                        className="h-4 w-4 shrink-0 opacity-50 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </Link>
                  ))}
                </div>
              </Card>

              <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#800020] via-[#650019] to-[#33060f] p-6 text-white shadow-lg shadow-[#800020]/25">
                <svg
                  viewBox="0 0 200 80"
                  className="pointer-events-none absolute -bottom-2 right-0 h-24 w-48 opacity-30"
                  aria-hidden
                >
                  <path
                    d="M0 70 L40 55 L70 62 L110 35 L150 42 L200 8"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h3 className="text-xl font-extrabold">Grow Your Gym</h3>
                <p className="mt-1 text-sm text-white/80">Better tools. More members. Bigger success.</p>
                <Link
                  href="/admin/reports"
                  className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#800020] transition hover:bg-[#faf7f2]"
                >
                  View Analytics <Icon name="chevRight" className="h-4 w-4" />
                </Link>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}