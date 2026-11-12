"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { API_URL } from "@/lib/api";

const highlights = ["Surprise pricing", "Diet plan included", "Expert guidance"];

type Plan = {
  _id: string;
  name: string;
  description?: string;
  duration: { value: number; unit: string };
  price: number;
  features: { _id: string; name: string }[];
  status: string;
};

export default function Pricing() {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/membership-plans`)
      .then((response) => response.json())
      .then((body) => setPlans((body.data ?? []).filter((plan: Plan) => plan.status === "active")))
      .catch(() => setPlans([]));
  }, []);

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

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan._id} className="rounded-2xl border border-[#eadadd] bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-black">{plan.name}</h3>
              {plan.description && <p className="mt-2 text-sm text-gray-600">{plan.description}</p>}
              <p className="mt-5 text-3xl font-extrabold text-[#800000]">
                Rs. {Number(plan.price).toLocaleString("en-PK")}
              </p>
              <p className="mt-1 text-sm text-gray-600">for {plan.duration.value} {plan.duration.unit}{plan.duration.value > 1 ? "s" : ""}</p>
              {plan.features?.length > 0 && (
                <ul className="mt-5 space-y-2 text-sm text-gray-700">
                  {plan.features.map((feature) => (
                    <li key={feature._id} className="flex gap-2"><CheckCircle2 size={18} className="shrink-0 text-[#800000]" />{feature.name}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
