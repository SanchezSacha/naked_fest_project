import { Suspense } from "react";
import AuthPage from "@/components/AuthPage";
import VerifyEmailClient from "./VerifyEmailClient";

export default function VerifyEmailPage() {
  return (
    <AuthPage title="Verification email" subtitle="Un dernier sas avant le froid">
      <Suspense
        fallback={
          <p className="border border-white/20 bg-white/5 px-5 py-5 text-sm text-white/60">
            Verification du lien...
          </p>
        }
      >
        <VerifyEmailClient />
      </Suspense>
    </AuthPage>
  );
}
