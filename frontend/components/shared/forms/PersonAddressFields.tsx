
"use client";

import type { ReactNode } from "react";

export type PersonAddressFormValues = {
  street: string;
  city: string;
  country: string;
};

type PersonAddressFieldsProps = {
  form: PersonAddressFormValues;
  fieldError: (field: string) => ReactNode;
  updateField: (
    field: keyof PersonAddressFormValues,
    value: string
  ) => void;
};

export default function PersonAddressFields({
  form,
  fieldError,
  updateField,
}: PersonAddressFieldsProps) {
  const inputClass =
    "w-full rounded-xl border border-[#e7dcd6] bg-white px-4 py-3 text-sm outline-none focus:border-[#641d32]";

  const labelClass =
    "mb-2 block text-sm font-semibold text-[#4b1725]";

  const fields = [
    { key: "street", label: "Street", maxLength: 150 },
    { key: "city", label: "City", maxLength: 100 },
    { key: "country", label: "Country", maxLength: 100 },
  ] as const;

  return (
    <>
      <div className="md:col-span-2 border-t border-[#eadfd9] pt-4">
        <h3 className="font-semibold text-[#4b1725]">
          Address
        </h3>
      </div>

      {fields.map((field) => (
        <div key={field.key}>
          <label className={labelClass}>
            {field.label}
          </label>

          <input
            value={form[field.key]}
            onChange={(event) =>
              updateField(field.key, event.target.value)
            }
            maxLength={field.maxLength}
            className={inputClass}
          />

          {fieldError(field.key)}
        </div>
      ))}
    </>
  );
}
