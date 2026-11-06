import { redirect } from "next/navigation";

// Keep old bookmarks working while maintaining one canonical login page.
export default function TrainerLoginRedirect() {
  redirect("/login");
}
