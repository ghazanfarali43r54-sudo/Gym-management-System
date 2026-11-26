"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { Trainer, TrainerStatus } from "@/types/trainer.types";

import {
  getTrainers,
  saveTrainer as saveTrainerRequest,
  deleteTrainer as deleteTrainerRequest,
  updateTrainerStatus as updateTrainerStatusRequest,
} from "@/features/trainers/trainerApis";

export function useTrainers() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<"All" | TrainerStatus>(
    "All"
  );

  // Fetch trainers
  const fetchTrainers = useCallback(async () => {
    try {
      const data = await getTrainers();

      setTrainers(data);
      setErrorMessage("");
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Create or update trainer
  const saveTrainerData = useCallback(
    async (
      id: string | null,
      payload: Record<string, unknown>
    ): Promise<boolean> => {
      setSaving(true);
      setErrorMessage("");

      try {
        await saveTrainerRequest(id, payload);

        // Background mein trainer list refresh hogi
        void fetchTrainers();

        return true;
      } catch (error: unknown) {
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to save trainer"
        );

        return false;
      } finally {
        setSaving(false);
      }
    },
    [fetchTrainers]
  );

  // Delete trainer
  const deleteTrainerData = useCallback(
    async (id: string): Promise<boolean> => {
      setSaving(true);
      setErrorMessage("");

      try {
        await deleteTrainerRequest(id);
        await fetchTrainers();

        return true;
      } catch (error: unknown) {
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to delete trainer"
        );

        return false;
      } finally {
        setSaving(false);
      }
    },
    [fetchTrainers]
  );

  // Activate or deactivate trainer
  const changeTrainerStatus = useCallback(
    async (id: string, status: "active" | "inactive"): Promise<boolean> => {
      setSaving(true);
      setErrorMessage("");

      try {
        await updateTrainerStatusRequest(id, status);
        await fetchTrainers();

        return true;
      } catch (error: unknown) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to update trainer status"
        );

        return false;
      } finally {
        setSaving(false);
      }
    },
    [fetchTrainers]
  );

  // Initial API call
  // Initial API call
  useEffect(() => {
    let isMounted = true;

    const loadTrainers = async () => {
      try {
        const data = await getTrainers();

        if (isMounted) {
          setTrainers(data);
          setErrorMessage("");
        }
      } catch (error: unknown) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error ? error.message : "Something went wrong"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadTrainers();

    return () => {
      isMounted = false;
    };
  }, []);

  // Search and status filtering
  const filteredTrainers = useMemo(() => {
    return trainers.filter((trainer) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        trainer.name.toLowerCase().includes(searchValue) ||
        trainer.email.toLowerCase().includes(searchValue) ||
        trainer.phone.toLowerCase().includes(searchValue) ||
        trainer.specialization.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || trainer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [trainers, search, statusFilter]);

  // Trainer statistics
  const activeCount = trainers.filter(
    (trainer) => trainer.status === "Active"
  ).length;

  const inactiveCount = trainers.filter(
    (trainer) => trainer.status === "Inactive"
  ).length;

  return {
    trainers,
    setTrainers,
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
    fetchTrainers,
    saveTrainerData,
    deleteTrainerData,
    changeTrainerStatus,
  };
}
