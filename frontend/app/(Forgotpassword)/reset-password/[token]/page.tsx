export const instant = false;


import ResetPasswordForm from "./ResetPasswordForm";


type ResetPasswordPageProps = { //ye hame btayae ga k params ik promise hy jisme token string ki form me melega
  params: Promise<{
    token: string;
  }>;
};

export default async function ResetPasswordPage({
  params,
}: ResetPasswordPageProps) {
  const { token } = await params;

  return <ResetPasswordForm token={token} />;
}
