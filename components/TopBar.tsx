import Link from "next/link";

const icon = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export default function TopBar() {
  return (
    <div className="bg-black text-sm text-white">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-8">
          <a href="tel:+923424267060" className="flex items-center gap-2 hover:text-red-400">
            <svg {...icon} className="h-4 w-4">
              <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
            </svg>
            +92 342 4267060
          </a>
          <a
            href="mailto:support@gympassport.pk"
            className="hidden items-center gap-2 hover:text-red-400 sm:flex"
          >
            <svg {...icon} className="h-4 w-4">
              <rect x="3" y="5" width="18" height="14" rx="2.5" />
              <path d="m3.5 7.5 8.5 6 8.5-6" />
            </svg>
            support@gympassport.pk
          </a>
        </div>

        <div className="flex items-center gap-5">
          <button className="hidden items-center gap-1.5 sm:flex" aria-label="Country">
            <span className="flex h-4 w-6 overflow-hidden rounded-sm">
              <span className="w-1/4 bg-white" />
              <span className="flex-1 bg-green-700" />
            </span>
            <svg {...icon} className="h-3.5 w-3.5">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          <span className="hidden h-5 w-px bg-white/30 sm:block" />

          <Link href="/partner/login" className="hover:text-red-400">
            Partner Login
          </Link>

          <span className="hidden h-5 w-px bg-white/30 sm:block" />

          <div className="hidden items-center gap-4 sm:flex">
            <a href="#" aria-label="LinkedIn" className="hover:text-red-400">
              <svg {...icon} className="h-5 w-5">
                <path d="M6 9v10M6 5v.5M11 19v-6a3 3 0 0 1 6 0v6M11 9v10" />
              </svg>
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-red-400">
              <svg {...icon} className="h-5 w-5">
                <rect x="4" y="4" width="16" height="16" rx="5" />
                <circle cx="12" cy="12" r="3.5" />
                <circle cx="17" cy="7" r=".6" fill="currentColor" />
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-red-400">
              <svg {...icon} className="h-5 w-5">
                <path d="M14 8h2V4.5h-2.5A3.5 3.5 0 0 0 10 8v2H8v3.5h2V20h3.5v-6.5H16l.5-3.5h-3V8.5c0-.3.2-.5.5-.5Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}