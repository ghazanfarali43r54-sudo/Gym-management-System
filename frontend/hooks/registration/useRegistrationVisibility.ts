"use client";

import { useState } from "react";

export function useRegistrationVisibility() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function togglePassword() {
    setShowPassword((prev) => !prev);
  }

  function toggleConfirm() {
    setShowConfirm((prev) => !prev);
  }

  function resetVisibility() {
    setShowPassword(false);
    setShowConfirm(false);
  }

  return {
    showPassword,
    showConfirm,
    togglePassword,
    toggleConfirm,
    resetVisibility,
  };
}