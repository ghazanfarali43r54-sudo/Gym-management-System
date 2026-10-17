import Image from "next/image";
import Link from "next/link";
import { Star, Award, Clock, Phone } from "lucide-react";

const trainers = [
  {
    name: "Haider Ali",
    role: "Strength & Performance Coach",
    rating: 5,
    clients: "200+ clients",
    experience: "6+ Years",
    timing: "Mon-Fri: 6AM-10PM",
    specialty: "Strength Training & Athletic Performance",
    bio: "Based in Islamabad, Haider is a dedicated strength and performance coach with a passion for helping everyday people build real strength.",
    tags: ["Strength Training", "Athletic Performance", "Functional Training", "Mobility", "Conditioning", "Nutrition"],
    image: "/images/triner1.png",
  },
  {
    name: "Rabee ul Hassnain",
    role: "Fitness Coach",
    rating: 4.8,
    clients: "50+ clients",
    experience: "2+ Years",
    timing: "Mon-Fri: 7AM-9PM",
    specialty: "Weight Loss & Muscle Building",
    bio: "Based in Rawalpindi, Rabee brings a unique blend of real-world discipline and personal passion to fitness coaching.",
    tags: ["Weight Loss", "Muscle Building", "Personal Training", "Diet Plans"],
    image: "/images/trainer2.png",
  },
  {
    name: "Mahaam Baig",
    role: "MMA Fighter & Combat Sports Coach",
    rating: 5,
    clients: "100+ clients",
    experience: "5+ Years",
    timing: "Mon-Fri: 5AM-9PM",
    specialty: "MMA, Boxing & Kickboxing",
    bio: "Elite combat sports athlete proudly representing Pakistan Air Force (PAF). Mahaam is a decorated champion across multiple combat disciplines.",
    tags: ["MMA", "Boxing", "Kickboxing", "Self Defense", "Conditioning"],
    image: "/images/triner5.png",
  },
  {
    name: "Basit Jhon",
    role: "Cardio & Fitness Coach",
    rating: 4.9,
    clients: "80+ clients",
    experience: "3+ Years",
    timing: "Mon-Sat: 6AM-9PM",
    specialty: "Cardio & Endurance Training",
    bio: "Apni bio yahan likhein. Ye trainer cardio aur endurance training mein maharat rakhta hai.",
    tags: ["Cardio", "Endurance", "HIIT"],
    image: "/images/trainer4.png",
  },
  {
    name: "Mr.Khursheed",
    role: "Personal Trainer",
    rating: 4.7,
    clients: "60+ clients",
    experience: "4+ Years",
    timing: "Mon-Sat: 7AM-10PM",
    specialty: "Personal Training & Body Transformation",
    bio: "Apni bio yahan likhein. Ye trainer one-on-one training aur body transformation par focus karta hai.",
    tags: ["Personal Training", "Transformation", "Diet Plans", "Strength"],
    image: "/images/triner2.png",
  },
  {
    name: "Mr.Zaam",
    role: "Yoga & Flexibility Coach",
    rating: 4.8,
    clients: "70+ clients",
    experience: "3+ Years",
    timing: "Mon-Sat: 6AM-8PM",
    specialty: "Yoga, Mobility & Flexibility",
    bio: "Apni bio yahan likhein. Ye trainer yoga, mobility aur flexibility training mein maharat rakhta hai.",
    tags: ["Yoga", "Mobility", "Flexibility", "Recovery"],
    image: "/images/triner6.png",
  },
];

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function Trainer() {
  return (
    <section id="trainers" className="bg-[#FAF7F2] py-20 text-[#800000]">
      <div className="mx-auto max-w-8xl px-4">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-black md:text-5xl">
            Our Training Team
          </h2>
          <p className="mt-4 text-base md:text-lg">
            Meet the professionals who will guide you on your fitness journey
          </p>
          <p className="mt-3 text-sm opacity-70">
            Showing {trainers.length} of {trainers.length} trainers
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trainers.map((t) => (
            <div
              key={t.name}
              className="flex flex-col overflow-hidden rounded-2xl border border-[#800000]/15 bg-[#FFFDF9] transition hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative h-80 w-full bg-[#F3EDE3]">
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  className="object-cover object-top"
                />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-2xl font-bold text-black">{t.name}</h3>
                <p className="mt-1 text-sm font-medium">{t.role}</p>

                <div className="mt-2 flex items-center gap-2 text-sm">
                  <Star size={16} fill="currentColor" />
                  <span className="font-semibold">{t.rating}</span>
                  <span className="opacity-60">· {t.clients}</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="flex items-center gap-1.5 rounded-full bg-[#800000]/10 px-3 py-1.5 font-medium">
                    <Award size={14} /> {t.experience}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full border border-[#800000]/20 px-3 py-1.5 font-medium">
                    <Clock size={14} /> {t.timing}
                  </span>
                </div>

                <p className="mt-4 text-xs opacity-70">{t.specialty}</p>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed">{t.bio}</p>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  {t.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full bg-[#800000]/5 px-3 py-1.5">
                      {tag}
                    </span>
                  ))}
                  {t.tags.length > 3 && (
                    <span className="rounded-full bg-[#800000]/5 px-3 py-1.5 opacity-70">
                      +{t.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between border-t border-[#800000]/15 pt-5">
                  <div className="flex items-center gap-3 opacity-60">
                    <Link href="#" aria-label="Instagram" className="transition hover:opacity-100">
                      <InstagramIcon />
                    </Link>
                    <Link href="#" aria-label="LinkedIn" className="transition hover:opacity-100">
                      <LinkedinIcon />
                    </Link>
                    <Link href="#" aria-label="Call" className="transition hover:opacity-100">
                      <Phone size={18} />
                    </Link>
                  </div>
                  <Link
                    href="#contact"
                    className="rounded-full bg-[#800000] px-5 py-2 text-sm font-semibold text-[#FAF7F2] transition hover:bg-[#660000]"
                  >
                    Book Session
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}