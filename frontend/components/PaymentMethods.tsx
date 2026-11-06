export default function PaymentMethods() {
  return (
    <div className="px-6 py-6 sm:px-8 lg:px-1">
      <h3 className="mb-4 text-base font-bold text-[#800020]">We accept</h3>

      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        {/* JazzCash */}
        <span className="text-base font-extrabold italic leading-none">
          <span className="text-red-600">Jazz</span>
          <span className="text-yellow-500">Cash</span>
        </span>

        {/* easypaisa */}
        <span className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
          <span className="h-4 w-4 rounded-full border-[3px] border-green-600" />
          easypaisa
        </span>

        {/* Visa */}
        <span className="text-2xl font-black italic tracking-tight text-[#1a1f71]">
          VISA
        </span>

        {/* Mastercard */}
        <span className="flex flex-col items-center">
          <span className="flex">
            <span className="h-7 w-7 rounded-full bg-red-500" />
            <span className="-ml-3 h-7 w-7 rounded-full bg-orange-400/90" />
          </span>
          <span className="mt-0.5 text-[7px] text-neutral-600">mastercard</span>
        </span>

        {/* American Express */}
        <span className="flex h-8 w-[46px] items-center justify-center rounded-sm bg-[#2e77bb] text-center text-[7px] font-bold leading-[1.1] text-white">
          AMERICAN
          <br />
          EXPRESS
        </span>

        <span className="hidden h-8 w-px bg-[#800020]/20 sm:block" />

        {/* Apple Pay */}
        <span className="flex items-center gap-1 text-lg font-medium text-neutral-900">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
            <path d="M16.4 12.6c0-2.2 1.8-3.2 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8s-1.7-.8-2.8-.8c-1.4 0-2.8.8-3.5 2.1-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.2s1.5-.7 2.8-.7 1.7.7 2.8.7 1.9-1 2.6-2.1c.8-1.2 1.1-2.3 1.2-2.4-.1 0-2.3-.9-2.3-3.4ZM14.3 6.2c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6 1 .1 1.9-.5 2.5-1.2Z" />
          </svg>
          Pay
        </span>

        {/* {/* Google Pay  */}
        <span className="text-lg font-medium text-neutral-800">
          <span className="font-bold text-blue-600">G</span> Pay
        </span>
      </div>
    </div>
  );
}