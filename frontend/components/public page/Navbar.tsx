import Link from "next/link";
import Image from "next/image";
import NavbarAuth from "@/components/auth/NavbarAuth";

const links = [
  { name: "Home", href: "/" },
  { name: "Our Trainers", href: "#trainers" },
  { name: "Review", href: "#Review" },
  { name: "About", href: "#footer" },
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

        {/* Login / Request Pending / member menu */}
        <NavbarAuth />
      </div>
    </nav>
  );
}