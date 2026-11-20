"use client";

import {
  Dumbbell,
  Heart,
  Zap,
  Apple,
} from "lucide-react";

const features = [
  {
    title: "Strength Training",
    description:
      "Build muscle and increase power with our comprehensive strength training programs and state-of-the-art equipment.",
    icon: Dumbbell,
  },
  {
    title: "Cardio Fitness",
    description:
      "Improve cardiovascular health and endurance with our dynamic cardio workouts and modern machines.",
    icon: Heart,
  },
  {
    title: "MMA Training",
    description:
      "Learn mixed martial arts from professional fighters with authentic combat sports training programs.",
    icon: Zap,
  },
  {
    title: "Nutrition Coaching",
    description:
      "Get personalized nutrition plans and dietary guidance to complement your fitness journey.",
    icon: Apple,
  },
];

export default function Features() {
  return (
    <section className="w-full bg-[#faf7f2] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#800020] sm:text-4xl">
            Why Choose StayFit?
          </h2>

          <p className="mt-4 text-base leading-7 text-[#55464a] sm:text-lg">
            We provide comprehensive fitness solutions with expert guidance,
            modern equipment, and personalized programs to help you achieve
            your goals.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="
                  group
                  flex min-h-[270px] cursor-pointer flex-col items-center
                  justify-center rounded-2xl border border-[#eadfdc]
                  bg-[#fffdf9] px-6 py-8 text-center
                  shadow-[0_4px_14px_rgba(0,0,0,0.06)]
                  transition-all duration-300 ease-out
                  hover:-translate-y-2
                  hover:scale-105
                  hover:border-[#800020]/40
                  hover:shadow-[0_18px_40px_rgba(0,0,0,0.14)]
                "
              >
                {/* Icon */}
                <div
                  className="
                    mb-8 flex h-14 w-14 items-center justify-center
                    rounded-full transition-all duration-300
                    group-hover:bg-[#800020]/10
                    group-hover:scale-110
                  "
                >
                  <Icon
                    size={31}
                    strokeWidth={2}
                    className="
                      text-[#800020]
                      transition-colors duration-300
                      group-hover:text-[#800020]
                    "
                  />
                </div>

                {/* Title */}
                <h3
                  className="
                    text-lg font-bold text-[#4a1525]
                    transition-colors duration-300
                    group-hover:text-[#800020]
                  "
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-4 text-sm leading-6 text-[#55464a]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
