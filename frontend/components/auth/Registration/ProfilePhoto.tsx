
"use client";

type ProfilePhotoProps = {
  photo: string;
  initial: string;
  photoError: string;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onPhotoChange: (file?: File) => void;
  onRemovePhoto: () => void;
};

export default function ProfilePhoto({
  photo,
  initial,
  photoError,
  fileRef,
  onPhotoChange,
  onRemovePhoto,
}: ProfilePhotoProps) {
  return (
    <section className="w-full rounded-2xl bg-[#faf7f2] p-5 ring-1 ring-[#800020]/10 sm:p-6">
      <div className="mb-4">
        <h3 className="font-bold text-[#800020]">
          Profile Picture
        </h3>

        <p className="mt-1 text-xs text-[#800020]/55">
          Upload a clear profile picture (optional).
        </p>
      </div>

      <div className="flex w-full flex-col items-center gap-5 sm:flex-row">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[#800020]/30 bg-white text-3xl font-bold text-[#800020]/50">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt="Profile preview"
              className="h-full w-full object-cover"
            />
          ) : (
            initial || "?"
          )}
        </div>

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(event) => {
              onPhotoChange(event.target.files?.[0]);
              event.target.value = "";
            }}
          />

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#800020] ring-1 ring-[#800020]/20 transition hover:bg-[#800020]/5"
          >
            Upload Photo
          </button>

          <p className="mt-2 text-xs text-[#800020]/50">
            PNG, JPG or WEBP. Maximum size 2 MB.
          </p>

          {photo && (
            <button
              type="button"
              onClick={onRemovePhoto}
              className="mt-2 text-xs font-bold text-rose-700 underline"
            >
              Remove photo
            </button>
          )}

          {photoError && (
            <p className="mt-2 text-xs font-semibold text-rose-700">
              {photoError}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
