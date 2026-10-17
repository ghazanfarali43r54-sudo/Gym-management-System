import Link from "next/link";
import { Clock, Users, Check, ArrowRight, Star, CheckCircle2 } from "lucide-react";

const highlights = ["Surprise pricing", "Diet plan included", "Expert guidance"];

const plans = [
  {
    title: "Strength Training",
    duration: "60-90 min",
    people: "8-30 people",
    features: [
      "Strength training only",
      "Free weights access",
      "Basic diet plan",
      "General training guidance",
    ],
  },
  {
    title: "Cardio Only",
    duration: "45-60 min",
    people: "10-15 people",
    features: [
      "Cardio equipment access",
      "Treadmill & cycling",
      "Basic diet plan",
      "Cardio guidance",
    ],
  },
  {
    title: "Cardio + Strength",
    duration: "60-90 min",
    people: "8-45 people",
    features: [
      "Full gym access",
      "Cardio & strength training",
      "Comprehensive diet plan",
      "Personal guidance",
    ],
  },
  {
    title: "Group Class (Strength)",
    duration: "60 min",
    people: "10-20 people",
    features: [
      "Guided strength sessions",
      "Certified trainer",
      "Basic diet plan",
      "Community motivation",
    ],
  },
  {
    title: "Group Class (Cardio + Strength)",
    duration: "60-75 min",
    people: "10-25 people",
    popular: true,
    features: [
      "Cardio & strength mix",
      "Certified trainer",
      "Comprehensive diet plan",
      "Progress tracking",
    ],
  },
  {
    title: "Personal Training",
    duration: "60 min",
    people: "1 on 1",
    features: [
      "Dedicated personal trainer",
      "Custom workout plan",
      "Personalized diet plan",
      "Weekly progress review",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-[#FAF7F2] py-20 text-[#800000]">
      <div className="mx-auto max-w-8xl px-4">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-black md:text-5xl">
            Membership Plans with Surprise Pricing
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg">
            Price barriers? That&apos;s old gym talk. Visit FitLife — our team
            will surprise you with a deal as powerful as your first workout.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
            {highlights.map((item) => (
              <span key={item} className="flex items-center gap-2">
                <CheckCircle2 size={18} />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <div
              key={plan.title}
              className={`relative flex flex-col rounded-2xl border bg-[#FFFDF9] p-7 transition hover:shadow-lg ${
                plan.popular
                  ? "border-[#800000] shadow-md"
                  : "border-[#800000]/15"
              } ${i % 3 === 1 ? "lg:-translate-y-2" : ""}`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-[#800000] px-4 py-1 text-xs font-semibold text-[#FAF7F2]">
                  <Star size={12} fill="currentColor" /> Most Popular
                </span>
              )}

              <h3 className="text-lg font-semibold text-black">{plan.title}</h3>

              <p className="mt-4 text-3xl font-extrabold">Surprise Pricing</p>
              <p className="mt-1 text-sm opacity-70">
                Better than you expect — see it live at the gym!
              </p>

              <div className="mt-5 flex items-center gap-4 text-sm opacity-80">
                <span className="flex items-center gap-1.5">
                  <Clock size={16} /> {plan.duration}
                </span>
                <span className="h-1 w-1 rounded-full bg-[#800000]/50" />
                <span className="flex items-center gap-1.5">
                  <Users size={16} /> {plan.people}
                </span>
              </div>

              <ul className="mt-6 flex-1 space-y-3 border-t border-[#800000]/15 pt-6 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <Check size={16} className="shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-[#800000]/15 pt-6 text-center">
                <Link
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full bg-[#800000] px-7 py-2.5 text-sm font-semibold text-[#FAF7F2] transition hover:bg-[#660000]"
                >
                  Enroll Now <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}