import type { Metadata } from "next";
import LoginUI from "@/components/LoginUI";

export const metadata: Metadata = {
  title: "Admin Login | GymMaster Pro",
};

export default function AdminLoginPage() {
  return <LoginUI role="admin" />;
}