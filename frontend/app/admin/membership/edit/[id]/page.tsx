
import MembershipForm from "../../MembershipForm";

// This edit page loads membership data after the admin shell hydrates.
export const instant = false;

interface EditMembershipPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMembershipPage({
  params,
}: EditMembershipPageProps) {
  const { id } = await params;

  return <MembershipForm planId={id} />;
}
