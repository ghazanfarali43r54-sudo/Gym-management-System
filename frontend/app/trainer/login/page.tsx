import type { Metadata } from "next";
import LoginUI from "@/components/LoginUI";

export const metadata: Metadata = {
  title: "Trainer Login | GymMaster Pro",
};

export default function TrainerLoginPage() {
  return <LoginUI role="trainer" />;
}