"use client";

import { useRouter } from "next/navigation";
import RegisterModal from "@/components/auth/RegisterModal";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <RegisterModal
      open={true}
      onClose={() => router.push("/login")}
      onSuccess={(requestId, email) => {
        alert(
          `Registration request sent!\nRequest ID: ${requestId}\n\nAdmin will contact you at ${email} once approved.`
        );
      }}
      onSwitchToLogin={() => router.push("/login")}
    />
  );
}
