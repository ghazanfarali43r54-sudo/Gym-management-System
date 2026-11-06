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
         
      </div>
    </section>
  );
}