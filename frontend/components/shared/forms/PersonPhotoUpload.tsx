
"use client";

import Image from "next/image";

type PersonPhotoUploadProps = {
  photo: string;
  name: string;
  editing: boolean;
  personType: "Member" | "Trainer";
  photoError: string;
  fieldError: (field: string) => React.ReactNode;
  onPhoto: (file?: File) => void;
  onRemove: () => void;
};

export default function PersonPhotoUpload({
  photo,
  name,
  editing,
  personType,
  photoError,
  fieldError,
  onPhoto,
  onRemove,
}: PersonPhotoUploadProps) {
  return (
    <div className="mb-6 rounded-xl border border-[#e7dcd6] bg-[#fffdfa] p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f3eae5] text-xl font-bold text-[#641d32]">
          {photo ? (
            <Image
              src={photo}
              alt={`${personType} profile preview`}
              width={64}
              height={64}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            name.trim().charAt(0).toUpperCase() ||
            personType.charAt(0)
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="pr-10 text-right text-lg font-bold text-[#4b1725]">
            {editing ? `Edit ${personType}` : `Add New ${personType}`}
          </h2>

          <div className="mt-1 flex items-center justify-between">
            <p className="text-xs text-[#8b7771]">
              Profile Picture (Optional)
            </p>

            <p className="text-xs text-[#8b7771]">
              {editing
                ? `Update ${personType.toLowerCase()} information`
                : `Enter details to register a new ${personType.toLowerCase()}.`}
            </p>
          </div>

          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => {
              onPhoto(event.target.files?.[0]);
              event.target.value = "";
            }}
            className="mt-2 block w-full text-sm"
          />

          <p className="mt-1 text-xs text-[#8b7771]">
            PNG, JPG or WEBP, maximum 2 MB.
          </p>

          {photo && (
            <button
              type="button"
              onClick={onRemove}
              className="mt-1 text-xs font-semibold text-[#641d32] underline"
            >
              Remove photo
            </button>
          )}

          {photoError && (
            <p className="mt-1 text-xs text-red-700">{photoError}</p>
          )}

          {fieldError("photo")}
        </div>
      </div>
    </div>
  );
}
