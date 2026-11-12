export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-screen bg-[#F8F5F0] p-4 text-[#352126] md:p-8"
    >
      <span className="sr-only">Loading features...</span>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-7 w-56 animate-pulse rounded bg-[#E9DDE0]" />
          <div className="mt-3 h-4 w-72 animate-pulse rounded bg-[#E9DDE0]" />
        </div>
        <div className="h-10 w-32 animate-pulse rounded-lg bg-[#E9DDE0]" />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-xl border border-[#E9DDE0] bg-white"
          />
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E9DDE0] bg-white">
        <div className="h-16 animate-pulse border-b border-[#E9DDE0] bg-[#FAF5F5]" />
        <div className="h-52 animate-pulse" />
      </div>
    </div>
  );
}
