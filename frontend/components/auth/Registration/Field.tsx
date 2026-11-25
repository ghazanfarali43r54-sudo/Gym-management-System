import type { ReactNode } from "react";

type FieldProps = {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
};

export default function Field({
  label,
  required = false,
  error,
  children,
}: FieldProps) {
  return (
    <div className="min-w-0 w-full">
      <label className="mb-2 block text-sm font-bold text-[#800020]">
        {label}
        {required && <span className="ml-1 text-rose-600">*</span>}
      </label>

      {children}

      {error && (
        <p className="mt-1.5 text-xs font-semibold text-rose-700">
          {error}
        </p>
      )}
    </div>
  );
}