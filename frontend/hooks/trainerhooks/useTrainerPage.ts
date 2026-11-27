"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ChangeEvent, FormEvent } from "react";

import type { Trainer, TrainerForm } from "@/types/trainer.types";

import { useTrainers } from "@/hooks/trainerhooks/useTrainers";

import {
  validateTrainerForm,
  buildTrainerPayload,
  buildTrainerForm,
  emptyTrainerForm,
} from "@/utils/trainerUtils/trainerUtilsHelper";

export function useTrainerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    trainers,
    loading,
    saving,
    errorMessage,
    setErrorMessage,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredTrainers,
    activeCount,
    inactiveCount,
    saveTrainerData,
    deleteTrainerData,
    changeTrainerStatus,
  } = useTrainers();

  const [formDraft, setFormDraft] = useState<{
    key: string;
    value: TrainerForm;
  } | null>(null);
  const [photo, setPhoto] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [deleteTrainer, setDeleteTrainer] = useState<Trainer | null>(null);
  const [today] = useState(() => new Date().toISOString().slice(0, 10));

  //updateField function
  const updateField = (field: string, value: string) => {
    setErrorMessage("");

    setFormDraft((previous) => ({
      key: formKey,
      value: {
        ...(previous?.key === formKey ? previous.value : form),
        [field]: value,
      },
    }));
  };

  //fieldError function
  const fieldError = (field: string): string | undefined => {
    if (field === "photo") return photoError || undefined;
    return undefined;
  };

  const view = searchParams.get("view");
  const trainerId = searchParams.get("id");

  // Current URL state
  const formKey = view === "edit" ? `edit:${trainerId}` : "add";

  // Find trainer from URL
  const editingTrainer = useMemo(() => {
    if (view !== "edit" || !trainerId) return null;

    return trainers.find((trainer) => trainer.id === trainerId) ?? null;
  }, [view, trainerId, trainers]);

  // Modal visibility comes from URL
  const modalOpen =
    view === "add" || (view === "edit" && editingTrainer !== null);

  // Form data comes from draft or selected trainer
  const form: TrainerForm =
    formDraft?.key === formKey
      ? formDraft.value
      : view === "edit" && editingTrainer
      ? buildTrainerForm(editingTrainer)
      : emptyTrainerForm;
  // Default URL view
  useEffect(() => {
    if (!view) {
      router.replace("/admin/trainers?view=list");
    }
  }, [view, router]);

  // Close trainer action menus on outside click
  useEffect(() => {
    const closeMenusOnOutsideClick = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) return;

      document
        .querySelectorAll<HTMLDetailsElement>("details[open]")
        .forEach((menu) => {
          if (!menu.contains(target)) {
            menu.open = false;
          }
        });
    };

    document.addEventListener("pointerdown", closeMenusOnOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", closeMenusOnOutsideClick);
    };
  }, []);

  // Open trainer dashboard
  const openTrainerDashboard = (id: string) => {
    router.push(`/admin/trainers/${encodeURIComponent(id)}/dashboard`);
  };

  // Open add modal
  const openAddModal = () => {
    setFormDraft({ key: "add", value: emptyTrainerForm });
    setPhoto("");
    setSelectedPhoto(null);
    setPhotoRemoved(false);
    setPhotoError("");
    setErrorMessage("");
    router.push("/admin/trainers?view=add");
  };
  // Open edit modal
  const openEditModal = (trainer: Trainer) => {
    setFormDraft({
      key: `edit:${trainer.id}`,
      value: buildTrainerForm(trainer),
    });

    setPhoto(trainer.photo || "");
    setSelectedPhoto(null);
    setPhotoRemoved(false);
    setPhotoError("");
    setErrorMessage("");

    router.push(
      `/admin/trainers?view=edit&id=${encodeURIComponent(trainer.id)}`
    );
  };

  const handlePhoto = async (file?: File) => {
    if (!file) return;

    setPhotoError("");

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setPhotoError("Choose a PNG, JPG, or WEBP image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setPhotoError("Photo must be smaller than 2 MB.");
      return;
    }

    let bitmap: ImageBitmap | null = null;

    try {
      bitmap = await createImageBitmap(file);

      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Image processing is unavailable.");
      }

      const side = Math.min(bitmap.width, bitmap.height);

      context.drawImage(
        bitmap,
        (bitmap.width - side) / 2,
        (bitmap.height - side) / 2,
        side,
        side,
        0,
        0,
        256,
        256
      );

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (result) => {
            if (result) resolve(result);
            else reject(new Error("Unable to compress image."));
          },
          "image/jpeg",
          0.85
        );
      });

      const compressedFile = new File([blob], "profile-photo.jpg", {
        type: "image/jpeg",
      });

      setSelectedPhoto(compressedFile);
      setPhoto(canvas.toDataURL("image/jpeg", 0.85));
      setPhotoRemoved(false);
    } catch {
      setPhotoError("Unable to process this photo.");
    } finally {
      bitmap?.close();
    }
  };

  const removePhoto = () => {
    setPhoto("");
    setSelectedPhoto(null);
    setPhotoRemoved(true);
    setPhotoError("");
  };
  // Close modal
  const closeModal = () => {
    setPhoto("");
    setSelectedPhoto(null);
    setPhotoRemoved(false);
    setPhotoError("");
    setFormDraft(null);

    router.push("/admin/trainers?view=list");
  };

  // Submit trainer form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validateTrainerForm(form, Boolean(editingTrainer));

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setErrorMessage("");

    const payload = buildTrainerPayload(form, selectedPhoto, photoRemoved);

    const success = await saveTrainerData(editingTrainer?.id ?? null, payload);

    if (success) {
      setFormDraft(null);
      setErrorMessage("");
      router.replace("/admin/trainers?view=list");
    }
  };

  // Delete trainer
  const confirmDelete = async () => {
    if (!deleteTrainer) return;

    const success = await deleteTrainerData(deleteTrainer.id);

    if (success) {
      setDeleteTrainer(null);
    }
  };

  // Toggle trainer status
  const toggleStatus = async (trainer: Trainer) => {
    const newStatus = trainer.status === "Active" ? "inactive" : "active";

    await changeTrainerStatus(trainer.id, newStatus);
  };

  // Handle form inputs
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormDraft((previous) => ({
      key: formKey,
      value: {
        ...(previous?.key === formKey ? previous.value : form),
        [name]: value,
      },
    }));
  };

  return {
    trainers,
    loading,
    saving,
    errorMessage,

    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredTrainers,
    activeCount,
    inactiveCount,

    modalOpen,
    editingTrainer,
    form,
    deleteTrainer,
    setDeleteTrainer,

    openTrainerDashboard,
    openAddModal,
    openEditModal,
    closeModal,
    handleSubmit,
    confirmDelete,
    toggleStatus,
    handleChange,
    photo,
    selectedPhoto,
    photoRemoved,
    photoError,
    handlePhoto,
    removePhoto,
    today,
    updateField,
    fieldError,
  };
}
