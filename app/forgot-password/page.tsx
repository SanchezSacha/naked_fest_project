"use client";

import Link from "next/link";
import { useState } from "react";
import AuthFormField from "@/components/AuthFormField";
import AuthPage from "@/components/AuthPage";
import AuthSubmitButton from "@/components/AuthSubmitButton";

type ForgotPasswordResponse = {
  error?: string;
  emailSent?: boolean;
  resetUrl?: string;
};

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function requestReset(formData: FormData) {
    setError(null);
    setResetUrl(null);
    setEmailSent(false);
    setIsPending(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.get("email") }),
    });

    const data = (await res.json().catch(() => ({}))) as ForgotPasswordResponse;
    setIsPending(false);

    if (!res.ok) {
      setError(data.error ?? "Impossible de preparer la reinitialisation.");
      return;
    }

    setEmailSent(Boolean(data.emailSent));
    setResetUrl(data.resetUrl ?? null);
  }

  return (
    <AuthPage title="Mot de passe oublie" subtitle="Recuperez votre acces au festival">
      <form action={requestReset} className="space-y-9">
        <AuthFormField
          id="email"
          name="email"
          label="Email"
          placeholder="maya@nfest.fr"
          type="email"
          autoComplete="email"
        />
        <AuthSubmitButton>{isPending ? "Preparation..." : "Recevoir le lien"}</AuthSubmitButton>
      </form>

      {error && (
        <p className="mt-8 border border-pink/50 bg-pink/10 px-5 py-4 text-sm text-pink">
          {error}
        </p>
      )}

      {emailSent && (
        <div className="mt-8 border border-lime/50 bg-lime/10 px-5 py-4 text-sm text-white/75">
          <p className="font-condensed text-lg font-bold uppercase tracking-[0.16em] text-lime">
            Email envoye
          </p>
          <p className="mt-2">
            Consulte ta boite mail pour choisir un nouveau mot de passe.
          </p>
        </div>
      )}

      {resetUrl && (
        <div className="mt-8 border border-lime/50 bg-lime/10 px-5 py-4 text-sm text-white/75">
          <p className="font-condensed text-lg font-bold uppercase tracking-[0.16em] text-lime">
            Mode test sans Resend
          </p>
          <p className="mt-2">
            Ajoute ta cle Resend pour recevoir l&apos;email. En attendant, utilise ce lien :
          </p>
          <Link
            href={resetUrl}
            className="mt-3 inline-block break-all text-lime underline underline-offset-4 transition-colors hover:text-white"
          >
            {resetUrl}
          </Link>
        </div>
      )}

      <p className="mt-10 text-center font-condensed text-xl font-bold uppercase tracking-[0.08em] text-white/55">
        Retour a la{" "}
        <Link href="/login" className="text-lime transition-colors duration-200 hover:text-white">
          connexion
        </Link>
      </p>
    </AuthPage>
  );
}
