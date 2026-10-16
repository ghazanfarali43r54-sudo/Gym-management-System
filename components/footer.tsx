import Link from "next/link";
import type { ReactNode } from "react";
import PaymentMethods from "./PaymentMethods";

/* ---------- data ---------- */

const services = [
  { label: "Membership Plans", href: "/membership" },
  { label: "Personal Training", href: "/training" },
  { label: "Class Schedule", href: "/classes" },
  { label: "Gym Equipment", href: "/equipment" },
];

const help = [
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "My Account", href: "/account" },
];

const legal = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
];

/* ---------- icons ---------- */

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const Chevron = () => (
  <svg {...iconProps} className="h-3.5 w-3.5 shrink-0 text-[#800020]">
    <path d="m9 6 6 6-6 6" />
  </svg>
);

const MailIcon = () => (
  <svg {...iconProps} className="h-4 w-4 text-[#800020]">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

const PhoneIcon = () => (
  <svg {...iconProps} className="h-4 w-4 text-[#800020]">
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
);

const PinIcon = () => (
  <svg {...iconProps} className="h-4 w-4 text-[#800020]">
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

const DumbbellIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2.2"
    strokeLinecap="round"
    aria-hidden
    className="h-6 w-6"
  >
    <path d="M3 10v4M6.5 7v10M17.5 7v10M21 10v4M6.5 12h11" />
  </svg>
);

/* ---------- reusable pieces ---------- */

function ColumnTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-4 text-base font-bold text-[#800020]">{children}</h3>
  );
}

function LinkList({ items }: { items: { label: string; href: string }[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label}>
          <Link
            href={item.href}
            className="flex items-center gap-2.5 text-sm text-neutral-800 transition-colors hover:text-[#800020]"
          >
            <Chevron />
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* ---------- social ---------- */

function Socials() {
  const base =
    "flex h-9 w-9 items-center justify-center rounded-full bg-[#800020] text-white transition hover:bg-[#5e0018]";

  return (
    <div className="flex items-center gap-3 ">
      <a href="https://instagram.com" aria-label="Instagram" className={base}>
        <svg {...iconProps} className="h-[18px] w-[18px]">
          <rect x="4" y="4" width="16" height="16" rx="5" />
          <circle cx="12" cy="12" r="3.5" />
          <circle cx="17" cy="7" r=".6" fill="currentColor" />
        </svg>
      </a>

      <a href="https://facebook.com" aria-label="Facebook" className={base}>
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden>
          <path d="M13.5 21v-7.5H16l.5-3h-3V8.7c0-.9.3-1.5 1.6-1.5h1.5V4.5c-.3 0-1.2-.1-2.2-.1-2.3 0-3.9 1.4-3.9 4v2.1H8v3h2.5V21h3Z" />
        </svg>
      </a>

      <a href="https://youtube.com" aria-label="YouTube" className={base}>
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
          <path d="M8 5v14l11-7L8 5Z" />
        </svg>
      </a>
    </div>
  );
}

/* ---------- footer ---------- */

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#800020]/15 bg-[#faf7f2] text-neutral-900">
      {/* ===== main columns ===== */}
      <div className="px-6 py-10 sm:px-8 lg:px-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-8">
          {/* Gym info */}
          <div>
            {/* <ColumnTitle>Gym info :</ColumnTitle> */}

            <Link href="/" className="mb-5 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#800020]">
                <DumbbellIcon />
              </span>
              <span>
                <span className="block text-xl font-bold leading-tight text-neutral-900">
                  GymMaster <span className="text-[#800020]">Pro</span>
                </span>
                <span className="block text-[11px] text-neutral-600">
                  Your partner in fitness management
                </span>
              </span>
            </Link>

            <ul className="space-y-3 text-sm text-neutral-800">
              <li className="flex items-center gap-3">
                <MailIcon />
                <a href="mailto:support@gymmasterpro.com" className="hover:text-[#800020]">
                  support@gymmasterpro.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon />
                <a href="tel:+923001234567" className="hover:text-[#800020]">
                  +92 300 1234567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <PinIcon />
                Pakistan
              </li>
            </ul>
          </div>

          {/* Gym Services */}
          <div>
            <ColumnTitle>Gym Services :</ColumnTitle>
            <LinkList items={services} />
          </div>

          {/* Help */}
          <div>
            <ColumnTitle>Help :</ColumnTitle>
            <LinkList items={help} />
          </div>

          {/* Social */}
          <div>
            <ColumnTitle>Connect with us</ColumnTitle>
            
            <Socials />
         <div className="border-t border-[#800020]/15">
        <PaymentMethods />
      </div>
            
          </div>
        </div>
      </div>

      {/* ===== bottom bar ===== */}
      <div className="border-t border-[#800020]/15">
        <div className="flex flex-col items-center justify-between gap-3 px-6 py-4 text-xs text-neutral-700 sm:flex-row sm:px-8 lg:px-12">
          <p>© 2026 GymMaster Pro. All rights reserved.</p>

          <ul className="flex items-center">
            {legal.map((item, i) => (
              <li key={item.label} className="flex items-center">
                {i > 0 && <span className="mx-3 h-3 w-px bg-[#800020]/30" />}
                <Link href={item.href} className="hover:text-[#800020]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}