import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  buildCreateMemberPayload,
  buildEditMemberForm,
  buildUpdateMemberPayload,
  changeMemberStatus,
  createMember,
  deleteMember,
  emptyMemberForm,
  getArray,
  getMemberById,
  listMemberTrainers,
  listMembershipPlans,
  listMembers,
  mapMemberApiErrors,
  normalizeMember,
  updateMember,
  type Member,
  type MemberForm,
  type MembershipPlanOption,
  type TrainerOption,
} from "@/features/memberApi";

export function useAdminMembers() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const requestedMemberId = searchParams.get("member");

  const [members, setMembers] = useState<Member[]>([]);
  const [trainers, setTrainers] = useState<TrainerOption[]>([]);
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlanOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [trainersLoading, setTrainersLoading] = useState(false);
  const [error, setError] = useState("");

  const editingMember =
    view === "edit"
      ? members.find((member) => member.id === requestedMemberId) ?? null
      : null;
  const selectedMember =
    view !== "list" && view !== "add" && view !== "edit" && requestedMemberId
      ? members.find((member) => member.id === requestedMemberId) ?? null
      : null;
  const showModal = view === "add" || (view === "edit" && editingMember !== null);

  const loadMembers = useCallback(async () => {
    setError("");
    try {
      const response = await listMembers();
      if (!response.ok) {
        throw new Error(response.data?.message || "Unable to load members.");
      }

      const rows = getArray<unknown>(response, "requests");
      setMembers(rows.map(normalizeMember));
    } catch (err: unknown) {
      console.error("Members loading error:", err);
      setError(err instanceof Error ? err.message : "Unable to load members.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTrainers = useCallback(async () => {
    try {
      const response = await listMemberTrainers();
      if (!response.ok) {
        throw new Error(response.data?.message || "Unable to load trainers.");
      }
      setTrainers(getArray<TrainerOption>(response, "trainers"));
    } catch (err) {
      console.error("Trainer loading error:", err);
      setTrainers([]);
    } finally {
      setTrainersLoading(false);
    }
  }, []);

  const loadMembershipPlans = useCallback(async () => {
    try {
      const response = await listMembershipPlans();
      if (!response.ok) {
        throw new Error(
          response.data?.message || "Unable to load membership plans."
        );
      }
      setMembershipPlans(getArray<MembershipPlanOption>(response, "data"));
    } catch {
      setMembershipPlans([]);
    }
  }, []);

  useEffect(() => {
    // These loaders update component state only after their API requests resolve.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadMembers();
    void loadMembershipPlans();
  }, [loadMembers, loadMembershipPlans]);

  useEffect(() => {
    // Trainer options are loaded in response to the form route becoming active.
    if (!showModal) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTrainersLoading(true);
    void loadTrainers();
  }, [showModal, loadTrainers]);

  const openAddModal = () => {
    setError("");
    setTrainersLoading(true);
    router.push("/admin/members?view=add");
  };

  const openEditModal = (member: Member) => {
    setError("");
    setTrainersLoading(true);
    router.push(
      `/admin/members?view=edit&member=${encodeURIComponent(member.id)}`
    );
  };

  const closeModal = () => {
    setError("");
    router.push("/admin/members?view=list");
  };

  const handleMemberSaved = async () => {
    setLoading(true);
    setTrainersLoading(true);
    router.replace("/admin/members?view=list");
    await loadMembers();
    await loadTrainers();
  };

  const confirmDelete = async (member: Member) => {
    if (!window.confirm(`Are you sure you want to delete ${member.name}?`)) {
      return;
    }

    try {
      const response = await deleteMember(member.id);
      if (!response.ok) {
        throw new Error(response.data?.message || "Unable to delete member.");
      }

      setLoading(true);
      setTrainersLoading(true);
      await loadMembers();
      await loadTrainers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Unable to delete member.");
    }
  };

  const toggleStatus = async (member: Member) => {
    const nextStatus = member.status === "Active" ? "Inactive" : "Active";
    try {
      const response = await changeMemberStatus(member.id, nextStatus);
      if (!response.ok) {
        throw new Error(
          response.data?.message || "Unable to update member status."
        );
      }

      setLoading(true);
      await loadMembers();
    } catch (err: unknown) {
      alert(
        err instanceof Error ? err.message : "Unable to update member status."
      );
    }
  };

  const selectMember = (member: Member) => {
    router.push(`/admin/members?member=${encodeURIComponent(member.id)}`);
  };

  const openFitnessEntry = (
    member: Member,
    type: "body-measurement" | "fitness-assessment"
  ) => {
    router.push(
      `/admin/members/${encodeURIComponent(member.id)}/fitness/${type}`
    );
  };

  return {
    members,
    trainers,
    membershipPlans,
    loading,
    trainersLoading,
    showModal,
    editingMember,
    selectedMember,
    error,
    openAddModal,
    openEditModal,
    closeModal,
    handleMemberSaved,
    confirmDelete,
    toggleStatus,
    selectMember,
    openFitnessEntry,
  };
}

export function useMemberFitnessEntry(memberId: string) {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadMember = async () => {
      try {
        const result = await getMemberById(memberId);
        if (!result) throw new Error("Member not found.");
        if (active) setMember(result);
      } catch (err: unknown) {
        if (active) {
          setError(err instanceof Error ? err.message : "Unable to load member details.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadMember();
    return () => { active = false; };
  }, [memberId]);

  return { member, loading, error };
}

type UseMemberFormOptions = {
  member: Member | null;
  onSaved: () => Promise<void>;
};

export function useMemberForm({ member, onSaved }: UseMemberFormOptions) {
  const [form, setForm] = useState<MemberForm>(() =>
    member ? buildEditMemberForm(member) : emptyMemberForm
  );
  const [membershipPlanIds, setMembershipPlanIds] = useState<string[]>(
    () => member?.membershipPlans.map((plan) => plan._id) ?? []
  );
  const [trainerId, setTrainerId] = useState(member?.assignedTrainerId || "");
  const [photo, setPhoto] = useState(member?.photo || "");
  const [photoError, setPhotoError] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [today] = useState(() => new Date().toISOString().slice(0, 10));  

const validateForm = () => {
  const errors: Record<string, string> = {};

  // Name
  const name = form.name.trim();

  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length < 2 || name.length > 80) {
    errors.name = "Name must be between 2 and 80 characters.";
  } else if (!/^[\p{L}]+(?:[ '\u2019-][\p{L}]+)*$/u.test(name)) {
    errors.name = "Enter a valid name.";
  }

  // Email
  const email = form.email.trim();

  if (!email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  // Phone
  const phoneDigits = form.phone.replace(/\D/g, "");

  if (!form.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (
    !/^[0-9+() .-]+$/.test(form.phone) ||
    phoneDigits.length < 7 ||
    phoneDigits.length > 15
  ) {
    errors.phone = "Enter a valid phone number.";
  }

  // Password
  if (!member && !form.password) {
    errors.password = "Password is required.";
  } else if (
    form.password &&
    (form.password.length < 6 || form.password.length > 72)
  ) {
    errors.password = "Password must be between 6 and 72 characters.";
  }

  // Confirm Password
  if (!member) {
    if (!form.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
  }

  // Gender
  if (!form.gender) {
    errors.gender = "Please select gender.";
  }

  // Date of Birth
  if (!form.dateOfBirth) {
    errors.dateOfBirth = "Date of birth is required.";
  } else {
    const date = new Date(`${form.dateOfBirth}T00:00:00`);

    if (
      Number.isNaN(date.getTime()) ||
      form.dateOfBirth > today
    ) {
      errors.dateOfBirth = "Enter a valid date of birth.";
    }
  }

  // Address
  if (!form.street.trim()) {
    errors.street = "Street is required.";
  }

  if (!form.city.trim()) {
    errors.city = "City is required.";
  }

  if (!form.country.trim()) {
    errors.country = "Country is required.";
  }

  // Emergency Contact
const emergencyName = form.emergencyName.trim();
const emergencyRelationship = form.emergencyRelationship.trim();
const emergencyPhone = form.emergencyPhone.trim();

if (!emergencyName) {
  errors.emergencyName = "Emergency contact name is required.";
}

if (!emergencyRelationship) {
  errors.emergencyRelationship = "Relationship is required.";
}

const emergencyDigits = emergencyPhone.replace(/\D/g, "");

if (!emergencyPhone) {
  errors.emergencyPhone = "Emergency phone is required.";
} else if (
  !/^[0-9+() .-]+$/.test(emergencyPhone) ||
  emergencyDigits.length < 7 ||
  emergencyDigits.length > 15
) {
  errors.emergencyPhone = "Enter a valid emergency phone number.";
}

  // Show errors
  setFieldErrors(errors);

  // Return true if there are no errors
  return Object.keys(errors).length === 0;
};

  const updateField = (field: keyof MemberForm, value: string) => {
    setError("");
    setForm((previous) => ({ ...previous, [field]: value }));
    setFieldErrors((previous) => {
      const next = { ...previous };
      delete next[field];
      if (field === "password") delete next.confirmPassword;
      if (["emergencyName", "emergencyRelationship", "emergencyPhone"].includes(field)) {
        delete next.emergencyName;
        delete next.emergencyRelationship;
        delete next.emergencyPhone;
      }
      return next;
    });
  };

  const handlePhoto = async (file?: File) => {
    if (!file) return;
    setError("");
    setPhotoError("");
    setFieldErrors((current) => {
      const next = { ...current };
      delete next.photo;
      return next;
    });
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setPhotoError("Choose a PNG, JPG, or WEBP image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setPhotoError("Photo must be smaller than 2 MB.");
      return;
    }

    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Image processing is unavailable.");
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
      bitmap.close();
      setPhoto(canvas.toDataURL("image/jpeg", 0.85));
    } catch {
      setPhotoError("Unable to process this photo.");
    }
  };

  const removePhoto = () => {
    setPhoto("");
    setFieldErrors((current) => {
      const next = { ...current };
      delete next.photo;
      return next;
    });
  };

  const toggleMembershipPlan = (planId: string, checked: boolean) => {
    setError("");
    setFieldErrors((current) => {
      const next = { ...current };
      delete next.membershipPlanIds;
      return next;
    });
    setMembershipPlanIds((current) =>
      checked
        ? [...current, planId]
        : current.filter((id) => id !== planId)
    );
  };

  const changeTrainer = (id: string) => {
    setError("");
    setFieldErrors((current) => {
      const next = { ...current };
      delete next.assignedTrainerId;
      return next;
    });
    setTrainerId(id);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
   setError("");

if (!validateForm()) {
  return;
}
    try {
      setSubmitting(true);
      const input = { ...form, assignedTrainerId: trainerId, membershipPlanIds, photo };
      const response = member
        ? await updateMember(member.id, buildUpdateMemberPayload(input))
        : await createMember(buildCreateMemberPayload(input));

      if (!response.ok) {
        throw Object.assign(
          new Error(response.data?.message || "Unable to save member."),
          { fieldErrors: response.data?.errors }
        );
      }

      await onSaved();
    } catch (err: unknown) {
      console.error("Member save error:", err);
      const responseErrors =
        err instanceof Error && "fieldErrors" in err
          ? err.fieldErrors
          : undefined;
      if (responseErrors && typeof responseErrors === "object") {
        setFieldErrors(
          mapMemberApiErrors(responseErrors as Record<string, unknown>)
        );
        setError(
          err instanceof Error && err.message === "Validation failed"
            ? "Please correct the highlighted fields."
            : err instanceof Error
              ? err.message
              : "Unable to save member."
        );
      } else {
        setError(err instanceof Error ? err.message : "Unable to save member.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return {
    state: {
      editingMember: member,
      form,
      membershipPlanIds,
      trainerId,
      photo,
      photoError,
      error,
      fieldErrors,
      submitting,
      today,
    },
    actions: {
      handleSubmit,
      updateField,
      handlePhoto,
      removePhoto,
      toggleMembershipPlan,
      changeTrainer,
    },
  };
}
