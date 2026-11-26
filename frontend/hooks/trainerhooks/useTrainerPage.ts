
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ChangeEvent, FormEvent } from "react";

import type {
  Trainer,
  TrainerForm,
} from "@/types/trainer.types";

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

  const [deleteTrainer, setDeleteTrainer] =
    useState<Trainer | null>(null);

  const view = searchParams.get("view");
  const trainerId = searchParams.get("id");

  // Current URL state
  const formKey =
    view === "edit"
      ? `edit:${trainerId}`
      : "add";

  // Find trainer from URL
  const editingTrainer = useMemo(() => {
    if (view !== "edit" || !trainerId) return null;

    return trainers.find((trainer) => trainer.id === trainerId) ?? null;
  }, [view, trainerId, trainers]);

  // Modal visibility comes from URL
  const modalOpen =
    view === "add" ||
    (view === "edit" && editingTrainer !== null);

  // Form data comes from draft or selected trainer
  const form = useMemo(() => {
    if (formDraft?.key === formKey) {
      return formDraft.value;
    }

    if (view === "edit" && editingTrainer) {
      return buildTrainerForm(editingTrainer);
    }

    return emptyTrainerForm;
  }, [formDraft, formKey, view, editingTrainer]);

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
      document.removeEventListener(
        "pointerdown",
        closeMenusOnOutsideClick
      );
    };
  }, []);

  // Open trainer dashboard
  const openTrainerDashboard = (id: string) => {
    router.push(
      `/admin/trainers/${encodeURIComponent(id)}/dashboard`
    );
  };

  // Open add modal
  const openAddModal = () => {
    setFormDraft({
      key: "add",
      value: emptyTrainerForm,
    });

    setErrorMessage("");
    router.push("/admin/trainers?view=add");
  };

  // Open edit modal
  const openEditModal = (trainer: Trainer) => {
    setFormDraft({
      key: `edit:${trainer.id}`,
      value: buildTrainerForm(trainer),
    });

    setErrorMessage("");

    router.push(
      `/admin/trainers?view=edit&id=${encodeURIComponent(trainer.id)}`
    );
  };

  // Close modal
  const closeModal = () => {
    router.push("/admin/trainers?view=list");
  };

  // Submit trainer form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validateTrainerForm(
      form,
      Boolean(editingTrainer)
    );

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setErrorMessage("");

    const payload = buildTrainerPayload(form);

    const success = await saveTrainerData(
      editingTrainer?.id ?? null,
      payload
    );

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
    const newStatus =
      trainer.status === "Active" ? "inactive" : "active";

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
  };
}
