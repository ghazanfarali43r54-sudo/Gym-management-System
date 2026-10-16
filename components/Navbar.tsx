import Link from "next/link";
import Image from "next/image";

const links = [
  { name: "Home", href: "/" },
  { name: "Ladies Gym", href: "#features" },
  { name: "Personal Trainer", href: "#pricing" },
  { name: "Gym Membership", href: "#about" },
  { name: "About", href: "#contact" },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#800020]/15 bg-[#faf7f2]/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logo.png"  
            alt="FitPro Logo"
            width={140}
            height={60}
            priority
            className="object-contain border  border-pink-950 rounded-2xl "
          />
        </Link>

        {/* Links */}
        <ul className="hidden items-center gap-8 text-base font-medium md:flex">
          {links.map((link, i) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={
                  i === 0
                    ? "border-b-2 border-[#800020] pb-1 font-semibold text-[#800020]"
                    : "pb-1 text-[#800020]/80 transition hover:text-[#800020]"
                }
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Button */}
        <button className="rounded-lg bg-[#800020] px-5 py-2.5 text-base font-semibold text-white transition hover:bg-[#5e0018]">
          Get Started
        </button>
      </div>
    </nav>
  );
}



// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";

// const nav = [
//   { label: "Home", href: "/" },
//   { label: "Venues", href: "/venues" },
//   { label: "Pricing", href: "/pricing" },
//   { label: "For Companies", href: "/companies" },
//   { label: "For Partners", href: "/partners" },
//   { label: "Contact Us", href: "/contact" },
// ];

// export default function Navbar() {
//   const pathname = usePathname();

//   return (
//     <div className="border-b border-slate-100 bg-white">
//       <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-6 px-6 py-5 lg:px-12">
//         {/* logo */}
//         <Link href="/" className="flex items-center gap-2">
//           <span className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-black">
//             <span className="h-5 w-5 rotate-45 rounded-sm bg-[#b52a2d]" />
//           </span>
//           <span className="leading-none">
//             <span className="block text-sm font-bold text-black">Gym</span>
//             <span className="block text-xs tracking-wider text-[#b52a2d]">Passport</span>
//           </span>
//         </Link>

//         {/* pill menu */}
//         <nav className="hidden rounded-full border border-slate-200 p-1.5 lg:block">
//           <ul className="flex items-center gap-1">
//             {nav.map((item) => {
//               const active = pathname === item.href;
//               return (
//                 <li key={item.label}>
//                   <Link
//                     href={item.href}
//                     className={`block rounded-full px-5 py-3 text-base font-medium transition ${
//                       active
//                         ? "bg-[#b52a2d] text-white"
//                         : "text-slate-800 hover:bg-slate-100"
//                     }`}
//                   >
//                     {item.label}
//                   </Link>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>

//         {/* buttons */}
//         <div className="flex items-center gap-3">
//           <Link
//             href="/app"
//             className="flex items-center gap-2.5 rounded-xl bg-[#b52a2d] px-6 py-3.5 text-base font-medium text-white shadow-md transition hover:bg-[#9a2124]"
//           >
//             <svg
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth={1.8}
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className="h-5 w-5"
//               aria-hidden
//             >
//               <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
//               <path d="M11 18.5h2" />
//             </svg>
//             Get The App
//           </Link>
//           <Link
//             href="/login"
//             className="hidden rounded-full border border-slate-300 px-7 py-3.5 text-base font-medium text-slate-900 transition hover:bg-slate-50 sm:block"
//           >
//             Member Login
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }