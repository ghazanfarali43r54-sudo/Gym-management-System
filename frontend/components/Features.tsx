import { Users, CalendarCheck, CalendarClock, CreditCard } from "lucide-react";

const features = [
  { icon: Users, title: "Easy Membership Management" },
  { icon: CalendarCheck, title: "Attendance Tracking" },
  { icon: CalendarClock, title: "Class Scheduling" },
  { icon: CreditCard, title: "Secure Payments" },
];

export default function Features() {
  return (
    <section
      id="features"
      className="border-t border-[#800020]/10 bg-[#faf7f2] py-16 text-center"
    >
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-bold text-[#800020]">Why Choose FitLife?</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-neutral-600">
          We provide everything you need to manage your gym, track progress and
          build a healthier community.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
          {features.map(({ icon: Icon, title }) => (
            <div
              key={title}
              className="flex flex-col items-center gap-4 rounded-xl p-4 md:border-r md:border-[#800020]/15 md:last:border-r-0"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#800020]/10 text-[#800020]">
                <Icon size={26} />
              </span>
              <p className="text-sm font-semibold text-[#800020]">{title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}