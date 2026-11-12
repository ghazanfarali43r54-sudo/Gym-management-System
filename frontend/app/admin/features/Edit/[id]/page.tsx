
import FeatureForm from "../../FeatureForm";

// This route depends on an authenticated client-side admin shell and loads the
// feature after hydration, so it cannot provide an instant server-rendered UI.
export const instant = false;

interface EditFeaturePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFeaturePage({
  params,
}: EditFeaturePageProps) {
  const { id } = await params;

  return <FeatureForm featureId={id} />;
}
