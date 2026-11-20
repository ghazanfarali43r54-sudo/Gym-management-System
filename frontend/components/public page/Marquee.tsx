const items = [
  "Gyms & Studios",
  "Swimming Pools & Sauna",
  "Diet Plans",
  "Physiotherapy",
  "Mental Health",
  "Padel & Sports",
];

function Group() {
  return (
    <div className="flex shrink-0 items-center">
      {items.map((text, i) => (
        <div key={text} className="flex items-center">
          <span
            className={`whitespace-nowrap text-5xl font-extrabold uppercase tracking-tight sm:text-6xl ${
              i % 2 === 0 ? "text-[#14141f]" : "text-slate-300"
            }`}
          >
            {text}
          </span>
          <span className="mx-10 h-3 w-3 rotate-45 bg-[#b52a2d]" />
        </div>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <section
      className="w-full overflow-hidden bg-[#fdf6f6] py-8"
      aria-label="Our services"
    >
      <style>{`
        @keyframes marquee-move {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track { animation: marquee-move 35s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>

      <div className="marquee-track flex w-max">
        <Group />
        <Group />
      </div>
    </section>
  );
}