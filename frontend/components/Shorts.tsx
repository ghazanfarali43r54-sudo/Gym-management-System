"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type Venue = {
  id: string;
  title: string;
  city: string;
  tag: string;
  video: string;
};

const venues: Venue[] = [
  {
    id: "1",
    title: "Elite Courts (Glow in the dark Pickle ball)",
    city: "Lahore",
    tag: "Corporate",
    video: "/vedios/vedio1.mp4",
  },
  {
    id: "2",
    title: "Elite Courts (Cricket Bowling Machine)",
    city: "Lahore",
    tag: "Corporate",
    video: "/vedios/vedio2.mp4",
  },
  {
    id: "3",
    title: "Elite Courts (indoor Table Tennis)",
    city: "Lahore",
    tag: "Corporate",
    video: "/vedios/vedio3.mp4",
  },
  {
    id: "4",
    title: "Elite Courts (Badminton)",
    city: "Lahore",
    tag: "Corporate",
    video: "/vedios/vedio4.mp4",
  },
];

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function VenueCard({ v }: { v: Venue }) {
  return (
    <Link
      href={`/locateGym/${v.id}`}
      className="group relative block aspect-[3/4] w-full overflow-hidden rounded-[28px] bg-slate-900"
    >
      <video
        src={v.video}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      <span className="absolute left-5 top-5 rounded-full bg-[#b52a2d] px-4 py-1.5 text-sm font-medium text-white">
        {v.tag}
      </span>

      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="text-2xl font-semibold leading-snug text-white">{v.title}</h3>

        <div className="mt-3 flex items-center justify-between text-white">
          <span className="flex items-center gap-2 text-base">
            <svg {...iconProps} className="h-5 w-5 text-[#e0434a]">
              <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
            {v.city}
          </span>

          <span className="flex items-center gap-2 text-base font-medium">
            View Details
            <svg
              {...iconProps}
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Shorts() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateButtons();
    window.addEventListener("resize", updateButtons);
    return () => window.removeEventListener("resize", updateButtons);
  }, [updateButtons]);

  function scrollByCard(direction: 1 | -1) {
    const el = trackRef.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    el.scrollBy({ left: direction * (card.offsetWidth + 24), behavior: "smooth" });
  }

  return (
    <section className="w-full bg-white py-16">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
        {/* heading + arrows */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#b52a2d]">
              Featured Gyms
            </p>
            <h2 className="mt-3 text-4xl font-bold text-black sm:text-5xl">
              Access Top Venues <span className="text-[#b52a2d]">Across Pakistan</span>
            </h2>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => scrollByCard(-1)}
              disabled={!canPrev}
              aria-label="Previous"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-800 transition enabled:hover:bg-slate-200 disabled:text-slate-400"
            >
              <svg {...iconProps} className="h-5 w-5">
                <path d="m15 6-6 6 6 6" />
              </svg>
            </button>
            <button
              onClick={() => scrollByCard(1)}
              disabled={!canNext}
              aria-label="Next"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-800 transition enabled:hover:bg-slate-200 disabled:text-slate-400"
            >
              <svg {...iconProps} className="h-5 w-5">
                <path d="m9 6 6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* carousel */}
        <div
          ref={trackRef}
          onScroll={updateButtons}
          className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {venues.map((v) => (
            <div
              key={v.id}
              className="w-[85%] shrink-0 snap-start sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
            >
              <VenueCard v={v} />
            </div>
          ))}
        </div>

        {/* view all */}
        <div className="mt-14 flex justify-center">
          <Link
            href="/venues"
            className="rounded-full border-2 border-[#b52a2d] px-10 py-4 text-lg font-medium text-[#b52a2d] transition hover:bg-[#b52a2d] hover:text-white"
          >
            View All Venues
          </Link>
        </div>
      </div>
    </section>
  );
}