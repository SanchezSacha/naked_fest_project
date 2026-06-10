import { Suspense } from "react";
import AuthPage from "@/components/AuthPage";
import ResetPasswordClient from "./ResetPasswordClient";

export default function ResetPasswordPage() {
  return (
    <AuthPage title="Nouveau mot de passe" subtitle="Reprenez le controle de votre compte">
      <Suspense
        fallback={
          <p className="border border-white/20 bg-white/5 px-5 py-5 text-sm text-white/60">
            Chargement du lien...
          </p>
        }
      >
        <ResetPasswordClient />
      </Suspense>
    </AuthPage>
  );
}
