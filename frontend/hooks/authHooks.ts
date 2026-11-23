
import { useState, type FormEvent } from "react";
import { loginUser, type LoginResponse } from "@/features/authApi";
import { saveSession } from "@/lib/memberAuth";

// Email format validation pattern
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useAuthLogin() {
  // Login form state
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Login UI state
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [remember, setRemember] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    // Prevent repeated form submission
    if (loading) return;

    setError("");

    const trimmedEmail = email.trim();

    // Email validation
    if (!trimmedEmail) {
      setError("Please enter your email.");
      return;
    }

    // Email format validation
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Password validation
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      // Login API call
      const response = await loginUser({
        email: trimmedEmail,
        password,
      });

      const data: LoginResponse = response.data;

      // Validate API response
      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password.");
      }

      // Validate token and user
      if (!data.token || !data.user) {
        throw new Error("Login response is incomplete.");
      }

      const user = data.user;

      // Validate user information
      if (!user.id || !user.name || !user.email) {
        throw new Error("User information is incomplete.");
      }

      // Normalize user role
      const role = user.role?.toLowerCase();

      if (!role) {
        throw new Error("User role is missing.");
      }

      if (role !== "admin" && role !== "trainer" && role !== "member") {
        throw new Error("Invalid user role.");
      }

      // Dashboard redirect path
      const redirectTo = data.redirectTo || "/";

      // Save session
      saveSession(
        data.token,
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role,
          photo: user.photo,
          dashboardPath: redirectTo,
        },
        remember
      );

      // Redirect user to dashboard
      window.location.assign(redirectTo);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    remember,
    setRemember,
    loading,
    error,
    handleSubmit,
  };
}
