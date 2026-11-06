"use client";

import { Suspense } from "react";
import UniversalLogin from "@/components/auth/UniversalLogin";

function LoginFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf9f7]">
      <div className="text-sm text-[#777]">
        Loading login...
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <UniversalLogin />
    </Suspense>
  );
}